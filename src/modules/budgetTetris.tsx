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

function newBlock(level: number = 1): Block {
  const amounts = [250, 500, 750, 1000, 1250, 1500];
  const amount = amounts[Math.floor(Math.random() * amounts.length)]!;
  const speedMult = 1 + (level - 1) * 0.18;
  return {
    id: uid(),
    amount,
    x: 0.1 + Math.random() * 0.8,
    y: 0,
    // Slower by default; ramps with level.
    vy: (0.006 + Math.random() * 0.004) * speedMult,
  };
}

export function BudgetTetris() {
  const [running, setRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(45); // seconds
  const [score, setScore] = React.useState(0);
  const [tip, setTip] = React.useState('İpucu: Bütçe yaparken önce ihtiyaçları ayır, sonra acil fon ve hedeflere geç.');

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

  const [level, setLevel] = React.useState(1);
  const [milestone, setMilestone] = React.useState<{ needs6000: boolean; needs8000: boolean; emergency2000: boolean; goal2500: boolean }>({
    needs6000: false,
    needs8000: false,
    emergency2000: false,
    goal2500: false,
  });

  const [block, setBlock] = React.useState<Block>(() => newBlock(1));
  const [dragX, setDragX] = React.useState<number | null>(null);
  const [cooldownMs, setCooldownMs] = React.useState(0);
  const [dropped, setDropped] = React.useState(0);
  const [missed, setMissed] = React.useState(0);
  const [streak, setStreak] = React.useState(0);

  const done = timeLeft <= 0;

  function reset() {
    setRunning(false);
    setTimeLeft(45);
    setScore(0);
    setTip('İpucu: Önce Zorunlular dolsun. Sonra acil fon ve hedef.');
    setBuckets((bs) => bs.map((b) => ({ ...b, saved: 0 })));
    setLevel(1);
    setMilestone({ needs6000: false, needs8000: false, emergency2000: false, goal2500: false });
    setBlock(newBlock(1));
    setDragX(null);
    setCooldownMs(0);
    setDropped(0);
    setMissed(0);
    setStreak(0);
  }

  // countdown
  React.useEffect(() => {
    if (!running) return;
    if (done) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  // cooldown tick
  React.useEffect(() => {
    if (!running) return;
    if (done) return;
    if (cooldownMs <= 0) return;
    const t = setInterval(() => setCooldownMs((ms) => Math.max(0, ms - 50)), 50);
    return () => clearInterval(t);
  }, [running, done, cooldownMs]);

  // falling loop
  React.useEffect(() => {
    if (!running) return;
    if (done) return;
    if (cooldownMs > 0) return;
    const t = setInterval(() => {
      setBlock((b) => {
        const y = b.y + b.vy;
        if (y >= 1) {
          // missed
          setMissed((m) => m + 1);
          setStreak(0);
          setScore((sc) => sc - 3);
          setTip('Kaçırdın: Para boşa gitti. Küçük kaçışlar ay sonunda büyür.');
          setCooldownMs(250);
          return newBlock(level);
        }
        return { ...b, y };
      });
    }, 50);
    return () => clearInterval(t);
  }, [running, done, cooldownMs]);

  function bucketFromX(x01: number): BucketId {
    if (x01 < 0.25) return 'needs';
    if (x01 < 0.50) return 'emergency';
    if (x01 < 0.75) return 'goal';
    return 'wants';
  }

  function drop() {
    const id = bucketFromX(block.x);

    setDropped((d) => d + 1);
    setBuckets((bs) =>
      bs.map((b) => (b.id === id ? { ...b, saved: b.saved + block.amount } : b))
    );

    // scoring rules (based on current bucket state)
    const needs = buckets.find((b) => b.id === 'needs')?.saved ?? 0;
    const needsAfter = id === 'needs' ? needs + block.amount : needs;

    let add = 0;
    if (id === 'needs') add += 5;
    if (id === 'emergency') add += needsAfter >= 6000 ? 4 : -1;
    if (id === 'goal') add += needsAfter >= 7000 ? 3 : -1;
    if (id === 'wants') add += needsAfter >= 8000 ? 1 : -3;

    setScore((sc) => sc + add);

    if (add > 0) setStreak((s) => s + 1);
    else setStreak(0);

    // teach hints
    if (id === 'wants') setTip('İstekler iyi ama önce zorunlular. Yoksa kart/borç riski artar.');
    if (id === 'emergency') setTip('Acil fon: sürpriz gider gelince karta yazmamak için yastık.');
    if (id === 'needs') setTip('Zorunlular: önce bunlar. Domino etkisini engeller.');
    if (id === 'goal') setTip('Hedef: motivasyon. Küçük ama düzenli ilerleme daha sürdürülebilir.');

    // level progression (roughly: every 6 drops)
    const nextLevel = 1 + Math.floor((dropped + 1) / 6);
    if (nextLevel !== level) {
      setLevel(nextLevel);
      setTip(`Seviye ${nextLevel}! Hız biraz arttı. Önce zorunlular, sonra acil fon.`);
    }

    // milestone bonuses (simple & motivating)
    const nextBuckets = buckets.map((b) => (b.id === id ? { ...b, saved: b.saved + block.amount } : b));
    const needsSaved = nextBuckets.find((b) => b.id === 'needs')?.saved ?? 0;
    const emergencySaved = nextBuckets.find((b) => b.id === 'emergency')?.saved ?? 0;
    const goalSaved = nextBuckets.find((b) => b.id === 'goal')?.saved ?? 0;

    setMilestone((m) => {
      let bonus = 0;
      const m2 = { ...m };
      if (!m2.needs6000 && needsSaved >= 6000) {
        m2.needs6000 = true;
        bonus += 6;
      }
      if (!m2.needs8000 && needsSaved >= 8000) {
        m2.needs8000 = true;
        bonus += 8;
      }
      if (!m2.emergency2000 && emergencySaved >= 2000) {
        m2.emergency2000 = true;
        bonus += 6;
      }
      if (!m2.goal2500 && goalSaved >= 2500) {
        m2.goal2500 = true;
        bonus += 5;
      }
      if (bonus > 0) {
        setScore((sc) => sc + bonus);
        setTip(`Bonus +${bonus}: hedef milestone! (Zorunlular/Acil Fon/Hedef)`);
      }
      return m2;
    });

    setCooldownMs(240);
    setBlock(newBlock(nextLevel));
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
            45 saniye. Parayı bütçe mantığına göre doğru kutuya bırak: önce ihtiyaçlar, sonra acil fon ve hedefler.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`Süre: ${Math.max(0, timeLeft)}s`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Toplam: ${money(totalSaved)}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Seviye: ${level}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip
              size="small"
              label={`Bonus: ${Object.values(milestone).filter(Boolean).length}/4`}
              sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }}
            />
            <Chip size="small" label={`Bırakılan: ${dropped}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Kaçan: ${missed}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Chip size="small" label={`Seri: ${streak}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
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
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.7 }}>
                Süre bitti. Özet:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                Zorunlular: {money(buckets.find((b) => b.id === 'needs')?.saved ?? 0)} ·
                Acil fon: {money(buckets.find((b) => b.id === 'emergency')?.saved ?? 0)} ·
                Hedef: {money(buckets.find((b) => b.id === 'goal')?.saved ?? 0)} ·
                İstek: {money(buckets.find((b) => b.id === 'wants')?.saved ?? 0)}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.7 }}>
                Ders: Bütçede önce ihtiyaçları ayırmak, sonra acil durumlar ve hedefler için pay bırakmak daha sağlıklı bir sıra oluşturur.
              </Typography>
            </Box>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  );
}
