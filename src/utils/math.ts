/** Clamp a number between min and max */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Round to nearest integer */
export function tl(n: number): number {
  return Math.round(n);
}

/** Format as TL with thousands separator */
export function moneyTL(n: number): string {
  return `${Math.round(n).toLocaleString()} TL`;
}
