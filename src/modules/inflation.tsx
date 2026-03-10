import { Box, Paper, Slider, Stack, Typography } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPct } from '../ui/format';

function computeSeries(params: {
  months: number;
  monthlyIncome: number;
  inflationMonthlyPct: number;
  basket0: number;
  incomeIndex: number;
}) {
  const { months, monthlyIncome, inflationMonthlyPct, basket0, incomeIndex } = params;

  const series: Array<{
    m: number;
    basket: number;
    realIncome: number;
    realIncomeIndex: number;
  }> = [];

  const inflation = inflationMonthlyPct / 100;

  for (let m = 0; m <= months; m++) {
    const basket = basket0 * Math.pow(1 + inflation, m);
    const incomeGrowth = 1 + inflation * (incomeIndex / 100);
    const nominalIncome = monthlyIncome * Math.pow(incomeGrowth, m);
    const realIncome = nominalIncome / Math.pow(1 + inflation, m);
    const realIncomeIndex = (realIncome / monthlyIncome) * 100;
    series.push({ m, basket, realIncome, realIncomeIndex });
  }

  return series;
}

export function InflationModule() {
  const [monthlyIncome, setMonthlyIncome] = React.useState(25000);
  const [basket0, setBasket0] = React.useState(12000);
  const [inflationMonthlyPct, setInflationMonthlyPct] = React.useState(3.0);
  const [months, setMonths] = React.useState(24);
  const [incomeIndex, setIncomeIndex] = React.useState(0); // 0 = maaş sabit, 100 = enflasyon kadar artış

  const data = computeSeries({ months, monthlyIncome, inflationMonthlyPct, basket0, incomeIndex });

  const basketEnd = data[data.length - 1]?.basket ?? basket0;
  const realIncomeEndIndex = data[data.length - 1]?.realIncomeIndex ?? 100;

  const headline =
    realIncomeEndIndex >= 90
      ? 'Alım gücü küçük bir düşüş yaşadı.'
      : realIncomeEndIndex >= 70
        ? 'Alım gücü belirgin şekilde eridi.'
        : 'Alım gücü ciddi şekilde eridi.';

  const feeling =
    realIncomeEndIndex >= 90
      ? 'Hissiyat: dengeli — küçük ayarlamalar yeter.'
      : realIncomeEndIndex >= 70
        ? 'Hissiyat: baskı artıyor — gideri optimize et, ek gelir ara.'
        : 'Hissiyat: stres yüksek — sepeti küçültmek veya gelir artırmak şart.';

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Enflasyon Laboratuvarı
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
          Sepet fiyatı artarken maaş aynı kalırsa (nominal sabit), alım gücü nasıl değişir?
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography fontWeight={600}>Aylık gelir (TL): {monthlyIncome.toLocaleString()}</Typography>
              <Slider
                value={monthlyIncome}
                min={5000}
                max={100000}
                step={500}
                onChange={(_, v) => setMonthlyIncome(v as number)}
              />
            </Box>
            <Box>
              <Typography fontWeight={600}>Başlangıç sepeti (TL): {basket0.toLocaleString()}</Typography>
              <Slider value={basket0} min={1000} max={60000} step={250} onChange={(_, v) => setBasket0(v as number)} />
            </Box>
            <Box>
              <Typography fontWeight={600}>Aylık enflasyon: {formatPct(inflationMonthlyPct, 1)}</Typography>
              <Slider
                value={inflationMonthlyPct}
                min={0}
                max={15}
                step={0.1}
                onChange={(_, v) => setInflationMonthlyPct(v as number)}
              />
            </Box>
            <Box>
              <Typography fontWeight={600}>Maaş artışı endeksi: %{incomeIndex}</Typography>
              <Slider value={incomeIndex} min={0} max={100} step={5} onChange={(_, v) => setIncomeIndex(v as number)} />
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                0 = maaş sabit · 100 = maaş enflasyon kadar artar
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={600}>Süre: {months} ay</Typography>
              <Slider value={months} min={6} max={60} step={1} onChange={(_, v) => setMonths(v as number)} />
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700}>Sonuç</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          {headline} {months}. ayda sepet yaklaşık <b>{basketEnd.toLocaleString()} TL</b> olur.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          Reel maaş endeksi yaklaşık <b>%{realIncomeEndIndex.toFixed(0)}</b> seviyesinde.
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
          {feeling}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Grafik: Sepet vs reel maaş endeksi
        </Typography>
        <Box sx={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" tickFormatter={(v) => `${v}a`} />
              <YAxis yAxisId="left" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 110]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(value: any, name) => {
                  if (name === 'basket') return [`${Math.round(value).toLocaleString()} TL`, 'Sepet'];
                  if (name === 'realIncomeIndex') return [`%${Number(value).toFixed(0)}`, 'Reel maaş endeksi'];
                  return [value, name];
                }}
                labelFormatter={(label) => `${label}. ay`}
              />
              <Line yAxisId="left" type="monotone" dataKey="basket" stroke="#1976d2" dot={false} strokeWidth={2} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="realIncomeIndex"
                stroke="#d32f2f"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Stack>
  );
}

import React from 'react';
