export function formatPct(v: number, digits = 0) {
  return `${v.toFixed(digits)}%`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
