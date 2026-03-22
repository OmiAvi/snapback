import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  MOCK_PORTFOLIO,
  MOCK_TRANSACTIONS,
  MOCK_USER,
} from '@/constants/data';
import type { Player, PortfolioItem, Transaction } from '@/constants/data';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/auth-context';
import { useAppData } from '@/context/app-data-context';

type TradeActionResult =
  | { ok: true; total: number; sharesOwned: number }
  | { ok: false; reason: string };

type TradingSnapshot = {
  balance: number;
  portfolio: PortfolioItem[];
  transactions: Transaction[];
};

type TradingContextValue = TradingSnapshot & {
  isHydrating: boolean;
  depositFunds: (amount: number) => void;
  buyShares: (player: Player, shares: number) => TradeActionResult;
  sellShares: (player: Player, shares: number) => TradeActionResult;
  getHolding: (playerId: string) => PortfolioItem | undefined;
};

const TradingContext = createContext<TradingContextValue | undefined>(undefined);

function formatTransactionDate() {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

function hydratePortfolio(items: PortfolioItem[], players: Player[]) {
  const playerById = new Map(players.map((player) => [player.id, player]));

  return items.map((item) => ({
    ...item,
    currentPrice: playerById.get(item.playerId)?.stockPrice ?? item.currentPrice,
  }));
}

function getDefaultTradingState(players: Player[]): TradingSnapshot {
  return {
    balance: MOCK_USER.balance,
    portfolio: hydratePortfolio(MOCK_PORTFOLIO, players),
    transactions: MOCK_TRANSACTIONS,
  };
}

function normalizeTradingState(value: Partial<TradingSnapshot> | undefined, players: Player[]): TradingSnapshot {
  return {
    balance: typeof value?.balance === 'number' ? value.balance : MOCK_USER.balance,
    portfolio: hydratePortfolio(Array.isArray(value?.portfolio) ? value!.portfolio : MOCK_PORTFOLIO, players),
    transactions: Array.isArray(value?.transactions) ? value!.transactions : MOCK_TRANSACTIONS,
  };
}

function serializeTradingState(state: TradingSnapshot) {
  return JSON.stringify({
    balance: Number(state.balance.toFixed(2)),
    portfolio: state.portfolio.map((item) => ({
      ...item,
      avgBuyPrice: Number(item.avgBuyPrice.toFixed(2)),
      currentPrice: Number(item.currentPrice.toFixed(2)),
    })),
    transactions: state.transactions.map((tx) => ({
      ...tx,
      price: Number(tx.price.toFixed(2)),
      total: Number(tx.total.toFixed(2)),
    })),
  });
}

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { allPlayers, updatePlayerMarket } = useAppData();
  const [balance, setBalance] = useState(MOCK_USER.balance);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => hydratePortfolio(MOCK_PORTFOLIO, allPlayers));
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isHydrating, setIsHydrating] = useState(true);
  const hasHydratedRef = useRef(false);
  const lastSyncedStateRef = useRef('');

  const tradingDocRef = useMemo(
    () => (user ? doc(db, 'users', user.uid, 'appState', 'trading') : null),
    [user?.uid]
  );

  useEffect(() => {
    if (!tradingDocRef) {
      const defaultState = getDefaultTradingState(allPlayers);

      setBalance(defaultState.balance);
      setPortfolio(defaultState.portfolio);
      setTransactions(defaultState.transactions);
      hasHydratedRef.current = false;
      lastSyncedStateRef.current = '';
      setIsHydrating(false);
      return;
    }

    setIsHydrating(true);
    let isActive = true;

    const unsubscribe = onSnapshot(
      tradingDocRef,
      (snapshot) => {
        if (!isActive) {
          return;
        }

        if (!snapshot.exists()) {
          const defaultState = getDefaultTradingState(allPlayers);
          const serializedDefaultState = serializeTradingState(defaultState);

          lastSyncedStateRef.current = serializedDefaultState;
          setBalance(defaultState.balance);
          setPortfolio(defaultState.portfolio);
          setTransactions(defaultState.transactions);
          hasHydratedRef.current = true;
          setIsHydrating(false);
          void setDoc(tradingDocRef, JSON.parse(serializedDefaultState)).catch(() => {
            if (!isActive) {
              return;
            }

            lastSyncedStateRef.current = '';
          });
          return;
        }

        const nextState = normalizeTradingState(snapshot.data() as Partial<TradingSnapshot>, allPlayers);
        lastSyncedStateRef.current = serializeTradingState(nextState);
        setBalance(nextState.balance);
        setPortfolio(nextState.portfolio);
        setTransactions(nextState.transactions);
        hasHydratedRef.current = true;
        setIsHydrating(false);
      },
      () => {
        if (!isActive) {
          return;
        }

        const defaultState = getDefaultTradingState(allPlayers);
        setBalance(defaultState.balance);
        setPortfolio(defaultState.portfolio);
        setTransactions(defaultState.transactions);
        hasHydratedRef.current = true;
        setIsHydrating(false);
      }
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [allPlayers, tradingDocRef]);

  useEffect(() => {
    if (!tradingDocRef || !hasHydratedRef.current) {
      return;
    }

    const nextState = { balance, portfolio, transactions };
    const serializedState = serializeTradingState(nextState);

    if (serializedState === lastSyncedStateRef.current) {
      return;
    }

    lastSyncedStateRef.current = serializedState;
    void setDoc(tradingDocRef, JSON.parse(serializedState));
  }, [balance, portfolio, transactions, tradingDocRef]);

  const getHolding = (playerId: string) => portfolio.find((item) => item.playerId === playerId);

  const depositFunds = (amount: number) => {
    setBalance((prev) => Number((prev + amount).toFixed(2)));
  };

  const buyShares = (player: Player, shares: number): TradeActionResult => {
    const total = Number((player.stockPrice * shares).toFixed(2));
    const existingShares = getHolding(player.id)?.shares ?? 0;

    if (shares < 1) {
      return { ok: false, reason: 'Choose at least 1 share.' };
    }

    if (total > balance) {
      return {
        ok: false,
        reason: `You need $${total.toFixed(2)} but only have $${balance.toFixed(2)} available.`,
      };
    }

    const nextMarketPrice = updatePlayerMarket(player.id, shares) ?? player.stockPrice;

    setBalance((prev) => Number((prev - total).toFixed(2)));
    setPortfolio((prev) => {
      const existing = prev.find((item) => item.playerId === player.id);

      if (!existing) {
        return [
          {
            playerId: player.id,
            playerName: player.name,
            team: player.team,
            shares,
            avgBuyPrice: player.stockPrice,
            currentPrice: nextMarketPrice,
          },
          ...prev,
        ];
      }

      const totalShares = existing.shares + shares;
      const totalCostBasis = existing.avgBuyPrice * existing.shares + total;
      const avgBuyPrice = Number((totalCostBasis / totalShares).toFixed(2));

      return prev.map((item) =>
        item.playerId === player.id
          ? {
              ...item,
              shares: totalShares,
              avgBuyPrice,
              currentPrice: nextMarketPrice,
            }
          : item
      );
    });
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        playerId: player.id,
        playerName: player.name,
        type: 'buy',
        shares,
        price: player.stockPrice,
        total,
        date: formatTransactionDate(),
      },
      ...prev,
    ]);

    return {
      ok: true,
      total,
      sharesOwned: existingShares + shares,
    };
  };

  const sellShares = (player: Player, shares: number): TradeActionResult => {
    const holding = getHolding(player.id);

    if (shares < 1) {
      return { ok: false, reason: 'Choose at least 1 share.' };
    }

    if (!holding || holding.shares < shares) {
      return {
        ok: false,
        reason: `You only own ${holding?.shares ?? 0} share${holding?.shares === 1 ? '' : 's'} of ${player.name}.`,
      };
    }

    const total = Number((player.stockPrice * shares).toFixed(2));
    const remainingShares = holding.shares - shares;

    setBalance((prev) => Number((prev + total).toFixed(2)));
    setPortfolio((prev) =>
      prev
        .map((item) =>
          item.playerId === player.id
            ? {
                ...item,
                shares: remainingShares,
                currentPrice: player.stockPrice,
              }
            : item
        )
        .filter((item) => item.shares > 0)
    );
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        playerId: player.id,
        playerName: player.name,
        type: 'sell',
        shares,
        price: player.stockPrice,
        total,
        date: formatTransactionDate(),
      },
      ...prev,
    ]);

    return {
      ok: true,
      total,
      sharesOwned: remainingShares,
    };
  };

  const value = useMemo(
    () => ({
      balance,
      portfolio,
      transactions,
      isHydrating,
      depositFunds,
      buyShares,
      sellShares,
      getHolding,
    }),
    [balance, portfolio, transactions, isHydrating]
  );

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export function useTrading() {
  const context = useContext(TradingContext);

  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }

  return context;
}
