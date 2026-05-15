import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import type { Difficulty, GameState } from '../types';
import { scoreEndOfMonth } from '../engine';
import { analyzeBudget } from '../../utils/budgetAnalysis';
import { checkAchievements, getAchievements, unlockAchievement } from '../../utils/achievements';
import { Top, panelSx, moneyTL, diffLabel } from './helpers';

interface Props {
  game: GameState;
  onRestart: (d: Difficulty) => void;
  onBack: () => void;
}

export function EndScreen({ game, onRestart, onBack }: Props) {
  const endScore = scoreEndOfMonth(game);
  const budget = analyzeBudget(game);
  const [achievements, setAchievements] = React.useState(() => checkAchievements(game));

  // Unlock first-day on mount
  React.useEffect(() => {
    const updated = unlockAchievement('first-day');
    setAchievements(updated);
    const recheck = checkAchievements(game);
    setAchievements(recheck);
  }, []);

  const strengths: string[] = [];
  const risks: string[] = [];

  if (game.rentPaid) strengths.push('kira ödendi');
  if (Object.values(game.billsPaid).every(Boolean)) strengths.push('tüm faturalar ödendi');
  if (game.cardDebt === 0) strengths.push('kartsız');
  if (game.cardDebt <= 3000) strengths.push('borç kontrolü');
  if (game.fridge >= 50) strengths.push('dolap dengesi');
  if (game.mood >= 55) strengths.push('moral iyi');
  if (game.discipline >= 55) strengths.push('disiplinli');
  if (game.cash >= 2000) strengths.push('nakit tampon');
  const totalAssets = (game.holdings.gold * game.goldPrice +
    game.holdings.stock * (game.stockIndex * 20) +
    game.holdings.usd * game.usdTry +
    game.holdings.btc * game.btcTry +
    game.holdings.eth * game.ethTry);
  if (totalAssets >= 5000) strengths.push('birikim başlangıcı');

  if (!game.rentPaid) risks.push('kira açığı');
  if (game.cardDebt >= 5000) risks.push('kart borcu yüksek');
  if (game.fridge <= 30) risks.push('dolap zayıf');
  if (game.mood <= 35) risks.push('moral düşük');
  if (game.discipline <= 30) risks.push('disiplin zayıf');
  if (game.cash < 500) risks.push('nakit darlığı');

  return (
    <>
      <Top title="Ay Sonu" />
      <Box sx={{ pt: 1 }}>
        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>📊 Ay Sonu Raporu</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <Typography variant="body2" sx={{ fontSize: 18, fontWeight: 900 }}>
                Skor: {endScore}/200
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Mod: <b>{diffLabel(game.difficulty)}</b> · Puan: <b>{game.points}</b>
              </Typography>

              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.12)' }} />

              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Nakit: <b>{moneyTL(game.cash)}</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Kart borcu: <b>{moneyTL(game.cardDebt)}</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Dolap seviyesi: <b>{game.fridge}%</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Finansal disiplin: <b>{game.discipline}%</b>
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

              <Typography fontWeight={900} sx={{ mb: 1, fontSize: '0.95rem' }}>📊 50/30/20 Bütçe Analizi</Typography>
              <Stack spacing={1}>
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">İhtiyaçlar (hedef: %50)</Typography>
                    <Typography variant="caption" fontWeight={700}>{budget.needsPct}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, budget.needsPct)}
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: budget.needsPct <= 55 ? '#22c55e' : budget.needsPct <= 70 ? '#f59e0b' : '#ef4444' } }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">İstekler (hedef: %30)</Typography>
                    <Typography variant="caption" fontWeight={700}>{budget.wantsPct}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, budget.wantsPct)}
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: budget.wantsPct <= 35 ? '#22c55e' : '#f59e0b' } }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">Birikim/Borç (hedef: %20)</Typography>
                    <Typography variant="caption" fontWeight={700}>{budget.savingsPct}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, budget.savingsPct)}
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: budget.savingsPct >= 15 ? '#22c55e' : '#f59e0b' } }}
                  />
                </Box>
              </Stack>

              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                50/30/20 kuralı: Gelirin %50'si ihtiyaç, %30'u istek, %20'si birikim/borç ödemesine ayrılır.
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

              <Typography fontWeight={900} sx={{ mb: 1, fontSize: '0.95rem' }}>🏆 Başarı Rozetleri</Typography>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                {achievements.filter(a => a.unlocked).length === 0 ? (
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>Henüz rozet kazanmadın. Tekrar dene!</Typography>
                ) : (
                  achievements.filter(a => a.unlocked).map(a => (
                    <Chip
                      key={a.id}
                      size="small"
                      label={`${a.emoji} ${a.title}`}
                      sx={{ bgcolor: 'rgba(34,197,94,0.2)', color: 'white' }}
                    />
                  ))
                )}
              </Stack>
              {achievements.filter(a => !a.unlocked).length > 0 && (
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.5, width: '100%' }}>Kilitli:</Typography>
                  {achievements.filter(a => !a.unlocked).slice(0, 5).map(a => (
                    <Chip
                      key={a.id}
                      size="small"
                      variant="outlined"
                      label={`${a.emoji} ${a.title}`}
                      sx={{ color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.15)' }}
                    />
                  ))}
                </Stack>
              )}

              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {endScore >= 70
                  ? 'Dengeyi kurdun: ihtiyaçlar + borç kontrolü + birikim.'
                  : endScore >= 40
                    ? 'Kıl payı: bazı alanlarda açık var. Kart borcuna ve dolap planına dikkat.'
                    : 'Zorlu ay: borç/ödeme planı bozuldu. Önce zorunlular, sonra küçük eğlence.'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.9, opacity: 0.72 }}>
                Ay sonu yorumu: iyi sonuç için tek bir doğru yok; ama genelde düzenli ödeme, kontrollü harcama ve acele yatırım kararlarından kaçınmak dengeyi güçlendirir.
              </Typography>

              <Stack spacing={0.75} sx={{ mt: 1.1 }}>
                <Typography variant="caption" sx={{ opacity: 0.72 }}>Ay sonu analizi:</Typography>
                {strengths.length ? (
                  <Typography variant="body2" sx={{ opacity: 0.88 }}>
                    Güçlü tarafların: {strengths.join(' · ')}.
                  </Typography>
                ) : null}
                {risks.length ? (
                  <Typography variant="body2" sx={{ opacity: 0.88 }}>
                    Geliştirilecek taraflar: {risks.join(' · ')}.
                  </Typography>
                ) : null}
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Button variant="contained" onClick={() => onRestart(game.difficulty)}>
                  Tekrar Oyna
                </Button>
                <Button variant="outlined" onClick={onBack}>
                  Telefona dön
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
