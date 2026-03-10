import React from 'react';
import { Box, Paper, Slider, Stack, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPct } from '../ui/format';

function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

function compoundGrowth(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  return principal * Math.pow(1 + r, months);
}

export function InterestModule() {
  const [principal, setPrincipal] = React.useState(100000);
  const [annualRatePct, setAnnualRatePct] = React.useState(45);
  const [months, setMonths] = React.useState(24);

  const pay = monthlyPayment(principal, annualRatePct, months);
  const total = pay * months;
  const totalInterest = total - principal;

  const compound = compoundGrowth(principal, annualRatePct, months);

  const installmentRatio = pay / Math.max(1, principal * 0.06); // toy ratio
  const stressLabel =
    pay > principal * 0.06
      ? 'Hissiyat: baskı yüksek — taksit yükü ağır.'
      : pay > principal * 0.04
        ? 'Hissiyat: dikkat — taksit yükü artıyor.'
        : 'Hissiyat: yönetilebilir.';

  const bars = [
    { k: 'Anapara', v: principal },
    { k: 'Toplam ödeme', v: total },
    { k: 'Faiz maliyeti', v: totalInterest },
  ];

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Faiz & Kredi Laboratuvarı
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
          Aynı oran hem borçta maliyet, hem birikimde büyüme demek. Sayılarla görelim.
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box>
            <Typography fontWeight={600}>Anapara (TL): {principal.toLocaleString()}</Typography>
            <Slider value={principal} min={1000} max={500000} step={1000} onChange={(_, v) => setPrincipal(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Yıllık faiz: {formatPct(annualRatePct, 0)}</Typography>
            <Slider value={annualRatePct} min={0} max={150} step={1} onChange={(_, v) => setAnnualRatePct(v as number)} />
          </Box>
          <Box>
            <Typography fontWeight={600}>Vade: {months} ay</Typography>
            <Slider value={months} min={3} max={60} step={1} onChange={(_, v) => setMonths(v as number)} />
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>Kredi sonucu (eşit taksit)</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          Aylık taksit yaklaşık <b>{Math.round(pay).toLocaleString()} TL</b>. Toplam geri ödeme <b>{Math.round(total).toLocaleString()} TL</b>.
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          Faiz maliyeti yaklaşık <b>{Math.round(totalInterest).toLocaleString()} TL</b>.
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          {stressLabel}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>Aynı oranla birikim büyümesi (bileşik)</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          {months} ay sonunda {principal.toLocaleString()} TL, yaklaşık <b>{Math.round(compound).toLocaleString()} TL</b> olur.
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Grafik
        </Typography>
        <Box sx={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={bars} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="k" />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: any) => `${Math.round(v).toLocaleString()} TL`} />
              <Bar dataKey="v" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Stack>
  );
}
