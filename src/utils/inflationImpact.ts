import type { GameState } from '../game/types';

const MONTHLY_INFLATION = 0.03; // ~%3 aylık (oyundaki varsayılan)

export interface InflationImpact {
  /** Nominal cash at end */
  nominalCash: number;
  /** Real value of cash after inflation */
  realCash: number;
  /** Total purchasing power lost */
  lossTL: number;
  /** Percentage lost */
  lossPct: number;
  /** What 100 TL at start is worth now */
  start100ValueNow: number;
}

export function calculateInflationImpact(game: GameState): InflationImpact {
  const monthsPassed = game.day / 30;
  const inflationFactor = Math.pow(1 + MONTHLY_INFLATION, monthsPassed);

  const nominalCash = game.cash;
  const realCash = Math.round(nominalCash / inflationFactor);
  const lossTL = nominalCash - realCash;
  const lossPct = Math.round((1 - 1 / inflationFactor) * 100);
  const start100ValueNow = Math.round(100 / inflationFactor);

  return { nominalCash, realCash, lossTL, lossPct, start100ValueNow };
}
