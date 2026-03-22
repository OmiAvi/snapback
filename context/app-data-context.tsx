import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';
import {
  ALL_PLAYERS as FALLBACK_ALL_PLAYERS,
  BRACKET as FALLBACK_BRACKET,
  TEAMS as FALLBACK_TEAMS,
} from '@/constants/data';
import type { Matchup, Player, Team } from '@/constants/data';

type BracketRegion = {
  region: string;
  matchups: Matchup[];
};

type AppDataContextValue = {
  teams: Record<string, Team>;
  bracket: BracketRegion[];
  allPlayers: Player[];
  isLoading: boolean;
  updatePlayerMarket: (playerId: string, sharesDelta: number) => number | null;
};

type FirestoreAppData = {
  teams?: Record<string, Team>;
  bracket?: BracketRegion[];
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function normalizeTeams(teams?: Record<string, Team>) {
  if (!teams || Object.keys(teams).length === 0) {
    return FALLBACK_TEAMS;
  }

  return teams;
}

function normalizeBracket(bracket?: BracketRegion[]) {
  if (!Array.isArray(bracket) || bracket.length === 0) {
    return FALLBACK_BRACKET;
  }

  return bracket;
}

function hydrateBracketTeams(bracket: BracketRegion[], teams: Record<string, Team>) {
  return bracket.map((region) => ({
    ...region,
    matchups: region.matchups.map((matchup) => ({
      ...matchup,
      topSeed: teams[matchup.topSeed.id] ?? matchup.topSeed,
      bottomSeed: teams[matchup.bottomSeed.id] ?? matchup.bottomSeed,
    })),
  }));
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Record<string, Team>>(FALLBACK_TEAMS);
  const [bracket, setBracket] = useState<BracketRegion[]>(FALLBACK_BRACKET);
  const [isLoading, setIsLoading] = useState(true);
  const appDataRef = useMemo(() => doc(db, 'appData', 'current'), []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      appDataRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setTeams(FALLBACK_TEAMS);
          setBracket(FALLBACK_BRACKET);
          setIsLoading(false);
          return;
        }

        const data = snapshot.data() as FirestoreAppData;
        const normalizedTeams = normalizeTeams(data.teams);
        const normalizedBracket = normalizeBracket(data.bracket);

        setTeams(normalizedTeams);
        setBracket(hydrateBracketTeams(normalizedBracket, normalizedTeams));
        setIsLoading(false);
      },
      () => {
        setTeams(FALLBACK_TEAMS);
        setBracket(FALLBACK_BRACKET);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [appDataRef]);

  const allPlayers = useMemo(() => {
    const derivedPlayers = Object.values(teams).flatMap((team) => team.players ?? []).filter((player) => player?.id);
    return derivedPlayers.length > 0 ? derivedPlayers : FALLBACK_ALL_PLAYERS;
  }, [teams]);

  const updatePlayerMarket = React.useCallback((playerId: string, sharesDelta: number) => {
    const currentPlayer = allPlayers.find((player) => player.id === playerId);

    if (!currentPlayer) {
      return null;
    }

    const priceImpact = Math.max(0.1, sharesDelta * 0.25);
    const updatedStockPrice = Number((currentPlayer.stockPrice + priceImpact).toFixed(2));
    const updatedPriceChange = Number((currentPlayer.priceChange + priceImpact).toFixed(2));
    const baselinePrice = currentPlayer.stockPrice - currentPlayer.priceChange || currentPlayer.stockPrice || 1;
    const updatedPriceChangePercent = Number((((updatedStockPrice - baselinePrice) / baselinePrice) * 100).toFixed(1));

    setTeams((prevTeams) => {
      let didUpdate = false;

      const nextTeams = Object.fromEntries(
        Object.entries(prevTeams).map(([teamId, team]) => {
          const nextPlayers = team.players.map((player) => {
            if (player.id !== playerId) {
              return player;
            }

            didUpdate = true;

            return {
              ...player,
              stockPrice: updatedStockPrice,
              priceChange: updatedPriceChange,
              priceChangePercent: updatedPriceChangePercent,
            };
          });

          return [
            teamId,
            didUpdate ? { ...team, players: nextPlayers } : team,
          ];
        })
      );

      return didUpdate ? nextTeams : prevTeams;
    });

    return updatedStockPrice;
  }, [allPlayers]);

  const value = useMemo(
    () => ({
      teams,
      bracket,
      allPlayers,
      isLoading,
      updatePlayerMarket,
    }),
    [teams, bracket, allPlayers, isLoading, updatePlayerMarket]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }

  return context;
}
