import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import type { LearnView } from './types';
import { GlassCard, openExternal, shuffleArray, LearnTop } from './LearnHelpers';
import type { LearnCategory } from './content';
import { getCategoryProgress, markItemOpened } from '../ui/progress';
import type { LearnCategoryId } from './content';

interface Props {
  category: LearnCategory;
  openedItemIds: string[];
  completedQuizIds: LearnCategoryId[];
  onSetView: (v: LearnView) => void;
}

export function CategoryView({ category: c, openedItemIds, completedQuizIds, onSetView }: Props) {
  const catItemIds = c.items.map(it => it.id);
  const { readCount, quizDone, totalPct } = getCategoryProgress(c.id, catItemIds, openedItemIds, completedQuizIds);

  function handleItemClick(itemId: string) {
    markItemOpened(itemId);
  }

  const barColor = totalPct >= 80 ? '#22c55e' : totalPct >= 40 ? '#60a5fa' : '#f59e0b';

  return (
    <Box sx={{ pt: 1, pb: 6 }}>
      <LearnTop title={`${c.icon} ${c.title}`} canBack onBack={() => onSetView({ kind: 'list' })} />
      <Typography variant="body2" sx={{ mt: 1, mb: 1, opacity: 0.8, color: 'rgba(255,255,255,0.75)' }}>
        {c.subtitle}
      </Typography>

      {/* Progress bar */}
      <GlassCard>
        <CardContent sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" fontWeight={800}>Kategori ilerlemesi</Typography>
            <Typography variant="caption" fontWeight={800}>{totalPct}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={totalPct}
            sx={{ height: 7, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: barColor, borderRadius: 3 } }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            <Chip size="small" label={`📖 ${readCount}/${c.items.length} içerik okundu`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
            <Chip size="small" label={quizDone ? '✅ Test tamamlandı' : `🧪 ${c.quiz.length} soru`} sx={{ bgcolor: quizDone ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.12)', color: 'white' }} />
          </Stack>
        </CardContent>
      </GlassCard>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {c.items.map((it) => {
          const isRead = openedItemIds.includes(it.id);
          return (
            <Box key={it.id} id={`item-${it.id}`} onClick={() => handleItemClick(it.id)}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 1, mb: 1 }}>
                <Typography sx={{ color: 'white', fontWeight: 950, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {it.title}
                </Typography>
                {isRead ? <Chip size="small" label="✓" sx={{ height: 20, minWidth: 20, bgcolor: 'rgba(34,197,94,0.2)', color: '#22c55e', fontWeight: 900 }} /> : null}
              </Stack>
              <Stack spacing={1.5} sx={{ mt: 0.5 }}>
                {it.body.map((p, i) => (
                  <GlassCard key={`${it.id}-body-${i}`}>
                    <CardContent sx={{ py: 1.5 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>{p}</Typography>
                    </CardContent>
                  </GlassCard>
                ))}
                {it.scenario ? (
                  <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5 }}>🎯 Mini Senaryo</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{it.scenario}</Typography>
                    </CardContent>
                  </Card>
                ) : null}
                {it.qa?.length ? (
                  <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5 }}>✅ Hızlı Soru‑Cevap</Typography>
                      {it.qa.map((qa, i) => (
                        <Typography key={i} variant="body2" sx={{ opacity: 0.9 }}>• {qa.q} — {qa.a}</Typography>
                      ))}
                    </CardContent>
                  </Card>
                ) : null}
                {it.tips?.map((t, i) => (
                  <Card key={`${it.id}-tip-${i}`} sx={{ borderRadius: 4, bgcolor: 'rgba(96,165,250,0.12)', color: 'white', border: '1px solid rgba(96,165,250,0.2)' }}>
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5, color: '#60a5fa' }}>💡 Taktik / İpucu</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{t}</Typography>
                    </CardContent>
                  </Card>
                ))}
                {it.video ? (
                  <Card sx={{ borderRadius: 4, bgcolor: 'rgba(168,85,247,0.12)', color: 'white', border: '1px solid rgba(168,85,247,0.22)' }}>
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5, color: '#c084fc' }}>🎥 Resmî video</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>{it.video.title}{it.video.source ? ` · ${it.video.source}` : ''}</Typography>
                      <Button size="small" variant="contained" endIcon={<OpenInNewRounded />} onClick={() => openExternal(it.video!.url)} sx={{ fontWeight: 800 }}>Videoyu aç</Button>
                    </CardContent>
                  </Card>
                ) : null}
                {it.warning ? (
                  <Card sx={{ borderRadius: 4, bgcolor: 'rgba(239,68,68,0.12)', color: 'white', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <CardContent sx={{ py: 1.25 }}>
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, mb: 0.5, color: '#ef4444' }}>⚠️ Uyarı</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{it.warning}</Typography>
                    </CardContent>
                  </Card>
                ) : null}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <Box sx={{ mt: 4 }}>
        <GlassCard>
          <CardContent
            onClick={() => {
              const indices = c.quiz.map((_, i) => i);
              const shuffled = shuffleArray(indices);
              onSetView({
                kind: 'quiz',
                category: c,
                index: 0,
                correct: 0,
                total: Math.min(10, c.quiz.length),
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
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>{c.quiz.length} soru · Öğrendiklerini pekiştir</Typography>
              </Box>
              <Chip size="small" label="BAŞLA" sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
            </Stack>
          </CardContent>
        </GlassCard>
      </Box>
    </Box>
  );
}
