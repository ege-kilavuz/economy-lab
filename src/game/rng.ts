// Deterministic RNG for repeatable runs (per seed)
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickWeighted<T>(rng: () => number, items: Array<{ w: number; v: T }>): T {
  const sum = items.reduce((a, b) => a + b.w, 0);
  const x = rng() * sum;
  let acc = 0;
  for (const it of items) {
    acc += it.w;
    if (x <= acc) return it.v;
  }
  return items[items.length - 1]!.v;
}
