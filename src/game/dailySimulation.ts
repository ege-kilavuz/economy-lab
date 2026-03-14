import { balanceFor } from './balance';
import { pickWeighted, mulberry32 } from './rng';
import type { BillId, BillsState, GameState } from './types';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tl(n: number) {
  return Math.round(n);
}

export function applyDailyExpenses(s: GameState): GameState {
  let fridge = s.fridge - 6;
  let mood = s.mood;
  let energy = s.energy;
  let cash = s.cash;

  if (fridge < 0) {
    fridge = 0;
    mood -= 8;
    energy -= 6;
  } else if (fridge < 20) {
    mood -= 2;
    energy -= 1;
  }

  const daily = 80;
  if (cash >= daily) {
    cash -= daily;
    return { ...s, fridge, mood: clamp(mood, 0, 100), energy: clamp(energy, 0, 100), cash };
  }

  return {
    ...s,
    fridge,
    mood: clamp(mood, 0, 100),
    energy: clamp(energy, 0, 100),
    cardDebt: s.cardDebt + (daily - cash),
    cash: 0,
  };
}

export function updateDailyMarkets(s: GameState): GameState {
  const b = balanceFor(s.difficulty);
  const rng = mulberry32(s.seed + s.day * 1337);

  const policyDelta = (rng() - 0.5) * 2 * b.policyRateVol;
  const policyRate = clamp(s.policyRate + policyDelta, 10, 80);

  const goldShock = (rng() - 0.5) * 2 * b.volatility.gold;
  const stockShock = (rng() - 0.5) * 2 * b.volatility.stocks;
  const rateTight = (policyRate - 40) / 100;

  const goldPrice = Math.max(500, s.goldPrice * (1 + goldShock + 0.002 * rateTight));
  const stockIndex = Math.max(20, s.stockIndex * (1 + stockShock - 0.004 * rateTight));

  const fxShock = (rng() - 0.5) * 2 * (b.volatility.gold * 1.2);
  const usdTry = Math.max(5, s.usdTry * (1 + fxShock + 0.001 * rateTight));

  const btcShock = (rng() - 0.5) * 2 * (b.volatility.stocks * 1.6);
  const ethShock = (rng() - 0.5) * 2 * (b.volatility.stocks * 1.4);
  const btcTry = Math.max(50000, s.btcTry * (1 + btcShock));
  const ethTry = Math.max(2000, s.ethTry * (1 + ethShock));

  return { ...s, goldPrice, stockIndex, usdTry, btcTry, ethTry, policyRate };
}

export function applyLifeEvent(s: GameState): { state: GameState; message: string | null } {
  const b = balanceFor(s.difficulty);
  const rng = mulberry32(s.seed + s.day * 9001);

  const cashPressure = s.cash < 500 ? 0.25 : 0;
  const debtPressure = clamp(s.cardDebt / Math.max(1, b.startingCash * 2), 0, 0.6);
  const moodPressure = s.mood < 40 ? 0.25 : s.mood < 55 ? 0.1 : 0;
  const stressFactor = clamp(1 + cashPressure + debtPressure + moodPressure, 0.7, 1.8);

  const guestP = clamp((b.guestDaysAvg / 30) * (2 - stressFactor), 0, 0.6);
  if (rng() < guestP) {
    const cost = tl(b.guestCostMin + rng() * (b.guestCostMax - b.guestCostMin));
    if (s.cash >= cost) {
      return {
        state: { ...s, cash: s.cash - cost, mood: clamp(s.mood + 2, 0, 100) },
        message: `Misafir geldi: -${cost.toLocaleString()} TL (ikram/alışveriş)`,
      };
    }

    return {
      state: { ...s, cardDebt: s.cardDebt + cost, mood: clamp(s.mood - 3, 0, 100) },
      message: `Misafir geldi: -${cost.toLocaleString()} TL (ikram/alışveriş)`,
    };
  }

  const roll = rng();
  const negThreshold = 0.12 * stressFactor;
  const posThreshold = negThreshold + 0.08 * (2 - stressFactor);
  const spoilThreshold = posThreshold + 0.06 * stressFactor;

  if (roll < negThreshold) {
    const cost = tl(1500 + rng() * 3500);
    const payWithCash = s.cash >= cost;
    return {
      state: payWithCash
        ? { ...s, cash: s.cash - cost, mood: clamp(s.mood - 2, 0, 100) }
        : { ...s, cardDebt: s.cardDebt + cost, mood: clamp(s.mood - 4, 0, 100) },
      message: `Beklenmedik gider: -${cost.toLocaleString()} TL (telefon/ev eşyası)`,
    };
  }

  if (roll < posThreshold) {
    const extra = tl(1000 + rng() * 2500);
    return {
      state: { ...s, cash: s.cash + extra, mood: clamp(s.mood + 1, 0, 100) },
      message: `Ek gelir: +${extra.toLocaleString()} TL (freelance/prim)`,
    };
  }

  if (roll < spoilThreshold) {
    const drop = tl(10 + rng() * 25);
    return {
      state: { ...s, fridge: clamp(s.fridge - drop, 0, 100), mood: clamp(s.mood - 2, 0, 100) },
      message: `Dolap sürprizi: bazı ürünler bozuldu (-${drop.toLocaleString()}% dolap)`,
    };
  }

  return { state: s, message: null };
}

export function getDailyPolicyNews(s: GameState): string | null {
  const rng = mulberry32(s.seed + s.day * 4242);
  const decisionDay = 15;

  if (s.day === decisionDay) {
    const surprise = s.difficulty === 'easy' ? 0.2 : s.difficulty === 'normal' ? 0.6 : 1.0;
    const dir = rng() < 0.5 + surprise * 0.1 ? 'artırdı' : 'indirdi';
    const delta = s.difficulty === 'easy' ? 2 : s.difficulty === 'normal' ? 5 : 8;
    return `TCMB faiz kararı: politika faizini ${delta} puan ${dir}. Açıklama: enflasyon görünümü ve beklentiler vurgulandı.`;
  }

  if (rng() > 0.18) return null;

  const theme = pickWeighted(rng, [
    { w: 2, v: 'Enflasyon' },
    { w: 2, v: 'Kur' },
    { w: 2, v: 'Piyasa' },
    { w: 1, v: 'Kredi' },
  ]);

  if (theme === 'Enflasyon') {
    return pickWeighted(rng, [
      { w: 1, v: 'Enflasyon gündemde: fiyat artışları konuşuluyor.' },
      { w: 1, v: 'Market fiyatları arttı: hane bütçesi daha zor.' },
    ]);
  }

  if (theme === 'Kur') {
    return pickWeighted(rng, [
      { w: 1, v: 'Kurda hareket: ithal ürünler pahalılaşabilir.' },
      { w: 1, v: 'Dolar/TL dalgalı: belirsizlik arttı.' },
    ]);
  }

  if (theme === 'Kredi') {
    return pickWeighted(rng, [
      { w: 1, v: 'Kredi kartı faizleri gündemde: asgari ödeme tuzağına dikkat.' },
      { w: 1, v: 'Tüketici kredilerinde sıkılaşma konuşuluyor.' },
    ]);
  }

  return pickWeighted(rng, [
    { w: 1, v: 'Borsada dalga: risk iştahı değişiyor.' },
    { w: 1, v: 'Altın hareketli: güvenli liman arayışı.' },
  ]);
}

export function getUnpaidBills(billsPaid: BillsState): BillId[] {
  return Object.entries(billsPaid)
    .filter(([, isPaid]) => !isPaid)
    .map(([billId]) => billId as BillId);
}

export function applyDailyPenalty(s: GameState): { state: GameState; message: string | null } {
  if (s.day === 10 && !s.rentPaid) {
    return {
      state: { ...s, mood: clamp(s.mood - 8, 0, 100), cardDebt: s.cardDebt + 300 },
      message: 'Kira gecikti: moral düştü, 300 TL gecikme (karta yazıldı).',
    };
  }

  if (s.day === 20) {
    const unpaid = getUnpaidBills(s.billsPaid);
    if (unpaid.length > 0) {
      return {
        state: { ...s, mood: clamp(s.mood - 6, 0, 100), cardDebt: s.cardDebt + 200 },
        message: `Faturalar gecikiyor (${unpaid.join(', ')}): 200 TL ceza (karta).`,
      };
    }
  }

  return { state: s, message: null };
}
