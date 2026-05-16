export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** Human-readable condition summary shown in UI */
  conditionSummary: string;
}

export interface ChallengeProgress {
  challengeId: string;
  completed: boolean;
  /** Week number when it was last completed (used for weekly rotation) */
  completedWeek?: number;
}

const STORAGE_KEY = 'econ-challenges-v1';

const ALL_CHALLENGES: Omit<WeeklyChallenge, 'conditionSummary'>[] = [
  {
    id: 'cash-only',
    title: 'Nakite Dön',
    description: 'Bu ay hiç kredi kartı kullanmadan bitir. Sadece nakit!',
    emoji: '💰',
  },
  {
    id: 'no-debt',
    title: 'Borçsuz Ay',
    description: 'Ay sonunda kart borcun sıfır olsun. Full ödeme yap!',
    emoji: '🆓',
  },
  {
    id: 'daily-market',
    title: 'Dolap Full',
    description: 'Her gün markete git. Hiçbir gün aç kalma!',
    emoji: '🛒',
  },
  {
    id: 'invest-diversify',
    title: 'Yatırımcı Kafası',
    description: 'En az 2 farklı varlık türüne yatırım yap.',
    emoji: '📊',
  },
  {
    id: 'no-fun',
    title: 'Disiplin Abidesi',
    description: 'Bu ay hiç eğlence harcaması yapma (sinema, kafe vb.). Zor ama mümkün!',
    emoji: '🧘',
  },
  {
    id: 'save-big',
    title: 'Büyük Tasarruf',
    description: 'Ay sonunda en az 10.000 TL nakit biriktir.',
    emoji: '🏦',
  },
  {
    id: 'bill-perfect',
    title: 'Fatura Müdürü',
    description: 'Tüm faturaları günü gününe öde. Hiçbiri gecikmesin.',
    emoji: '📑',
  },
  {
    id: 'mood-zen',
    title: 'Zihin Rahat',
    description: 'Hiçbir gün moralin %40\'ın altına düşmesin.',
    emoji: '🧘',
  },
];

/** Get the current week number of the year (for rotation) */
function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diffMs = now.getTime() - start.getTime();
  return Math.ceil((diffMs / 86400000 + start.getDay() + 1) / 7);
}

/** Pick a challenge for this week based on week number (rotates through the list) */
export function getWeeklyChallenge(): WeeklyChallenge {
  const week = getCurrentWeek();
  const idx = week % ALL_CHALLENGES.length;
  const c = ALL_CHALLENGES[idx];

  // Build condition summary based on challenge
  const summaries: Record<string, string> = {
    'cash-only': 'Kredi kartı kullanma — sadece nakit harca.',
    'no-debt': 'Kart borcunu sıfırla — ay sonu kart borcu 0 TL olmalı.',
    'daily-market': 'Her gün market alışverişi yap — dolabı hiç boş bırakma.',
    'invest-diversify': 'En az 2 farklı varlık al (altın, dolar, hisse, kripto).',
    'no-fun': 'Eğlence harcaması yapma (sinema/kafe).',
    'save-big': 'Ay sonu elinde en az 10.000 TL nakit olsun.',
    'bill-perfect': 'Tüm faturaları zamanında öde.',
    'mood-zen': 'Morali hiç %40\'ın altına düşürme.',
  };

  return {
    ...c,
    conditionSummary: summaries[c.id] || c.description,
  };
}

/** Load challenge progress from localStorage */
export function loadChallengeProgress(): ChallengeProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save challenge progress */
export function saveChallengeProgress(progress: ChallengeProgress[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* ignore */ }
}

/** Check if the current weekly challenge is completed and mark it */
export function checkWeeklyChallenge(game: {
  cardDebt: number;
  cash: number;
  mood: number;
  fridge: number;
  holdings: Record<string, number>;
  billsPaid: Record<string, boolean>;
  day: number;
  log: string[];
}): { challenge: WeeklyChallenge; justCompleted: boolean } {
  const challenge = getWeeklyChallenge();
  const progress = loadChallengeProgress();
  const week = getCurrentWeek();

  // Already completed this week?
  const existing = progress.find(p => p.challengeId === challenge.id);
  if (existing?.completed && existing.completedWeek === week) {
    return { challenge, justCompleted: false };
  }

  let completed = false;

  switch (challenge.id) {
    case 'cash-only':
      // Check game log for any grocery/cinema that added card debt, or no card use at all
      completed = game.cardDebt === 0;
      break;
    case 'no-debt':
      completed = game.cardDebt === 0;
      break;
    case 'daily-market':
      // If fridge never dropped below 20 (i.e. always had some food)
      completed = game.fridge >= 20;
      break;
    case 'invest-diversify':
      const holdings = Object.entries(game.holdings).filter(([, v]) => v > 0);
      completed = holdings.length >= 2;
      break;
    case 'no-fun':
      // Check if there's any entertainment log entry
      completed = !game.log.some(l =>
        l.includes('sinema') || l.includes('kafe') || l.includes('eğlence') || l.includes('dışarı')
      );
      break;
    case 'save-big':
      completed = game.cash >= 10000;
      break;
    case 'bill-perfect':
      completed = Object.values(game.billsPaid).every(Boolean);
      break;
    case 'mood-zen':
      // Minimum check: finished with mood >= 40 (simplified - ideally check daily min)
      completed = game.mood >= 40;
      break;
  }

  if (completed) {
    const updated = progress.filter(p => p.challengeId !== challenge.id);
    updated.push({ challengeId: challenge.id, completed: true, completedWeek: week });
    saveChallengeProgress(updated);
    return { challenge, justCompleted: true };
  }

  return { challenge, justCompleted: false };
}
