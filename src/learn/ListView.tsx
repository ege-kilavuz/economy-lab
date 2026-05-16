import { Accordion, AccordionDetails, AccordionSummary, Box, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import type { LearnView } from './types';
import { GlassCard, categoryById, LearnTop } from './LearnHelpers';
import { LEARN_CATEGORIES } from './content';
import { LEARNING_SCENARIOS } from './scenarios';
import type { LearnCategoryId } from './content';
import { getCategoryProgress } from '../ui/progress';

interface Props {
  completedQuizIds: LearnCategoryId[];
  completedSet: Set<LearnCategoryId>;
  openedItemIds: string[];
  nextRecommendedId: string | undefined;
  nextRecommended: { icon: string; title: string } | undefined;
  expandedScenarioId: string | false;
  onSetView: (v: LearnView) => void;
  onScenarioToggle: (id: string) => void;
}

function ProgressBar({ value, color }: { value: number; color?: string }) {
  const barColor = color || (value >= 80 ? '#22c55e' : value >= 40 ? '#60a5fa' : '#f59e0b');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        sx={{
          flex: 1,
          height: 6,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': { bgcolor: barColor, borderRadius: 3 },
        }}
      />
      <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'right', fontWeight: 800, color: barColor }}>
        {value}%
      </Typography>
    </Box>
  );
}

export function ListView({ completedQuizIds, openedItemIds, nextRecommendedId, nextRecommended, expandedScenarioId, onSetView, onScenarioToggle }: Props) {
  const totalItems = LEARN_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const totalRead = LEARN_CATEGORIES.reduce((sum, c) => sum + c.items.filter(it => openedItemIds.includes(it.id)).length, 0);
  const totalQuizDone = completedQuizIds.length;
  const totalQuiz = LEARN_CATEGORIES.length;
  const overallPct = Math.round(((totalRead / totalItems) * 0.5 + (totalQuizDone / totalQuiz) * 0.5) * 100);

  return (
    <Box sx={{ pt: 1 }}>
      <LearnTop title="📚 Öğren" canBack={false} onBack={() => {}} />

      <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
        Kartlara tıkla → kategori içindeki terimler ve "taktik/ipuçları" açılır.
      </Typography>

      <GlassCard>
        <CardContent>
          <Typography fontWeight={950}>Öğrenme yolu</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            Önerilen sıra: Temeller → Bütçe → Kredi → Yatırım → Makro → Psikoloji → Güvenlik
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" fontWeight={800}>Genel ilerleme</Typography>
              <Typography variant="caption" fontWeight={800}>{overallPct}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={overallPct}
              sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: overallPct >= 80 ? '#22c55e' : overallPct >= 40 ? '#60a5fa' : '#f59e0b', borderRadius: 4 } }}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
              <Chip size="small" label={`📖 ${totalRead}/${totalItems} içerik okundu`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
              <Chip size="small" label={`🧪 ${completedQuizIds.length}/${totalQuiz} test tamam`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
              <Chip size="small" label={completedQuizIds.length >= 3 ? 'Geri bildirim: ritim iyi gidiyor' : 'Geri bildirim: ilk 3 testi bitir'} sx={{ bgcolor: completedQuizIds.length >= 3 ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.18)', color: 'white' }} />
              {nextRecommended ? (
                <Chip size="small" label={`Sıradaki: ${nextRecommended.icon} ${nextRecommended.title}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
              ) : (
                <Chip size="small" label="Ana öğrenme yolu tamamlandı 🎉" sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: 'white' }} />
              )}
            </Stack>
          </Box>
        </CardContent>
      </GlassCard>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {LEARN_CATEGORIES.map((c) => {
          const catItemIds = c.items.map(it => it.id);
          const { readCount, quizDone, totalPct } = getCategoryProgress(c.id, catItemIds, openedItemIds, completedQuizIds);
          const barColor = totalPct >= 80 ? '#22c55e' : totalPct >= 40 ? '#60a5fa' : '#f59e0b';
          return (
            <GlassCard key={c.id}>
              <CardContent onClick={() => onSetView({ kind: 'category', category: c })} sx={{ cursor: 'pointer' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={950}>{c.icon} {c.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>{c.subtitle}</Typography>
                    <Box sx={{ mt: 1, mb: 0.75 }}>
                      <ProgressBar value={totalPct} color={barColor} />
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip size="small" label={`📖 ${readCount}/${c.items.length} içerik`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', height: 22 }} />
                      <Chip size="small" label={`🧪 ${c.quiz.length} soru`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', height: 22 }} />
                      {quizDone ? <Chip size="small" label="✅ Test tamam" sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: 'white', height: 22 }} /> : null}
                      {nextRecommendedId === c.id ? <Chip size="small" label="🎯 Önerilen sıra" sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white', height: 22 }} /> : null}
                    </Stack>
                  </Box>
                  <Chip size="small" label={totalPct >= 100 ? '👍 İNCELENDİ' : 'AÇ'} sx={{ ml: 1, flexShrink: 0, bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                </Stack>
              </CardContent>
            </GlassCard>
          );
        })}
      </Stack>

      <GlassCard>
        <CardContent>
          <Typography fontWeight={950}>Senaryo kütüphanesi</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            İçerik başlıklarını sınıf içinde tartışmaya çevirmek için kısa vaka kartları.
          </Typography>
          <Stack spacing={1.1} sx={{ mt: 1.5 }}>
            {LEARNING_SCENARIOS.map((scenario) => {
              const category = categoryById(scenario.categoryId);
              const expanded = expandedScenarioId === scenario.id;
              return (
                <Accordion
                  key={scenario.id}
                  expanded={expanded}
                  onChange={(_, isExpanded) => onScenarioToggle(isExpanded ? scenario.id : '')}
                  disableGutters
                  elevation={0}
                  sx={{
                    borderRadius: '16px !important',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.08)',
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreRounded sx={{ color: 'white' }} />} sx={{ px: 1.5, py: 0.25, '& .MuiAccordionSummary-content': { my: 1 } }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography fontWeight={900}>{scenario.title}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.35, opacity: 0.82 }}>{scenario.summary}</Typography>
                      <Chip size="small" label={category ? `${category.icon} ${category.title}` : scenario.categoryId} sx={{ mt: 1, bgcolor: 'rgba(96,165,250,0.22)', color: 'white', maxWidth: '100%', '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', overflowWrap: 'anywhere', paddingTop: '4px', paddingBottom: '4px' }, height: 'auto' }} />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>{scenario.prompt}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      {scenario.check.map((item) => (
                        <Chip key={item} size="small" label={item} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                      ))}
                    </Stack>
                    {category ? (
                      <Chip size="small" label="İlgili içeriği aç" onClick={() => onSetView({ kind: 'category', category })} sx={{ mt: 1.25, cursor: 'pointer', bgcolor: 'rgba(34,197,94,0.2)', color: 'white' }} />
                    ) : null}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </CardContent>
      </GlassCard>

      <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.65 }}>
        Not: İçerikler eğitim amaçlıdır; yatırım tavsiyesi değildir.
      </Typography>
    </Box>
  );
}
