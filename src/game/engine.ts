import type { ActionId, BillId, BillsState, Difficulty, GameState, HoldingId, QuestState } from './types';
import { balanceFor } from './balance';
import {
  applyDailyExpenses,
  applyDailyPenalty,
  applyLifeEvent,
  getDailyPolicyNews,
  updateDailyMarkets,
} from './dailySimulation';
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

  if (!s.rentPaid && s.day >= 5) {
    return { title: 'Bugün kira planını çöz', hint: 'Kira gecikirse ay dengesi hızla bozulur.', done: false };
  }

  if (s.cardDebt >= 7000) {
    return { title: 'Bugün kart borcunu azalt', hint: 'Borç baskısı büyümeden ödeme yapmak daha güvenlidir.', done: false };
  }

  if (s.fridge <= 35) {
    return { title: 'Bugün dolabı 45% üstüne taşı', hint: 'İhtiyaç tarafı çok düşerse moral de etkilenir.', done: false };
  }

  if (s.cash < 600 && s.cardDebt > 0) {
    return { title: 'Bugün en az 600 TL nakit tampon bırak', hint: 'Tamponsuz kalmak yeni harcamayı karta iter.', done: false };
  }

  const pick = pickWeighted(rng, [
    { w: 1, v: { title: 'Bugün dolabı 40% üstünde tut', hint: 'Market yapmayı unutma.' } },
    { w: 1, v: { title: 'Bugün kart borcunu azalt', hint: 'Asgari bile ödesen puan alırsın.' } },
    { w: 1, v: { title: 'Bugün en az 500 TL nakit bırak', hint: 'Tüm parayı harcama.' } },
    { w: 1, v: { title: 'Bugün bir faturayı öde', hint: 'Gecikme cezası can yakar.' } },
    { w: 1, v: { title: 'Bugün moralini 65% üstünde tut', hint: 'Bazen küçük eğlence iyidir.' } },
    { w: 1, v: { title: 'Bugün yatırımda tek varlığa yüklenme', hint: 'Çeşitlendirme bazen kazançtan önce riski yönetmektir.' } },
  ]);
  return { ...pick, done: false };
}

function tryCompleteQuest(s: GameState) {
  const q = s.quest;
  if (q.done) return s;

  let ok = false;
  if (q.title.includes('45%')) ok = s.fridge >= 45;
  else if (q.title.includes('dolabı')) ok = s.fridge >= 40;
  else if (q.title.includes('kart borcunu')) ok = s.cardDebt < 1 || s.log.some((l) => l.includes('Kredi kartı asgari') || l.includes('borcu kapatıldı'));
  else if (q.title.includes('600 TL')) ok = s.cash >= 600;
  else if (q.title.includes('500 TL')) ok = s.cash >= 500;
  else if (q.title.includes('kira planını')) ok = s.rentPaid;
  else if (q.title.includes('faturayı')) ok = Object.values(s.billsPaid).some(Boolean) || s.rentPaid;
  else if (q.title.includes('moralini')) ok = s.mood >= 65;
  else if (q.title.includes('tek varlığa')) {
    const assetTL =
      s.holdings.gold * s.goldPrice +
      s.holdings.stock * (s.stockIndex * 20) +
      s.holdings.usd * s.usdTry +
      s.holdings.btc * s.btcTry +
      s.holdings.eth * s.ethTry;
    const weights = [
      s.holdings.gold * s.goldPrice,
      s.holdings.stock * (s.stockIndex * 20),
      s.holdings.usd * s.usdTry,
      s.holdings.btc * s.btcTry,
      s.holdings.eth * s.ethTry,
    ];
    const maxWeight = assetTL > 0 ? Math.max(...weights) / assetTL : 0;
    ok = assetTL === 0 || maxWeight < 0.75;
  }

  if (!ok) return s;

  let next = { ...s, points: s.points + 10, quest: { ...s.quest, done: true } };

  if (q.title.includes('kart borcunu')) {
    next = { ...next, mood: clamp(next.mood + 2, 0, 100) };
  } else if (q.title.includes('dolabı')) {
    next = { ...next, mood: clamp(next.mood + 1, 0, 100) };
  } else if (q.title.includes('nakit tampon')) {
    next = { ...next, mood: clamp(next.mood + 1, 0, 100) };
  }

  return logPush(next, `Görev tamamlandı! +10 puan: ${q.title}`);
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
    discipline: 55,

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
    marketMood: 'neutral',
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
      const lowFridgeBoost = s0.fridge < 30 ? 0.75 : s0.fridge < 50 ? 0.4 : 0.15;
      const cost = tl(b.groceryBase * (0.85 + lowFridgeBoost));
      const payment = pay(s, cost, useCard);
      if (!payment.ok) return payment.state;

      const fridgeGain = s0.fridge < 30 ? 26 : s0.fridge < 50 ? 22 : 16;
      const moodGain = s0.fridge < 30 ? 4 : 2;
      s = {
        ...payment.state,
        fridge: clamp(payment.state.fridge + fridgeGain, 0, 100),
        mood: clamp(payment.state.mood + moodGain, 0, 100),
        discipline: clamp(payment.state.discipline + 1, 0, 100),
      };
      return logPush(s, `Market: -${cost.toLocaleString()} TL (${payment.chargedTo === 'card' ? 'kart' : 'nakit'}), dolap +${fridgeGain}`);
    }
    case 'cinema': {
      const cost = b.cinema;
      const payment = pay(s, cost, useCard);
      if (!payment.ok) return payment.state;

      const moodGain = s.cardDebt >= 8000 ? 8 : 12;
      s = {
        ...payment.state,
        mood: clamp(payment.state.mood + moodGain, 0, 100),
        energy: clamp(payment.state.energy - 5, 0, 100),
        discipline: clamp(payment.state.discipline - 1, 0, 100),
      };
      return logPush(s, `Sinema: -${cost.toLocaleString()} TL (${payment.chargedTo === 'card' ? 'kart' : 'nakit'}), moral +${moodGain}`);
    }
    case 'lightsOff': {
      // tiny habit. increases energy/mood slightly, gives end-of-month bill reduction via daily flag? simplified to immediate cash-saving token.
      s = { ...s, mood: clamp(s.mood + 1, 0, 100), discipline: clamp(s.discipline + 2, 0, 100) };
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

      const assetTLBefore =
        s.holdings.gold * s.goldPrice +
        s.holdings.stock * (s.stockIndex * 20) +
        s.holdings.usd * s.usdTry +
        s.holdings.btc * s.btcTry +
        s.holdings.eth * s.ethTry;
      const projectedTotal = assetTLBefore + cost;
      const projectedAssetValue = s.holdings[asset] * priceTL + cost;
      const concentration = projectedTotal > 0 ? projectedAssetValue / projectedTotal : 0;

      let moodDelta = 0;
      let extraLog = '';
      if (concentration >= 0.75) {
        moodDelta = -2;
        extraLog = ' · Uyarı: portföy tek varlıkta yoğunlaşıyor';
      } else if (concentration <= 0.45 && projectedTotal >= 2000) {
        moodDelta = 1;
        extraLog = ' · Çeşitlendirme dengesi iyi görünüyor';
      }

      s = {
        ...s,
        cash: s.cash - cost,
        mood: clamp(s.mood + moodDelta, 0, 100),
        holdings: { ...s.holdings, [asset]: s.holdings[asset] + amount },
      };
      return logPush(s, `Alım: ${asset} +${amount} ( -${cost.toLocaleString()} TL )${extraLog}`);
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
      s = {
        ...s,
        cash: s.cash - minPay,
        cardDebt: Math.max(0, s.cardDebt - minPay),
        mood: clamp(s.mood + 1, 0, 100),
        discipline: clamp(s.discipline + 2, 0, 100),
      };
      return logPush(s, `Kredi kartı asgari ödeme: -${minPay.toLocaleString()} TL`);
    }
    case 'payCardAll': {
      const amt = tl(s.cardDebt);
      if (amt <= 0) return logPush(s, 'Kart borcu yok.');
      if (s.cash < amt) return logPush(s, 'Kart borcunu kapatacak nakit yok.');
      s = { ...s, cash: s.cash - amt, cardDebt: 0, mood: clamp(s.mood + 4, 0, 100), discipline: clamp(s.discipline + 4, 0, 100) };
      return logPush(s, `Kredi kartı borcu kapatıldı: -${amt.toLocaleString()} TL`);
    }
    default: {
      return s;
    }
  }
}


export function nextDay(s0: GameState) {
  let s = applyDailyExpenses(s0);

  // credit card interest applied at end of month (day 30)
  if (s.day === 30 && s.cardDebt > 0) {
    const b = balanceFor(s.difficulty);
    const interest = tl(s.cardDebt * b.cardMonthlyRate);
    s = { ...s, cardDebt: s.cardDebt + interest };
    s = logPush(s, `Ay sonu kart faizi işlendi: +${interest.toLocaleString()} TL`);
  }

  const lifeEvent = applyLifeEvent(s);
  s = lifeEvent.state;
  if (lifeEvent.message) s = logPush(s, lifeEvent.message);

  const news = getDailyPolicyNews(s);
  if (news) {
    let marketMood: GameState['marketMood'] = 'neutral';
    const lower = news.toLowerCase();
    if (lower.includes('enflasyon') || lower.includes('market fiyatları')) marketMood = 'inflation';
    else if (lower.includes('kurda') || lower.includes('dolar')) marketMood = 'fx';
    else if (lower.includes('kredi') || lower.includes('faiz')) marketMood = 'credit';
    else if (lower.includes('borsada')) marketMood = 'equity';

    s = { ...s, marketMood };
    s = logPush(s, `Haber: ${news}`);
  }

  s = updateDailyMarkets(s);

  const penalty = applyDailyPenalty(s);
  s = penalty.state;
  if (penalty.message) s = logPush(s, penalty.message);

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
  score += clamp(Math.round(s.discipline / 6), 0, 16);

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
