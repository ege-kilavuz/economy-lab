export type Difficulty = 'easy' | 'normal' | 'hard';

export type HoldingId = 'gold' | 'stock' | 'usd' | 'btc' | 'eth';

export type GameState = {
  day: number; // 1..30
  cash: number;
  cardDebt: number;
  fridge: number; // 0..100
  mood: number; // 0..100
  energy: number; // 0..100

  holdings: Record<HoldingId, number>; // amounts (gold grams, stock units, usd dollars, coins)

  rentPaid: boolean;
  billsPaid: { electric: boolean; gas: boolean; internet: boolean; dues: boolean };
  difficulty: Difficulty;
  seed: number;
  log: string[];

  // daily gamification
  points: number;
  quest: { title: string; hint: string; done: boolean };

  // market prices
  goldPrice: number; // TL per gram
  stockIndex: number; // arbitrary index
  usdTry: number; // TL per USD
  btcTry: number; // TL per BTC
  ethTry: number; // TL per ETH

  policyRate: number; // %
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
