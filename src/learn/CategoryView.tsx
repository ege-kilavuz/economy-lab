import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import type { LearnView } from './types';
import { GlassCard, openExternal, shuffleArray, LearnTop } from './LearnHelpers';
import type { LearnCategory } from './content';

interface Props {
  category: LearnCategory;
  onSetView: (v: LearnView) => void;
}

export function CategoryView({ category: c, onSetView }: Props) {
  return (
    <Box sx={{ pt: 1, pb: 6 }}>
      <LearnTop title={`${c.icon} ${c.title}`} canBack onBack={() => onSetView({ kind: 'list' })} />
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
