import React from 'react';
import { Box, Button, Paper, Slider, Stack, Typography } from '@mui/material';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPct } from '../ui/format';

function simulateBES(params: {
  monthly: number;      // aylık katkı (TL)
  years: number;        // vade (yıl)
  returnRate: number;   // yıllık getiri (%)
  govtMatch: number;    // devlet katkısı (%)
}) {
  const { monthly, years, returnRate, govtMatch } = params;
  const monthlyRate = returnRate / 100 / 12;
  const data: Array<{
    y: number;
    personal: number;
    govt: number;
    total: number;
  }> = [];

  let personalTotal = 0;
  let govtTotal = 0;

  for (let m = 0; m <= years * 12; m++) {
    if (m > 0) {
      const contribution = monthly;
      const govtContribution = monthly * (govtMatch / 100);
      personalTotal = (personalTotal + contribution) * (1 + monthlyRate);
      govtTotal = (govtTotal + govtContribution) * (1 + monthlyRate);
    }

    if (m % 12 === 0) {
      data.push({
        y: m / 12,
        personal: Math.round(personalTotal),
        govt: Math.round(govtTotal),
        total: Math.round(personalTotal + govtTotal),
      });
    }
  }

  return data;
}

const DEFAULTS = {
  monthly: 1000,
  years: 10,
  returnRate: 15,
  govtMatch: 30,
};

function tl(n: number) { return Math.round(n); }

export function BESModule() {
  const [monthly, setMonthly] = React.useState(DEFAULTS.monthly);
  const [years, setYears] = React.useState(DEFAULTS.years);
  const [returnRate, setReturnRate] = React.useState(DEFAULTS.returnRate);
  const [govtMatch, setGovtMatch] = React.useState(DEFAULTS.govtMatch);

  const data = simulateBES({ monthly, years, returnRate, govtMatch });
  const last = data[data.length - 1] || data[0];

  const totalContributed = monthly * years * 12;
  const totalGovtContributed = monthly * (govtMatch / 100) * years * 12;
  const totalReturn = last.total - totalContributed - totalGovtContributed;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          BES — Bireysel Emeklilik Simülasyonu
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
          Devlet katkısı ve bileşik getirinin uzun vadede birikimine nasıl etki ettiğini gör.
        </Typography>

        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800, display: 'block' }}>
            Öğrenme hedefi
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
            • Devlet katkısının birikime etkisini anlamak
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
            • Erken başlamanın bileşik getiri gücünü görmek
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => { setMonthly(DEFAULTS.monthly); setYears(DEFAULTS.years); setReturnRate(DEFAULTS.returnRate); setGovtMatch(DEFAULTS.govtMatch); }}>
              Sıfırla
            </Button>
          </Stack>
        </Box>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800 }}>
            Simülasyon girdileri
          </Typography>
          <Box>
            <Typography fontWeight={600}>Aylık katkı: {monthly.toLocaleString()} TL</Typography>
            <Slider value={monthly} min={200} max={10000} step={100} onChange={(_, v) => setMonthly(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Vade: {years} yıl</Typography>
            <Slider value={years} min={1} max={30} step={1} onChange={(_, v) => setYears(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Yıllık getiri: {formatPct(returnRate, 0)}</Typography>
            <Slider value={returnRate} min={0} max={50} step={1} onChange={(_, v) => setReturnRate(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Devlet katkısı: {formatPct(govtMatch, 0)}</Typography>
            <Slider value={govtMatch} min={0} max={50} step={5} onChange={(_, v) => setGovtMatch(v as number)} />
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Gerçekte BES'te devlet katkısı %30'dur (yıllık brüt asgari ücretin %30'una kadar).
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>Vade Sonu</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          <b>{years} yıl</b> boyunca ayda <b>{monthly.toLocaleString()} TL</b> biriktirirsen:
        </Typography>
        <Stack spacing={0.5} sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            💰 Kendi birikimin: <b>{last.personal.toLocaleString()} TL</b>
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            🏛️ Devlet katkısı: <b>{last.govt.toLocaleString()} TL</b>
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            📊 Getiri: <b>{totalReturn.toLocaleString()} TL</b>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
            🎯 Toplam birikim: <b>{last.total.toLocaleString()} TL</b>
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
          Devlet katkısı olmasaydı: <b>{last.personal.toLocaleString()} TL</b> (devlet katkısı <b>{last.govt.toLocaleString()} TL</b> ekstra)
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Grafik: Birikim + Devlet Katkısı
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="y" tickFormatter={(v) => `${v}y`} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip
                formatter={(value: any, name) => {
                  if (name === 'personal') return [`${Math.round(value).toLocaleString()} TL`, 'Kendi birikim'];
                  if (name === 'govt') return [`${Math.round(value).toLocaleString()} TL`, 'Devlet katkısı'];
                  if (name === 'total') return [`${Math.round(value).toLocaleString()} TL`, 'Toplam'];
                  return [value, name];
                }}
                labelFormatter={(label) => `${label}. yıl`}
              />
              <Legend />
              <Line type="monotone" dataKey="personal" stroke="#1976d2" dot={false} strokeWidth={2} name="Kendi birikim" />
              <Line type="monotone" dataKey="govt" stroke="#388e3c" dot={false} strokeWidth={2} name="Devlet katkısı" />
              <Line type="monotone" dataKey="total" stroke="#f59e0b" dot={false} strokeWidth={2} name="Toplam" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Stack>
  );
}
