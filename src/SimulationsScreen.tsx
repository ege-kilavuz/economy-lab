import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import { InflationModule } from './modules/inflation';
import { InterestModule } from './modules/interest';
import { CentralBankModule } from './modules/centralBank';
import { loadProgress, markSimulationOpened } from './ui/progress';

type SimId = 'inflation' | 'interest' | 'central';

type SimMeta = {
  id: SimId;
  title: string;
  short: string;
  goals: string[];
  inputs: string[];
  minutes: number;
  level: 'Başlangıç' | 'Orta';
  format: 'Grafik' | 'Karar deneyi' | 'Hızlı karşılaştırma';
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
    short: 'Faiz, enflasyon, işsizlik ve büyüme arasındaki trade-off’u gözlemle.',
    goals: ['Faiz kararının etkilerini denge olarak görmek', 'Arz/talep şoklarının etkisini ayırt etmek'],
    inputs: ['Politika faizi', 'Arz şoku', 'Talep ısısı'],
    minutes: 6,
    level: 'Orta',
    format: 'Karar deneyi',
    bestFor: 'Sınıfta neden-sonuç tartışması açmak için',
    teacherPrompts: ['Faiz artışı kime iyi, kime zor gelebilir?', 'Arz şoku ile talep şokunda aynı karar işe yarar mı?'],
    debrief: 'Kapanış: makro politikada tek tuşla herkes kazanmaz; her kararın bedeli ve hedefi vardır.',
  },
];

function SimCard({ sim, onOpen, teacherMode }: { sim: SimMeta; onOpen: () => void; teacherMode: boolean }) {
  return (
    <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Box>
            <Typography fontWeight={900}>{sim.title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>{sim.short}</Typography>
          </Box>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            <Chip size="small" label={`${sim.minutes} dk`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
            <Chip size="small" label={sim.level} sx={{ bgcolor: 'rgba(96,165,250,0.18)', color: 'white' }} />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
          <Chip size="small" label={sim.format} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.18)' }} />
          <Chip size="small" label={sim.bestFor} sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.92)' }} />
        </Stack>

        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800, display: 'block' }}>Öğrenme hedefi</Typography>
          {sim.goals.map((g) => (
            <Typography key={g} variant="caption" sx={{ opacity: 0.7, display: 'block' }}>• {g}</Typography>
          ))}
        </Box>

        <Divider sx={{ my: 1.25, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box>
          <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800, display: 'block' }}>Girdiler</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>{sim.inputs.join(' · ')}</Typography>
        </Box>

        {teacherMode ? (
          <Box sx={{ mt: 1.25 }}>
            <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 800, display: 'block' }}>Öğretmen soruları</Typography>
            {sim.teacherPrompts.map((prompt) => (
              <Typography key={prompt} variant="caption" sx={{ opacity: 0.74, display: 'block' }}>• {prompt}</Typography>
            ))}
          </Box>
        ) : null}

        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button variant="contained" size="small" onClick={onOpen}>Simülasyonu aç</Button>
          <Button variant="outlined" size="small" onClick={onOpen}>İçeriğe git</Button>
        </Stack>
      </CardContent>
    </Card>
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
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      <Typography variant="subtitle1" fontWeight={900}>🎯 Simülasyonlar</Typography>
      <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
        Finansal okuryazarlık ve Merkez Bankası temalarını kısa, sınıf içi kullanıma uygun mini laboratuvarlarla gösterir.
      </Typography>

      <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(96,165,250,0.12)', color: 'white', border: '1px solid rgba(96,165,250,0.24)' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            <Typography fontWeight={950}>Hızlı seçim rehberi</Typography>
            <FormControlLabel
              control={<Switch checked={teacherMode} onChange={(_, checked) => setTeacherMode(checked)} />}
              label={<Typography variant="body2" sx={{ color: 'white' }}>Öğretmen modu</Typography>}
              sx={{ m: 0 }}
            />
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            <Chip size="small" label={`Açılan laboratuvar: ${progress.openedSimulationIds.length}/${SIMS.length}`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
            <Chip
              size="small"
              label={progress.lastPlayedAt ? `Son oyun: ${new Date(progress.lastPlayedAt).toLocaleDateString('tr-TR')}` : 'Henüz oyun açılmadı'}
              sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }}
            />
          </Stack>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.88 }}>
            Yeni başlayan biri için önce alım gücü ve bütçe mantığı, sonra kredi/yatırım, en sonda Merkez Bankası etkisi en okunur akış oluyor.
          </Typography>
          {teacherMode ? (
            <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.82 }}>
              Sınıf kullanımı: önce tahmin al, sonra simülasyonu aç, en sonda kapanış cümlesiyle ana fikri sabitle.
            </Typography>
          ) : null}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
            <Chip size="small" label="1. Alım gücü" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
            <Chip size="small" label="2. Borç vs birikim" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
            <Chip size="small" label="3. Politika etkisi" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.75} sx={{ mt: 2 }}>
        {SIMS.map((sim) => (
          <SimCard key={sim.id} sim={sim} teacherMode={teacherMode} onOpen={() => openSimulation(sim.id)} />
        ))}
      </Stack>
    </Box>
  );
}
