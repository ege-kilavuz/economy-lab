import { Box, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import type { LearnView } from './types';
import { GlassCard, categoryById, LearnTop } from './LearnHelpers';
import type { LearnCategoryId } from './content';

interface Props {
  view: Extract<LearnView, { kind: 'quiz' }>;
  itemIndex: Map<string, { title: string; categoryId: string; categoryTitle: string }>;
  nextRecommended?: { icon: string; title: string } | undefined;
  onSetView: (v: LearnView) => void;
  onCompletedChange: (id: LearnCategoryId) => void;
}

export function QuizView({ view, itemIndex, nextRecommended, onSetView, onCompletedChange }: Props) {
  const c = view.category;
  const qi = view.questionOrder[view.index];
  const q = c.quiz[qi];

  if (!q) {
    return (
      <Box sx={{ pt: 1, pb: 6 }}>
        <LearnTop title={`✅ Test bitti · ${c.title}`} canBack onBack={() => onSetView({ kind: 'list' })} />
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.85, color: 'rgba(255,255,255,0.85)' }}>
          Skor: <b>{view.correct}</b> / <b>{view.total}</b>
        </Typography>

        {view.reviewItemIds?.length ? (
          <>
            <Typography variant="body2" sx={{ mt: 1.25, opacity: 0.85 }}>
              Tekrar bakmanı önerdiklerim:
            </Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mt: 1 }}>
              {view.reviewItemIds.slice(0, 12).map((id) => {
                const meta = itemIndex.get(id);
                const label = meta ? meta.title : id;
                return (
                  <Chip
                    key={id}
                    size="small"
                    label={label}
                    onClick={() => {
                      const cat = meta ? categoryById(meta.categoryId) : undefined;
                      if (cat) onSetView({ kind: 'category', category: cat, focusItemId: id });
                    }}
                    sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', cursor: meta ? 'pointer' : 'default' }}
                  />
                );
              })}
            </Stack>

            <Box sx={{ mt: 2 }}>
              <GlassCard>
                <CardContent
                  onClick={() => {
                    const wrongIds = new Set(view.reviewItemIds ?? []);
                    const order = c.quiz
                      .map((qq, idx) => ({ idx, related: qq.relatedItemIds ?? [] }))
                      .filter((x) => x.related.some((rid) => wrongIds.has(rid)))
                      .map((x) => x.idx);
                    const fallback = order.length ? order : c.quiz.map((_, i) => i);
                    onSetView({
                      kind: 'quiz',
                      category: c,
                      index: 0,
                      correct: 0,
                      total: fallback.length,
                      reviewItemIds: [],
                      questionOrder: fallback,
                      mode: 'wrong-only',
                    });
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight={950}>🔁 Yanlışlardan tekrar test</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                        Sadece yanlış yaptığın konular (hızlı tekrar)
                      </Typography>
                    </Box>
                    <Chip size="small" label="BAŞLA" sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
                  </Stack>
                </CardContent>
              </GlassCard>
            </Box>
          </>
        ) : (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
            İpucu: Eksik kaldığın terimlere geri dönüp tekrar dene.
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <GlassCard>
            <CardContent
              onClick={() => {
                if (nextRecommended) {
                  const cat = categoryById(
                    ['basics', 'budget', 'credit', 'investing', 'macro', 'psychology', 'safety'].find(
                      (id) => !new Set(c.id).has(id)
                    ) || c.id
                  );
                  if (cat) onSetView({ kind: 'category', category: cat });
                }
              }}
              sx={{ cursor: nextRecommended ? 'pointer' : 'default' }}
            >
              <Typography fontWeight={900}>🎯 Sıradaki öneri</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                {nextRecommended
                  ? `${nextRecommended.icon} ${nextRecommended.title} ile öğrenme akışına devam et.`
                  : 'Temel öğrenme yolunu bitirdin. İstersen tekrar testi çözebilirsin.'}
              </Typography>
            </CardContent>
          </GlassCard>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1, pb: 6 }}>
      <LearnTop title={`🧪 Test · ${c.title}`} canBack onBack={() => onSetView({ kind: 'list' })} />
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.75, color: 'rgba(255,255,255,0.75)' }}>
        Soru {view.index + 1} / {view.total}
      </Typography>

      <GlassCard>
        <CardContent>
          <Typography fontWeight={950} sx={{ fontSize: 18 }}>
            {q.q}
          </Typography>
          <Stack spacing={1.25} sx={{ mt: 1.75 }}>
            {q.choices.map((ch, i) => {
              const picked = view.selected === i;
              const locked = view.selected !== undefined;
              return (
                <Box key={i}>
                  <Box
                    component="button"
                    onClick={() =>
                      onSetView(
                        view.selected === undefined
                          ? { ...view, selected: i }
                          : view
                      )
                    }
                    disabled={locked}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 16,
                      padding: '14px 14px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: picked ? 'rgba(96,165,250,0.22)' : 'rgba(255,255,255,0.06)',
                      color: 'white',
                      fontSize: 15,
                      cursor: locked ? 'default' : 'pointer',
                    }}
                  >
                    {picked ? '✅ ' : ''}{ch}
                  </Box>
                </Box>
              );
            })}
          </Stack>

          {view.selected !== undefined ? (
            <>
              <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {view.selected === q.correctIndex ? 'Doğru.' : 'Yanlış.'} {q.explain}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                <Chip size="small" label={view.selected === q.correctIndex ? '✅ +1' : '❌ 0'} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                <Chip
                  size="small"
                  label="Devam"
                  sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }}
                  onClick={() => {
                    const ok = view.selected === q.correctIndex;
                    const inc = ok ? 1 : 0;
                    const related = !ok ? (q.relatedItemIds ?? []) : [];
                    const merged = Array.from(new Set([...(view.reviewItemIds ?? []), ...related]));
                    const nextIndex = view.index + 1;
                    if (nextIndex >= view.total) {
                      onCompletedChange(c.id);
                      onSetView({
                        ...view,
                        index: nextIndex,
                        correct: (view.correct ?? 0) + inc,
                        reviewItemIds: merged,
                      });
                    } else {
                      onSetView({
                        kind: 'quiz',
                        category: c,
                        index: nextIndex,
                        correct: (view.correct ?? 0) + inc,
                        total: view.total,
                        reviewItemIds: merged,
                        questionOrder: view.questionOrder,
                        mode: view.mode,
                      });
                    }
                  }}
                />
              </Stack>
            </>
          ) : null}
        </CardContent>
      </GlassCard>
    </Box>
  );
}
