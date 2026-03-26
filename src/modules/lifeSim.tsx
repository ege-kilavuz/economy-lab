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
import {
  createLifeSim,
  DEFAULT_INCOME,
  roundTL,
  runLifeSimMonth,
  type LifeSimPlan,
  type LifeSimState,
} from '../game/lifeSimEngine';

export function LifeSimModule() {
  const [baseIncome, setBaseIncome] = React.useState(DEFAULT_INCOME);

  // spending plan sliders (percent of income)
  const [needsPct, setNeedsPct] = React.useState(55); // rent+food+transport
  const [wantsPct, setWantsPct] = React.useState(20);
  const [debtPayPct, setDebtPayPct] = React.useState(10);
  const [emergencyPct, setEmergencyPct] = React.useState(10);
  const [investPct, setInvestPct] = React.useState(5);

  const pctSum = needsPct + wantsPct + debtPayPct + emergencyPct + investPct;

  const [sim, setSim] = React.useState<LifeSimState | null>(null);

  function start() {
    setSim(createLifeSim(baseIncome));
  }

  function reset() {
    setSim(null);
  }

  function runOneMonth() {
    if (!sim) return;

    const plan: LifeSimPlan = {
      needsPct,
      wantsPct,
      debtPayPct,
      emergencyPct,
      investPct,
    };

    setSim(runLifeSimMonth(sim, plan).state);
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
          Burada hissiyat (dayanıklılık) düşerse bir sonraki ay gelir düşebilir ve olumsuz olaylar artabilir.
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
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
            Hissiyat/Dayanıklılık: <b>{sim.wellbeing}</b> · Sonraki ay gelir: <b>{roundTL(sim.income).toLocaleString()} TL</b>
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
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                  Hissiyat: {last.wellbeingEnd} · Gelecek ay gelir: {roundTL(last.nextIncome).toLocaleString()} TL
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
