import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import type { DraftRoster, PlayGroup } from '@/constants/data';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/auth-context';
import { useAppData } from '@/context/app-data-context';
import { getRosterBudgetUsed, toGroupRosterEntry } from '@/utils/play';

type PlaySnapshot = {
  rosters: DraftRoster[];
  joinedGroupIds: string[];
};

type ActionResult =
  | { ok: true; groupId?: string; rosterId?: string }
  | { ok: false; reason: string };

type PlayContextValue = PlaySnapshot & {
  groups: PlayGroup[];
  isHydrating: boolean;
  createGroup: (name: string) => Promise<ActionResult>;
  joinGroup: (code: string) => Promise<ActionResult>;
  createRoster: (name: string, playerIds: string[]) => Promise<ActionResult>;
  deleteRoster: (rosterId: string) => Promise<ActionResult>;
  linkRosterToGroup: (rosterId: string, groupId: string) => Promise<ActionResult>;
  getGroupById: (groupId: string) => PlayGroup | undefined;
};

const EMPTY_STATE: PlaySnapshot = {
  rosters: [],
  joinedGroupIds: [],
};

const PlayContext = createContext<PlayContextValue | undefined>(undefined);

function normalizePlayState(value: Partial<PlaySnapshot> | undefined): PlaySnapshot {
  return {
    rosters: Array.isArray(value?.rosters) ? value!.rosters : EMPTY_STATE.rosters,
    joinedGroupIds: Array.isArray(value?.joinedGroupIds) ? value!.joinedGroupIds : EMPTY_STATE.joinedGroupIds,
  };
}

function serializePlayState(state: PlaySnapshot) {
  return JSON.stringify({
    rosters: state.rosters,
    joinedGroupIds: [...state.joinedGroupIds].sort(),
  });
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeGroupCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function PlayProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { allPlayers } = useAppData();
  const [rosters, setRosters] = useState<DraftRoster[]>(EMPTY_STATE.rosters);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(EMPTY_STATE.joinedGroupIds);
  const [groups, setGroups] = useState<PlayGroup[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const hasHydratedRef = useRef(false);
  const lastSyncedStateRef = useRef('');

  const playDocRef = useMemo(
    () => (user ? doc(db, 'users', user.uid, 'appState', 'play') : null),
    [user?.uid]
  );

  useEffect(() => {
    if (!playDocRef) {
      setRosters(EMPTY_STATE.rosters);
      setJoinedGroupIds(EMPTY_STATE.joinedGroupIds);
      setGroups([]);
      hasHydratedRef.current = false;
      lastSyncedStateRef.current = '';
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    let isActive = true;

    const unsubscribe = onSnapshot(
      playDocRef,
      (snapshot) => {
        if (!isActive) {
          return;
        }

        const nextState = snapshot.exists()
          ? normalizePlayState(snapshot.data() as Partial<PlaySnapshot>)
          : EMPTY_STATE;

        setRosters(nextState.rosters);
        setJoinedGroupIds(nextState.joinedGroupIds);
        lastSyncedStateRef.current = serializePlayState(nextState);
        hasHydratedRef.current = true;
        setIsHydrating(false);
      },
      () => {
        if (!isActive) {
          return;
        }

        setRosters(EMPTY_STATE.rosters);
        setJoinedGroupIds(EMPTY_STATE.joinedGroupIds);
        hasHydratedRef.current = true;
        setIsHydrating(false);
      }
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [playDocRef]);

  useEffect(() => {
    if (!playDocRef || !hasHydratedRef.current) {
      return;
    }

    const nextState = { rosters, joinedGroupIds };
    const serializedState = serializePlayState(nextState);

    if (serializedState === lastSyncedStateRef.current) {
      return;
    }

    lastSyncedStateRef.current = serializedState;
    void setDoc(playDocRef, nextState, { merge: true });
  }, [joinedGroupIds, playDocRef, rosters]);

  useEffect(() => {
    let isActive = true;

    async function loadGroups() {
      if (joinedGroupIds.length === 0) {
        setGroups([]);
        return;
      }

      const snapshots = await Promise.all(
        joinedGroupIds.map((groupId) => getDoc(doc(db, 'playGroups', groupId)))
      );

      if (!isActive) {
        return;
      }

      const nextGroups = snapshots
        .filter((snapshot) => snapshot.exists())
        .map((snapshot) => ({ id: snapshot.id, ...(snapshot.data() as Omit<PlayGroup, 'id'>) }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setGroups(nextGroups);
    }

    void loadGroups();

    return () => {
      isActive = false;
    };
  }, [joinedGroupIds]);

  const createGroup = async (name: string): Promise<ActionResult> => {
    if (!user) {
      return { ok: false, reason: 'Sign in to create a group.' };
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return { ok: false, reason: 'Give your group a name first.' };
    }

    const groupId = makeId('group');
    const groupCode = makeGroupCode();
    const group: PlayGroup = {
      id: groupId,
      name: trimmedName,
      code: groupCode,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      memberIds: [user.uid],
      rosterEntries: {},
    };

    const batch = writeBatch(db);
    batch.set(doc(db, 'playGroups', groupId), group);
    if (playDocRef) {
      batch.set(playDocRef, { joinedGroupIds: arrayUnion(groupId) }, { merge: true });
    }
    await batch.commit();

    setJoinedGroupIds((prev) => (prev.includes(groupId) ? prev : [...prev, groupId]));
    setGroups((prev) => [...prev, group].sort((a, b) => a.name.localeCompare(b.name)));

    return { ok: true, groupId };
  };

  const joinGroup = async (code: string): Promise<ActionResult> => {
    if (!user) {
      return { ok: false, reason: 'Sign in to join a group.' };
    }

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return { ok: false, reason: 'Enter a valid group code.' };
    }

    const snapshot = await getDocs(
      query(collection(db, 'playGroups'), where('code', '==', normalizedCode), limit(1))
    );

    if (snapshot.empty) {
      return { ok: false, reason: 'We could not find a group with that code.' };
    }

    const groupDoc = snapshot.docs[0];
    const groupId = groupDoc.id;

    await updateDoc(groupDoc.ref, {
      memberIds: arrayUnion(user.uid),
    });

    setJoinedGroupIds((prev) => (prev.includes(groupId) ? prev : [...prev, groupId]));

    return { ok: true, groupId };
  };

  const createRoster = async (name: string, playerIds: string[]): Promise<ActionResult> => {
    const trimmedName = name.trim();
    const uniquePlayerIds = [...new Set(playerIds)];

    if (!trimmedName) {
      return { ok: false, reason: 'Name your roster before saving it.' };
    }

    if (uniquePlayerIds.length !== 5) {
      return { ok: false, reason: 'A roster needs exactly 5 players.' };
    }

    const budgetUsed = getRosterBudgetUsed(uniquePlayerIds, allPlayers);

    if (budgetUsed > 100) {
      return { ok: false, reason: `That roster costs $${budgetUsed.toFixed(1)} and goes over budget.` };
    }

    const roster: DraftRoster = {
      id: makeId('roster'),
      name: trimmedName,
      playerIds: uniquePlayerIds,
      budgetUsed,
      linkedGroupId: null,
      createdAt: new Date().toISOString(),
    };

    setRosters((prev) => [roster, ...prev]);
    return { ok: true, rosterId: roster.id };
  };

  const deleteRoster = async (rosterId: string): Promise<ActionResult> => {
    const roster = rosters.find((entry) => entry.id === rosterId);

    if (!roster) {
      return { ok: false, reason: 'That roster could not be found.' };
    }

    const nextRosters = rosters.filter((entry) => entry.id !== rosterId);
    setRosters(nextRosters);

    if (playDocRef && hasHydratedRef.current) {
      const nextState = { rosters: nextRosters, joinedGroupIds };
      lastSyncedStateRef.current = serializePlayState(nextState);
      void setDoc(playDocRef, nextState, { merge: true }).catch(() => {
        lastSyncedStateRef.current = '';
      });
    }

    if (!user || !roster.linkedGroupId) {
      return { ok: true };
    }

    setGroups((prev) =>
      prev.map((entry) => {
        if (entry.id !== roster.linkedGroupId) {
          return entry;
        }

        const nextRosterEntries = { ...(entry.rosterEntries ?? {}) };
        delete nextRosterEntries[user.uid];

        return {
          ...entry,
          rosterEntries: nextRosterEntries,
        };
      })
    );

    try {
      await updateDoc(doc(db, 'playGroups', roster.linkedGroupId), {
        [`rosterEntries.${user.uid}`]: deleteField(),
      });
    } catch {
      // Keep the local delete even if shared-group cleanup is blocked by permissions.
    }

    return { ok: true };
  };

  const linkRosterToGroup = async (rosterId: string, groupId: string): Promise<ActionResult> => {
    if (!user) {
      return { ok: false, reason: 'Sign in to link a roster.' };
    }

    const roster = rosters.find((entry) => entry.id === rosterId);
    const group = groups.find((entry) => entry.id === groupId);

    if (!roster) {
      return { ok: false, reason: 'That roster could not be found.' };
    }

    if (!group) {
      return { ok: false, reason: 'That group could not be found.' };
    }

    const groupRef = doc(db, 'playGroups', groupId);
    const nextEntry = toGroupRosterEntry(user.uid, roster, allPlayers);

    if (roster.linkedGroupId && roster.linkedGroupId !== groupId) {
      await updateDoc(doc(db, 'playGroups', roster.linkedGroupId), {
        [`rosterEntries.${user.uid}`]: deleteField(),
      });
    }

    await setDoc(
      groupRef,
      {
        memberIds: arrayUnion(user.uid),
        rosterEntries: {
          [user.uid]: nextEntry,
        },
      },
      { merge: true }
    );

    setRosters((prev) =>
      prev.map((entry) =>
        entry.id === rosterId
          ? {
              ...entry,
              linkedGroupId: groupId,
            }
          : entry
      )
    );

    setGroups((prev) =>
      prev.map((entry) => {
        if (entry.id === roster.linkedGroupId && entry.id !== groupId) {
          const nextRosterEntries = { ...(entry.rosterEntries ?? {}) };
          delete nextRosterEntries[user.uid];
          return { ...entry, rosterEntries: nextRosterEntries };
        }

        if (entry.id !== groupId) {
          return entry;
        }

        return {
          ...entry,
          memberIds: entry.memberIds.includes(user.uid) ? entry.memberIds : [...entry.memberIds, user.uid],
          rosterEntries: {
            ...(entry.rosterEntries ?? {}),
            [user.uid]: nextEntry,
          },
        };
      })
    );

    return { ok: true };
  };

  const value = useMemo(
    () => ({
      rosters,
      joinedGroupIds,
      groups,
      isHydrating,
      createGroup,
      joinGroup,
      createRoster,
      deleteRoster,
      linkRosterToGroup,
      getGroupById: (groupId: string) => groups.find((group) => group.id === groupId),
    }),
    [groups, isHydrating, joinedGroupIds, rosters]
  );

  return <PlayContext.Provider value={value}>{children}</PlayContext.Provider>;
}

export function usePlay() {
  const context = useContext(PlayContext);

  if (!context) {
    throw new Error('usePlay must be used within a PlayProvider');
  }

  return context;
}
