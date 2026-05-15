import React from 'react';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import type { Difficulty, GameState } from '../types';
import { newGame, scoreEndOfMonth } from '../engine';
import { Top, panelSx, moneyTL, diffLabel } from './helpers';

interface Props {
  game: GameState;
  onRestart: (d: Difficulty) => void;
  onBack: () => void;
}

export function EndScreen({ game, onRestart, onBack }: Props) {
  const endScore = scoreEndOfMonth(game);

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
