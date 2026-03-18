import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

import { SCAM_RADAR_POOL, type ScamScenario, type ScamChoiceId } from './pools';

// Dolandırıcılık Radar (2–3 min)
// 10 senaryo: SMS/DM/E-posta/Arama. Oyuncu en güvenli aksiyonu seçer.
// Educational toy model. Not legal/financial advice.

type ChoiceId = ScamChoiceId;

type Scenario = ScamScenario;

const CHOICES: { id: ChoiceId; label: string }[] = [
  { id: 'verify', label: 'Resmî kanaldan doğrula' },
  { id: 'ignore', label: 'Yoksay / bekle' },
  { id: 'block', label: 'Engelle / bildir' },
  { id: 'click', label: 'Linke tıkla / devam et' },
];

const SCENARIOS: Scenario[] = SCAM_RADAR_POOL;

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ScamRadarGame() {
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [order, setOrder] = React.useState<Scenario[]>(() => shuffle(SCENARIOS).slice(0, 10));
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [last, setLast] = React.useState<{ choice: ChoiceId; ok: boolean; s: Scenario } | null>(null);

  const s = order[index];
  const done = started && index >= order.length;

  function reset() {
    setStarted(false);
    setIndex(0);
    setOrder(shuffle(SCENARIOS).slice(0, 10));
    setScore(0);
    setStreak(0);
    setLast(null);
  }

  function choose(c: ChoiceId) {
    if (!s) return;
    const ok = c === s.best;
    if (ok) {
      const add = 4 + Math.min(3, streak);
      setScore((x) => x + add);
      setStreak((x) => x + 1);
    } else {
      setScore((x) => x - 2);
      setStreak(0);
    }
    setLast({ choice: c, ok, s });
    setIndex((i) => i + 1);
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Dolandırıcılık Radar</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(239,68,68,0.16)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur. Amaç: bankacılık ve dijital güvenlikte resmî kanal dışı tuzakları hızlı fark etmek.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={done ? 'Bitti' : `Tur ${Math.min(index + 1, order.length)}/${order.length}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }}
            />
            <Chip size="small" label={`Seri ${streak}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Havuz ${SCENARIOS.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
            {!started ? (
              <Button variant="contained" onClick={() => setStarted(true)}>
                Başlat
              </Button>
            ) : null}
            <Button variant="text" onClick={reset}>
              Sıfırla
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {started && !done && s ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Chip size="small" label={s.channel} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
              <Chip size="small" label="Senaryo" sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            </Stack>

            <Typography fontWeight={950} sx={{ mt: 1 }}>
              {s.message}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.75 }}>
              {s.detail}
            </Typography>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Ne yaparsın?
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {CHOICES.map((c) => (
                <Button key={c.id} variant={c.id === 'verify' ? 'contained' : 'outlined'} onClick={() => choose(c.id)}>
                  {c.label}
                </Button>
              ))}
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
              Not: Şüphedeysen “doğrula” veya “bekle” genelde en güvenlisidir.
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {started && (done || last) ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{done ? 'Özet' : 'Son Tur'}</Typography>
            {last ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  En güvenli: <b>{CHOICES.find((c) => c.id === last.s.best)?.label}</b>
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.85 }}>
                  Neden: {last.s.why}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
                  {last.s.rule}
                </Typography>
              </Box>
            ) : null}

            {done ? (
              <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
                Ders: Hızlı karar istiyorlarsa yavaşla. Kimliği sen doğrula.
              </Typography>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
