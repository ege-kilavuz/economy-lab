export type MonthResult = {
  month: number;
  income: number;
  expenses: number;
  debtPayment: number;
  invest: number;
  emergencySave: number;
  eventText?: string;
  net: number;
  cashEnd: number;
  debtEnd: number;
  investEnd: number;
  emergencyEnd: number;
  wellbeingEnd: number;
  nextIncome: number;
};

export type LifeSimState = {
  month: number;
  income: number;
  cash: number;
  debt: number;
  invest: number;
  emergency: number;
  wellbeing: number;
  score: number;
  history: MonthResult[];
  seed: number;
};

export type LifeSimPlan = {
  needsPct: number;
  wantsPct: number;
  debtPayPct: number;
  emergencyPct: number;
  investPct: number;
};

export type LifeSimMonthTransition = {
  state: LifeSimState;
  result: MonthResult;
  scoreDelta: number;
};

type SimEvent = {
  p: number;
  kind: 'neg' | 'pos';
  title: string;
  apply: (s: Pick<LifeSimState, 'cash'>) => Pick<LifeSimState, 'cash'>;
};

const EVENTS: SimEvent[] = [
  {
    p: 0.18,
    kind: 'neg',
    title: 'Telefon bozuldu (beklenmedik gider) - 4.000 TL',
    apply: (s) => ({ ...s, cash: s.cash - 4000 }),
  },
  {
    p: 0.14,
    kind: 'neg',
    title: 'Sağlık gideri - 2.500 TL',
    apply: (s) => ({ ...s, cash: s.cash - 2500 }),
  },
  {
    p: 0.12,
    kind: 'pos',
    title: 'Ufak ek gelir (freelance) + 2.000 TL',
    apply: (s) => ({ ...s, cash: s.cash + 2000 }),
  },
  {
    p: 0.10,
    kind: 'neg',
    title: 'İş görüşmesi/sertifika masrafı - 1.500 TL',
    apply: (s) => ({ ...s, cash: s.cash - 1500 }),
  },
];

export const DEFAULT_INCOME = 17002;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function roundTL(n: number) {
  return Math.round(n);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickEvent(rng: () => number, stressFactor: number) {
  const adjusted = EVENTS.map((event) => ({
    ...event,
    p: event.kind === 'neg' ? event.p * stressFactor : event.p * (2 - stressFactor),
  }));
  const total = adjusted.reduce((acc, event) => acc + event.p, 0);
  const x = rng() * total;
  let acc = 0;
  for (const event of adjusted) {
    acc += event.p;
    if (x < acc) return event;
  }
  return null;
}

export function normalizePlan(plan: LifeSimPlan) {
  const pctSum = plan.needsPct + plan.wantsPct + plan.debtPayPct + plan.emergencyPct + plan.investPct;
  const divisor = pctSum === 0 ? 1 : pctSum / 100;

  return {
    pctSum,
    divisor,
    needsShare: (plan.needsPct / 100) / divisor,
    wantsShare: (plan.wantsPct / 100) / divisor,
    debtPayShare: (plan.debtPayPct / 100) / divisor,
    emergencyShare: (plan.emergencyPct / 100) / divisor,
    investShare: (plan.investPct / 100) / divisor,
  };
}

export function createLifeSim(initialIncome: number, seed = Date.now() % 100000): LifeSimState {
  return {
    month: 1,
    income: initialIncome,
    cash: 0,
    debt: 20000,
    invest: 0,
    emergency: 0,
    wellbeing: 70,
    score: 0,
    history: [],
    seed,
  };
}

export function runLifeSimMonth(sim: LifeSimState, plan: LifeSimPlan): LifeSimMonthTransition {
  const normalized = normalizePlan(plan);

  const income = sim.income;
  const needs = roundTL(income * normalized.needsShare);
  const wants = roundTL(income * normalized.wantsShare);
  const plannedDebtPay = roundTL(income * normalized.debtPayShare);
  const plannedEmergency = roundTL(income * normalized.emergencyShare);
  const plannedInvest = roundTL(income * normalized.investShare);

  const debtInterest = sim.debt * 0.035;
  let debt = sim.debt + debtInterest;
  let cash = sim.cash + income;

  cash -= needs + wants;

  const debtPressure = sim.debt / Math.max(1, sim.income);
  const cashPressure = sim.cash <= 0 ? 0.2 : 0;
  const stressFactor = clamp(1 + debtPressure * 0.25 + cashPressure, 0.6, 1.8);

  const rng = mulberry32(sim.seed + sim.month * 997);
  const event = pickEvent(rng, stressFactor);
  let eventText: string | undefined;
  if (event) {
    cash = event.apply({ cash }).cash;
    eventText = event.title;
  }

  let scoreDelta = 0;

  const debtPayment = clamp(plannedDebtPay, 0, Math.max(0, cash));
  cash -= debtPayment;
  debt = Math.max(0, debt - debtPayment);

  const emergencySave = clamp(plannedEmergency, 0, Math.max(0, cash));
  cash -= emergencySave;

  const invest = clamp(plannedInvest, 0, Math.max(0, cash));
  cash -= invest;

  if (cash < 0) {
    debt += Math.abs(cash);
    cash = 0;
    scoreDelta -= 20;
  }

  const investEnd = (sim.invest + invest) * 1.012;
  const emergencyEnd = sim.emergency + emergencySave;

  let wellbeing = sim.wellbeing;
  if (cash === 0) wellbeing -= 8;
  if (debt > sim.income * 3) wellbeing -= 10;
  if (debt <= sim.debt) wellbeing += 4;
  if (emergencyEnd >= sim.income) wellbeing += 6;
  if (plan.wantsPct > 30 && cash === 0) wellbeing -= 6;
  wellbeing = clamp(Math.round(wellbeing), 20, 95);

  let nextIncome = sim.income;
  if (wellbeing < 40) nextIncome = Math.round(sim.income * 0.95);
  if (wellbeing > 80) nextIncome = Math.round(sim.income * 1.02);

  if (emergencySave > 0) scoreDelta += 5;
  if (debtPayment > 0) scoreDelta += 5;
  if (debt < sim.debt) scoreDelta += 5;
  if (plan.wantsPct <= 25) scoreDelta += 3;
  if (cash >= 0) scoreDelta += 2;
  if (debt > sim.debt + 1000) scoreDelta -= 10;
  if (plan.needsPct >= 45 && cash >= 0) scoreDelta += 3;

  const expenses = needs + wants;

  const result: MonthResult = {
    month: sim.month,
    income,
    expenses,
    debtPayment,
    invest,
    emergencySave,
    eventText,
    net: income - expenses - debtPayment - invest - emergencySave,
    cashEnd: cash,
    debtEnd: debt,
    investEnd,
    emergencyEnd,
    wellbeingEnd: wellbeing,
    nextIncome,
  };

  return {
    result,
    scoreDelta,
    state: {
      ...sim,
      month: sim.month + 1,
      cash,
      debt,
      invest: investEnd,
      emergency: emergencyEnd,
      wellbeing,
      income: nextIncome,
      score: sim.score + scoreDelta,
      history: [...sim.history, result],
    },
  };
}
