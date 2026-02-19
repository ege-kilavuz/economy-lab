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
  | 'Inverted Hammer'
  | 'Shooting Star'
  | 'Spinning Top'
  | 'Dragonfly Doji'
  | 'Gravestone Doji'
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
  if (kindPick < 0.1) {
    // Doji (Classic)
    const mid = base;
    const wig = 0.2 + r() * 0.8;
    const open = mid - wig;
    const close = mid + wig;
    const high = mid + 15 + r() * 10;
    const low = mid - 15 - r() * 10;
    return {
      candle: { open, close, high, low },
      answer: 'Doji',
      hint: 'Açılış ve kapanış neredeyse aynı. Kararsızlık hakim.',
      context,
      bestPractice: 'Doji tek başına sinyal değildir. Sonraki mumla teyit ara.',
    };
  }
  if (kindPick < 0.16) {
    // Dragonfly Doji
    const mid = base + 20;
    const wig = 0.2 + r() * 0.5;
    const open = mid - wig;
    const close = mid + wig;
    const high = mid + 1 + r() * 3;
    const low = mid - 30 - r() * 15;
    return {
      candle: { open, close, high, low },
      answer: 'Dragonfly Doji',
      hint: 'Açılış/Kapanış tepede, çok uzun alt fitil: aşağı denendi ama sert reddedildi.',
      context,
      bestPractice: 'Destek seviyesindeyse anlamlıdır, ancak ertesi gün teyit şarttır.',
    };
  }
  if (kindPick < 0.22) {
    // Gravestone Doji
    const mid = base - 20;
    const wig = 0.2 + r() * 0.5;
    const open = mid - wig;
    const close = mid + wig;
    const high = mid + 30 + r() * 15;
    const low = mid - 1 - r() * 3;
    return {
      candle: { open, close, high, low },
      answer: 'Gravestone Doji',
      hint: 'Açılış/Kapanış dipte, çok uzun üst fitil: yukarı denendi ama satıcılar baskın çıktı.',
      context,
      bestPractice: 'Direnç seviyesindeyse düşüş ihtimalini artırır; teyit beklemek güvenlidir.',
    };
  }
  if (kindPick < 0.35) {
    // Hammer
    const bodyTop = base + 10 + r() * 6;
    const body = 3 + r() * 5;
    const open = bodyTop - body;
    const close = bodyTop;
    const high = bodyTop + 1 + r() * 4;
    const low = bodyTop - 25 - r() * 15;
    return {
      candle: { open, close, high, low },
      answer: 'Hammer',
      hint: 'Alt fitil uzun (gövdenin 2-3 katı), gövde küçük: düşüş sonrası alış tepkisi.',
      context,
      bestPractice:
        context.trend === 'down' && context.level === 'support'
          ? 'İdeal Hammer bağlamı: düşüş trendi + destek. Teyit ara.'
          : 'Düşüş trendi/destek yoksa Hammer’ın güvenilirliği düşüktür.',
    };
  }
  if (kindPick < 0.45) {
    // Inverted Hammer
    const bodyBottom = base - 10 - r() * 6;
    const body = 3 + r() * 5;
    const open = bodyBottom;
    const close = bodyBottom + body;
    const high = close + 25 + r() * 15;
    const low = bodyBottom - 1 - r() * 4;
    return {
      candle: { open, close, high, low },
      answer: 'Inverted Hammer',
      hint: 'Düşüş sonrası küçük gövde + uzun üst fitil: alıcıların yukarıyı yoklamaya başladığını gösterebilir.',
      context,
      bestPractice: 'Hammer gibi düşüş trendi sonunda anlamlıdır; teyit mumu şarttır.',
    };
  }
  if (kindPick < 0.55) {
    // Shooting star
    const bodyBottom = base + 15 + r() * 5;
    const body = 3 + r() * 5;
    const open = bodyBottom;
    const close = bodyBottom + body;
    const high = close + 30 + r() * 15;
    const low = bodyBottom - 2 - r() * 5;
    return {
      candle: { open, close, high, low },
      answer: 'Shooting Star',
      hint: 'Yükseliş sonrası küçük gövde + uzun üst fitil: yukarıda yorulma ve satış baskısı.',
      context,
      bestPractice:
        context.trend === 'up' && context.level === 'resistance'
          ? 'Klasik Shooting Star: yükseliş + direnç. Düşüş ihtimali güçlü ancak teyit ara.'
          : 'Yükseliş trendi ve direnç seviyesi yoksa sadece "fitilli mum"dur.',
    };
  }
  if (kindPick < 0.65) {
    // Spinning Top
    const mid = base;
    const body = 4 + r() * 6;
    const open = mid - body / 2;
    const close = mid + body / 2;
    const high = close + 12 + r() * 10;
    const low = open - 12 - r() * 10;
    return {
      candle: { open, close, high, low },
      answer: 'Spinning Top',
      hint: 'Küçük gövde, benzer boyda üst ve alt fitiller: piyasada kararsızlık.',
      context,
      bestPractice: 'Büyük hareketler sonrası kararsızlığı gösterir. Trend dönüşü veya dinlenme sinyali olabilir.',
    };
  }
  if (kindPick < 0.75) {
    // Long upper wick
    const bodyBottom = base - 2 - r() * 4;
    const body = 8 + r() * 10;
    const open = bodyBottom;
    const close = bodyBottom + body;
    const high = close + 30 + r() * 20;
    const low = bodyBottom - 5 - r() * 5;
    return {
      candle: { open, close, high, low },
      answer: 'Long Upper Wick',
      hint: 'Gövde orta/büyük olsa da üst fitil çok belirgin: yukarıda satış gelmiş.',
      context,
      bestPractice: 'Önemli bir dirençteyse alıcıların gücünün azaldığını düşündürür.',
    };
  }
  if (kindPick < 0.85) {
    // Long lower wick
    const bodyTop = base + 2 + r() * 4;
    const body = 8 + r() * 10;
    const close = bodyTop;
    const open = bodyTop - body;
    const high = bodyTop + 5 + r() * 5;
    const low = open - 30 - r() * 20;
    return {
      candle: { open, close, high, low },
      answer: 'Long Lower Wick',
      hint: 'Aşağıda sert alım tepkisi geldiğini gösteren belirgin alt fitil.',
      context,
      bestPractice: 'Destek seviyesinde görülmesi dönüş ihtimalini artırır; teyit ara.',
    };
  }
  if (kindPick < 0.93) {
    // Marubozu
    const mid = base;
    const body = 35 + r() * 15;
    const open = mid - body / 2;
    const close = mid + body / 2;
    const high = close + 0.1 + r() * 1;
    const low = open - 0.1 - r() * 1;
    return {
      candle: { open, close, high, low },
      answer: 'Marubozu',
      hint: 'Neredeyse hiç fitil yok, tam gövde: tek yönlü çok güçlü hakimiyet.',
      context,
      bestPractice: 'Trendin devamını işaret eder ancak çok uzamış bir trend sonunda olması yorulma belirtisi de olabilir.',
    };
  }

  // Big body
  const mid = base;
  const body = 28 + r() * 15;
  const open = mid - body / 2;
  const close = mid + body / 2;
  const high = close + 8 + r() * 10;
  const low = open - 8 - r() * 10;
  return {
    candle: { open, close, high, low },
    answer: 'Big Body',
    hint: 'Ortalamadan büyük bir gövde: piyasada o yönde net bir hacim var.',
    context,
    bestPractice: 'Güçlü bir harekettir ama her zaman riskini yönet; haber/veri etkisini kontrol et.',
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

const CHOICES: Label[] = [
  'Doji',
  'Hammer',
  'Inverted Hammer',
  'Shooting Star',
  'Spinning Top',
  'Dragonfly Doji',
  'Gravestone Doji',
  'Long Upper Wick',
  'Long Lower Wick',
  'Marubozu',
  'Big Body',
];

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
