import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

// Simple, educational mini-game.
// Player sees a random candle WITH CONTEXT and picks what it most resembles.
// We add a simple trend + level context to teach "shape alone is not enough".

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

type Label =
  | 'Doji'
  | 'Hammer'
  | 'Shooting Star'
  | 'Long Upper Wick'
  | 'Long Lower Wick'
  | 'Big Body'
  | 'Marubozu';

type Context = {
  trend: 'up' | 'down' | 'sideways';
  level: 'support' | 'resistance' | 'none';
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function rng(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function genContext(r: () => number): Context {
  const trend = r() < 0.4 ? 'down' : r() < 0.75 ? 'up' : 'sideways';
  const level = r() < 0.33 ? 'support' : r() < 0.66 ? 'resistance' : 'none';
  return { trend, level };
}

function genCandle(r: () => number): { candle: Candle; answer: Label; hint: string; context: Context; bestPractice: string } {
  const context = genContext(r);

  // Build candle in 0..100 space
  const base = 40 + r() * 20;

  const kindPick = r();
  if (kindPick < 0.22) {
    // Doji
    const mid = base;
    const wig = 0.5 + r() * 1.5;
    const open = mid - wig;
    const close = mid + wig;
    const high = mid + 18 + r() * 12;
    const low = mid - 18 - r() * 12;
    return {
      candle: { open, close, high, low },
      answer: 'Doji',
      hint: 'Açılış ve kapanış çok yakınsa kararsızlık olabilir.',
      context,
      bestPractice: 'Doji tek başına sinyal değildir. Sonraki mumla teyit ara ve trend/level ile birlikte düşün.',
    };
  }
  if (kindPick < 0.44) {
    // Hammer
    const bodyTop = base + 10 + r() * 6;
    const body = 3 + r() * 5;
    const open = bodyTop - body;
    const close = bodyTop;
    const high = bodyTop + 2 + r() * 5;
    const low = bodyTop - 25 - r() * 15;
    return {
      candle: { open, close, high, low },
      answer: 'Hammer',
      hint: 'Alt fitil uzun, gövde küçük: düşüş sonrası tepki ihtimali konuşulur (teyit şart).',
      context,
      bestPractice:
        context.trend === 'down' && context.level === 'support'
          ? 'Bu bağlamda daha anlamlı: düşüş trendi + destek. Yine de teyit (sonraki mum) ara.'
          : 'Hammer görmek yetmez: düşüş trendi ve destek bölgesi yoksa anlamı zayıflar. Teyit ara.',
    };
  }
  if (kindPick < 0.60) {
    // Shooting star (small body near low, long upper wick)
    const bodyBottom = base - 6 - r() * 4;
    const body = 3 + r() * 5;
    const open = bodyBottom;
    const close = bodyBottom + body;
    const high = close + 28 + r() * 18;
    const low = bodyBottom - 4 - r() * 6;
    return {
      candle: { open, close, high, low },
      answer: 'Shooting Star',
      hint: 'Küçük gövde + uzun üst fitil: yukarı itildi ama tutunamamış olabilir (teyit şart).',
      context,
      bestPractice:
        context.trend === 'up' && context.level === 'resistance'
          ? 'Bu bağlamda daha anlamlı: yükseliş + direnç. Yine de ertesi mumla teyit ara.'
          : 'Shooting Star tek mumla karar verdirmez: trend/direnç + teyit aramak gerekir.',
    };
  }
  if (kindPick < 0.74) {
    // Long upper wick
    const bodyBottom = base - 2 - r() * 4;
    const body = 6 + r() * 8;
    const open = bodyBottom;
    const close = bodyBottom + body;
    const high = close + 25 + r() * 18;
    const low = bodyBottom - 6 - r() * 6;
    return {
      candle: { open, close, high, low },
      answer: 'Long Upper Wick',
      hint: 'Uzun üst fitil: yukarı denendi ama reddedilmiş olabilir.',
      context,
      bestPractice:
        context.level === 'resistance'
          ? 'Dirençte uzun üst fitil daha anlamlı olabilir. Yine de tek mumla karar verme.'
          : 'Üst fitil tek başına yeterli değil: seviye (direnç) ve teyit aramak gerekir.',
    };
  }
  if (kindPick < 0.86) {
    // Long lower wick
    const bodyTop = base + 2 + r() * 4;
    const body = 6 + r() * 8;
    const close = bodyTop;
    const open = bodyTop - body;
    const high = bodyTop + 6 + r() * 6;
    const low = open - 25 - r() * 18;
    return {
      candle: { open, close, high, low },
      answer: 'Long Lower Wick',
      hint: 'Uzun alt fitil: aşağı denendi ama alım gelmiş olabilir.',
      context,
      bestPractice:
        context.level === 'support'
          ? 'Destekte uzun alt fitil daha anlamlı olabilir. Teyit aramak şart.'
          : 'Alt fitil tek başına yeterli değil: destek seviyesi + teyit aramak gerekir.',
    };
  }
  if (kindPick < 0.93) {
    // Marubozu (almost no wicks)
    const mid = base;
    const body = 30 + r() * 14;
    const open = mid - body / 2;
    const close = mid + body / 2;
    const high = close + 0.5 + r() * 2;
    const low = open - 0.5 - r() * 2;
    return {
      candle: { open, close, high, low },
      answer: 'Marubozu',
      hint: 'Fitilsiz gibi: çok güçlü tek yön hareket. (Ama haber/bağlam önemli.)',
      context,
      bestPractice:
        'Güçlü mumlar “kesin” demek değildir. Risk yönetimi ve bağlam şart; aşırı heyecan FOMO yapabilir.',
    };
  }

  // Big body
  const mid = base;
  const body = 24 + r() * 12;
  const open = mid - body / 2;
  const close = mid + body / 2;
  const high = close + 6 + r() * 8;
  const low = open - 6 - r() * 8;
  return {
    candle: { open, close, high, low },
    answer: 'Big Body',
    hint: 'Uzun gövde: güçlü hareket. Bağlam (trend/haber) önemli.',
    context,
    bestPractice:
      'Uzun gövde güç demek olabilir ama hangi yönde ve hangi seviyede olduğun önemli. Riskini küçük tut.',
  };
}

function CandleSvg({ candle }: { candle: Candle }) {
  const max = candle.high;
  const min = candle.low;
  const h = max - min || 1;

  const y = (v: number) => 10 + (1 - (v - min) / h) * 180;

  const openY = y(candle.open);
  const closeY = y(candle.close);
  const highY = y(candle.high);
  const lowY = y(candle.low);

  const bodyTop = Math.min(openY, closeY);
  const bodyBottom = Math.max(openY, closeY);
  const bodyH = Math.max(6, bodyBottom - bodyTop);

  const up = candle.close >= candle.open;
  const color = up ? '#22c55e' : '#ef4444';

  return (
    <svg width="100%" height="220" viewBox="0 0 120 220">
      <rect x="0" y="0" width="120" height="220" fill="rgba(255,255,255,0.02)" />
      {/* wick */}
      <line x1="60" y1={highY} x2="60" y2={lowY} stroke={color} strokeWidth={4} strokeLinecap="round" />
      {/* body */}
      <rect x="40" y={bodyTop} width="40" height={bodyH} rx="8" fill={color} opacity={0.9} />
    </svg>
  );
}

const CHOICES: Label[] = ['Doji', 'Hammer', 'Shooting Star', 'Long Upper Wick', 'Long Lower Wick', 'Marubozu', 'Big Body'];

export function CandleGame() {
  const [seed] = React.useState(() => Math.floor(Date.now() % 1000000));
  const [round, setRound] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState<Label | null>(null);

  const r = React.useMemo(() => rng(seed + round * 997), [seed, round]);
  const { candle, answer, hint, context, bestPractice } = React.useMemo(() => genCandle(r), [r]);

  const done = round > 10;

  function reset() {
    setRound(1);
    setScore(0);
    setPicked(null);
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Mum Okuma Mini-Oyunu</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            10 tur: Mum şekline en yakın terimi seç. (Eğitim amaçlı)
          </Typography>
        </CardContent>
      </Card>

      {done ? (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={950}>Bitti</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Skorun: <b>{score}</b> / 10
            </Typography>
            <Button sx={{ mt: 1.5 }} variant="contained" onClick={reset}>Tekrar oyna</Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={900}>Tur {round}/10</Typography>
              <Chip size="small" label="Bağlam" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Trend: ${context.trend === 'up' ? 'Yukarı' : context.trend === 'down' ? 'Aşağı' : 'Yatay'}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
              <Chip size="small" label={`Seviye: ${context.level === 'support' ? 'Destek' : context.level === 'resistance' ? 'Direnç' : 'Yok'}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            </Stack>

            <Box sx={{ mt: 1 }}>
              <CandleSvg candle={candle} />
            </Box>

            <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />

            <Stack spacing={1}>
              {CHOICES.map((c) => {
                const disabled = picked !== null;
                const isPicked = picked === c;
                return (
                  <Button
                    key={c}
                    variant={isPicked ? 'contained' : 'outlined'}
                    disabled={disabled}
                    onClick={() => setPicked(c)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {c}
                  </Button>
                );
              })}
            </Stack>

            {picked ? (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {picked === answer ? 'Doğru.' : `Yanlış. Doğru cevap: ${answer}.`} {hint}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.75 }}>
                  İyi pratik: {bestPractice}
                </Typography>
                <Button
                  sx={{ mt: 1.25 }}
                  variant="contained"
                  onClick={() => {
                    if (picked === answer) setScore((s) => clamp(s + 1, 0, 10));
                    setPicked(null);
                    setRound((r2) => r2 + 1);
                  }}
                >
                  Devam
                </Button>
              </Box>
            ) : null}

            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, opacity: 0.7 }}>
              Not: Tek mumla işlem yapılmaz. Bağlam + risk yönetimi şart.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
