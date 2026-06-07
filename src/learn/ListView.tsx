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

function MiniProgress({ value }: { value: number }) {
  const color = value >= 80 ? '#22c55e' : value >= 40 ? '#60a5fa' : '#f59e0b';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        sx={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2 },
        }}
      />
      <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.65rem', color, minWidth: 28, textAlign: 'right' }}>
        {value}%
      </Typography>
    </Box>
  );
}

export function ListView({ completedQuizIds, openedItemIds, nextRecommendedId: _nextRecommendedId, nextRecommended, expandedScenarioId, onSetView, onScenarioToggle }: Props) {
  const totalItems = LEARN_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const totalRead = LEARN_CATEGORIES.reduce((sum, c) => sum + c.items.filter(it => openedItemIds.includes(it.id)).length, 0);
  const totalQuizDone = completedQuizIds.length;
  const totalQuiz = LEARN_CATEGORIES.length;
  const overallPct = Math.round(((totalRead / totalItems) * 0.5 + (totalQuizDone / totalQuiz) * 0.5) * 100);

  return (
    <Box sx={{ pt: 1 }}>
      <LearnTop title="📚 Öğren" canBack={false} onBack={() => {}} />

      <Typography variant="body2" sx={{ mb: 1.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
        Finansal okuryazarlık için konu başlıkları. Karta tıkla, kategorideki terimleri keşfet.
      </Typography>

      {/* Progress overview */}
      <GlassCard>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography fontWeight={950}>Öğrenme yolu</Typography>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
              <Typography variant="caption" fontWeight={800}>Genel ilerleme</Typography>
              <Typography variant="caption" fontWeight={800}>{overallPct}%</Typography>
            </Box>
            <MiniProgress value={overallPct} />
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
              <Chip size="small" label={`📖 ${totalRead}/${totalItems}`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', height: 22 }} />
              <Chip size="small" label={`🧪 ${completedQuizIds.length}/${totalQuiz}`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', height: 22 }} />
              {nextRecommended ? (
                <Chip size="small" label={`Sıradaki: ${nextRecommended.icon} ${nextRecommended.title}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white', height: 22 }} />
              ) : (
                <Chip size="small" label="Ana yol tamamlandı 🎉" sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: 'white', height: 22 }} />
              )}
            </Stack>
          </Box>
        </CardContent>
      </GlassCard>

      {/* ── 3-COLUMN GRID ── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: { xs: 0.75, sm: 1 },
        mt: 2,
      }}>
        {LEARN_CATEGORIES.map((c) => {
          const catItemIds = c.items.map(it => it.id);
          const { totalPct } = getCategoryProgress(c.id, catItemIds, openedItemIds, completedQuizIds);

          return (
            <Box
              key={c.id}
              onClick={() => onSetView({ kind: 'category', category: c })}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                aspectRatio: '3 / 2',
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                p: { xs: 0.75, sm: 1 },
                minWidth: 0,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.18)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  bgcolor: 'rgba(255,255,255,0.04)',
                },
              }}
            >
              {/* Icon */}
              <Typography sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, lineHeight: 1, mb: 0.25 }}>
                {c.icon}
              </Typography>

              {/* Title */}
              <Typography
                fontWeight={900}
                sx={{
                  fontSize: { xs: '0.55rem', sm: '0.6rem' },
                  lineHeight: 1.2,
                  mb: 0.25,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                }}
              >
                {c.title}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.72,
                  fontSize: { xs: '0.45rem', sm: '0.5rem' },
                  lineHeight: 1.2,
                  mb: 0.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {c.subtitle}
              </Typography>

              {/* Mini progress chip */}
              <Chip
                size="small"
                label={totalPct >= 100 ? '✅' : `${totalPct}%`}
                sx={{
                  height: 16,
                  fontSize: '0.5rem',
                  minWidth: 0,
                  bgcolor: totalPct >= 100 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
                  color: totalPct >= 100 ? '#22c55e' : 'white',
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            </Box>
          );
        })}
      </Box>

      {/* ── SCENARIO LIBRARY ── */}
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
