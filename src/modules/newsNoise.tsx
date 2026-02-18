import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

import { NEWS_NOISE_POOL, type NewsNoiseItem } from './pools';

// "Haber mi Gürültü mü?" (2–3 min)
// Purpose: teach basic media/finance literacy: source quality, incentives, confirmation, urgency traps.
// Educational toy model. Not financial advice.

type Pick = 'signal' | 'noise' | 'unsure';

type Item = NewsNoiseItem;

const ITEMS: Item[] = NEWS_NOISE_POOL;

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function NewsNoiseGame() {
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [order, setOrder] = React.useState<Item[]>(() => shuffle(ITEMS).slice(0, 10));
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [last, setLast] = React.useState<{ pick: Pick; ok: boolean; item: Item } | null>(null);

  const item = order[index];
  const done = started && index >= order.length;

  function reset() {
    setStarted(false);
    setIndex(0);
    setOrder(shuffle(ITEMS).slice(0, 10));
    setScore(0);
    setStreak(0);
    setLast(null);
  }

  function pick(p: Pick) {
    if (!item) return;
    const ok = p !== 'unsure' && p === item.correct;

    if (p === 'unsure') {
      setScore((s) => s + 1);
      setStreak(0);
    } else if (ok) {
      setScore((s) => s + 4);
      setStreak((s) => s + 1);
    } else {
      setScore((s) => s - 2);
      setStreak(0);
    }

    setLast({ pick: p, ok, item });
    setIndex((i) => i + 1);
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Haber mi Gürültü mü?</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(34,197,94,0.18)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur. Amaç: “Kaynak + kanıt + teşvik” filtrelerini refleks yapmak.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={done ? 'Bitti' : `Tur ${Math.min(index + 1, order.length)}/${order.length}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }}
            />
            <Chip size="small" label={`Seri ${streak}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Havuz ${ITEMS.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
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

      {started && !done && item ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{item.title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.75 }}>
              {item.context}
            </Typography>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Seç:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" color="success" onClick={() => pick('signal')}>
                Sinyal
              </Button>
              <Button variant="contained" color="error" onClick={() => pick('noise')}>
                Gürültü
              </Button>
              <Button variant="outlined" onClick={() => pick('unsure')}>
                Emin değilim
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
              Not: “Emin değilim” bazen en doğru karardır. Özellikle kanıt yoksa.
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {started && (done || last) ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>{done ? 'Özet' : 'Son Tur'} </Typography>
            {last ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Doğru cevap: <b>{last.item.correct === 'signal' ? 'Sinyal' : 'Gürültü'}</b> · Sen:{' '}
                  <b>{last.pick === 'signal' ? 'Sinyal' : last.pick === 'noise' ? 'Gürültü' : 'Emin değilim'}</b>
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.85 }}>
                  Neden: {last.item.why}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
                  {last.item.rule}
                </Typography>
              </Box>
            ) : null}

            {done ? (
              <Typography variant="caption" sx={{ display: 'block', mt: 1.25, opacity: 0.7 }}>
                Ders: En iyi savunma “yavaşlamak”. Acele ettiren içerikler çoğunlukla manipülasyon taşır.
              </Typography>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
