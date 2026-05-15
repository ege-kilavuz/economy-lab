import type { LearnCategory } from './content';

export type LearnView =
  | { kind: 'list' }
  | { kind: 'category'; category: LearnCategory; focusItemId?: string }
  | {
      kind: 'quiz';
      category: LearnCategory;
      index: number;
      selected?: number;
      correct?: number;
      total: number;
      reviewItemIds?: string[];
      questionOrder: number[];
      mode?: 'full' | 'wrong-only';
    };
