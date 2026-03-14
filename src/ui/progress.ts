import type { LearnCategoryId } from '../learn/content';

export type ProgressSnapshot = {
  completedQuizIds: LearnCategoryId[];
  openedSimulationIds: string[];
  lastPlayedAt?: string;
};

const STORAGE_KEY = 'economy-lab-progress-v1';

const EMPTY_PROGRESS: ProgressSnapshot = {
  completedQuizIds: [],
  openedSimulationIds: [],
};

export function loadProgress(): ProgressSnapshot {
  if (typeof window === 'undefined') return EMPTY_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressSnapshot>;
    return {
      completedQuizIds: Array.isArray(parsed.completedQuizIds) ? parsed.completedQuizIds as LearnCategoryId[] : [],
      openedSimulationIds: Array.isArray(parsed.openedSimulationIds) ? parsed.openedSimulationIds as string[] : [],
      lastPlayedAt: typeof parsed.lastPlayedAt === 'string' ? parsed.lastPlayedAt : undefined,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: ProgressSnapshot) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markQuizCompleted(categoryId: LearnCategoryId) {
  const current = loadProgress();
  if (!current.completedQuizIds.includes(categoryId)) {
    current.completedQuizIds = [...current.completedQuizIds, categoryId];
  }
  saveProgress(current);
  return current;
}

export function markSimulationOpened(simulationId: string) {
  const current = loadProgress();
  if (!current.openedSimulationIds.includes(simulationId)) {
    current.openedSimulationIds = [...current.openedSimulationIds, simulationId];
  }
  current.lastPlayedAt = new Date().toISOString();
  saveProgress(current);
  return current;
}
