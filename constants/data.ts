export interface Player {
  id: string;
  name: string;
  team: string;
  teamId: string;
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

// ──────────────────────────────────────
//  PLAYER DATA
// ──────────────────────────────────────

const uconnPlayers: Player[] = [
  { id: 'p1', name: 'Donovan Clingan', team: 'UConn', teamId: 'uconn', position: 'C', jersey: 32, stockPrice: 42.50, priceChange: 3.20, priceChangePercent: 8.1, stats: { ppg: 13.1, rpg: 7.4, apg: 1.2, bpg: 2.8, fg: 73.3 }, year: 'Sophomore', height: "7'2\"", hometown: 'Bristol, CT', isHot: true },
  { id: 'p2', name: 'Tristen Newton', team: 'UConn', teamId: 'uconn', position: 'PG', jersey: 2, stockPrice: 28.75, priceChange: 1.50, priceChangePercent: 5.5, stats: { ppg: 12.4, rpg: 4.0, apg: 8.1, spg: 1.2 }, year: 'Senior', height: "6'2\"", hometown: 'Houston, TX' },
  { id: 'p3', name: 'Andre Jackson Jr.', team: 'UConn', teamId: 'uconn', position: 'SG', jersey: 44, stockPrice: 24.00, priceChange: -0.80, priceChangePercent: -3.2, stats: { ppg: 8.7, rpg: 3.8, apg: 2.2, spg: 1.6 }, year: 'Sophomore', height: "6'6\"", hometown: 'Albany, NY' },
  { id: 'p4', name: 'Cam Spencer', team: 'UConn', teamId: 'uconn', position: 'SG', jersey: 12, stockPrice: 22.30, priceChange: 0.90, priceChangePercent: 4.2, stats: { ppg: 12.9, rpg: 2.8, apg: 3.1 }, year: 'Senior', height: "6'4\"", hometown: 'Toms River, NJ' },
  { id: 'p5', name: 'Joey Calcaterra', team: 'UConn', teamId: 'uconn', position: 'SF', jersey: 3, stockPrice: 18.60, priceChange: 0.45, priceChangePercent: 2.5, stats: { ppg: 9.8, rpg: 3.1, apg: 1.7 }, year: 'Senior', height: "6'5\"", hometown: 'San Diego, CA' },
];

const iowastPlayers: Player[] = [
  { id: 'p6', name: 'Tamin Lipsey', team: 'Iowa St', teamId: 'iowast', position: 'PG', jersey: 3, stockPrice: 31.20, priceChange: 2.10, priceChangePercent: 7.2, stats: { ppg: 11.3, rpg: 3.6, apg: 5.2, spg: 2.1 }, year: 'Sophomore', height: "6'1\"", hometown: 'Ames, IA', isHot: true },
  { id: 'p7', name: 'Keshon Gilbert', team: 'Iowa St', teamId: 'iowast', position: 'SG', jersey: 10, stockPrice: 26.80, priceChange: 1.30, priceChangePercent: 5.1, stats: { ppg: 14.2, rpg: 3.1, apg: 3.8 }, year: 'Junior', height: "6'3\"", hometown: 'DeSoto, TX' },
  { id: 'p8', name: 'Milan Momcilovic', team: 'Iowa St', teamId: 'iowast', position: 'SF', jersey: 22, stockPrice: 29.40, priceChange: -1.20, priceChangePercent: -3.9, stats: { ppg: 12.8, rpg: 4.5, apg: 1.9 }, year: 'Freshman', height: "6'7\"", hometown: 'Brookfield, WI' },
  { id: 'p9', name: 'Omaha Biliew', team: 'Iowa St', teamId: 'iowast', position: 'PF', jersey: 13, stockPrice: 21.50, priceChange: 0.60, priceChangePercent: 2.9, stats: { ppg: 9.1, rpg: 5.7, apg: 1.1 }, year: 'Freshman', height: "6'7\"", hometown: 'Waterloo, IA' },
  { id: 'p10', name: 'Curtis Jones', team: 'Iowa St', teamId: 'iowast', position: 'SG', jersey: 1, stockPrice: 17.80, priceChange: 0.30, priceChangePercent: 1.7, stats: { ppg: 7.3, rpg: 2.4, apg: 2.0 }, year: 'Senior', height: "6'4\"", hometown: 'Iowa City, IA' },
];

const purduePlayers: Player[] = [
  { id: 'p11', name: 'Zach Edey', team: 'Purdue', teamId: 'purdue', position: 'C', jersey: 15, stockPrice: 55.00, priceChange: 4.50, priceChangePercent: 8.9, stats: { ppg: 24.2, rpg: 11.7, apg: 2.0, bpg: 2.2, fg: 62.1 }, year: 'Senior', height: "7'4\"", hometown: 'Toronto, Canada', isHot: true },
  { id: 'p12', name: 'Braden Smith', team: 'Purdue', teamId: 'purdue', position: 'PG', jersey: 3, stockPrice: 34.60, priceChange: 2.20, priceChangePercent: 6.8, stats: { ppg: 12.5, rpg: 5.2, apg: 8.3, spg: 1.9 }, year: 'Sophomore', height: "6'1\"", hometown: 'Westfield, IN', isHot: true },
  { id: 'p13', name: 'Fletcher Loyer', team: 'Purdue', teamId: 'purdue', position: 'SG', jersey: 2, stockPrice: 25.10, priceChange: 0.80, priceChangePercent: 3.3, stats: { ppg: 10.1, rpg: 1.7, apg: 2.3 }, year: 'Sophomore', height: "6'3\"", hometown: 'Fort Wayne, IN' },
  { id: 'p14', name: 'Mason Gillis', team: 'Purdue', teamId: 'purdue', position: 'SF', jersey: 0, stockPrice: 14.20, priceChange: -0.50, priceChangePercent: -3.4, stats: { ppg: 6.3, rpg: 4.1, apg: 0.9 }, year: 'Senior', height: "6'6\"", hometown: 'Victor, NY' },
  { id: 'p15', name: 'Lance Jones', team: 'Purdue', teamId: 'purdue', position: 'SG', jersey: 55, stockPrice: 19.80, priceChange: 1.10, priceChangePercent: 5.9, stats: { ppg: 9.6, rpg: 2.5, apg: 3.1 }, year: 'Senior', height: "6'3\"", hometown: 'South Holland, IL' },
];

const houstonPlayers: Player[] = [
  { id: 'p16', name: 'Jamal Shead', team: 'Houston', teamId: 'houston', position: 'PG', jersey: 1, stockPrice: 38.90, priceChange: 2.70, priceChangePercent: 7.5, stats: { ppg: 13.2, rpg: 4.1, apg: 7.3, spg: 2.3 }, year: 'Senior', height: "6'1\"", hometown: 'Katy, TX', isHot: true },
  { id: 'p17', name: 'LJ Cryer', team: 'Houston', teamId: 'houston', position: 'SG', jersey: 4, stockPrice: 29.40, priceChange: 1.60, priceChangePercent: 5.8, stats: { ppg: 14.9, rpg: 2.2, apg: 2.0 }, year: 'Junior', height: "6'1\"", hometown: 'Katy, TX' },
  { id: 'p18', name: 'Damian Dunn', team: 'Houston', teamId: 'houston', position: 'SG', jersey: 10, stockPrice: 22.70, priceChange: -0.90, priceChangePercent: -3.8, stats: { ppg: 12.1, rpg: 3.4, apg: 1.7 }, year: 'Senior', height: "6'5\"", hometown: 'Buffalo, NY' },
  { id: 'p19', name: 'J\'Wan Roberts', team: 'Houston', teamId: 'houston', position: 'PF', jersey: 13, stockPrice: 20.30, priceChange: 0.70, priceChangePercent: 3.6, stats: { ppg: 10.7, rpg: 7.9, apg: 1.8 }, year: 'Junior', height: "6'7\"", hometown: 'Ocala, FL' },
  { id: 'p20', name: 'Emanuel Sharp', team: 'Houston', teamId: 'houston', position: 'SG', jersey: 21, stockPrice: 16.50, priceChange: 0.40, priceChangePercent: 2.5, stats: { ppg: 7.4, rpg: 2.3, apg: 1.1 }, year: 'Sophomore', height: "6'4\"", hometown: 'Frisco, TX' },
];

const tennesseePlayers: Player[] = [
  { id: 'p21', name: 'Dalton Knecht', team: 'Tennessee', teamId: 'tennessee', position: 'SF', jersey: 3, stockPrice: 47.20, priceChange: 3.80, priceChangePercent: 8.8, stats: { ppg: 21.7, rpg: 4.9, apg: 2.0 }, year: 'Senior', height: "6'6\"", hometown: 'Le Roy, IL', isHot: true },
  { id: 'p22', name: 'Josiah-Jordan James', team: 'Tennessee', teamId: 'tennessee', position: 'SG', jersey: 5, stockPrice: 23.10, priceChange: 0.90, priceChangePercent: 4.1, stats: { ppg: 9.1, rpg: 4.2, apg: 2.7 }, year: 'Senior', height: "6'6\"", hometown: 'Las Vegas, NV' },
  { id: 'p23', name: 'Zakai Zeigler', team: 'Tennessee', teamId: 'tennessee', position: 'PG', jersey: 10, stockPrice: 31.80, priceChange: 2.10, priceChangePercent: 7.1, stats: { ppg: 12.8, rpg: 3.5, apg: 7.0, spg: 2.5 }, year: 'Junior', height: "5'9\"", hometown: 'Brooklyn, NY', isHot: true },
  { id: 'p24', name: 'Santiago Vescovi', team: 'Tennessee', teamId: 'tennessee', position: 'SG', jersey: 25, stockPrice: 19.60, priceChange: -0.70, priceChangePercent: -3.4, stats: { ppg: 8.9, rpg: 2.5, apg: 2.1 }, year: 'Senior', height: "6'3\"", hometown: 'Montevideo, Uruguay' },
  { id: 'p25', name: 'Jonas Aidoo', team: 'Tennessee', teamId: 'tennessee', position: 'C', jersey: 0, stockPrice: 22.40, priceChange: 1.20, priceChangePercent: 5.7, stats: { ppg: 9.6, rpg: 6.8, apg: 1.1, bpg: 2.0 }, year: 'Junior', height: "6'11\"", hometown: 'Accra, Ghana' },
];

const marquettePlayers: Player[] = [
  { id: 'p26', name: 'Tyler Kolek', team: 'Marquette', teamId: 'marquette', position: 'PG', jersey: 11, stockPrice: 41.30, priceChange: 3.10, priceChangePercent: 8.1, stats: { ppg: 16.1, rpg: 5.4, apg: 7.6, spg: 1.6 }, year: 'Senior', height: "6'3\"", hometown: 'Masury, OH', isHot: true },
  { id: 'p27', name: 'Oso Ighodaro', team: 'Marquette', teamId: 'marquette', position: 'C', jersey: 21, stockPrice: 27.60, priceChange: 1.40, priceChangePercent: 5.3, stats: { ppg: 12.8, rpg: 6.3, apg: 2.9 }, year: 'Senior', height: "6'10\"", hometown: 'Detroit, MI' },
  { id: 'p28', name: 'Stevie Mitchell', team: 'Marquette', teamId: 'marquette', position: 'SG', jersey: 0, stockPrice: 21.80, priceChange: 0.60, priceChangePercent: 2.8, stats: { ppg: 9.4, rpg: 3.2, apg: 2.0 }, year: 'Senior', height: "6'1\"", hometown: 'Sarasota, FL' },
  { id: 'p29', name: 'Chase Ross', team: 'Marquette', teamId: 'marquette', position: 'SG', jersey: 3, stockPrice: 17.40, priceChange: -0.40, priceChangePercent: -2.2, stats: { ppg: 7.6, rpg: 2.4, apg: 1.3 }, year: 'Junior', height: "6'5\"", hometown: 'Solon, OH' },
  { id: 'p30', name: 'Kam Jones', team: 'Marquette', teamId: 'marquette', position: 'SG', jersey: 1, stockPrice: 30.20, priceChange: 2.00, priceChangePercent: 7.1, stats: { ppg: 16.3, rpg: 3.0, apg: 3.3 }, year: 'Junior', height: "6'5\"", hometown: 'Chicago, IL' },
];

const creightonPlayers: Player[] = [
  { id: 'p31', name: 'Ryan Kalkbrenner', team: 'Creighton', teamId: 'creighton', position: 'C', jersey: 11, stockPrice: 36.70, priceChange: 2.50, priceChangePercent: 7.3, stats: { ppg: 15.8, rpg: 7.9, apg: 1.2, bpg: 2.5 }, year: 'Senior', height: "7'0\"", hometown: 'St. Louis, MO' },
  { id: 'p32', name: 'Baylor Scheierman', team: 'Creighton', teamId: 'creighton', position: 'SF', jersey: 55, stockPrice: 33.40, priceChange: 1.80, priceChangePercent: 5.7, stats: { ppg: 16.6, rpg: 7.3, apg: 4.0 }, year: 'Senior', height: "6'6\"", hometown: 'Henderson, NE', isHot: true },
  { id: 'p33', name: 'Trey Alexander', team: 'Creighton', teamId: 'creighton', position: 'SG', jersey: 23, stockPrice: 28.10, priceChange: 0.90, priceChangePercent: 3.3, stats: { ppg: 15.4, rpg: 3.3, apg: 4.1 }, year: 'Junior', height: "6'4\"", hometown: 'Overland Park, KS' },
  { id: 'p34', name: 'Steven Ashworth', team: 'Creighton', teamId: 'creighton', position: 'PG', jersey: 14, stockPrice: 19.20, priceChange: -0.60, priceChangePercent: -3.0, stats: { ppg: 9.8, rpg: 2.7, apg: 5.3 }, year: 'Senior', height: "6'1\"", hometown: 'Layton, UT' },
  { id: 'p35', name: 'Francisco Farabello', team: 'Creighton', teamId: 'creighton', position: 'SG', jersey: 3, stockPrice: 15.60, priceChange: 0.50, priceChangePercent: 3.3, stats: { ppg: 6.8, rpg: 2.2, apg: 2.1 }, year: 'Senior', height: "6'3\"", hometown: 'Buenos Aires, Argentina' },
];

const kansasPlayers: Player[] = [
  { id: 'p36', name: 'Hunter Dickinson', team: 'Kansas', teamId: 'kansas', position: 'C', jersey: 1, stockPrice: 44.80, priceChange: 3.60, priceChangePercent: 8.7, stats: { ppg: 18.8, rpg: 10.9, apg: 2.3, bpg: 1.3, fg: 57.8 }, year: 'Senior', height: "7'1\"", hometown: 'Alexandria, VA', isHot: true },
  { id: 'p37', name: 'Dajuan Harris Jr.', team: 'Kansas', teamId: 'kansas', position: 'PG', jersey: 3, stockPrice: 21.90, priceChange: 0.80, priceChangePercent: 3.8, stats: { ppg: 8.1, rpg: 2.7, apg: 5.6, spg: 1.4 }, year: 'Senior', height: "6'1\"", hometown: 'St. Louis, MO' },
  { id: 'p38', name: 'KJ Adams Jr.', team: 'Kansas', teamId: 'kansas', position: 'PF', jersey: 24, stockPrice: 26.30, priceChange: 1.20, priceChangePercent: 4.8, stats: { ppg: 12.8, rpg: 5.7, apg: 1.4 }, year: 'Junior', height: "6'7\"", hometown: 'Austin, TX' },
  { id: 'p39', name: 'Johnny Furphy', team: 'Kansas', teamId: 'kansas', position: 'SF', jersey: 10, stockPrice: 29.70, priceChange: 2.30, priceChangePercent: 8.4, stats: { ppg: 11.4, rpg: 5.4, apg: 1.7 }, year: 'Freshman', height: "6'7\"", hometown: 'Bendigo, Australia' },
  { id: 'p40', name: 'Arterio Morris', team: 'Kansas', teamId: 'kansas', position: 'SG', jersey: 0, stockPrice: 17.10, priceChange: -0.30, priceChangePercent: -1.7, stats: { ppg: 7.6, rpg: 2.1, apg: 1.9 }, year: 'Sophomore', height: "6'4\"", hometown: 'Dallas, TX' },
];

const dukePlayers: Player[] = [
  { id: 'p41', name: 'Kyle Filipowski', team: 'Duke', teamId: 'duke', position: 'C', jersey: 30, stockPrice: 48.30, priceChange: 4.10, priceChangePercent: 9.3, stats: { ppg: 16.4, rpg: 8.3, apg: 3.2, bpg: 1.8 }, year: 'Sophomore', height: "7'0\"", hometown: 'Wilton, CT', isHot: true },
  { id: 'p42', name: 'Jeremy Roach', team: 'Duke', teamId: 'duke', position: 'PG', jersey: 3, stockPrice: 28.50, priceChange: 1.70, priceChangePercent: 6.3, stats: { ppg: 13.9, rpg: 2.8, apg: 5.1 }, year: 'Senior', height: "6'2\"", hometown: 'Prince George\'s County, MD' },
  { id: 'p43', name: 'Tyrese Proctor', team: 'Duke', teamId: 'duke', position: 'SG', jersey: 5, stockPrice: 31.70, priceChange: 2.40, priceChangePercent: 8.2, stats: { ppg: 13.5, rpg: 3.0, apg: 4.2 }, year: 'Sophomore', height: "6'5\"", hometown: 'Sydney, Australia' },
  { id: 'p44', name: 'Mark Mitchell', team: 'Duke', teamId: 'duke', position: 'SF', jersey: 15, stockPrice: 22.80, priceChange: 0.90, priceChangePercent: 4.1, stats: { ppg: 11.1, rpg: 5.4, apg: 1.8 }, year: 'Sophomore', height: "6'7\"", hometown: 'St. Louis, MO' },
  { id: 'p45', name: 'Jared McCain', team: 'Duke', teamId: 'duke', position: 'SG', jersey: 0, stockPrice: 35.90, priceChange: 3.30, priceChangePercent: 10.1, stats: { ppg: 14.6, rpg: 3.2, apg: 2.0 }, year: 'Freshman', height: "6'3\"", hometown: 'Murrieta, CA', isHot: true },
];

const gonzagaPlayers: Player[] = [
  { id: 'p46', name: 'Graham Ike', team: 'Gonzaga', teamId: 'gonzaga', position: 'C', jersey: 13, stockPrice: 37.40, priceChange: 2.60, priceChangePercent: 7.5, stats: { ppg: 16.1, rpg: 7.4, apg: 1.1 }, year: 'Senior', height: "6'9\"", hometown: 'Frisco, TX' },
  { id: 'p47', name: 'Nolan Hickman', team: 'Gonzaga', teamId: 'gonzaga', position: 'PG', jersey: 11, stockPrice: 24.70, priceChange: 0.80, priceChangePercent: 3.3, stats: { ppg: 10.8, rpg: 2.4, apg: 4.9 }, year: 'Junior', height: "6'2\"", hometown: 'Shoreline, WA' },
  { id: 'p48', name: 'Anton Watson', team: 'Gonzaga', teamId: 'gonzaga', position: 'SF', jersey: 22, stockPrice: 19.30, priceChange: -0.50, priceChangePercent: -2.5, stats: { ppg: 10.3, rpg: 5.3, apg: 1.8 }, year: 'Senior', height: "6'7\"", hometown: 'Spokane, WA' },
  { id: 'p49', name: 'Ben Gregg', team: 'Gonzaga', teamId: 'gonzaga', position: 'PF', jersey: 14, stockPrice: 16.80, priceChange: 0.60, priceChangePercent: 3.7, stats: { ppg: 7.9, rpg: 4.8, apg: 0.9 }, year: 'Senior', height: "6'9\"", hometown: 'Portland, OR' },
  { id: 'p50', name: 'Ryan Nembhard', team: 'Gonzaga', teamId: 'gonzaga', position: 'PG', jersey: 0, stockPrice: 33.20, priceChange: 2.10, priceChangePercent: 6.8, stats: { ppg: 14.6, rpg: 4.0, apg: 7.5, spg: 1.5 }, year: 'Junior', height: "6'1\"", hometown: 'Mississauga, Canada', isHot: true },
];

const baylorPlayers: Player[] = [
  { id: 'p51', name: 'RayJ Dennis', team: 'Baylor', teamId: 'baylor', position: 'PG', jersey: 10, stockPrice: 29.80, priceChange: 1.90, priceChangePercent: 6.8, stats: { ppg: 15.9, rpg: 3.3, apg: 5.2 }, year: 'Senior', height: "6'1\"", hometown: 'Beaumont, TX' },
  { id: 'p52', name: 'Jalen Bridges', team: 'Baylor', teamId: 'baylor', position: 'SF', jersey: 11, stockPrice: 23.40, priceChange: 1.10, priceChangePercent: 4.9, stats: { ppg: 13.2, rpg: 4.9, apg: 1.7 }, year: 'Senior', height: "6'7\"", hometown: 'Charleston, WV' },
  { id: 'p53', name: 'Norchad Omier', team: 'Baylor', teamId: 'baylor', position: 'PF', jersey: 15, stockPrice: 27.60, priceChange: 1.50, priceChangePercent: 5.8, stats: { ppg: 14.8, rpg: 9.9, apg: 1.4 }, year: 'Junior', height: "6'7\"", hometown: 'Bluefields, Nicaragua', isHot: true },
  { id: 'p54', name: 'Langston Love', team: 'Baylor', teamId: 'baylor', position: 'SG', jersey: 3, stockPrice: 18.70, priceChange: -0.40, priceChangePercent: -2.1, stats: { ppg: 9.3, rpg: 2.6, apg: 1.4 }, year: 'Junior', height: "6'4\"", hometown: 'Mesquite, TX' },
  { id: 'p55', name: 'VJ Edgecombe', team: 'Baylor', teamId: 'baylor', position: 'SG', jersey: 4, stockPrice: 36.50, priceChange: 3.20, priceChangePercent: 9.6, stats: { ppg: 14.2, rpg: 4.5, apg: 2.1 }, year: 'Freshman', height: "6'5\"", hometown: 'Nassau, Bahamas', isHot: true },
];

const ncstatePlayers: Player[] = [
  { id: 'p56', name: 'DJ Burns Jr.', team: 'NC State', teamId: 'ncstate', position: 'C', jersey: 30, stockPrice: 38.20, priceChange: 4.80, priceChangePercent: 14.4, stats: { ppg: 15.3, rpg: 5.3, apg: 3.2 }, year: 'Senior', height: "6'9\"", hometown: 'Fayetteville, NC', isHot: true },
  { id: 'p57', name: 'Michael O\'Connell', team: 'NC State', teamId: 'ncstate', position: 'PG', jersey: 12, stockPrice: 24.90, priceChange: 2.10, priceChangePercent: 9.2, stats: { ppg: 13.7, rpg: 3.2, apg: 5.9 }, year: 'Senior', height: "6'3\"", hometown: 'Lisle, IL', isHot: true },
  { id: 'p58', name: 'Mohamed Diarra', team: 'NC State', teamId: 'ncstate', position: 'C', jersey: 23, stockPrice: 19.40, priceChange: 1.30, priceChangePercent: 7.2, stats: { ppg: 7.8, rpg: 5.9, apg: 0.9, bpg: 1.8 }, year: 'Senior', height: "7'0\"", hometown: 'Paris, France' },
  { id: 'p59', name: 'Casey Morsell', team: 'NC State', teamId: 'ncstate', position: 'SG', jersey: 14, stockPrice: 17.60, priceChange: 0.80, priceChangePercent: 4.8, stats: { ppg: 9.2, rpg: 2.7, apg: 1.5 }, year: 'Senior', height: "6'4\"", hometown: 'Woodbridge, VA' },
  { id: 'p60', name: 'Ben Middlebrooks', team: 'NC State', teamId: 'ncstate', position: 'PF', jersey: 34, stockPrice: 14.30, priceChange: 0.50, priceChangePercent: 3.6, stats: { ppg: 6.4, rpg: 4.6, apg: 0.7 }, year: 'Sophomore', height: "6'9\"", hometown: 'Charlotte, NC' },
];

const alabamaPlayers: Player[] = [
  { id: 'p61', name: 'Mark Sears', team: 'Alabama', teamId: 'alabama', position: 'PG', jersey: 1, stockPrice: 45.60, priceChange: 3.90, priceChangePercent: 9.4, stats: { ppg: 21.4, rpg: 4.0, apg: 4.5 }, year: 'Senior', height: "6'1\"", hometown: 'Alexander City, AL', isHot: true },
  { id: 'p62', name: 'Rylan Griffen', team: 'Alabama', teamId: 'alabama', position: 'SG', jersey: 3, stockPrice: 28.70, priceChange: 1.80, priceChangePercent: 6.7, stats: { ppg: 14.1, rpg: 3.4, apg: 1.8 }, year: 'Freshman', height: "6'5\"", hometown: 'Lake Charles, LA' },
  { id: 'p63', name: 'Grant Nelson', team: 'Alabama', teamId: 'alabama', position: 'PF', jersey: 4, stockPrice: 31.20, priceChange: 2.20, priceChangePercent: 7.6, stats: { ppg: 13.4, rpg: 6.7, apg: 2.4, bpg: 1.6 }, year: 'Senior', height: "6'11\"", hometown: 'Fargo, ND' },
  { id: 'p64', name: 'Aaron Estrada', team: 'Alabama', teamId: 'alabama', position: 'SG', jersey: 5, stockPrice: 22.80, priceChange: 1.00, priceChangePercent: 4.6, stats: { ppg: 12.8, rpg: 3.5, apg: 2.9 }, year: 'Senior', height: "6'4\"", hometown: 'Bayamon, Puerto Rico' },
  { id: 'p65', name: 'Jarin Stevenson', team: 'Alabama', teamId: 'alabama', position: 'PF', jersey: 15, stockPrice: 16.90, priceChange: -0.60, priceChangePercent: -3.4, stats: { ppg: 7.3, rpg: 4.8, apg: 0.9 }, year: 'Junior', height: "6'10\"", hometown: 'Durham, NC' },
];

// ──────────────────────────────────────
//  TEAM DATA
// ──────────────────────────────────────

export const TEAMS: Record<string, Team> = {
  uconn: {
    id: 'uconn', name: 'Connecticut Huskies', shortName: 'UConn', seed: 1, region: 'East',
    conference: 'Big East', record: '29-4', color: '#002868', players: uconnPlayers,
  },
  stetson: {
    id: 'stetson', name: 'Stetson Hatters', shortName: 'Stetson', seed: 16, region: 'East',
    conference: 'ASUN', record: '25-10', color: '#006747',
    players: [
      { id: 'ps1', name: 'Stephan Swenson', team: 'Stetson', teamId: 'stetson', position: 'C', jersey: 15, stockPrice: 8.20, priceChange: 0.30, priceChangePercent: 3.8, stats: { ppg: 13.5, rpg: 8.2, apg: 1.1 }, year: 'Senior', height: "6'9\"", hometown: 'Hollywood, FL' },
      { id: 'ps2', name: 'Jahlil Tripp', team: 'Stetson', teamId: 'stetson', position: 'SF', jersey: 10, stockPrice: 7.60, priceChange: -0.20, priceChangePercent: -2.6, stats: { ppg: 11.3, rpg: 5.4, apg: 1.7 }, year: 'Senior', height: "6'6\"", hometown: 'Rochester, NY' },
      { id: 'ps3', name: 'Jalen Blackmon', team: 'Stetson', teamId: 'stetson', position: 'PG', jersey: 3, stockPrice: 9.40, priceChange: 0.50, priceChangePercent: 5.6, stats: { ppg: 14.2, rpg: 3.1, apg: 4.9 }, year: 'Senior', height: "6'2\"", hometown: 'Marion, IN' },
    ],
  },
  iowast: {
    id: 'iowast', name: 'Iowa State Cyclones', shortName: 'Iowa St', seed: 2, region: 'East',
    conference: 'Big 12', record: '26-7', color: '#C8102E', players: iowastPlayers,
  },
  sdsu: {
    id: 'sdsu', name: 'San Diego State Aztecs', shortName: 'San Diego St', seed: 5, region: 'East',
    conference: 'Mountain West', record: '26-7', color: '#CC0033',
    players: [
      { id: 'psdsu1', name: 'Lamont Butler', team: 'San Diego St', teamId: 'sdsu', position: 'PG', jersey: 5, stockPrice: 24.10, priceChange: 1.30, priceChangePercent: 5.7, stats: { ppg: 14.0, rpg: 3.8, apg: 5.2 }, year: 'Junior', height: "6'3\"", hometown: 'Bakersfield, CA', isHot: true },
      { id: 'psdsu2', name: 'Jaedon LeDee', team: 'San Diego St', teamId: 'sdsu', position: 'C', jersey: 13, stockPrice: 19.80, priceChange: 0.80, priceChangePercent: 4.2, stats: { ppg: 12.6, rpg: 6.2, apg: 1.4 }, year: 'Junior', height: "6'9\"", hometown: 'Richmond, TX' },
      { id: 'psdsu3', name: 'Micah Parrish', team: 'San Diego St', teamId: 'sdsu', position: 'SF', jersey: 3, stockPrice: 14.50, priceChange: -0.30, priceChangePercent: -2.0, stats: { ppg: 8.5, rpg: 3.5, apg: 1.2 }, year: 'Senior', height: "6'5\"", hometown: 'Detroit, MI' },
    ],
  },
  purdue: {
    id: 'purdue', name: 'Purdue Boilermakers', shortName: 'Purdue', seed: 1, region: 'Midwest',
    conference: 'Big Ten', record: '29-4', color: '#CEB888', players: purduePlayers,
  },
  montanast: {
    id: 'montanast', name: 'Montana State Bobcats', shortName: 'Montana St', seed: 16, region: 'Midwest',
    conference: 'Big Sky', record: '27-7', color: '#003475',
    players: [
      { id: 'pms1', name: 'Robert Ford III', team: 'Montana St', teamId: 'montanast', position: 'SG', jersey: 2, stockPrice: 7.40, priceChange: 0.20, priceChangePercent: 2.8, stats: { ppg: 12.1, rpg: 3.2, apg: 2.4 }, year: 'Senior', height: "6'3\"", hometown: 'Sacramento, CA' },
      { id: 'pms2', name: 'Great Osobor', team: 'Montana St', teamId: 'montanast', position: 'PF', jersey: 10, stockPrice: 11.30, priceChange: 0.60, priceChangePercent: 5.6, stats: { ppg: 17.1, rpg: 9.7, apg: 1.5 }, year: 'Senior', height: "6'8\"", hometown: 'Toronto, Canada', isHot: true },
      { id: 'pms3', name: 'Darius Brown II', team: 'Montana St', teamId: 'montanast', position: 'PG', jersey: 0, stockPrice: 8.80, priceChange: -0.10, priceChangePercent: -1.1, stats: { ppg: 9.8, rpg: 2.7, apg: 4.2 }, year: 'Senior', height: "6'0\"", hometown: 'Birmingham, AL' },
    ],
  },
  houston: {
    id: 'houston', name: 'Houston Cougars', shortName: 'Houston', seed: 1, region: 'South',
    conference: 'Big 12', record: '31-3', color: '#C8102E', players: houstonPlayers,
  },
  tennessee: {
    id: 'tennessee', name: 'Tennessee Volunteers', shortName: 'Tennessee', seed: 2, region: 'South',
    conference: 'SEC', record: '25-8', color: '#FF8200', players: tennesseePlayers,
  },
  marquette: {
    id: 'marquette', name: 'Marquette Golden Eagles', shortName: 'Marquette', seed: 2, region: 'West',
    conference: 'Big East', record: '27-6', color: '#003366', players: marquettePlayers,
  },
  creighton: {
    id: 'creighton', name: 'Creighton Bluejays', shortName: 'Creighton', seed: 3, region: 'West',
    conference: 'Big East', record: '23-10', color: '#005CA9', players: creightonPlayers,
  },
  kansas: {
    id: 'kansas', name: 'Kansas Jayhawks', shortName: 'Kansas', seed: 4, region: 'Midwest',
    conference: 'Big 12', record: '23-9', color: '#0051A5', players: kansasPlayers,
  },
  duke: {
    id: 'duke', name: 'Duke Blue Devils', shortName: 'Duke', seed: 4, region: 'East',
    conference: 'ACC', record: '27-7', color: '#003087', players: dukePlayers,
  },
  gonzaga: {
    id: 'gonzaga', name: 'Gonzaga Bulldogs', shortName: 'Gonzaga', seed: 5, region: 'West',
    conference: 'WCC', record: '27-7', color: '#002469', players: gonzagaPlayers,
  },
  baylor: {
    id: 'baylor', name: 'Baylor Bears', shortName: 'Baylor', seed: 3, region: 'East',
    conference: 'Big 12', record: '24-9', color: '#003015', players: baylorPlayers,
  },
  ncstate: {
    id: 'ncstate', name: 'NC State Wolfpack', shortName: 'NC State', seed: 11, region: 'West',
    conference: 'ACC', record: '22-12', color: '#CC0000', players: ncstatePlayers,
  },
  alabama: {
    id: 'alabama', name: 'Alabama Crimson Tide', shortName: 'Alabama', seed: 4, region: 'South',
    conference: 'SEC', record: '22-10', color: '#9E1B32', players: alabamaPlayers,
  },
  auburn: {
    id: 'auburn', name: 'Auburn Tigers', shortName: 'Auburn', seed: 5, region: 'East',
    conference: 'SEC', record: '24-8', color: '#0C2340',
    players: [
      { id: 'pau1', name: 'Johni Broome', team: 'Auburn', teamId: 'auburn', position: 'C', jersey: 4, stockPrice: 39.70, priceChange: 2.80, priceChangePercent: 7.6, stats: { ppg: 14.9, rpg: 10.4, apg: 2.5, bpg: 2.8 }, year: 'Junior', height: "6'10\"", hometown: 'Leesburg, FL', isHot: true },
      { id: 'pau2', name: 'Jabari Smith Sr.', team: 'Auburn', teamId: 'auburn', position: 'SG', jersey: 1, stockPrice: 22.30, priceChange: 0.90, priceChangePercent: 4.2, stats: { ppg: 11.7, rpg: 4.2, apg: 3.7 }, year: 'Senior', height: "6'4\"", hometown: 'Fayetteville, GA' },
      { id: 'pau3', name: 'Chad Baker-Mazara', team: 'Auburn', teamId: 'auburn', position: 'SF', jersey: 44, stockPrice: 18.40, priceChange: 0.60, priceChangePercent: 3.4, stats: { ppg: 10.2, rpg: 3.8, apg: 1.3 }, year: 'Senior', height: "6'7\"", hometown: 'Ottawa, Canada' },
    ],
  },
  illinois: {
    id: 'illinois', name: 'Illinois Fighting Illini', shortName: 'Illinois', seed: 3, region: 'East',
    conference: 'Big Ten', record: '22-11', color: '#13294B',
    players: [
      { id: 'pill1', name: 'Terrence Shannon Jr.', team: 'Illinois', teamId: 'illinois', position: 'SG', jersey: 0, stockPrice: 43.20, priceChange: 3.50, priceChangePercent: 8.8, stats: { ppg: 23.0, rpg: 4.7, apg: 2.5, spg: 1.5 }, year: 'Senior', height: "6'6\"", hometown: 'Harvey, IL', isHot: true },
      { id: 'pill2', name: 'Marcus Domask', team: 'Illinois', teamId: 'illinois', position: 'SF', jersey: 3, stockPrice: 28.60, priceChange: 1.60, priceChangePercent: 5.9, stats: { ppg: 14.6, rpg: 5.3, apg: 4.0 }, year: 'Senior', height: "6'5\"", hometown: 'Mattoon, IL' },
      { id: 'pill3', name: 'Dain Dainja', team: 'Illinois', teamId: 'illinois', position: 'C', jersey: 42, stockPrice: 21.40, priceChange: 0.80, priceChangePercent: 3.9, stats: { ppg: 10.3, rpg: 6.4, apg: 0.8 }, year: 'Sophomore', height: "6'9\"", hometown: 'Bellwood, IL' },
    ],
  },
  northwestern: {
    id: 'northwestern', name: 'Northwestern Wildcats', shortName: 'Northwestern', seed: 10, region: 'West',
    conference: 'Big Ten', record: '23-10', color: '#4E2A84',
    players: [
      { id: 'pnw1', name: 'Boo Buie', team: 'Northwestern', teamId: 'northwestern', position: 'PG', jersey: 0, stockPrice: 26.80, priceChange: 1.70, priceChangePercent: 6.8, stats: { ppg: 18.8, rpg: 3.9, apg: 5.2 }, year: 'Senior', height: "6'2\"", hometown: 'Beaverton, OR', isHot: true },
      { id: 'pnw2', name: 'Blake Peters', team: 'Northwestern', teamId: 'northwestern', position: 'SG', jersey: 14, stockPrice: 19.20, priceChange: 0.70, priceChangePercent: 3.8, stats: { ppg: 11.2, rpg: 3.4, apg: 2.2 }, year: 'Junior', height: "6'4\"", hometown: 'Oceanside, CA' },
      { id: 'pnw3', name: 'Nick Martinelli', team: 'Northwestern', teamId: 'northwestern', position: 'SF', jersey: 2, stockPrice: 16.50, priceChange: -0.30, priceChangePercent: -1.8, stats: { ppg: 9.3, rpg: 4.8, apg: 1.6 }, year: 'Sophomore', height: "6'7\"", hometown: 'Fairview Park, OH' },
    ],
  },
  florida: {
    id: 'florida', name: 'Florida Gators', shortName: 'Florida', seed: 8, region: 'West',
    conference: 'SEC', record: '23-11', color: '#0021A5',
    players: [
      { id: 'pfl1', name: 'Walter Clayton Jr.', team: 'Florida', teamId: 'florida', position: 'PG', jersey: 1, stockPrice: 32.40, priceChange: 2.20, priceChangePercent: 7.3, stats: { ppg: 16.4, rpg: 3.2, apg: 4.2 }, year: 'Senior', height: "6'2\"", hometown: 'Newark, NJ', isHot: true },
      { id: 'pfl2', name: 'Riley Kugel', team: 'Florida', teamId: 'florida', position: 'SG', jersey: 4, stockPrice: 21.80, priceChange: 1.00, priceChangePercent: 4.8, stats: { ppg: 13.5, rpg: 3.5, apg: 2.0 }, year: 'Sophomore', height: "6'5\"", hometown: 'Windermere, FL' },
      { id: 'pfl3', name: 'Alex Condon', team: 'Florida', teamId: 'florida', position: 'C', jersey: 11, stockPrice: 17.90, priceChange: 0.60, priceChangePercent: 3.5, stats: { ppg: 8.9, rpg: 6.7, apg: 1.4, bpg: 1.6 }, year: 'Freshman', height: "7'0\"", hometown: 'Melbourne, Australia' },
    ],
  },
  dayton: {
    id: 'dayton', name: 'Dayton Flyers', shortName: 'Dayton', seed: 7, region: 'West',
    conference: 'Atlantic 10', record: '25-7', color: '#CC0000',
    players: [
      { id: 'pd1', name: 'DaRon Holmes II', team: 'Dayton', teamId: 'dayton', position: 'C', jersey: 15, stockPrice: 40.10, priceChange: 3.40, priceChangePercent: 9.3, stats: { ppg: 19.4, rpg: 7.2, apg: 2.8, bpg: 2.7 }, year: 'Junior', height: "6'10\"", hometown: 'Bellingham, WA', isHot: true },
      { id: 'pd2', name: 'Toumani Camara', team: 'Dayton', teamId: 'dayton', position: 'SF', jersey: 10, stockPrice: 26.30, priceChange: 1.40, priceChangePercent: 5.6, stats: { ppg: 13.5, rpg: 6.1, apg: 2.3 }, year: 'Senior', height: "6'7\"", hometown: 'Paris, France' },
      { id: 'pd3', name: 'Koby Brea', team: 'Dayton', teamId: 'dayton', position: 'SG', jersey: 4, stockPrice: 18.70, priceChange: 0.70, priceChangePercent: 3.9, stats: { ppg: 10.1, rpg: 2.8, apg: 1.5 }, year: 'Senior', height: "6'6\"", hometown: 'Fort Lauderdale, FL' },
    ],
  },
  clemson: {
    id: 'clemson', name: 'Clemson Tigers', shortName: 'Clemson', seed: 6, region: 'South',
    conference: 'ACC', record: '22-11', color: '#F66733',
    players: [
      { id: 'pcl1', name: 'PJ Hall', team: 'Clemson', teamId: 'clemson', position: 'PF', jersey: 0, stockPrice: 30.60, priceChange: 2.10, priceChangePercent: 7.4, stats: { ppg: 16.0, rpg: 5.5, apg: 2.0 }, year: 'Junior', height: "6'9\"", hometown: 'Anderson, SC', isHot: true },
      { id: 'pcl2', name: 'Chase Hunter', team: 'Clemson', teamId: 'clemson', position: 'SG', jersey: 1, stockPrice: 22.40, priceChange: 0.90, priceChangePercent: 4.2, stats: { ppg: 12.7, rpg: 3.2, apg: 3.6 }, year: 'Senior', height: "6'4\"", hometown: 'Powder Springs, GA' },
      { id: 'pcl3', name: 'Brevin Galloway', team: 'Clemson', teamId: 'clemson', position: 'SG', jersey: 23, stockPrice: 17.80, priceChange: 0.40, priceChangePercent: 2.3, stats: { ppg: 10.3, rpg: 3.7, apg: 2.2 }, year: 'Grad', height: "6'3\"", hometown: 'Charlotte, NC' },
    ],
  },
};

// ──────────────────────────────────────
//  BRACKET DATA
// ──────────────────────────────────────

export const BRACKET: { region: string; matchups: Matchup[] }[] = [
  {
    region: 'East',
    matchups: [
      { id: 'm1', region: 'East', round: 1, topSeed: TEAMS.uconn, bottomSeed: TEAMS.stetson, gameDate: 'Mar 21', gameTime: '12:15 PM' },
      { id: 'm2', region: 'East', round: 1, topSeed: TEAMS.iowast, bottomSeed: { ...TEAMS.sdsu, name: 'South Dakota St', shortName: 'South Dakota St', seed: 15, conference: 'Summit', record: '29-5', color: '#003F87' }, gameDate: 'Mar 21', gameTime: '2:45 PM' },
      { id: 'm3', region: 'East', round: 1, topSeed: TEAMS.illinois, bottomSeed: { id: 'morehead', name: 'Morehead State Eagles', shortName: 'Morehead St', seed: 14, region: 'East', conference: 'OVC', record: '26-9', color: '#001B4E', players: [] }, gameDate: 'Mar 22', gameTime: '12:15 PM' },
      { id: 'm4', region: 'East', round: 1, topSeed: TEAMS.auburn, bottomSeed: { id: 'yale', name: 'Yale Bulldogs', shortName: 'Yale', seed: 13, region: 'East', conference: 'Ivy', record: '23-8', color: '#00356B', players: [] }, gameDate: 'Mar 22', gameTime: '2:45 PM' },
      { id: 'm5', region: 'East', round: 1, topSeed: TEAMS.sdsu, bottomSeed: { id: 'uab', name: 'UAB Blazers', shortName: 'UAB', seed: 12, region: 'East', conference: 'AAC', record: '24-10', color: '#1E6B52', players: [] }, gameDate: 'Mar 21', gameTime: '7:10 PM' },
      { id: 'm6', region: 'East', round: 1, topSeed: TEAMS.baylor, bottomSeed: { id: 'colgate', name: 'Colgate Raiders', shortName: 'Colgate', seed: 14, region: 'East', conference: 'Patriot', record: '26-9', color: '#821019', players: [] }, gameDate: 'Mar 22', gameTime: '7:10 PM' },
      { id: 'm7', region: 'East', round: 1, topSeed: TEAMS.duke, bottomSeed: { id: 'vermont', name: 'Vermont Catamounts', shortName: 'Vermont', seed: 13, region: 'East', conference: 'America East', record: '26-7', color: '#007A33', players: [] }, gameDate: 'Mar 21', gameTime: '9:40 PM' },
      { id: 'm8', region: 'East', round: 1, topSeed: { id: 'iowa', name: 'Iowa Hawkeyes', shortName: 'Iowa', seed: 8, region: 'East', conference: 'Big Ten', record: '22-11', color: '#FFCD00', players: [] }, bottomSeed: { id: 'coloradost', name: 'Colorado State Rams', shortName: 'Colorado St', seed: 9, region: 'East', conference: 'MWC', record: '25-10', color: '#1E4D2B', players: [] }, gameDate: 'Mar 22', gameTime: '9:40 PM' },
    ],
  },
  {
    region: 'West',
    matchups: [
      { id: 'm9', region: 'West', round: 1, topSeed: TEAMS.ncstate, bottomSeed: { id: 'texastech', name: 'Texas Tech Red Raiders', shortName: 'Texas Tech', seed: 6, region: 'West', conference: 'Big 12', record: '23-10', color: '#CC0000', players: [] }, gameDate: 'Mar 21', gameTime: '12:15 PM' },
      { id: 'm10', region: 'West', round: 1, topSeed: TEAMS.marquette, bottomSeed: { id: 'wku', name: 'Western Kentucky Hilltoppers', shortName: 'W. Kentucky', seed: 15, region: 'West', conference: 'CUSA', record: '27-8', color: '#C60C30', players: [] }, gameDate: 'Mar 21', gameTime: '2:45 PM' },
      { id: 'm11', region: 'West', round: 1, topSeed: { id: 'kentucky', name: 'Kentucky Wildcats', shortName: 'Kentucky', seed: 3, region: 'West', conference: 'SEC', record: '23-10', color: '#0033A0', players: [] }, bottomSeed: { id: 'oakland', name: 'Oakland Golden Grizzlies', shortName: 'Oakland', seed: 14, region: 'West', conference: 'Horizon', record: '22-12', color: '#231F20', players: [] }, gameDate: 'Mar 22', gameTime: '12:15 PM' },
      { id: 'm12', region: 'West', round: 1, topSeed: TEAMS.florida, bottomSeed: { id: 'colorado', name: 'Colorado Buffaloes', shortName: 'Colorado', seed: 9, region: 'West', conference: 'Pac-12', record: '26-10', color: '#CFB87C', players: [] }, gameDate: 'Mar 21', gameTime: '7:10 PM' },
      { id: 'm13', region: 'West', round: 1, topSeed: TEAMS.dayton, bottomSeed: { id: 'nevada', name: 'Nevada Wolf Pack', shortName: 'Nevada', seed: 10, region: 'West', conference: 'MWC', record: '26-9', color: '#003366', players: [] }, gameDate: 'Mar 22', gameTime: '7:10 PM' },
      { id: 'm14', region: 'West', round: 1, topSeed: TEAMS.tennessee, bottomSeed: { id: 'stpeters', name: "Saint Peter's Peacocks", shortName: "Saint Peter's", seed: 15, region: 'West', conference: 'MAAC', record: '20-14', color: '#00529B', players: [] }, gameDate: 'Mar 21', gameTime: '9:40 PM' },
      { id: 'm15', region: 'West', round: 1, topSeed: TEAMS.creighton, bottomSeed: { id: 'akron', name: 'Akron Zips', shortName: 'Akron', seed: 14, region: 'West', conference: 'MAC', record: '27-7', color: '#041E42', players: [] }, gameDate: 'Mar 22', gameTime: '2:45 PM' },
      { id: 'm16', region: 'West', round: 1, topSeed: TEAMS.gonzaga, bottomSeed: { id: 'mcneese', name: 'McNeese Cowboys', shortName: 'McNeese', seed: 16, region: 'West', conference: 'Southland', record: '30-4', color: '#005596', players: [] }, gameDate: 'Mar 22', gameTime: '9:40 PM' },
    ],
  },
  {
    region: 'South',
    matchups: [
      { id: 'm17', region: 'South', round: 1, topSeed: TEAMS.houston, bottomSeed: { id: 'longwood', name: 'Longwood Lancers', shortName: 'Longwood', seed: 16, region: 'South', conference: 'Big South', record: '29-6', color: '#003366', players: [] }, gameDate: 'Mar 21', gameTime: '12:30 PM' },
      { id: 'm18', region: 'South', round: 1, topSeed: { id: 'texas', name: 'Texas Longhorns', shortName: 'Texas', seed: 2, region: 'South', conference: 'Big 12', record: '25-8', color: '#BF5700', players: [] }, bottomSeed: { id: 'utarlington', name: 'UT Arlington Mavericks', shortName: 'UT Arlington', seed: 15, region: 'South', conference: 'WAC', record: '24-9', color: '#003087', players: [] }, gameDate: 'Mar 21', gameTime: '3:00 PM' },
      { id: 'm19', region: 'South', round: 1, topSeed: TEAMS.purdue, bottomSeed: TEAMS.montanast, gameDate: 'Mar 22', gameTime: '12:30 PM' },
      { id: 'm20', region: 'South', round: 1, topSeed: TEAMS.duke, bottomSeed: { id: 'vermont2', name: 'Vermont Catamounts', shortName: 'Vermont', seed: 13, region: 'South', conference: 'America East', record: '26-7', color: '#007A33', players: [] }, gameDate: 'Mar 22', gameTime: '3:00 PM' },
      { id: 'm21', region: 'South', round: 1, topSeed: TEAMS.alabama, bottomSeed: { id: 'charlestonsc', name: 'College of Charleston', shortName: 'Charleston', seed: 13, region: 'South', conference: 'CAA', record: '28-7', color: '#461D7C', players: [] }, gameDate: 'Mar 21', gameTime: '7:25 PM' },
      { id: 'm22', region: 'South', round: 1, topSeed: TEAMS.clemson, bottomSeed: { id: 'newmexico', name: 'New Mexico Lobos', shortName: 'New Mexico', seed: 11, region: 'South', conference: 'MWC', record: '27-7', color: '#BA0C2F', players: [] }, gameDate: 'Mar 22', gameTime: '7:25 PM' },
      { id: 'm23', region: 'South', round: 1, topSeed: TEAMS.kansas, bottomSeed: { id: 'samford', name: 'Samford Bulldogs', shortName: 'Samford', seed: 13, region: 'South', conference: 'SoCon', record: '28-7', color: '#003591', players: [] }, gameDate: 'Mar 21', gameTime: '9:55 PM' },
      { id: 'm24', region: 'South', round: 1, topSeed: TEAMS.gonzaga, bottomSeed: { id: 'mcneese2', name: 'McNeese Cowboys', shortName: 'McNeese', seed: 12, region: 'South', conference: 'Southland', record: '30-4', color: '#005596', players: [] }, gameDate: 'Mar 22', gameTime: '9:55 PM' },
    ],
  },
  {
    region: 'Midwest',
    matchups: [
      { id: 'm25', region: 'Midwest', round: 1, topSeed: { id: 'illinois2', name: 'Illinois Fighting Illini', shortName: 'Illinois', seed: 3, region: 'Midwest', conference: 'Big Ten', record: '22-11', color: '#13294B', players: [] }, bottomSeed: { id: 'morehead2', name: 'Morehead State', shortName: 'Morehead St', seed: 14, region: 'Midwest', conference: 'OVC', record: '26-9', color: '#001B4E', players: [] }, gameDate: 'Mar 22', gameTime: '12:30 PM' },
      { id: 'm26', region: 'Midwest', round: 1, topSeed: TEAMS.marquette, bottomSeed: { id: 'wku2', name: 'Western Kentucky', shortName: 'W. Kentucky', seed: 15, region: 'Midwest', conference: 'CUSA', record: '27-8', color: '#C60C30', players: [] }, gameDate: 'Mar 22', gameTime: '3:00 PM' },
      { id: 'm27', region: 'Midwest', round: 1, topSeed: { id: 'kentucky2', name: 'Kentucky Wildcats', shortName: 'Kentucky', seed: 3, region: 'Midwest', conference: 'SEC', record: '23-10', color: '#0033A0', players: [] }, bottomSeed: { id: 'oakland2', name: 'Oakland Golden Grizzlies', shortName: 'Oakland', seed: 14, region: 'Midwest', conference: 'Horizon', record: '22-12', color: '#231F20', players: [] }, gameDate: 'Mar 21', gameTime: '7:25 PM' },
      { id: 'm28', region: 'Midwest', round: 1, topSeed: { id: 'ncstate2', name: 'NC State Wolfpack', shortName: 'NC State', seed: 11, region: 'Midwest', conference: 'ACC', record: '22-12', color: '#CC0000', players: [] }, bottomSeed: { id: 'texastech2', name: 'Texas Tech Red Raiders', shortName: 'Texas Tech', seed: 6, region: 'Midwest', conference: 'Big 12', record: '23-10', color: '#CC0000', players: [] }, gameDate: 'Mar 21', gameTime: '9:55 PM' },
      { id: 'm29', region: 'Midwest', round: 1, topSeed: { id: 'jmu', name: 'James Madison Dukes', shortName: 'James Madison', seed: 12, region: 'Midwest', conference: 'Sun Belt', record: '31-3', color: '#450084', players: [] }, bottomSeed: { id: 'wisconsin', name: 'Wisconsin Badgers', shortName: 'Wisconsin', seed: 5, region: 'Midwest', conference: 'Big Ten', record: '23-10', color: '#C5050C', players: [] }, gameDate: 'Mar 22', gameTime: '7:25 PM' },
      { id: 'm30', region: 'Midwest', round: 1, topSeed: TEAMS.northwestern, bottomSeed: { id: 'floridaatlantic', name: 'Florida Atlantic Owls', shortName: 'Fla. Atlantic', seed: 7, region: 'Midwest', conference: 'AAC', record: '24-8', color: '#003366', players: [] }, gameDate: 'Mar 22', gameTime: '9:55 PM' },
      { id: 'm31', region: 'Midwest', round: 1, topSeed: TEAMS.creighton, bottomSeed: { id: 'akron2', name: 'Akron Zips', shortName: 'Akron', seed: 14, region: 'Midwest', conference: 'MAC', record: '27-7', color: '#041E42', players: [] }, gameDate: 'Mar 21', gameTime: '12:30 PM' },
      { id: 'm32', region: 'Midwest', round: 1, topSeed: TEAMS.tennessee, bottomSeed: { id: 'stpeters2', name: "Saint Peter's Peacocks", shortName: "Saint Peter's", seed: 15, region: 'Midwest', conference: 'MAAC', record: '20-14', color: '#00529B', players: [] }, gameDate: 'Mar 21', gameTime: '3:00 PM' },
    ],
  },
];

// ──────────────────────────────────────
//  FLATTENED PLAYER LIST
// ──────────────────────────────────────

export const ALL_PLAYERS: Player[] = Object.values(TEAMS)
  .flatMap(team => team.players)
  .filter(p => p.id);

// ──────────────────────────────────────
//  MOCK USER DATA
// ──────────────────────────────────────

export const MOCK_USER = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  balance: 1250.00,
  portfolioValue: 842.50,
};

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { playerId: 'p11', playerName: 'Zach Edey', team: 'Purdue', shares: 5, avgBuyPrice: 48.20, currentPrice: 55.00 },
  { playerId: 'p1', playerName: 'Donovan Clingan', team: 'UConn', shares: 3, avgBuyPrice: 38.50, currentPrice: 42.50 },
  { playerId: 'p56', playerName: 'DJ Burns Jr.', team: 'NC State', shares: 4, avgBuyPrice: 29.10, currentPrice: 38.20 },
  { playerId: 'p41', playerName: 'Kyle Filipowski', team: 'Duke', shares: 2, avgBuyPrice: 44.00, currentPrice: 48.30 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', playerId: 'p11', playerName: 'Zach Edey', type: 'buy', shares: 5, price: 48.20, total: 241.00, date: 'Mar 18, 2024' },
  { id: 't2', playerId: 'p1', playerName: 'Donovan Clingan', type: 'buy', shares: 3, price: 38.50, total: 115.50, date: 'Mar 17, 2024' },
  { id: 't3', playerId: 'p56', playerName: 'DJ Burns Jr.', type: 'buy', shares: 4, price: 29.10, total: 116.40, date: 'Mar 16, 2024' },
  { id: 't4', playerId: 'p41', playerName: 'Kyle Filipowski', type: 'buy', shares: 2, price: 44.00, total: 88.00, date: 'Mar 15, 2024' },
  { id: 't5', playerId: 'p16', playerName: 'Jamal Shead', type: 'sell', shares: 2, price: 41.20, total: 82.40, date: 'Mar 14, 2024' },
  { id: 't6', playerId: 'p21', playerName: 'Dalton Knecht', type: 'buy', shares: 3, price: 39.80, total: 119.40, date: 'Mar 13, 2024' },
];
