import React from 'react';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import { LEARN_CATEGORIES } from './learn/content';
import type { LearnCategory, LearnCategoryId } from './learn/content';
import { LEARNING_SCENARIOS } from './learn/scenarios';
import { loadProgress, markQuizCompleted } from './ui/progress';

function buildItemIndex() {
  const map = new Map<string, { title: string; categoryId: string; categoryTitle: string }>();
  for (const c of LEARN_CATEGORIES) {
    for (const it of c.items) {
      map.set(it.id, { title: it.title, categoryId: c.id, categoryTitle: c.title });
    }
  }
  return map;
}

function categoryById(id: string) {
  return LEARN_CATEGORIES.find((c) => c.id === id);
}

type LearnView =
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

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,0.06)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {children}
    </Card>
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const LEARNING_PATH: LearnCategoryId[] = ['basics', 'budget', 'credit', 'investing', 'macro', 'psychology', 'safety'];

export function LearnScreen() {
  const [view, setView] = React.useState<LearnView>({ kind: 'list' });
  const [completedQuizIds, setCompletedQuizIds] = React.useState<LearnCategoryId[]>(() => loadProgress().completedQuizIds);
  const itemIndex = React.useMemo(() => buildItemIndex(), []);
  const completedSet = React.useMemo(() => new Set(completedQuizIds), [completedQuizIds]);
  const nextRecommendedId = LEARNING_PATH.find((id) => !completedSet.has(id));
  const nextRecommended = nextRecommendedId ? categoryById(nextRecommendedId) : undefined;

  // Scroll to a focused item when we jump from quiz recommendations.
  // Must be top-level (hooks can't be conditional).
  React.useEffect(() => {
    if (view.kind !== 'category') return;
    if (!view.focusItemId) return;
    const el = document.getElementById(`item-${view.focusItemId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [view]);

  const Top = ({ title, canBack }: { title: string; canBack: boolean }) => (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'transparent', color: 'white' }}>
      <Toolbar sx={{ px: 1 }}>
        {canBack ? (
          <IconButton onClick={() => setView({ kind: 'list' })} sx={{ color: 'white' }}>
            <ArrowBackRounded />
          </IconButton>
        ) : (
          <Box sx={{ width: 44 }} />
        )}
        <Typography variant="subtitle1" sx={{ fontWeight: 950, flex: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        <Box sx={{ width: 44 }} />
      </Toolbar>
    </AppBar>
  );

  if (view.kind === 'quiz') {
    const c = view.category;
    const qi = view.questionOrder[view.index];
    const q = c.quiz[qi];

    if (!q) {
      return (
        <Box sx={{ pt: 1, pb: 6 }}>
          <Top title={`✅ Test bitti · ${c.title}`} canBack />
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
                        if (cat) setView({ kind: 'category', category: cat, focusItemId: id });
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
                      setView({
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
                  if (nextRecommended) setView({ kind: 'category', category: nextRecommended });
                }}
                sx={{ cursor: nextRecommended ? 'pointer' : 'default' }}
              >
                <Typography fontWeight={900}>🎯 Sıradaki öneri</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                  {nextRecommended ? `${nextRecommended.icon} ${nextRecommended.title} ile öğrenme akışına devam et.` : 'Temel öğrenme yolunu bitirdin. İstersen tekrar testi çözebilirsin.'}
                </Typography>
              </CardContent>
            </GlassCard>
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={{ pt: 1, pb: 6 }}>
        <Top title={`🧪 Test · ${c.title}`} canBack />
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
                        setView((v) =>
                          v.kind === 'quiz' && v.selected === undefined
                            ? { ...v, selected: i }
                            : v
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
                  <Chip
                    size="small"
                    label={view.selected === q.correctIndex ? '✅ +1' : '❌ 0'}
                    sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  />
                  <Chip size="small" label="Devam" sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }}
                    onClick={() => {
                      const ok = view.selected === q.correctIndex;
                      const inc = ok ? 1 : 0;
                      const related = !ok ? (q.relatedItemIds ?? []) : [];
                      const merged = Array.from(new Set([...(view.reviewItemIds ?? []), ...related]));
                      
                      const nextIndex = view.index + 1;
                      if (nextIndex >= view.total) {
                        // End of quiz
                        setCompletedQuizIds((prev) => {
                          const next = prev.includes(c.id) ? prev : [...prev, c.id];
                          markQuizCompleted(c.id);
                          return next;
                        });
                        setView({
                          ...view,
                          index: nextIndex,
                          correct: (view.correct ?? 0) + inc,
                          reviewItemIds: merged,
                        });
                      } else {
                        setView({
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

  if (view.kind === 'category') {
    const c = view.category;

    return (
      <Box sx={{ pt: 1, pb: 6 }}>
        <Top title={`${c.icon} ${c.title}`} canBack />
        <Typography variant="body2" sx={{ mt: 1, mb: 1, opacity: 0.8, color: 'rgba(255,255,255,0.75)' }}>
          {c.subtitle}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip size="small" label={`${c.items.length} içerik`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
          <Chip size="small" label={`${c.quiz.length} soru`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
        </Stack>

        <Stack spacing={2}>
          {c.items.map((it) => (
            <Box key={it.id} id={`item-${it.id}`}>
              <Typography sx={{ color: 'white', fontWeight: 950, ml: 1, fontSize: '1.25rem', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                {it.title}
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 0.5 }}>
                {it.body.map((p, i) => (
                  <GlassCard key={`${it.id}-body-${i}`}>
                    <CardContent sx={{ py: 1.5 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                        {p}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                ))}
                {it.scenario ? (
                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5 }}>
                        🎯 Mini Senaryo
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {it.scenario}
                      </Typography>
                    </CardContent>
                  </Card>
                ) : null}
                {it.qa?.length ? (
                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5 }}>
                        ✅ Hızlı Soru‑Cevap
                      </Typography>
                      {it.qa.map((qa, i) => (
                        <Typography key={i} variant="body2" sx={{ opacity: 0.9 }}>
                          • {qa.q} — {qa.a}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                ) : null}
                {it.tips?.map((t, i) => (
                  <Card
                    key={`${it.id}-tip-${i}`}
                    sx={{
                      borderRadius: 4,
                      bgcolor: 'rgba(96,165,250,0.12)',
                      color: 'white',
                      border: '1px solid rgba(96,165,250,0.2)',
                    }}
                  >
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5, color: '#60a5fa' }}>
                        💡 Taktik / İpucu
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {t}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 4 }}>
          <GlassCard>
            <CardContent
              onClick={() => {
                const indices = c.quiz.map((_, i) => i);
                const shuffled = shuffleArray(indices);
                setView({
                  kind: 'quiz',
                  category: c,
                  index: 0,
                  correct: 0,
                  total: Math.min(10, c.quiz.length), // Limit to 10 random questions per run
                  reviewItemIds: [],
                  questionOrder: shuffled,
                  mode: 'full',
                });
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={950}>🧪 Bu kategoriyi test et</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                    {c.quiz.length} soru · Öğrendiklerini pekiştir
                  </Typography>
                </Box>
                <Chip size="small" label="BAŞLA" sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
              </Stack>
            </CardContent>
          </GlassCard>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      <Top title="📚 Öğren" canBack={false} />

      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.75)' }}>
        Kartlara tıkla → kategori içindeki terimler ve “taktik/ipuçları” açılır.
      </Typography>

      <GlassCard>
        <CardContent>
          <Typography fontWeight={950}>Öğrenme yolu</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            Önerilen sıra: Temeller → Bütçe → Kredi → Yatırım → Makro → Psikoloji → Güvenlik
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            <Chip size="small" label={`Tamamlanan test: ${completedQuizIds.length}/${LEARNING_PATH.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
            <Chip
              size="small"
              label={completedQuizIds.length >= 3 ? 'Geri bildirim: ritim iyi gidiyor' : 'Geri bildirim: ilk 3 testi bitir'}
              sx={{ bgcolor: completedQuizIds.length >= 3 ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.18)', color: 'white' }}
            />
            {nextRecommended ? (
              <Chip size="small" label={`Sıradaki: ${nextRecommended.title}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
            ) : (
              <Chip size="small" label="Ana öğrenme yolu tamamlandı" sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: 'white' }} />
            )}
          </Stack>
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardContent>
          <Typography fontWeight={950}>Senaryo kütüphanesi</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            İçerik başlıklarını sınıf içinde tartışmaya çevirmek için kısa vaka kartları.
          </Typography>
          <Stack spacing={1.25} sx={{ mt: 1.5 }}>
            {LEARNING_SCENARIOS.map((scenario) => {
              const category = categoryById(scenario.categoryId);
              return (
                <Box
                  key={scenario.id}
                  sx={{ borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.04)', p: 1.25 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box>
                      <Typography fontWeight={900}>{scenario.title}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.35, opacity: 0.82 }}>
                        {scenario.summary}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={category ? `${category.icon} ${category.title}` : scenario.categoryId}
                      sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }}
                    />
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {scenario.prompt}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    {scenario.check.map((item) => (
                      <Chip key={item} size="small" label={item} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                    ))}
                  </Stack>
                  {category ? (
                    <Chip
                      size="small"
                      label="İlgili içeriği aç"
                      onClick={() => setView({ kind: 'category', category })}
                      sx={{ mt: 1.25, cursor: 'pointer', bgcolor: 'rgba(34,197,94,0.2)', color: 'white' }}
                    />
                  ) : null}
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </GlassCard>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {LEARN_CATEGORIES.map((c) => (
          <GlassCard key={c.id}>
            <CardContent
              onClick={() => setView({ kind: 'category', category: c })}
              sx={{ cursor: 'pointer' }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={950}>
                    {c.icon} {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                    {c.subtitle}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
                    <Chip size="small" label={`${c.items.length} içerik`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                    <Chip size="small" label={`${c.quiz.length} soru`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                    {completedSet.has(c.id) ? <Chip size="small" label="Test tamam" sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: 'white' }} /> : null}
                    {nextRecommendedId === c.id ? <Chip size="small" label="Önerilen sıra" sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} /> : null}
                  </Stack>
                </Box>
                <Chip size="small" label={completedSet.has(c.id) ? 'TEKRAR AÇ' : 'AÇ'} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
              </Stack>
            </CardContent>
          </GlassCard>
        ))}
      </Stack>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.65 }}>
        Not: İçerikler eğitim amaçlıdır; yatırım tavsiyesi değildir.
      </Typography>
    </Box>
  );
}
