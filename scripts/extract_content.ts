import { LEARN_CATEGORIES } from '../src/learn/content';
import { LEARNING_SCENARIOS } from '../src/learn/scenarios';
import fs from 'fs';

const cleanCategories = LEARN_CATEGORIES.map(cat => ({
  id: cat.id,
  title: cat.title,
  subtitle: cat.subtitle,
  icon: cat.icon,
  items: cat.items.map(item => ({
    id: item.id,
    title: item.title,
    short: item.short,
    body: item.body,
    scenario: item.scenario || null,
    qa: item.qa || null,
    tips: item.tips || null,
    warning: item.warning || null,
    video: item.video ? { title: item.video.title, url: item.video.url, source: item.video.source || null } : null,
  })),
  quiz: cat.quiz.map(q => ({
    id: q.id,
    q: q.q,
    choices: q.choices,
    correctIndex: q.correctIndex,
    explain: q.explain,
    relatedItemIds: q.relatedItemIds || null,
  })),
}));

const output = {
  categories: cleanCategories,
  scenarios: LEARNING_SCENARIOS.map(s => ({
    id: s.id,
    title: s.title,
    categoryId: s.categoryId,
    summary: s.summary,
    prompt: s.prompt,
    check: s.check,
    recommendedModule: s.recommendedModule,
  })),
  learningPath: [
    'basics', 'budget', 'credit', 'investing', 'stock-patterns',
    'macro', 'tax', 'credit-score', 'crypto', 'global-economy',
    'sustainability', 'psychology', 'safety',
  ],
};

fs.writeFileSync('/tmp/content_data.json', JSON.stringify(output, null, 2));
console.log(`Exported ${cleanCategories.length} categories`);
