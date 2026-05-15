export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

const STORAGE_KEY = 'econ-achievements-v1';

const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked'>[] = [
  { id: 'first-day', title: 'İlk Adım', description: 'Oyunu başlat', emoji: '👶' },
  { id: 'debt-free', title: 'Borçsuz Ay', description: 'Ay sonunda hiç kart borcun olmasın', emoji: '💳' },
  { id: 'saver', title: 'Tasarrufçu', description: 'Ay sonunda 5,000 TL üzeri nakit biriktir', emoji: '🐷' },
  { id: 'investor', title: 'Yatırımcı', description: 'Herhangi bir varlıktan satın al', emoji: '📈' },
  { id: 'bill-master', title: 'Fatura Müdürü', description: 'Tüm faturaları zamanında öde', emoji: '📑' },
  { id: 'zen-master', title: 'Zihin Rahat', description: 'Ay sonunda moral 70% üzerinde kalsın', emoji: '🧘' },
  { id: 'disciplined', title: 'Disiplin Abidesi', description: 'Ay sonunda disiplin 70% üzerinde kalsın', emoji: '💪' },
  { id: 'hard-mode', title: 'Zorluk Fatihi', description: 'Zor modda başarıyla bitir', emoji: '⚔️' },
  { id: 'no-card-month', title: 'Nakitçi', description: 'Hiç kart kullanmadan bir ayı bitir', emoji: '💰' },
  { id: 'diversified', title: 'Portföy Dağıtıcı', description: 'En az 3 farklı varlık türünde yatırım yap', emoji: '🎯' },
];

export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const unlocked = raw ? JSON.parse(raw) as string[] : [];
    return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: unlocked.includes(a.id) }));
  } catch {
    return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
  }
}

export function unlockAchievement(id: string): Achievement[] {
  if (typeof window === 'undefined') return getAchievements();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const unlocked: string[] = raw ? JSON.parse(raw) : [];
    if (!unlocked.includes(id)) {
      unlocked.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    }
    return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: unlocked.includes(a.id) }));
  } catch {
    return getAchievements();
  }
}

export function checkAchievements(game: { cash: number; cardDebt: number; mood: number; discipline: number; difficulty: string; holdings: Record<string, number>; billsPaid: Record<string, boolean> }): Achievement[] {
  let changed = false;
  let current = getAchievements();

  function tryUnlock(id: string) {
    if (!current.find(a => a.id === id)?.unlocked) {
      current = unlockAchievement(id);
      changed = true;
    }
  }

  // Check conditions
  if (game.cardDebt === 0) tryUnlock('debt-free');
  if (game.cash >= 5000) tryUnlock('saver');
  if (Object.values(game.holdings).some(v => v > 0)) tryUnlock('investor');
  if (Object.values(game.billsPaid).every(Boolean)) tryUnlock('bill-master');
  if (game.mood >= 70) tryUnlock('zen-master');
  if (game.discipline >= 70) tryUnlock('disciplined');
  if (game.difficulty === 'hard') tryUnlock('hard-mode');
  // Diversified: 3+ different asset types
  const assetTypes = Object.entries(game.holdings).filter(([, v]) => v > 0).length;
  if (assetTypes >= 3) tryUnlock('diversified');

  return current;
}
