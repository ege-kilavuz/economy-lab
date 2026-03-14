import type { ActionId, BillId, BillsState, Difficulty, GameState, HoldingId, QuestState } from './types';
import { balanceFor } from './balance';
import { mulberry32, pickWeighted } from './rng';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tl(n: number) {
  return Math.round(n);
}

function logPush(s: GameState, msg: string) {
  return { ...s, log: [msg, ...s.log].slice(0, 120) };
}

type PaymentResult = {
  state: GameState;
  ok: boolean;
  chargedTo: 'cash' | 'card' | null;
};

const INITIAL_BILLS: BillsState = { electric: false, gas: false, internet: false, dues: false };
const INITIAL_QUEST: QuestState = { title: 'Bugün dolabı 40% üstünde tut', hint: 'Market yapmayı unutma.', done: false };

function questForDay(s: GameState): QuestState {
  const rng = mulberry32(s.seed + s.day * 777);
  const pick = pickWeighted(rng, [
    { w: 1, v: { title: 'Bugün dolabı 40% üstünde tut', hint: 'Market yapmayı unutma.' } },
    { w: 1, v: { title: 'Bugün kart borcunu azalt', hint: 'Asgari bile ödesen puan alırsın.' } },
    { w: 1, v: { title: 'Bugün en az 500 TL nakit bırak', hint: 'Tüm parayı harcama.' } },
    { w: 1, v: { title: 'Bugün bir faturayı öde', hint: 'Gecikme cezası can yakar.' } },
    { w: 1, v: { title: 'Bugün moralini 65% üstünde tut', hint: 'Bazen küçük eğlence iyidir.' } },
  ]);
  return { ...pick, done: false };
}

function tryCompleteQuest(s: GameState) {
  const q = s.quest;
  if (q.done) return s;

  let ok = false;
  if (q.title.includes('dolabı')) ok = s.fridge >= 40;
  else if (q.title.includes('kart borcunu')) ok = s.cardDebt < 1 || s.log.some((l) => l.includes('Kredi kartı asgari') || l.includes('borcu kapatıldı'));
  else if (q.title.includes('500 TL')) ok = s.cash >= 500;
  else if (q.title.includes('faturayı')) ok = Object.values(s.billsPaid).some(Boolean) || s.rentPaid;
  else if (q.title.includes('moralini')) ok = s.mood >= 65;

  if (!ok) return s;

  return logPush({ ...s, points: s.points + 10, quest: { ...s.quest, done: true } }, `Görev tamamlandı! +10 puan: ${q.title}`);
}

export function newGame(difficulty: Difficulty, seed = Date.now() % 1000000): GameState {
  const b = balanceFor(difficulty);
  return {
    day: 1,
    cash: b.startingCash,
    cardDebt: 0,
    fridge: 55,
    mood: 60,
    energy: 60,

    holdings: { gold: 0, stock: 0, usd: 0, btc: 0, eth: 0 },

    rentPaid: false,
    billsPaid: { ...INITIAL_BILLS },
    difficulty,
    seed,
    log: [`Oyun başladı (${difficulty}). Maaş yattı: ${b.startingCash.toLocaleString()} TL`],

    points: 0,
    quest: { ...INITIAL_QUEST },

    goldPrice: 2200,
    stockIndex: 100,
    usdTry: 33.5,
    btcTry: 2200000,
    ethTry: 120000,

    policyRate: 45,
  };
}

function pay(s: GameState, amount: number, useCard: boolean): PaymentResult {
  if (amount <= 0) return { state: s, ok: false, chargedTo: null };
  if (!useCard) {
    if (s.cash < amount) {
      return {
        state: logPush(s, `Yetersiz bakiye: ${tl(amount).toLocaleString()} TL ödenemedi.`),
        ok: false,
        chargedTo: null,
      };
    }
    return { state: { ...s, cash: s.cash - amount }, ok: true, chargedTo: 'cash' };
  }
  // credit card
  return { state: { ...s, cardDebt: s.cardDebt + amount }, ok: true, chargedTo: 'card' };
}

function payBill(s: GameState, billId: BillId, amount: number, label: string, useCard: boolean): GameState {
  if (s.billsPaid[billId]) return logPush(s, `${label} zaten ödendi.`);

  const payment = pay(s, amount, useCard);
  if (!payment.ok) return payment.state;

  return logPush(
    {
      ...payment.state,
      billsPaid: { ...payment.state.billsPaid, [billId]: true },
    },
    `${label} ödendi: ${amount.toLocaleString()} TL (${payment.chargedTo === 'card' ? 'kart' : 'nakit'})`
  );
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
      const payment = pay(s, cost, useCard);
      if (!payment.ok) return payment.state;

      s = {
        ...payment.state,
        fridge: clamp(payment.state.fridge + 20, 0, 100),
        mood: clamp(payment.state.mood + 2, 0, 100),
      };
      return logPush(s, `Market: -${cost.toLocaleString()} TL (${payment.chargedTo === 'card' ? 'kart' : 'nakit'}), dolap +20`);
    }
    case 'cinema': {
      const cost = b.cinema;
      const payment = pay(s, cost, useCard);
      if (!payment.ok) return payment.state;

      s = {
        ...payment.state,
        mood: clamp(payment.state.mood + 12, 0, 100),
        energy: clamp(payment.state.energy - 5, 0, 100),
      };
      return logPush(s, `Sinema: -${cost.toLocaleString()} TL (${payment.chargedTo === 'card' ? 'kart' : 'nakit'}), moral +12`);
    }
    case 'lightsOff': {
      // tiny habit. increases energy/mood slightly, gives end-of-month bill reduction via daily flag? simplified to immediate cash-saving token.
      s = { ...s, mood: clamp(s.mood + 1, 0, 100) };
      return logPush(s, `Tasarruf: ışıkları kapattın. (+1 moral)`);
    }
    case 'payRent': {
      if (s.rentPaid) return logPush(s, 'Kira zaten ödendi.');
      const payment = pay(s, b.rent, useCard);
      if (!payment.ok) return payment.state;

      return logPush(
        { ...payment.state, rentPaid: true },
        `Kira ödendi: ${b.rent.toLocaleString()} TL (${payment.chargedTo === 'card' ? 'kart' : 'nakit'})`
      );
    }
    case 'payDues': {
      return payBill(s, 'dues', b.dues, 'Aidat', useCard);
    }
    case 'payElectric': {
      return payBill(s, 'electric', b.electric, 'Elektrik', useCard);
    }
    case 'payGas': {
      return payBill(s, 'gas', b.gas, 'Doğalgaz', useCard);
    }
    case 'payInternet': {
      return payBill(s, 'internet', b.internet, 'İnternet', useCard);
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
    default: {
      return s;
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

function maybeLifeEvents(s: GameState) {
  const b = balanceFor(s.difficulty);
  const rng = mulberry32(s.seed + s.day * 9001);

  // Stress factor: low cash + high debt + low mood => more negative events
  const cashPressure = s.cash < 500 ? 0.25 : 0;
  const debtPressure = clamp(s.cardDebt / Math.max(1, b.startingCash * 2), 0, 0.6);
  const moodPressure = s.mood < 40 ? 0.25 : s.mood < 55 ? 0.1 : 0;
  const stressFactor = clamp(1 + cashPressure + debtPressure + moodPressure, 0.7, 1.8);

  // Guest probability calibrated so avg guest days approx given
  const guestP = clamp((b.guestDaysAvg / 30) * (2 - stressFactor), 0, 0.6);
  if (rng() < guestP) {
    const cost = tl(b.guestCostMin + rng() * (b.guestCostMax - b.guestCostMin));
    let s2 = s;
    if (s2.cash >= cost) s2 = { ...s2, cash: s2.cash - cost, mood: clamp(s2.mood + 2, 0, 100) };
    else s2 = { ...s2, cardDebt: s2.cardDebt + cost, mood: clamp(s2.mood - 3, 0, 100) };
    return logPush(s2, `Misafir geldi: -${cost.toLocaleString()} TL (ikram/alışveriş)`);
  }

  // Other random events (stress shifts probabilities)
  const roll = rng();
  const negThreshold = 0.12 * stressFactor;
  const posThreshold = negThreshold + 0.08 * (2 - stressFactor); // positive events shrink under stress
  const spoilThreshold = posThreshold + 0.06 * stressFactor;

  if (roll < negThreshold) {
    const cost = tl(1500 + rng() * 3500);
    const payWithCash = s.cash >= cost;
    const s2 = payWithCash
      ? { ...s, cash: s.cash - cost, mood: clamp(s.mood - 2, 0, 100) }
      : { ...s, cardDebt: s.cardDebt + cost, mood: clamp(s.mood - 4, 0, 100) };
    return logPush(s2, `Beklenmedik gider: -${cost.toLocaleString()} TL (telefon/ev eşyası)`);
  }
  if (roll < posThreshold) {
    const extra = tl(1000 + rng() * 2500);
    return logPush({ ...s, cash: s.cash + extra, mood: clamp(s.mood + 1, 0, 100) }, `Ek gelir: +${extra.toLocaleString()} TL (freelance/prim)`);
  }
  if (roll < spoilThreshold) {
    const drop = tl(10 + rng() * 25);
    return logPush({ ...s, fridge: clamp(s.fridge - drop, 0, 100), mood: clamp(s.mood - 2, 0, 100) }, `Dolap sürprizi: bazı ürünler bozuldu (-${drop.toLocaleString()}% dolap)`);
  }

  return s;
}

function maybePolicyNews(s: GameState) {
  const rng = mulberry32(s.seed + s.day * 4242);

  // Scheduled-ish policy decision day
  const decisionDay = 15;

  if (s.day === decisionDay) {
    // Decision explainability: easy more predictable, hard more surprising.
    const surprise = s.difficulty === 'easy' ? 0.2 : s.difficulty === 'normal' ? 0.6 : 1.0;
    const dir = rng() < 0.5 + (surprise * 0.1) ? 'artırdı' : 'indirdi';
    const delta = s.difficulty === 'easy' ? 2 : s.difficulty === 'normal' ? 5 : 8;
    return `TCMB faiz kararı: politika faizini ${delta} puan ${dir}. Açıklama: enflasyon görünümü ve beklentiler vurgulandı.`;
  }

  // Daily macro headlines: keep a consistent theme
  const base = 0.18;
  if (rng() > base) return null;

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

  // life events
  s = maybeLifeEvents(s);

  // policy/news
  const news = maybePolicyNews(s);
  if (news) s = logPush(s, `Haber: ${news}`);

  // markets update after news
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

  // quest completion check at end of day
  s = tryCompleteQuest(s);

  const day = s.day + 1;
  if (day <= 30) {
    s = { ...s, day, quest: questForDay({ ...s, day }) };
    s = logPush(s, `Gün ${day} başladı.`);
  }

  return s;
}

export function scoreEndOfMonth(s: GameState) {
  // Score: keep bills paid, low debt, healthy fridge, some savings/invest, decent mood.
  // Plus daily quest points.
  let score = s.points;
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
