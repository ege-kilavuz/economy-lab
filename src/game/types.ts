export type Difficulty = 'easy' | 'normal' | 'hard';

export type HoldingId = 'gold' | 'stock' | 'usd' | 'btc' | 'eth';

export type QuestState = {
  title: string;
  hint: string;
  done: boolean;
};

export type BillId = 'electric' | 'gas' | 'internet' | 'dues';

export type BillsState = Record<BillId, boolean>;

export type GameState = {
  day: number; // 1..30
  cash: number;
  cardDebt: number;
  fridge: number; // 0..100
  mood: number; // 0..100
  energy: number; // 0..100

  holdings: Record<HoldingId, number>; // amounts (gold grams, stock units, usd dollars, coins)

  rentPaid: boolean;
  billsPaid: BillsState;
  difficulty: Difficulty;
  seed: number;
  log: string[];

  // daily gamification
  points: number;
  quest: QuestState;

  // market prices
  goldPrice: number; // TL per gram
  stockIndex: number; // arbitrary index
  usdTry: number; // TL per USD
  btcTry: number; // TL per BTC
  ethTry: number; // TL per ETH

  policyRate: number; // %
  marketMood?: 'inflation' | 'fx' | 'credit' | 'equity' | 'neutral';
};

export type ActionId =
  | 'grocery'
  | 'cinema'
  | 'lightsOff'
  | 'payRent'
  | 'payElectric'
  | 'payGas'
  | 'payInternet'
  | 'payDues'
  | 'buyAsset'
  | 'sellAsset'
  | 'payCardMin'
  | 'payCardAll';
