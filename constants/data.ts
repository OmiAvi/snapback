export interface Player {
  id: string;
  name: string;
  team: string;
  teamId: string;
  headshotUrl?: string;
  highlightVideoUrl?: string;
  position: string;
  jersey: number;
  stockPrice: number;
  priceChange: number;
  priceChangePercent: number;
  stats: {
    ppg: number;
    rpg: number;
    apg: number;
    spg?: number;
    bpg?: number;
    fg?: number;
  };
  year: string;
  height: string;
  hometown: string;
  isHot?: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  seed: number;
  region: string;
  conference: string;
  record: string;
  color: string;
  players: Player[];
}

export interface Matchup {
  id: string;
  region: string;
  round: number;
  topSeed: Team;
  bottomSeed: Team;
  gameDate: string;
  gameTime: string;
}

export interface Transaction {
  id: string;
  playerId: string;
  playerName: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  date: string;
}

export interface PortfolioItem {
  playerId: string;
  playerName: string;
  team: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
}

export interface DraftRoster {
  id: string;
  name: string;
  playerIds: string[];
  budgetUsed: number;
  linkedGroupId?: string | null;
  createdAt: string;
}

export interface GroupRosterEntry {
  userId: string;
  rosterId: string;
  rosterName: string;
  playerIds: string[];
  budgetUsed: number;
  updatedAt: string;
}

export interface PlayGroup {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
  memberIds: string[];
  rosterEntries?: Record<string, GroupRosterEntry>;
}

export const TEAMS: Record<string, Team> = {};

export const BRACKET: { region: string; matchups: Matchup[] }[] = [];

export const ALL_PLAYERS: Player[] = [];

export const MOCK_USER = {
  id: 'user1',
  name: 'Guest User',
  email: 'guest@onit.app',
  balance: 1250.0,
  portfolioValue: 842.5,
};

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    playerId: 'duke-p4',
    playerName: 'Patrick Ngongba II',
    team: 'Duke',
    shares: 8,
    avgBuyPrice: 14.25,
    currentPrice: 18.0,
  },
  {
    playerId: 'ark-p1',
    playerName: 'Darius Acuff Jr.',
    team: 'Arkansas',
    shares: 6,
    avgBuyPrice: 26.4,
    currentPrice: 32.0,
  },
  {
    playerId: 'tex-p1',
    playerName: 'Tramon Mark',
    team: 'Texas',
    shares: 10,
    avgBuyPrice: 9.1,
    currentPrice: 12.0,
  },
  {
    playerId: 'siena-p1',
    playerName: 'Gavin Doty',
    team: 'Siena',
    shares: 12,
    avgBuyPrice: 8.75,
    currentPrice: 12.0,
  },
  {
    playerId: 'chase-johnston-hp',
    playerName: 'Chase Johnston',
    team: 'High Point',
    shares: 5,
    avgBuyPrice: 27.8,
    currentPrice: 34.5,
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', playerId: 'chase-johnston-hp', playerName: 'Chase Johnston', type: 'buy', shares: 5, price: 27.8, total: 139.0, date: 'Mar 20, 2026' },
  { id: 't2', playerId: 'ark-p1', playerName: 'Darius Acuff Jr.', type: 'buy', shares: 6, price: 26.4, total: 158.4, date: 'Mar 19, 2026' },
  { id: 't3', playerId: 'duke-p4', playerName: 'Patrick Ngongba II', type: 'buy', shares: 8, price: 14.25, total: 114.0, date: 'Mar 18, 2026' },
  { id: 't4', playerId: 'tex-p1', playerName: 'Tramon Mark', type: 'buy', shares: 10, price: 9.1, total: 91.0, date: 'Mar 17, 2026' },
  { id: 't5', playerId: 'siena-p1', playerName: 'Gavin Doty', type: 'buy', shares: 12, price: 8.75, total: 105.0, date: 'Mar 16, 2026' },
];
