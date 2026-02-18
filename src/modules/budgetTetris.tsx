import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';

// Budget Tetris (2–3 min): drag falling money blocks into budget buckets.
// Educational toy model. Not financial advice.

type BucketId = 'needs' | 'emergency' | 'goal' | 'wants';

type Block = {
  id: string;
  amount: number;
  x: number; // 0..1
  y: number; // 0..1
  vy: number; // per tick
};

type Bucket = {
  id: BucketId;
  title: string;
  subtitle: string;
  target: number;
  saved: number;
  color: string;
};

function money(n: number) {
  return `${Math.round(n).toLocaleString()} TL`;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function uid() {
  return Math.random().toString(16).slice(2);
}

function newBlock(): Block {
  const amounts = [250, 500, 750, 1000, 1250, 1500];
  const amount = amounts[Math.floor(Math.random() * amounts.length)]!;
  return {
    id: uid(),
    amount,
    x: 0.1 + Math.random() * 0.8,
    y: 0,
    vy: 0.012 + Math.random() * 0.01,
  };
}

export function BudgetTetris() {
  const [running, setRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(75); // seconds
  const [score, setScore] = React.useState(0);
  const [tip, setTip] = React.useState('İpucu: Önce Zorunlular dolsun. Sonra acil fon ve hedef.');

  const [buckets, setBuckets] = React.useState<Bucket[]>([
    {
      id: 'needs',
      title: 'Zorunlular',
      subtitle: 'kira/fatura/gıda',
      target: 9000,
      saved: 0,
      color: '#60a5fa',
    },
    {
      id: 'emergency',
      title: 'Acil Fon',
      subtitle: 'sürpriz gider',
      target: 2000,
      saved: 0,
      color: '#22c55e',
    },
    {
      id: 'goal',
      title: 'Hedef',
      subtitle: 'laptop/ehliyet',
      target: 2500,
      saved: 0,
      color: '#f59e0b',
    },
    {
      id: 'wants',
      title: 'İstek',
      subtitle: 'eğlence',
      target: 1500,
      saved: 0,
      color: '#fb7185',
    },
  ]);

  const [block, setBlock] = React.useState<Block>(() => newBlock());
  const [dragX, setDragX] = React.useState<number | null>(null);

  const done = timeLeft <= 0;

  function reset() {
    setRunning(false);
    setTimeLeft(75);
    setScore(0);
    setTip('İpucu: Önce Zorunlular dolsun. Sonra acil fon ve hedef.');
    setBuckets((bs) => bs.map((b) => ({ ...b, saved: 0 })));
    setBlock(newBlock());
    setDragX(null);
  }

  // countdown
  React.useEffect(() => {
    if (!running) return;
    if (done) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  // falling loop
  React.useEffect(() => {
    if (!running) return;
    if (done) return;
    const t = setInterval(() => {
      setBlock((b) => {
        const y = b.y + b.vy;
        if (y >= 1) {
          // missed
          setScore((sc) => sc - 3);
          setTip('Kaçırdın: Para boşa gitti. Küçük kaçışlar ay sonunda büyür.');
          return newBlock();
        }
        return { ...b, y };
      });
    }, 50);
    return () => clearInterval(t);
  }, [running, done]);

  function bucketFromX(x01: number): BucketId {
    if (x01 < 0.25) return 'needs';
    if (x01 < 0.50) return 'emergency';
    if (x01 < 0.75) return 'goal';
    return 'wants';
  }

  function drop() {
    const id = bucketFromX(block.x);

    setBuckets((bs) =>
      bs.map((b) => (b.id === id ? { ...b, saved: b.saved + block.amount } : b))
    );

    setScore((sc) => {
      const needs = buckets.find((b) => b.id === 'needs')?.saved ?? 0;
      const needsAfter = id === 'needs' ? needs + block.amount : needs;

      // scoring rules
      let add = 0;
      if (id === 'needs') add += 5;
      if (id === 'emergency') add += needsAfter >= 6000 ? 4 : -1;
      if (id === 'goal') add += needsAfter >= 7000 ? 3 : -1;
      if (id === 'wants') add += needsAfter >= 8000 ? 1 : -3;

      return sc + add;
    });

    // teach hints
    if (id === 'wants') setTip('İstekler iyi ama önce zorunlular. Yoksa kart/borç riski artar.');
    if (id === 'emergency') setTip('Acil fon: sürpriz gider gelince karta yazmamak için yastık.');
    if (id === 'needs') setTip('Zorunlular: önce bunlar. Domino etkisini engeller.');
    if (id === 'goal') setTip('Hedef: motivasyon. Küçük ama düzenli ilerleme daha sürdürülebilir.');

    setBlock(newBlock());
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    setDragX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    setDragX(e.clientX);
    setBlock((b) => ({ ...b, x: clamp(b.x + dx / 320, 0.02, 0.98) }));
  }

  function onPointerUp() {
    setDragX(null);
    if (!running || done) return;
    drop();
  }

  const totalSaved = buckets.reduce((a, b) => a + b.saved, 0);

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950}>Bütçe Tetris</Typography>
            <Chip size="small" label={`Skor ${score}`} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            75 saniye. Parayı doğru kutuya bırak.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`Süre: ${Math.max(0, timeLeft)}s`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Toplam: ${money(totalSaved)}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
            {!running ? (
              <Button variant="contained" onClick={() => setRunning(true)} disabled={done}>
                Başlat
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setRunning(false)}>
                Duraklat
              </Button>
            )}
            <Button variant="text" onClick={reset}>
              Sıfırla
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
        <CardContent>
          <Typography fontWeight={900}>Oyun Alanı</Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Bloğu sürükle ve bırak (parmağını kaldırınca düşer).
          </Typography>

          <Box
            sx={{
              mt: 1.25,
              position: 'relative',
              height: 260,
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
              bgcolor: 'rgba(0,0,0,0.18)',
            }}
          >
            {/* lanes background */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {buckets.map((b) => (
                <Box key={b.id} sx={{ borderRight: '1px solid rgba(255,255,255,0.06)' }} />
              ))}
            </Box>

            {/* falling block */}
            <Box
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              sx={{
                position: 'absolute',
                left: `${block.x * 100}%`,
                top: `${block.y * 80}%`,
                transform: 'translate(-50%, 0)',
                width: 110,
                height: 46,
                borderRadius: 3,
                bgcolor: 'rgba(96,165,250,0.22)',
                border: '1px solid rgba(96,165,250,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                touchAction: 'none',
              }}
            >
              <Typography fontWeight={900}>{money(block.amount)}</Typography>
            </Box>

            {/* buckets footer */}
            <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {buckets.map((b) => (
                <Box key={b.id} sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.10)', bgcolor: 'rgba(255,255,255,0.03)' }}>
                  <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', fontWeight: 900 }}>
                    {b.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                    {money(b.saved)} / {money(b.target)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.12)' }} />
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {tip}
          </Typography>

          {done ? (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
              Süre bitti. İpucu: Zorunlular dolmadan istekleri büyütmek kart/borç riskini artırır.
            </Typography>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  );
}
