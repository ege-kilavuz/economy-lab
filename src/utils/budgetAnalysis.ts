import type { GameState } from '../game/types';
import { balanceFor } from '../game/balance';

export interface BudgetAnalysis {
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  needsTarget: number;
  wantsTarget: number;
  savingsTarget: number;
  rentPaid: boolean;
  billsCount: number;
  totalBills: number;
  hasInvestment: boolean;
}

export function analyzeBudget(game: GameState): BudgetAnalysis {
  const b = balanceFor(game.difficulty);
  const income = b.startingCash;

  // Needs: rent + bills + estimated grocery
  const totalBills = b.rent + b.dues + b.electric + b.gas + b.internet;
  const needsTotal = totalBills + b.groceryBase * 30;
  const needsPct = Math.round((needsTotal / income) * 100);

  // Wants: estimated from game (cinema, entertainment)
  // We estimate based on mood spending
  const wantsEstimate = game.day > 0 ? Math.round((income - game.cash - needsTotal * (game.day / 30)) / Math.max(1, game.day / 30)) : 0;
  const wantsPct = Math.min(100, Math.round(((wantsEstimate * 30) / income) * 100));

  // Savings: investments + cash remaining
  const totalAssets = Object.values(game.holdings).reduce((s, v) => s + v, 0);
  const savingsTotal = totalAssets > 0 ? totalAssets * 1000 : 0; // rough estimate
  const savingsPct = Math.min(100, Math.round(((game.cash + savingsTotal) / income) * 100));

  // 50/30/20 targets based on income
  const needsTarget = Math.round(income * 0.5);
  const wantsTarget = Math.round(income * 0.3);
  const savingsTarget = Math.round(income * 0.2);

  return {
    needsPct,
    wantsPct,
    savingsPct,
    needsTarget,
    wantsTarget,
    savingsTarget,
    rentPaid: game.rentPaid,
    billsCount: Object.values(game.billsPaid).filter(Boolean).length,
    totalBills,
    hasInvestment: Object.values(game.holdings).some(v => v > 0),
  };
}
