import type { ActionId, Difficulty, GameState, HoldingId } from './types';
import { balanceFor } from './balance';
import { mulberry32, pickWeighted } from './rng';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tl(n: number) {
  return Math.round(n);
}

function logPush(s: GameState, msg: string) {
  return { ...s, log: [msg, ...s.log].slice(0, 80) };
}

export function newGame(difficulty: Difficulty): GameState {
  const b = balanceFor(difficulty);
  const seed = Date.now() % 1000000;
  return {
    day: 1,
    cash: b.startingCash,
    cardDebt: 0,
    fridge: 55,
    mood: 60,
    energy: 60,

    holdings: { gold: 0, stock: 0, usd: 0, btc: 0, eth: 0 },

    rentPaid: false,
    billsPaid: { electric: false, gas: false, internet: false, dues: false },
    difficulty,
    seed,
    log: [`Oyun başladı (${difficulty}). Maaş yattı: ${b.startingCash.toLocaleString()} TL`],

    goldPrice: 2200,
    stockIndex: 100,
    usdTry: 33.5,
    btcTry: 2200000,
    ethTry: 120000,

    policyRate: 45,
  };
}

function pay(s: GameState, amount: number, useCard: boolean) {
  if (amount <= 0) return s;
  if (!useCard) {
    if (s.cash < amount) return logPush(s, `Yetersiz bakiye: ${tl(amount).toLocaleString()} TL ödenemedi.`);
    return { ...s, cash: s.cash - amount };
  }
  // credit card
  return { ...s, cardDebt: s.cardDebt + amount };
}

export function canAfford(s: GameState, amount: number) {
  return s.cash >= amount;
}

export function applyAction(
  s0: GameState,
  action: ActionId,
  opts?: { useCard?: boolean; amount?: number; asset?: HoldingId }
) {
  const b = balanceFor(s0.difficulty);
  let s = s0;
  const useCard = !!opts?.useCard;

  switch (action) {
    case 'grocery': {
      const cost = tl(b.groceryBase * (0.8 + (s0.fridge < 35 ? 0.6 : 0.2)));
      s = pay(s, cost, useCard);
      s = { ...s, fridge: clamp(s.fridge + 20, 0, 100), mood: clamp(s.mood + 2, 0, 100) };
      return logPush(s, `Market: -${cost.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'}), dolap +20`);
    }
    case 'cinema': {
      const cost = b.cinema;
      s = pay(s, cost, useCard);
      s = { ...s, mood: clamp(s.mood + 12, 0, 100), energy: clamp(s.energy - 5, 0, 100) };
      return logPush(s, `Sinema: -${cost.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'}), moral +12`);
    }
    case 'lightsOff': {
      // tiny habit. increases energy/mood slightly, gives end-of-month bill reduction via daily flag? simplified to immediate cash-saving token.
      s = { ...s, mood: clamp(s.mood + 1, 0, 100) };
      return logPush(s, `Tasarruf: ışıkları kapattın. (+1 moral)`);
    }
    case 'payRent': {
      if (s.rentPaid) return logPush(s, 'Kira zaten ödendi.');
      s = pay(s, b.rent, useCard);
      // If paid (cash reduced or debt increased) we still mark paid.
      s = { ...s, rentPaid: true };
      return logPush(s, `Kira ödendi: ${b.rent.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'})`);
    }
    case 'payDues': {
      if (s.billsPaid.dues) return logPush(s, 'Aidat zaten ödendi.');
      s = pay(s, b.dues, useCard);
      s = { ...s, billsPaid: { ...s.billsPaid, dues: true } };
      return logPush(s, `Aidat ödendi: ${b.dues.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'})`);
    }
    case 'payElectric': {
      if (s.billsPaid.electric) return logPush(s, 'Elektrik zaten ödendi.');
      s = pay(s, b.electric, useCard);
      s = { ...s, billsPaid: { ...s.billsPaid, electric: true } };
      return logPush(s, `Elektrik ödendi: ${b.electric.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'})`);
    }
    case 'payGas': {
      if (s.billsPaid.gas) return logPush(s, 'Doğalgaz zaten ödendi.');
      s = pay(s, b.gas, useCard);
      s = { ...s, billsPaid: { ...s.billsPaid, gas: true } };
      return logPush(s, `Doğalgaz ödendi: ${b.gas.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'})`);
    }
    case 'payInternet': {
      if (s.billsPaid.internet) return logPush(s, 'İnternet zaten ödendi.');
      s = pay(s, b.internet, useCard);
      s = { ...s, billsPaid: { ...s.billsPaid, internet: true } };
      return logPush(s, `İnternet ödendi: ${b.internet.toLocaleString()} TL (${useCard ? 'kart' : 'nakit'})`);
    }
    case 'buyAsset': {
      const asset = opts?.asset;
      const amount = opts?.amount ?? 1;
      if (!asset) return logPush(s, 'Asset seçilmedi.');
      if (amount <= 0) return s;

      const priceTL =
        asset === 'gold'
          ? s.goldPrice
          : asset === 'stock'
            ? tl(s.stockIndex * 20)
            : asset === 'usd'
              ? s.usdTry
              : asset === 'btc'
                ? s.btcTry
                : s.ethTry;

      const cost = tl(amount * priceTL);
      if (s.cash < cost) return logPush(s, 'Alım için yeterli nakit yok.');

      s = {
        ...s,
        cash: s.cash - cost,
        holdings: { ...s.holdings, [asset]: s.holdings[asset] + amount },
      };
      return logPush(s, `Alım: ${asset} +${amount} ( -${cost.toLocaleString()} TL )`);
    }
    case 'sellAsset': {
      const asset = opts?.asset;
      const amount = opts?.amount ?? 1;
      if (!asset) return logPush(s, 'Asset seçilmedi.');
      if (amount <= 0) return s;
      if (s.holdings[asset] < amount) return logPush(s, 'Satacak varlık yok.');

      const priceTL =
        asset === 'gold'
          ? s.goldPrice
          : asset === 'stock'
            ? tl(s.stockIndex * 20)
            : asset === 'usd'
              ? s.usdTry
              : asset === 'btc'
                ? s.btcTry
                : s.ethTry;

      const gain = tl(amount * priceTL);
      s = {
        ...s,
        cash: s.cash + gain,
        holdings: { ...s.holdings, [asset]: s.holdings[asset] - amount },
      };
      return logPush(s, `Satış: ${asset} -${amount} ( +${gain.toLocaleString()} TL )`);
    }
    case 'payCardMin': {
      const minPay = tl(Math.max(200, s.cardDebt * 0.1));
      if (s.cash < minPay) return logPush(s, 'Asgari ödemeyi yapmak için nakit yok.');
      s = { ...s, cash: s.cash - minPay, cardDebt: Math.max(0, s.cardDebt - minPay) };
      return logPush(s, `Kredi kartı asgari ödeme: -${minPay.toLocaleString()} TL`);
    }
    case 'payCardAll': {
      const amt = tl(s.cardDebt);
      if (amt <= 0) return logPush(s, 'Kart borcu yok.');
      if (s.cash < amt) return logPush(s, 'Kart borcunu kapatacak nakit yok.');
      s = { ...s, cash: s.cash - amt, cardDebt: 0 };
      return logPush(s, `Kredi kartı borcu kapatıldı: -${amt.toLocaleString()} TL`);
    }
  }
}

function dailyExpenses(s: GameState) {
  // Fridge depletes daily; if empty, mood/energy drop.
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

  // small daily transport/coffee spend (cash)
  const daily = 80;
  if (cash >= daily) cash -= daily;
  else {
    // if no cash, adds to card debt slightly (survival)
    return { ...s, fridge, mood: clamp(mood, 0, 100), energy: clamp(energy, 0, 100), cardDebt: s.cardDebt + (daily - cash), cash: 0 };
  }

  return { ...s, fridge, mood: clamp(mood, 0, 100), energy: clamp(energy, 0, 100), cash };
}

function updateMarkets(s: GameState) {
  const b = balanceFor(s.difficulty);
  const rng = mulberry32(s.seed + s.day * 1337);

  // policy rate random walk
  const policyDelta = (rng() - 0.5) * 2 * b.policyRateVol;
  const policyRate = clamp(s.policyRate + policyDelta, 10, 80);

  // gold and stocks move with volatility + policy drift
  const goldShock = (rng() - 0.5) * 2 * b.volatility.gold;
  const stockShock = (rng() - 0.5) * 2 * b.volatility.stocks;

  // higher policy rate -> slightly negative stocks, slightly positive gold (toy)
  const rateTight = (policyRate - 40) / 100;

  const goldPrice = Math.max(500, s.goldPrice * (1 + goldShock + 0.002 * rateTight));
  const stockIndex = Math.max(20, s.stockIndex * (1 + stockShock - 0.004 * rateTight));

  // FX/crypto (toy)
  const fxShock = (rng() - 0.5) * 2 * (b.volatility.gold * 1.2);
  const usdTry = Math.max(5, s.usdTry * (1 + fxShock + 0.001 * rateTight));

  const btcShock = (rng() - 0.5) * 2 * (b.volatility.stocks * 1.6);
  const ethShock = (rng() - 0.5) * 2 * (b.volatility.stocks * 1.4);
  const btcTry = Math.max(50000, s.btcTry * (1 + btcShock));
  const ethTry = Math.max(2000, s.ethTry * (1 + ethShock));

  return { ...s, goldPrice, stockIndex, usdTry, btcTry, ethTry, policyRate };
}

function maybeGuestEvent(s: GameState) {
  const b = balanceFor(s.difficulty);
  const rng = mulberry32(s.seed + s.day * 9001);

  // probability calibrated so avg guest days approx given
  const p = clamp(b.guestDaysAvg / 30, 0, 0.5);
  if (rng() > p) return { s, eventText: null as string | null };

  const cost = tl(b.guestCostMin + rng() * (b.guestCostMax - b.guestCostMin));
  let s2 = s;
  if (s2.cash >= cost) s2 = { ...s2, cash: s2.cash - cost, mood: clamp(s2.mood + 2, 0, 100) };
  else s2 = { ...s2, cardDebt: s2.cardDebt + cost, mood: clamp(s2.mood - 2, 0, 100) };

  return { s: logPush(s2, `Misafir geldi: ${cost.toLocaleString()} TL harcama (${s2.cash >= 0 ? 'nakit/kart' : 'kart'})`), eventText: 'Misafir geldi' };
}

function maybePolicyNews(s: GameState) {
  // Not every day. Around day 10 & 24-ish more likely.
  const rng = mulberry32(s.seed + s.day * 4242);
  const base = 0.08;
  const extra = s.day === 10 || s.day === 24 ? 0.25 : 0;
  if (rng() > base + extra) return null;

  const tone = pickWeighted(rng, [
    { w: 1, v: 'Faiz kararı yaklaşıyor, piyasalar tedirgin.' },
    { w: 1, v: 'Enflasyon verisi geldi: beklentiler şaştı.' },
    { w: 1, v: 'Kur dalgalanıyor, altın hareketli.' },
  ]);

  return tone;
}

export function nextDay(s0: GameState) {
  let s = s0;

  // day end: daily expenses + events + markets
  s = dailyExpenses(s);

  // credit card interest applied at end of month (day 30)
  if (s.day === 30 && s.cardDebt > 0) {
    const b = balanceFor(s.difficulty);
    const interest = tl(s.cardDebt * b.cardMonthlyRate);
    s = { ...s, cardDebt: s.cardDebt + interest };
    s = logPush(s, `Ay sonu kart faizi işlendi: +${interest.toLocaleString()} TL`);
  }

  const guest = maybeGuestEvent(s);
  s = guest.s;

  const news = maybePolicyNews(s);
  if (news) s = logPush(s, `Haber: ${news}`);

  s = updateMarkets(s);

  // penalties for unpaid bills near deadlines (toy)
  if (s.day === 10 && !s.rentPaid) {
    s = { ...s, mood: clamp(s.mood - 8, 0, 100), cardDebt: s.cardDebt + 300 };
    s = logPush(s, 'Kira gecikti: moral düştü, 300 TL gecikme (karta yazıldı).');
  }
  if (s.day === 20) {
    const unpaid = Object.entries(s.billsPaid)
      .filter(([, v]) => !v)
      .map(([k]) => k);
    if (unpaid.length > 0) {
      s = { ...s, mood: clamp(s.mood - 6, 0, 100), cardDebt: s.cardDebt + 200 };
      s = logPush(s, `Faturalar gecikiyor (${unpaid.join(', ')}): 200 TL ceza (karta).`);
    }
  }

  const day = s.day + 1;
  if (day <= 30) {
    s = { ...s, day };
    s = logPush(s, `Gün ${day} başladı.`);
  }

  return s;
}

export function scoreEndOfMonth(s: GameState) {
  // Score: keep bills paid, low debt, healthy fridge, some savings/invest, decent mood.
  let score = 0;
  if (s.rentPaid) score += 20;
  score += Object.values(s.billsPaid).filter(Boolean).length * 8;

  score += clamp(Math.round(s.fridge / 5), 0, 20);
  score += clamp(Math.round(s.mood / 5), 0, 20);

  // debt penalty
  score -= Math.round(clamp(s.cardDebt / 1000, 0, 80));

  // assets
  const assetTL =
    s.holdings.gold * s.goldPrice +
    s.holdings.stock * (s.stockIndex * 20) +
    s.holdings.usd * s.usdTry +
    s.holdings.btc * s.btcTry +
    s.holdings.eth * s.ethTry;

  score += Math.round(clamp(assetTL / 2000, 0, 40));

  // cash buffer
  score += Math.round(clamp(s.cash / 1000, 0, 25));

  return score;
}
