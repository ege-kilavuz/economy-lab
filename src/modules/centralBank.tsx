import React from 'react';
import { Box, Button, Paper, Slider, Stack, Typography } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// This is an educational toy model, not a real macro model.
// We model a 12-month horizon where policy rate influences inflation and unemployment with lags.

type Point = { m: number; inflation: number; unemployment: number; growth: number };

function simulate(params: {
  policyRate: number; // 0..80
  supplyShock: number; // -10..+20
  demand: number; // -10..+10
}): Point[] {
  const { policyRate, supplyShock, demand } = params;

  const points: Point[] = [];

  // Baselines
  let inflation = 35 + supplyShock; // annualized-ish
  let unemployment = 10;
  let growth = 3 + demand * 0.2;

  // Policy effect (higher rate -> lower demand -> lower inflation, higher unemployment, lower growth)
  const rateTightness = (policyRate - 30) / 50; // around 30 neutral

  for (let m = 0; m <= 12; m++) {
    // Lagged effects: take small steps
    const infChange = -0.8 * rateTightness + 0.15 * supplyShock - 0.1 * demand;
    const unempChange = 0.25 * rateTightness - 0.05 * demand;
    const growthChange = -0.35 * rateTightness + 0.08 * demand;

    inflation = Math.max(-5, inflation + infChange);
    unemployment = Math.max(2, unemployment + unempChange);
    growth = Math.max(-10, growth + growthChange);

    points.push({ m, inflation, unemployment, growth });
  }

  return points;
}

const DEFAULTS = {
  policyRate: 35,
  supplyShock: 5,
  demand: 0,
};

export function CentralBankModule() {
  const [policyRate, setPolicyRate] = React.useState(DEFAULTS.policyRate);
  const [supplyShock, setSupplyShock] = React.useState(DEFAULTS.supplyShock);
  const [demand, setDemand] = React.useState(DEFAULTS.demand);

  const data = simulate({ policyRate, supplyShock, demand });
  const last = data[data.length - 1] || data[0];

  const summary =
    last.inflation < 20
      ? 'Enflasyon düşüyor; ama bunun bedeli işsizlik ve büyümede olabilir.'
      : last.inflation < 35
        ? 'Dengeye yaklaşan bir görünüm var; trade-off hâlâ devam ediyor.'
        : 'Enflasyon yüksek kalıyor; faiz/demand/supply dengesi zor.';

  const feeling =
    last.unemployment > 14
      ? 'Hissiyat: iş güvencesi zayıf — tüketim isteği düşer.'
      : last.inflation > 40
        ? 'Hissiyat: fiyat baskısı yüksek — güven azalır.'
        : last.growth < 0
          ? 'Hissiyat: durgunluk — risk algısı artar.'
          : 'Hissiyat: temkinli iyimserlik.';

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Merkez Bankası Karar Odası (Basitleştirilmiş)
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
          Faiz kararının etkilerini "trade-off" olarak gör. (Bu bir eğitim modeli, gerçek hayatta daha karmaşıktır.)
        </Typography>

        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800, display: 'block' }}>
            Öğrenme hedefi
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>• Faiz kararının enflasyon/işsizlik/büyümeye etkisini gözlemlemek</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>• Arz ve talep şoklarını ayırt etmek</Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setPolicyRate(DEFAULTS.policyRate);
                setSupplyShock(DEFAULTS.supplyShock);
                setDemand(DEFAULTS.demand);
              }}
            >
              Sıfırla
            </Button>
          </Stack>
        </Box>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800 }}>
            Simülasyon girdileri
          </Typography>
          <Box>
            <Typography fontWeight={600}>Politika faizi: {policyRate}%</Typography>
            <Slider value={policyRate} min={0} max={80} step={1} onChange={(_, v) => setPolicyRate(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Arz şoku (enerji/ithalat maliyeti): {supplyShock}</Typography>
            <Slider value={supplyShock} min={-10} max={20} step={1} onChange={(_, v) => setSupplyShock(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Talep (ekonomi ısısı): {demand}</Typography>
            <Slider value={demand} min={-10} max={10} step={1} onChange={(_, v) => setDemand(v as number)} />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>12 ay sonu</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          Enflasyon: <b>{last.inflation.toFixed(1)}%</b> · İşsizlik: <b>{last.unemployment.toFixed(1)}%</b> · Büyüme: <b>{last.growth.toFixed(1)}%</b>
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>{summary}</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>{feeling}</Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Grafik: Enflasyon / İşsizlik / Büyüme
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" tickFormatter={(v) => `${v}a`} />
              <YAxis domain={[-10, 80]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(value: any, name) => {
                  if (name === 'inflation') return [`%${Number(value).toFixed(1)}`, 'Enflasyon'];
                  if (name === 'unemployment') return [`%${Number(value).toFixed(1)}`, 'İşsizlik'];
                  if (name === 'growth') return [`%${Number(value).toFixed(1)}`, 'Büyüme'];
                  return [value, name];
                }}
                labelFormatter={(label) => `${label}. ay`}
              />
              <Line type="monotone" dataKey="inflation" stroke="#d32f2f" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="unemployment" stroke="#1976d2" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="growth" stroke="#388e3c" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Stack>
  );
}
