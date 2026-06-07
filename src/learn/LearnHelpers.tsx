import { Box, Card, IconButton, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { LEARN_CATEGORIES } from './content';
import type { LearnCategory, LearnCategoryId } from './content';

export function buildItemIndex() {
  const map = new Map<string, { title: string; categoryId: string; categoryTitle: string }>();
  for (const c of LEARN_CATEGORIES) {
    for (const it of c.items) {
      map.set(it.id, { title: it.title, categoryId: c.id, categoryTitle: c.title });
    }
  }
  return map;
}

export function categoryById(id: string): LearnCategory | undefined {
  return LEARN_CATEGORIES.find((c) => c.id === id);
}

export const LEARNING_PATH: LearnCategoryId[] = [
  'basics', 'budget', 'credit', 'investing', 'stock-patterns',
  'macro', 'tax', 'credit-score', 'crypto', 'global-economy',
  'sustainability', 'psychology', 'safety',
];

export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
      {children}
    </Card>
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function openExternal(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function LearnTop({ title, canBack, onBack }: { title: string; canBack: boolean; onBack: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 44, mb: 1 }}>
      {canBack ? (
        <IconButton onClick={onBack} sx={{ color: 'white' }}>
          <ArrowBackRounded />
        </IconButton>
      ) : null}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 950,
          flex: 1,
          textAlign: canBack ? 'left' : 'center',
          pr: canBack ? 1 : 0,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
