import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import type { DraftRoster, Player } from '@/constants/data';
import { useAppData } from '@/context/app-data-context';
import { usePlay } from '@/context/play-context';
import { getPlayerImageUri } from '@/utils/player-images';
import { getDraftPrice, getRosterScore } from '@/utils/play';

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.segmentButton, active && styles.segmentButtonActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function GroupCard({
  name,
  code,
  members,
  rosterCount,
  onPress,
}: {
  name: string;
  code: string;
  members: number;
  rosterCount: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.groupCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.groupCardHeader}>
        <View>
          <Text style={styles.groupName}>{name}</Text>
          <Text style={styles.groupCode}>Code: {code}</Text>
        </View>
        <View style={styles.groupArrow}>
          <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
        </View>
      </View>
      <View style={styles.groupMetaRow}>
        <View style={styles.groupMetaChip}>
          <Ionicons name="people-outline" size={14} color={Colors.accent} />
          <Text style={styles.groupMetaText}>{members} member{members === 1 ? '' : 's'}</Text>
        </View>
        <View style={styles.groupMetaChip}>
          <Ionicons name="list-outline" size={14} color={Colors.accent} />
          <Text style={styles.groupMetaText}>{rosterCount} roster{rosterCount === 1 ? '' : 's'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function RosterCard({
  roster,
  players,
  allPlayers,
  groupName,
  score,
  expanded,
  canLink,
  onToggleExpand,
  onLink,
  onDelete,
}: {
  roster: DraftRoster;
  players: Player[];
  allPlayers: Player[];
  groupName?: string;
  score: number;
  expanded: boolean;
  canLink: boolean;
  onToggleExpand: () => void;
  onLink: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.rosterCard}>
      <TouchableOpacity onPress={onToggleExpand} activeOpacity={0.85}>
        <View style={styles.rosterHeader}>
          <View style={styles.rosterHeaderInfo}>
            <Text style={styles.rosterName}>{roster.name}</Text>
            <Text style={styles.rosterSubtext}>
              ${roster.budgetUsed.toFixed(1)} spent · {score >= 0 ? '+' : ''}
              {score.toFixed(1)} pts
            </Text>
          </View>
          <View style={styles.rosterHeaderRight}>
            <View style={styles.rosterCountBadge}>
              <Text style={styles.rosterCountText}>{players.length}/5</Text>
            </View>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.textSecondary}
            />
          </View>
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.rosterPlayers}>
          {players.map((player) => (
            <View key={player.id} style={styles.rosterPlayerRow}>
              <Image source={{ uri: getPlayerImageUri(player) }} style={styles.rosterPlayerImage} resizeMode="cover" />
              <View style={styles.rosterPlayerInfo}>
                <Text style={styles.rosterPlayerName}>{player.name}</Text>
                <Text style={styles.rosterPlayerMeta}>
                  {player.team} · Draft ${getDraftPrice(player, allPlayers).toFixed(1)}
                </Text>
                <Text
                  style={[
                    styles.rosterPlayerStockMove,
                    player.priceChangePercent >= 0 ? styles.stockMovePositive : styles.stockMoveNegative,
                  ]}
                >
                  Stock {player.priceChange >= 0 ? '+' : ''}${player.priceChange.toFixed(2)} ·{' '}
                  {player.priceChangePercent >= 0 ? '+' : ''}
                  {player.priceChangePercent.toFixed(1)}%
                </Text>
              </View>
              <Text style={styles.rosterPlayerCurrentPrice}>${player.stockPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.rosterPreviewRow}>
          {players.slice(0, 5).map((player) => (
            <Image
              key={player.id}
              source={{ uri: getPlayerImageUri(player) }}
              style={styles.rosterPreviewImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      <View style={styles.rosterFooter}>
        <Text style={styles.linkedGroupText}>{groupName ? `Linked to ${groupName}` : 'Not linked to a group yet'}</Text>
        <View style={styles.rosterActionRow}>
          {canLink ? (
            <TouchableOpacity style={styles.linkButton} onPress={onLink} activeOpacity={0.8}>
              <Text style={styles.linkButtonText}>{groupName ? 'Switch Group' : 'Link to Group'}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={14} color={Colors.red} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PlayScreen() {
  const router = useRouter();
  const { allPlayers } = useAppData();
  const {
    groups,
    rosters,
    createGroup,
    joinGroup,
    createRoster,
    deleteRoster,
    linkRosterToGroup,
    isHydrating,
  } = usePlay();

  const [activeTab, setActiveTab] = useState<'groups' | 'roster'>('groups');
  const [createGroupName, setCreateGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftRosterName, setDraftRosterName] = useState('');
  const [draftSearch, setDraftSearch] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [linkingRosterId, setLinkingRosterId] = useState<string | null>(null);
  const [expandedRosterId, setExpandedRosterId] = useState<string | null>(null);

  const playersById = useMemo(
    () => new Map(allPlayers.map((player) => [player.id, player])),
    [allPlayers]
  );

  const draftBudgetUsed = useMemo(
    () =>
      selectedPlayerIds.reduce((sum, playerId) => {
        const player = playersById.get(playerId);
        return sum + (player ? getDraftPrice(player, allPlayers) : 0);
      }, 0),
    [allPlayers, playersById, selectedPlayerIds]
  );
  const budgetRemaining = Number((100 - draftBudgetUsed).toFixed(1));
  const isBudgetExceeded = budgetRemaining < 0;

  const draftCandidates = useMemo(() => {
    const query = draftSearch.trim().toLowerCase();
    const nextPlayers = [...allPlayers].sort((a, b) => b.stockPrice - a.stockPrice);

    if (!query) {
      return nextPlayers;
    }

    return nextPlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(query) || player.team.toLowerCase().includes(query)
    );
  }, [allPlayers, draftSearch]);

  const resetDraft = () => {
    setIsDrafting(false);
    setDraftRosterName('');
    setDraftSearch('');
    setSelectedPlayerIds([]);
  };

  const handleCreateGroup = async () => {
    try {
      const result = await createGroup(createGroupName);
      if (!result.ok) {
        Alert.alert('Create group', result.reason);
        return;
      }

      setCreateGroupName('');
      Alert.alert('Group created', 'Your new group is ready in the Play tab.');
    } catch {
      Alert.alert('Create group', 'We could not create that group right now.');
    }
  };

  const handleJoinGroup = async () => {
    try {
      const result = await joinGroup(joinCode);
      if (!result.ok) {
        Alert.alert('Join group', result.reason);
        return;
      }

      setJoinCode('');
      Alert.alert('Group joined', 'You are in. Your group now shows up below.');
    } catch {
      Alert.alert('Join group', 'We could not join that group right now.');
    }
  };

  const handleTogglePlayer = (playerId: string) => {
    const isSelected = selectedPlayerIds.includes(playerId);

    if (isSelected) {
      setSelectedPlayerIds((prev) => prev.filter((entry) => entry !== playerId));
      return;
    }

    if (selectedPlayerIds.length >= 5) {
      Alert.alert('Roster full', 'You can only draft 5 players.');
      return;
    }

    if (!playersById.get(playerId)) {
      return;
    }

    setSelectedPlayerIds((prev) => [...prev, playerId]);
  };

  const handleSaveRoster = async () => {
    try {
      const fallbackName = `Roster ${rosters.length + 1}`;
      const result = await createRoster(draftRosterName || fallbackName, selectedPlayerIds);

      if (!result.ok) {
        Alert.alert('Save roster', result.reason);
        return;
      }

      resetDraft();
      setActiveTab('roster');
      setExpandedRosterId(result.rosterId ?? null);
      Alert.alert('Roster saved', 'Your drafted roster is ready to join a group.');
    } catch {
      Alert.alert('Save roster', 'We could not save that roster right now.');
    }
  };

  const handleDeleteRoster = (rosterId: string, rosterName: string) => {
    Alert.alert('Delete roster', `Delete ${rosterName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const result = await deleteRoster(rosterId);
            if (!result.ok) {
              Alert.alert('Delete roster', result.reason);
              return;
            }

            if (expandedRosterId === rosterId) {
              setExpandedRosterId(null);
            }
            if (linkingRosterId === rosterId) {
              setLinkingRosterId(null);
            }
          } catch {
            Alert.alert('Delete roster', 'We could not delete that roster right now.');
          }
        },
      },
    ]);
  };

  const handleLinkRoster = async (rosterId: string, groupId: string) => {
    try {
      const result = await linkRosterToGroup(rosterId, groupId);
      if (!result.ok) {
        Alert.alert('Link roster', result.reason);
        return;
      }

      setLinkingRosterId(null);
      Alert.alert('Roster linked', 'That roster is now entered in the group.');
    } catch {
      Alert.alert('Link roster', 'We could not link that roster right now.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Play</Text>
        <Text style={styles.heroTitle}>Build a five-player roster and chase the best stock run.</Text>
        <Text style={styles.heroSubtitle}>
          Draft under a $100 cap, link your roster to a group, and climb the leaderboard as player stocks move.
        </Text>
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton label="Groups" active={activeTab === 'groups'} onPress={() => setActiveTab('groups')} />
        <SegmentButton label="Roster" active={activeTab === 'roster'} onPress={() => setActiveTab('roster')} />
      </View>

      {activeTab === 'groups' ? (
        <View style={styles.section}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Create Group</Text>
            <Text style={styles.panelSubtitle}>Start a pool, invite friends with the code, and link your roster.</Text>
            <TextInput
              value={createGroupName}
              onChangeText={setCreateGroupName}
              placeholder="Friday Night Pool"
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateGroup} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Join Group</Text>
            <Text style={styles.panelSubtitle}>Already have a code? Drop it in and jump straight in.</Text>
            <TextInput
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="ABC123"
              autoCapitalize="characters"
              placeholderTextColor={Colors.textMuted}
              style={styles.input}
            />
            <TouchableOpacity style={styles.secondaryButton} onPress={handleJoinGroup} activeOpacity={0.85}>
              <Text style={styles.secondaryButtonText}>Join With Code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <Text style={styles.sectionCaption}>{groups.length} total</Text>
          </View>

          {isHydrating ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Loading your groups...</Text>
            </View>
          ) : groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No groups yet</Text>
              <Text style={styles.emptyStateText}>Create one above or join with a group code to get started.</Text>
            </View>
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                name={group.name}
                code={group.code}
                members={group.memberIds.length}
                rosterCount={Object.keys(group.rosterEntries ?? {}).length}
                onPress={() => router.push(`/group/${group.id}`)}
              />
            ))
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.panel}>
            <View style={styles.draftHeader}>
              <View style={styles.draftHeaderTextWrap}>
                <Text style={styles.panelTitle}>Draft Center</Text>
                <Text style={styles.panelSubtitle}>Pick the best 5-player stock roster you can build.</Text>
              </View>
              <TouchableOpacity
                style={styles.primaryButtonCompact}
                onPress={() => setIsDrafting((prev) => !prev)}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonCompactText}>{isDrafting ? 'Close Draft' : 'Draft'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.budgetRow}>
              <View style={styles.budgetTile}>
                <Text style={styles.budgetLabel}>Budget Used</Text>
                <Text style={styles.budgetValue}>${draftBudgetUsed.toFixed(1)}</Text>
              </View>
              <View style={styles.budgetTile}>
                <Text style={styles.budgetLabel}>Remaining</Text>
                <Text style={[styles.budgetValue, isBudgetExceeded && styles.budgetExceededValue]}>
                  ${budgetRemaining.toFixed(1)}
                </Text>
              </View>
              <View style={styles.budgetTile}>
                <Text style={styles.budgetLabel}>Picks</Text>
                <Text style={styles.budgetValue}>{selectedPlayerIds.length}/5</Text>
              </View>
            </View>

            {isBudgetExceeded ? (
              <Text style={styles.budgetExceededText}>
                Budget exceeded. Remove a player to get back under the $100 cap.
              </Text>
            ) : null}

            {isDrafting ? (
              <View style={styles.draftComposer}>
                <TextInput
                  value={draftRosterName}
                  onChangeText={setDraftRosterName}
                  placeholder={`My Madness Five or leave blank for Roster ${rosters.length + 1}`}
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                />
                <TextInput
                  value={draftSearch}
                  onChangeText={setDraftSearch}
                  placeholder="Search players or teams"
                  placeholderTextColor={Colors.textMuted}
                  style={styles.input}
                />

                <View style={styles.selectedRow}>
                  {selectedPlayerIds.length === 0 ? (
                    <Text style={styles.selectedHint}>Select 5 players to build your roster.</Text>
                  ) : (
                    selectedPlayerIds.map((playerId) => {
                      const player = playersById.get(playerId);
                      if (!player) {
                        return null;
                      }

                      return (
                        <View key={player.id} style={styles.selectedChip}>
                          <Text style={styles.selectedChipText}>{player.name}</Text>
                        </View>
                      );
                    })
                  )}
                </View>

                <ScrollView
                  style={styles.draftList}
                  contentContainerStyle={styles.draftListContent}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {draftCandidates.map((player) => {
                    const isSelected = selectedPlayerIds.includes(player.id);
                    const draftCost = getDraftPrice(player, allPlayers);

                    return (
                      <TouchableOpacity
                        key={player.id}
                        style={[styles.draftRow, isSelected && styles.draftRowSelected]}
                        onPress={() => handleTogglePlayer(player.id)}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: getPlayerImageUri(player) }}
                          style={styles.draftPlayerImage}
                          resizeMode="cover"
                        />
                        <View style={styles.draftPlayerInfo}>
                          <Text style={styles.draftPlayerName}>{player.name}</Text>
                          <Text style={styles.draftPlayerMeta}>
                            {player.team} · Stock ${player.stockPrice.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.draftPlayerRight}>
                          <Text style={styles.draftPrice}>${draftCost.toFixed(1)}</Text>
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                            size={20}
                            color={isSelected ? Colors.green : Colors.accent}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    styles.saveButton,
                    (isBudgetExceeded || selectedPlayerIds.length !== 5) && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSaveRoster}
                  activeOpacity={0.85}
                  disabled={isBudgetExceeded || selectedPlayerIds.length !== 5}
                >
                  <Text style={styles.primaryButtonText}>Save Roster</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Rosters</Text>
            <Text style={styles.sectionCaption}>{rosters.length} saved</Text>
          </View>

          {rosters.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No roster yet</Text>
              <Text style={styles.emptyStateText}>Press Draft to build your first 5-player lineup.</Text>
            </View>
          ) : (
            rosters.map((roster) => {
              const players = roster.playerIds
                .map((playerId) => playersById.get(playerId))
                .filter((player): player is Player => Boolean(player));
              const linkedGroup = groups.find((group) => group.id === roster.linkedGroupId);

              return (
                <View key={roster.id}>
                  <RosterCard
                    roster={roster}
                    players={players}
                    allPlayers={allPlayers}
                    groupName={linkedGroup?.name}
                    score={getRosterScore(roster.playerIds, allPlayers)}
                    expanded={expandedRosterId === roster.id}
                    canLink={groups.length > 0}
                    onToggleExpand={() =>
                      setExpandedRosterId((current) => (current === roster.id ? null : roster.id))
                    }
                    onLink={() => setLinkingRosterId((current) => (current === roster.id ? null : roster.id))}
                    onDelete={() => handleDeleteRoster(roster.id, roster.name)}
                  />

                  {linkingRosterId === roster.id ? (
                    <View style={styles.linkPanel}>
                      <Text style={styles.linkPanelTitle}>Link {roster.name}</Text>
                      {groups.map((group) => (
                        <TouchableOpacity
                          key={group.id}
                          style={styles.linkGroupRow}
                          onPress={() => handleLinkRoster(roster.id, group.id)}
                          activeOpacity={0.8}
                        >
                          <View>
                            <Text style={styles.linkGroupName}>{group.name}</Text>
                            <Text style={styles.linkGroupCode}>Code: {group.code}</Text>
                          </View>
                          <Ionicons name="link-outline" size={18} color={Colors.accent} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  heroCard: {
    backgroundColor: Colors.cardLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  heroEyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    padding: 4,
    marginBottom: Spacing.md,
  },
  segmentButton: {
    flex: 1,
    borderRadius: BorderRadius.round,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  segmentButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  segmentButtonTextActive: {
    color: Colors.text,
  },
  section: {
    gap: Spacing.md,
  },
  panel: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  panelTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  panelSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonCompact: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    minWidth: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.textLight,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  primaryButtonCompactText: {
    color: Colors.textLight,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  secondaryButton: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  sectionCaption: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  emptyStateText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  groupCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  groupCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  groupName: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: 2,
  },
  groupCode: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  groupArrow: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupMetaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  groupMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  groupMetaText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  draftHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  draftHeaderTextWrap: {
    flex: 1,
    minWidth: 180,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  budgetTile: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  budgetLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  budgetValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  budgetExceededValue: {
    color: Colors.red,
  },
  budgetExceededText: {
    color: Colors.red,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  draftComposer: {
    marginTop: Spacing.md,
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  selectedHint: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  selectedChip: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectedChipText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  draftList: {
    maxHeight: 420,
    marginBottom: Spacing.md,
  },
  draftListContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  draftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  draftRowSelected: {
    borderColor: Colors.green,
    backgroundColor: Colors.greenLight,
  },
  draftPlayerImage: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
  },
  draftPlayerInfo: {
    flex: 1,
  },
  draftPlayerName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  draftPlayerMeta: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  draftPlayerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  draftPrice: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  saveButton: {
    marginTop: Spacing.xs,
  },
  rosterCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rosterHeaderInfo: {
    flex: 1,
  },
  rosterHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rosterName: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: 2,
  },
  rosterSubtext: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  rosterCountBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rosterCountText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  rosterPreviewRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  rosterPreviewImage: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.round,
    marginRight: -8,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.surfaceLight,
  },
  rosterPlayers: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  rosterPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rosterPlayerImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
  },
  rosterPlayerInfo: {
    flex: 1,
  },
  rosterPlayerName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  rosterPlayerMeta: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  rosterPlayerStockMove: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: 4,
  },
  stockMovePositive: {
    color: Colors.green,
  },
  stockMoveNegative: {
    color: Colors.red,
  },
  rosterPlayerCurrentPrice: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  rosterFooter: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  linkedGroupText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  rosterActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  linkButton: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkButtonText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.redLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: Colors.red,
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  linkPanel: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
  },
  linkPanelTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  linkGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  linkGroupName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  linkGroupCode: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
