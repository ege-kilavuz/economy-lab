import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material';

type MonthResult = {
  month: number;
  income: number;
  expenses: number;
  debtPayment: number;
  invest: number;
  emergencySave: number;
  eventText?: string;
  net: number;
  cashEnd: number;
  debtEnd: number;
  investEnd: number;
  emergencyEnd: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function roundTL(n: number) {
  return Math.round(n);
}

// Educational toy model.
// We simulate 12 months of income/expenses + debt + emergency fund + investing.
// This is not financial advice.

const EVENTS: Array<{ p: number; title: string; apply: (s: SimState) => SimState } > = [
  {
    p: 0.18,
    title: 'Telefon bozuldu (beklenmedik gider) - 4.000 TL',
    apply: (s) => ({ ...s, cash: s.cash - 4000 }),
  },
  {
    p: 0.14,
    title: 'Sağlık gideri - 2.500 TL',
    apply: (s) => ({ ...s, cash: s.cash - 2500 }),
  },
  {
    p: 0.12,
    title: 'Ufak ek gelir (freelance) + 2.000 TL',
    apply: (s) => ({ ...s, cash: s.cash + 2000 }),
  },
  {
    p: 0.10,
    title: 'İş görüşmesi/sertifika masrafı - 1.500 TL',
    apply: (s) => ({ ...s, cash: s.cash - 1500 }),
  },
];

function pickEvent(rng: () => number) {
  const x = rng();
  let acc = 0;
  for (const e of EVENTS) {
    acc += e.p;
    if (x < acc) return e;
  }
  return null;
}

// Deterministic RNG so the same "seed" produces same run.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type SimState = {
  month: number;
  income: number;
  cash: number;
  debt: number;
  invest: number;
  emergency: number;
  score: number;
  history: MonthResult[];
  seed: number;
};

const DEFAULT_INCOME = 17002; // approx 2024/2025 TR min-wage-ish, placeholder

export function LifeSimModule() {
  const [baseIncome, setBaseIncome] = React.useState(DEFAULT_INCOME);

  // spending plan sliders (percent of income)
  const [needsPct, setNeedsPct] = React.useState(55); // rent+food+transport
  const [wantsPct, setWantsPct] = React.useState(20);
  const [debtPayPct, setDebtPayPct] = React.useState(10);
  const [emergencyPct, setEmergencyPct] = React.useState(10);
  const [investPct, setInvestPct] = React.useState(5);

  const pctSum = needsPct + wantsPct + debtPayPct + emergencyPct + investPct;

  const [sim, setSim] = React.useState<SimState | null>(null);

  function start() {
    const seed = Date.now() % 100000;
    setSim({
      month: 1,
      income: baseIncome,
      cash: 0,
      debt: 20000, // starts with some debt
      invest: 0,
      emergency: 0,
      score: 0,
      history: [],
      seed,
    });
  }

  function reset() {
    setSim(null);
  }

  function runOneMonth() {
    if (!sim) return;

    // Normalize plan if not 100% (we clamp but keep educational)
    const sum = pctSum;
    const norm = sum === 0 ? 1 : sum / 100;

    const income = sim.income;
    const needs = roundTL((income * (needsPct / 100)) / norm);
    const wants = roundTL((income * (wantsPct / 100)) / norm);
    const plannedDebtPay = roundTL((income * (debtPayPct / 100)) / norm);
    const plannedEmergency = roundTL((income * (emergencyPct / 100)) / norm);
    const plannedInvest = roundTL((income * (investPct / 100)) / norm);

    // debt interest monthly ~ 3.5% toy
    const debtInterest = sim.debt * 0.035;
    let debt = sim.debt + debtInterest;

    let cash = sim.cash + income;

    // pay needs + wants
    cash -= needs + wants;

    // apply event
    const rng = mulberry32(sim.seed + sim.month * 997);
    const ev = pickEvent(rng);
    let eventText: string | undefined;
    if (ev) {
      const before = { ...sim, cash };
      const after = ev.apply(before);
      cash = after.cash;
      eventText = ev.title;
    }

    // If cash goes negative, it becomes new debt (credit card / overdraft) with penalty
    let scoreDelta = 0;

    // debt payment (cannot exceed cash)
    const debtPayment = clamp(plannedDebtPay, 0, Math.max(0, cash));
    cash -= debtPayment;
    debt = Math.max(0, debt - debtPayment);

    // emergency saving
    const emergencySave = clamp(plannedEmergency, 0, Math.max(0, cash));
    cash -= emergencySave;

    // invest
    const invest = clamp(plannedInvest, 0, Math.max(0, cash));
    cash -= invest;

    // if still negative -> convert to debt
    if (cash < 0) {
      debt += Math.abs(cash);
      cash = 0;
      scoreDelta -= 20; // debt spiral penalty
    }

    // investment grows monthly ~ 1.2% toy
    const investEnd = (sim.invest + invest) * 1.012;

    const emergencyEnd = sim.emergency + emergencySave;

    // score rules (simple & transparent)
    // - emergency fund progress
    // - keep debt going down
    // - don't overspend wants too much
    if (emergencySave > 0) scoreDelta += 5;
    if (debtPayment > 0) scoreDelta += 5;
    if (debt < sim.debt) scoreDelta += 5;
    if (wantsPct <= 25) scoreDelta += 3;
    if (cash >= 0) scoreDelta += 2;
    if (debt > sim.debt + 1000) scoreDelta -= 10;

    // "needs met" proxy: if needs budget exists and cash didn't go negative
    if (needsPct >= 45 && cash >= 0) scoreDelta += 3;

    const expenses = needs + wants;

    const monthResult: MonthResult = {
      month: sim.month,
      income,
      expenses,
      debtPayment,
      invest,
      emergencySave,
      eventText,
      net: income - expenses - debtPayment - invest - emergencySave,
      cashEnd: cash,
      debtEnd: debt,
      investEnd: investEnd,
      emergencyEnd,
    };

    const next: SimState = {
      ...sim,
      month: sim.month + 1,
      cash,
      debt,
      invest: investEnd,
      emergency: emergencyEnd,
      score: sim.score + scoreDelta,
      history: [...sim.history, monthResult],
    };

    setSim(next);
  }

  const finished = sim && sim.month > 12;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          İlk Maaş Simülasyonu (Prototype)
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
          Amaç: Asgari ücret seviyesinde bir gelirle 12 ay boyunca giderleri, borcu, acil durum fonunu ve küçük bir yatırımı dengelemek.
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
          Not: Bu eğitim amaçlı oyuncak modeldir. Rakamlar/etkiler basitleştirilmiştir.
        </Typography>
      </Paper>

      {!sim && (
        <Paper sx={{ p: 2 }}>
          <Typography fontWeight={700}>Başlangıç</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography fontWeight={600}>Aylık gelir (TL): {baseIncome.toLocaleString()}</Typography>
            <Slider value={baseIncome} min={8000} max={60000} step={250} onChange={(_, v) => setBaseIncome(v as number)} />
          </Box>
          <Button variant="contained" sx={{ mt: 1 }} onClick={start}>
            Başlat
          </Button>
        </Paper>
      )}

      {sim && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography fontWeight={800}>Ay {Math.min(sim.month, 12)}/12</Typography>
            <Chip label={`Skor: ${sim.score}`} />
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Planın (yüzde)
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Toplam: {pctSum}% (100% ideal). Toplam 100 değilse otomatik normalize ediyoruz.
          </Typography>

          <Stack spacing={1.25} sx={{ mt: 1 }}>
            <Box>
              <Typography fontWeight={600}>İhtiyaçlar (kira+yemek+ulaşım): {needsPct}%</Typography>
              <Slider value={needsPct} min={20} max={80} step={1} onChange={(_, v) => setNeedsPct(v as number)} />
            </Box>
            <Box>
              <Typography fontWeight={600}>İstekler (eğlence/alışveriş): {wantsPct}%</Typography>
              <Slider value={wantsPct} min={0} max={40} step={1} onChange={(_, v) => setWantsPct(v as number)} />
            </Box>
            <Box>
              <Typography fontWeight={600}>Borç ödemesi: {debtPayPct}%</Typography>
              <Slider value={debtPayPct} min={0} max={40} step={1} onChange={(_, v) => setDebtPayPct(v as number)} />
            </Box>
            <Box>
              <Typography fontWeight={600}>Acil durum fonu: {emergencyPct}%</Typography>
              <Slider value={emergencyPct} min={0} max={40} step={1} onChange={(_, v) => setEmergencyPct(v as number)} />
            </Box>
            <Box>
              <Typography fontWeight={600}>Yatırım: {investPct}%</Typography>
              <Slider value={investPct} min={0} max={30} step={1} onChange={(_, v) => setInvestPct(v as number)} />
            </Box>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          {!finished ? (
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={runOneMonth}>
                Bu ayı oyna
              </Button>
              <Button variant="outlined" onClick={reset}>
                Sıfırla
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={reset}>
                Yeniden dene
              </Button>
            </Stack>
          )}
        </Paper>
      )}

      {sim && sim.history.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography fontWeight={800}>Durum</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            Nakit: <b>{roundTL(sim.cash).toLocaleString()} TL</b> · Borç: <b>{roundTL(sim.debt).toLocaleString()} TL</b> · Acil fon: <b>{roundTL(sim.emergency).toLocaleString()} TL</b> · Yatırım: <b>{roundTL(sim.invest).toLocaleString()} TL</b>
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography fontWeight={700}>Son ay özeti</Typography>
          {(() => {
            const last = sim.history[sim.history.length - 1];
            if (!last) return null;
            return (
              <Box sx={{ mt: 0.5 }}>
                {last.eventText && (
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Olay: <b>{last.eventText}</b>
                  </Typography>
                )}
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Gelir: {roundTL(last.income).toLocaleString()} · Gider: {roundTL(last.expenses).toLocaleString()} · Borç ödeme: {roundTL(last.debtPayment).toLocaleString()} · Acil fon: {roundTL(last.emergencySave).toLocaleString()} · Yatırım: {roundTL(last.invest).toLocaleString()}
                </Typography>
              </Box>
            );
          })()}
        </Paper>
      )}

      {finished && sim && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={900}>
            12 ay sonucu
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            Skor: <b>{sim.score}</b>
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {sim.debt <= 5000 && sim.emergency >= sim.income * 1 ? (
              <>Harika: Borç kontrol altında ve en az 1 aylık acil durum fonu oluşturdun.</>
            ) : sim.debt > 30000 ? (
              <>Zor bir yıl: Borç yükseldi. İstekleri kıs + acil fonu öncele + borç ödemesini artır.</>
            ) : (
              <>Fena değil: Dengeyi kurmaya yaklaştın. 1 aylık acil fon hedefle ve borcu kademeli azalt.</>
            )}
          </Typography>

          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, opacity: 0.7 }}>
            İpucu: İstekleri (wants) %15–20 bandında tutmak ve acil fona düzenli pay ayırmak çoğu senaryoda borç şoklarını azaltır.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}
