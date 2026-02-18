export type Difficulty = 'easy' | 'normal' | 'hard';

export type GameState = {
  day: number; // 1..30
  cash: number;
  cardDebt: number;
  fridge: number; // 0..100
  mood: number; // 0..100
  energy: number; // 0..100
  gold: number; // grams
  stocks: number; // "units"
  rentPaid: boolean;
  billsPaid: { electric: boolean; gas: boolean; internet: boolean; dues: boolean };
  difficulty: Difficulty;
  seed: number;
  log: string[];
  // market
  goldPrice: number; // TL per gram
  stockIndex: number; // arbitrary index
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
  | 'buyGold'
  | 'sellGold'
  | 'buyStocks'
  | 'sellStocks'
  | 'payCardMin'
  | 'payCardAll';
