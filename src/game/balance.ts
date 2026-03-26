import type { Difficulty } from './types';

export type Balance = {
  startingCash: number;
  rent: number;
  dues: number;
  electric: number;
  gas: number;
  internet: number;
  groceryBase: number;
  cinema: number;
  cardMonthlyRate: number; // monthly interest on unpaid debt
  volatility: { gold: number; stocks: number };
  policyRateVol: number;
  guestDaysAvg: number;
  guestCostMin: number;
  guestCostMax: number;
};

export function balanceFor(d: Difficulty): Balance {
  switch (d) {
    case 'easy':
      return {
        startingCash: 17002,
        rent: 7000,
        dues: 600,
        electric: 700,
        gas: 900,
        internet: 450,
        groceryBase: 450,
        cinema: 280,
        cardMonthlyRate: 0.06,
        volatility: { gold: 0.015, stocks: 0.02 },
        policyRateVol: 0.6,
        guestDaysAvg: 1.5,
        guestCostMin: 250,
        guestCostMax: 600,
      };
    case 'normal':
      return {
        startingCash: 17002,
        rent: 8000,
        dues: 750,
        electric: 850,
        gas: 1100,
        internet: 500,
        groceryBase: 520,
        cinema: 320,
        cardMonthlyRate: 0.08,
        volatility: { gold: 0.03, stocks: 0.045 },
        policyRateVol: 1.2,
        guestDaysAvg: 3.0,
        guestCostMin: 350,
        guestCostMax: 900,
      };
    case 'hard':
      return {
        startingCash: 17002,
        rent: 9000,
        dues: 950,
        electric: 1000,
        gas: 1300,
        internet: 550,
        groceryBase: 600,
        cinema: 380,
        cardMonthlyRate: 0.10,
        volatility: { gold: 0.06, stocks: 0.09 },
        policyRateVol: 2.0,
        guestDaysAvg: 5.0,
        guestCostMin: 450,
        guestCostMax: 1400,
      };
  }
}
