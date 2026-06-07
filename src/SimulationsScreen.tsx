import React from 'react';
import { Box, Button, Card, CardContent, Chip, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import { InflationModule } from './modules/inflation';
import { InterestModule } from './modules/interest';
import { CentralBankModule } from './modules/centralBank';
import { BESModule } from './modules/bes';
import { loadProgress, markSimulationOpened } from './ui/progress';

type SimId = 'inflation' | 'interest' | 'central' | 'bes';

type SimMeta = {
  id: SimId;
  title: string;
  short: string;
  goals: string[];
  inputs: string[];
  minutes: number;
  level: 'Başlangıç' | 'Orta';
  format: 'Grafik' | 'Karar deneyi' | 'Hızlı karşılaştırma' | 'Simülasyon';
  bestFor: string;
  teacherPrompts: string[];
  debrief: string;
};

const SIMS: SimMeta[] = [
  {
    id: 'inflation',
    title: 'Enflasyon Laboratuvarı',
    short: 'Sepet fiyatı artarken maaş sabit kalırsa alım gücü nasıl erir?',
    goals: ['Enflasyonun alım gücüne etkisini görmek', 'Maaş artışı endeksiyle reel gelir farkını anlamak'],
    inputs: ['Aylık gelir', 'Başlangıç sepeti', 'Aylık enflasyon', 'Maaş artışı endeksi', 'Süre (ay)'],
    minutes: 6,
    level: 'Başlangıç',
    format: 'Grafik',
    bestFor: 'Alım gücü fikrini ilk kez anlatmak için',
    teacherPrompts: ['Aynı maaşla hangi üründen vazgeçmek zorunda kaldın?', 'Nominal artış neden yetmeyebilir?'],
    debrief: 'Kapanış: maaş artışı tek başına yeterli değil; fiyat artış hızı da önemli.',
  },
  {
    id: 'interest',
    title: 'Faiz & Kredi Laboratuvarı',
    short: 'Aynı oran borçta maliyet, birikimde büyüme demek.',
    goals: ['Taksit ve toplam geri ödeme farkını görmek', 'Bileşik getiriyi sayılarla kıyaslamak'],
    inputs: ['Anapara', 'Yıllık faiz', 'Vade (ay)'],
    minutes: 5,
    level: 'Başlangıç',
    format: 'Hızlı karşılaştırma',
    bestFor: 'Kredi ve birikim tarafını yan yana göstermek için',
    teacherPrompts: ['Aynı faiz neden borçta kötü, birikimde iyi hissediliyor?', 'Toplam geri ödeme hangi noktada şaşırtıcı hale geliyor?'],
    debrief: 'Kapanış: faiz bir araçtır; bağlam borç mu birikim mi olduğuna göre etkisi değişir.',
  },
  {
    id: 'central',
    title: 'Merkez Bankası Karar Odası',
    short: 'Faiz, enflasyon, işsizlik ve büyüme arasındaki trade-off\'u gözlemle.',
    goals: ['Faiz kararının etkilerini denge olarak görmek', 'Arz/talep şoklarının etkisini ayırt etmek'],
    inputs: ['Politika faizi', 'Arz şoku', 'Talep ısısı'],
    minutes: 6,
    level: 'Orta',
    format: 'Karar deneyi',
    bestFor: 'Sınıfta neden-sonuç tartışması açmak için',
    teacherPrompts: ['Faiz artışı kime iyi, kime zor gelebilir?', 'Arz şoku ile talep şokunda aynı karar işe yarar mı?'],
    debrief: 'Kapanış: makro politikada tek tuşla herkes kazanmaz; her kararın bedeli ve hedefi vardır.',
  },
  {
    id: 'bes',
    title: 'BES — Bireysel Emeklilik',
    short: 'Devlet katkısı %30 — erken başlayan biriktirir, geç başlayan koşar.',
    goals: ['Devlet katkısının birikime etkisini görmek', 'Erken başlamanın bileşik getiri gücünü anlamak'],
    inputs: ['Aylık katkı', 'Vade (yıl)', 'Yıllık getiri', 'Devlet katkısı'],
    minutes: 5,
    level: 'Başlangıç',
    format: 'Simülasyon',
    bestFor: 'Gençlere BES\'in mantığını anlatmak için',
    teacherPrompts: ['Devlet katkısı olmasa ne fark ederdi?', '10 yıl ile 20 yıl arasındaki fark neden bu kadar büyük?'],
    debrief: 'Kapanış: BES sadece birikim değil, devlet desteğiyle hızlanan bir bileşik getiri aracıdır.',
  },
];

const SIM_ICONS: Record<SimId, string> = {
  inflation: '📈',
  interest: '💹',
  central: '🏛️',
  bes: '💰',
};

const SIM_COLORS: Record<SimId, string> = {
  inflation: 'rgba(96,165,250,0.15)',
  interest: 'rgba(34,197,94,0.15)',
  central: 'rgba(250,204,21,0.15)',
  bes: 'rgba(168,85,247,0.15)',
};

const SIM_BORDERS: Record<SimId, string> = {
  inflation: 'rgba(96,165,250,0.25)',
  interest: 'rgba(34,197,94,0.25)',
  central: 'rgba(250,204,21,0.25)',
  bes: 'rgba(168,85,247,0.25)',
};

function SimCardSquare({ sim, onOpen, teacherMode, progress }: { sim: SimMeta; onOpen: () => void; teacherMode: boolean; progress: { openedSimulationIds: string[] } }) {
  const opened = progress.openedSimulationIds.includes(sim.id);
  return (
    <Box
      onClick={onOpen}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        aspectRatio: '1 / 1',
        borderRadius: 4,
        bgcolor: SIM_COLORS[sim.id],
        border: `1px solid ${SIM_BORDERS[sim.id]}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        p: { xs: 1.5, sm: 2 },
        '&:hover': {
          bgcolor: SIM_COLORS[sim.id].replace('0.15', '0.25'),
          borderColor: SIM_BORDERS[sim.id].replace('0.25', '0.4'),
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      }}
    >
      {/* Icon */}
      <Typography sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, lineHeight: 1, mb: 0.75 }}>
        {SIM_ICONS[sim.id]}
      </Typography>

      {/* Title */}
      <Typography
        fontWeight={900}
        sx={{
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          lineHeight: 1.3,
          mb: 0.5,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
        }}
      >
        {sim.title}
      </Typography>

      {/* Short description */}
      <Typography
        variant="caption"
        sx={{
          opacity: 0.72,
          fontSize: { xs: '0.55rem', sm: '0.6rem' },
          lineHeight: 1.3,
          mb: 0.75,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {sim.short}
      </Typography>

      {/* Chips row */}
      <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap" useFlexGap>
        <Chip size="small" label={`${sim.minutes}dk`} sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
        <Chip size="small" label={sim.level} sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
        {opened ? (
          <Chip size="small" label="✓" sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(34,197,94,0.2)', color: '#22c55e' }} />
        ) : (
          <Chip size="small" label="Yeni" sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(96,165,250,0.22)', color: '#60a5fa' }} />
        )}
      </Stack>

      {/* Teacher mode: mini prompt preview */}
      {teacherMode && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            opacity: 0.65,
            fontSize: '0.5rem',
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          💡 {sim.teacherPrompts[0]}
        </Typography>
      )}
    </Box>
  );
}

export function SimulationsScreen() {
  const [selected, setSelected] = React.useState<SimId | null>(null);
  const [progress, setProgress] = React.useState(() => loadProgress());
  const [teacherMode, setTeacherMode] = React.useState(false);

  const activeMeta = SIMS.find((s) => s.id === selected);

  function openSimulation(id: SimId) {
    setSelected(id);
    setProgress(markSimulationOpened(id));
  }

  if (selected) {
    return (
      <Box sx={{ pt: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Button startIcon={<ArrowBackRounded />} onClick={() => setSelected(null)} sx={{ color: 'white' }}>
            Geri
          </Button>
          <Typography fontWeight={900}>{activeMeta?.title}</Typography>
        </Stack>

        {teacherMode && activeMeta ? (
          <Card sx={{ mb: 2, borderRadius: 4, bgcolor: 'rgba(34,197,94,0.12)', color: 'white', border: '1px solid rgba(34,197,94,0.24)' }}>
            <CardContent>
              <Typography fontWeight={900}>Öğretmen modu özeti</Typography>
              {activeMeta.teacherPrompts.map((prompt) => (
                <Typography key={prompt} variant="body2" sx={{ mt: 0.6, opacity: 0.88 }}>
                  • {prompt}
                </Typography>
              ))}
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.92 }}>
                {activeMeta.debrief}
              </Typography>
            </CardContent>
          </Card>
        ) : null}

        {selected === 'inflation' && <InflationModule />}
        {selected === 'interest' && <InterestModule />}
        {selected === 'central' && <CentralBankModule />}
        {selected === 'bes' && <BESModule />}
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="subtitle1" fontWeight={900}>🎯 Simülasyonlar</Typography>
      <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5, mb: 1.5 }}>
        Finansal okuryazarlık ve Merkez Bankası temalarını kısa, sınıf içi kullanıma uygun mini laboratuvarlarla gösterir.
      </Typography>

      {/* Quick guide card */}
      <Card sx={{ mb: 2, borderRadius: 4, bgcolor: 'rgba(96,165,250,0.12)', color: 'white', border: '1px solid rgba(96,165,250,0.24)' }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            <Typography fontWeight={950}>Hızlı seçim rehberi</Typography>
            <FormControlLabel
              control={<Switch checked={teacherMode} onChange={(_, checked) => setTeacherMode(checked)} />}
              label={<Typography variant="body2" sx={{ color: 'white' }}>Öğretmen modu</Typography>}
              sx={{ m: 0 }}
            />
          </Stack>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
            <Chip size="small" label={`Açılan: ${progress.openedSimulationIds.length}/${SIMS.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white', height: 22 }} />
            <Chip size="small" label={`Son: ${progress.lastPlayedAt ? new Date(progress.lastPlayedAt).toLocaleDateString('tr-TR') : '—'}`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white', height: 22 }} />
          </Stack>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85, fontSize: '0.8rem' }}>
            Önerilen akış: Alım gücü → Kredi/Yatırım → Merkez Bankası
          </Typography>
        </CardContent>
      </Card>

      {/* ── 2-COLUMN SQUARE CARD GRID ── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: { xs: 1, sm: 1.5 },
      }}>
        {SIMS.map((sim) => (
          <SimCardSquare key={sim.id} sim={sim} teacherMode={teacherMode} progress={progress} onOpen={() => openSimulation(sim.id)} />
        ))}
      </Box>
    </Box>
  );
}
