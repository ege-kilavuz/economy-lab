import React from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import { InflationModule } from './modules/inflation';
import { InterestModule } from './modules/interest';
import { CentralBankModule } from './modules/centralBank';

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
  },
];

function SimCard({ sim, onOpen }: { sim: SimMeta; onOpen: () => void }) {
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

  const activeMeta = SIMS.find((s) => s.id === selected);

  if (selected) {
    return (
      <Box sx={{ pt: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Button startIcon={<ArrowBackRounded />} onClick={() => setSelected(null)} sx={{ color: 'white' }}>
            Geri
          </Button>
          <Typography fontWeight={900}>{activeMeta?.title}</Typography>
        </Stack>

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
        Hızlı, öğretmen sunumuna uygun mini laboratuvarlar.
      </Typography>

      <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(96,165,250,0.12)', color: 'white', border: '1px solid rgba(96,165,250,0.24)' }}>
        <CardContent>
          <Typography fontWeight={950}>Hızlı seçim rehberi</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.88 }}>
            Yeni başlayan biri için önce Enflasyon → Faiz & Kredi → Merkez Bankası sırası en okunur akış oluyor.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
            <Chip size="small" label="1. Alım gücü" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
            <Chip size="small" label="2. Borç vs birikim" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
            <Chip size="small" label="3. Politika etkisi" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'white' }} />
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.75} sx={{ mt: 2 }}>
        {SIMS.map((sim) => (
          <SimCard key={sim.id} sim={sim} onOpen={() => setSelected(sim.id)} />
        ))}
      </Stack>
    </Box>
  );
}
