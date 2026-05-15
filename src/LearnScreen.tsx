import React from 'react';
import type { LearnCategoryId } from './learn/content';
import { LEARNING_SCENARIOS } from './learn/scenarios';
import { loadProgress, markQuizCompleted } from './ui/progress';
import type { LearnView } from './learn/types';
import { buildItemIndex, categoryById, LEARNING_PATH } from './learn/LearnHelpers';
import { QuizView } from './learn/QuizView';
import { CategoryView } from './learn/CategoryView';
import { ListView } from './learn/ListView';

export function LearnScreen() {
  const [view, setView] = React.useState<LearnView>({ kind: 'list' });
  const [completedQuizIds, setCompletedQuizIds] = React.useState<LearnCategoryId[]>(() => loadProgress().completedQuizIds);
  const [expandedScenarioId, setExpandedScenarioId] = React.useState<string | false>(LEARNING_SCENARIOS[0]?.id ?? false);
  const itemIndex = React.useMemo(() => buildItemIndex(), []);
  const completedSet = React.useMemo(() => new Set(completedQuizIds), [completedQuizIds]);
  const nextRecommendedId = LEARNING_PATH.find((id) => !completedSet.has(id));
  const nextRecommended = nextRecommendedId ? categoryById(nextRecommendedId) : undefined;

  React.useEffect(() => {
    if (view.kind !== 'category') return;
    if (!view.focusItemId) return;
    const el = document.getElementById(`item-${view.focusItemId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [view]);

  function handleCompletedChange(id: LearnCategoryId) {
    setCompletedQuizIds((prev) => {
      if (prev.includes(id)) return prev;
      markQuizCompleted(id);
      return [...prev, id];
    });
  }

  if (view.kind === 'quiz') {
    return (
      <QuizView
        view={view}
        itemIndex={itemIndex}
        nextRecommended={nextRecommended}
        onSetView={setView}
        onCompletedChange={handleCompletedChange}
      />
    );
  }

  if (view.kind === 'category') {
    return <CategoryView category={view.category} onSetView={setView} />;
  }

  return (
    <ListView
      completedQuizIds={completedQuizIds}
      completedSet={completedSet}
      nextRecommendedId={nextRecommendedId}
      nextRecommended={nextRecommended}
      expandedScenarioId={expandedScenarioId}
      onSetView={setView}
      onScenarioToggle={(id) => setExpandedScenarioId(id || false)}
    />
  );
}
