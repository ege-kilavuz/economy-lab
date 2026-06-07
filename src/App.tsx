import React from 'react';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Fade,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import SportsEsportsRounded from '@mui/icons-material/SportsEsportsRounded';

import { LearnScreen } from './LearnScreen';
import { MonthSimModule } from './game/MonthSimModule';
import { SimulationsScreen } from './SimulationsScreen';

type RootTab = 'learn' | 'play';
type PlayView = 'month' | 'sims';

const TAGS = ['harcama', 'gelir', 'fatura', 'yatırım', 'kriz', 'başarı'] as const;

export default function App() {
  const [tab, setTab] = React.useState<RootTab>('learn');
  const [playView, setPlayView] = React.useState<PlayView>('sims');
  const [events, setEvents] = React.useState<string[]>([]);
  const [summary, setSummary] = React.useState<{ cash: number; cardDebt: number; mood: number; day: number } | null>(null);
  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  const today = new Date();
  const month = today.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', month: 'long' });
  const day = today.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric' });

  const playSubtitle = playView === 'sims'
    ? 'Simülasyon tabanlı hızlı finans senaryoları (birkaç dakikada biten).'
    : '30 günlük makro oyunu: her gün karar ver, bütçeni yönet.';

  const visibleEvents = React.useMemo(() => {
    if (activeTags.length === 0) return events;
    return events.filter((e) => {
      const match = e.match(/^\[(.+?)\]\s/);
      const tag = match?.[1]?.toLowerCase();
      return tag ? activeTags.includes(tag) : false;
    });
  }, [events, activeTags]);

  function pushEvent(text: string) {
    setEvents((prev) => [text, ...prev].slice(0, 30));
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

    React.useEffect(() => {
    // Native status bar: transparent bg + light icons for notch support
    (async () => {
      try {
        await StatusBar.setStyle({ style: StatusBarStyle.Dark });
        await StatusBar.setBackgroundColor({ color: '#0b1220' });
      } catch { /* web fallback */ }
    })();
  }, []);

  const showActivity = summary !== null || tab === 'play';

  return (
    <>
      <CssBaseline />
      <Box sx={{ bgcolor: '#0b1220', color: 'white', minHeight: '100dvh', overflowX: 'hidden', pt: 'env(safe-area-inset-top, 0px)' }}>
        {/* ─── HEADER ─── */}
        <AppBar position="sticky" sx={{ bgcolor: 'rgba(15,23,42,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)' }} elevation={0}>
          <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={950} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                  🧪 Ekonomi Laboratuvarı
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.65 }}>{day} {month}</Typography>
              </Box>
              <Chip size="small" label={tab === 'learn' ? 'Öğren' : 'Oyna'} sx={{ ml: 'auto', bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
            </Box>
          </Toolbar>
        </AppBar>

        {/* ─── MAIN CONTENT ─── */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 2 }, pb: 2, flex: 1 }}>
            {/* ── OYUN AKTİVİTESİ ── */}
            {showActivity && (
              <Box sx={{ mb: 2, mt: 1, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.04)', p: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.65 }}>OYUN AKTİVİTESİ</Typography>

                {/* Summary chips */}
                {summary && (
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1, mb: 1 }}>
                    <Chip size="small" label={`Gün ${summary.day}/30`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                    <Chip size="small" label={`Nakit: ${Math.round(summary.cash).toLocaleString()} TL`} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                    <Chip size="small" label={`Kart: ${Math.round(summary.cardDebt).toLocaleString()} TL`} sx={{ bgcolor: summary.cardDebt > 0 ? 'rgba(255,160,0,0.25)' : 'rgba(255,255,255,0.1)', color: 'white' }} />
                    <Chip size="small" label={`Moral: %${summary.mood}`} sx={{ bgcolor: summary.mood < 45 ? 'rgba(244,67,54,0.25)' : summary.mood < 60 ? 'rgba(255,160,0,0.25)' : 'rgba(255,255,255,0.1)', color: 'white' }} />
                  </Stack>
                )}

                {/* Tag filter chips */}
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  {TAGS.map((tag) => {
                    const active = activeTags.includes(tag);
                    return (
                      <Chip
                        key={tag}
                        size="small"
                        label={tag}
                        onClick={() => toggleTag(tag)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: active ? 800 : 500,
                          bgcolor: active ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.08)',
                          color: 'white',
                          '&:active': { transform: 'scale(0.96)' },
                        }}
                      />
                    );
                  })}
                  {activeTags.length > 0 && (
                    <Chip size="small" label="Temizle" onClick={() => setActiveTags([])} sx={{ cursor: 'pointer', bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }} />
                  )}
                </Stack>

                {/* Event list */}
                <Box sx={{ mt: 1 }}>
                  {visibleEvents.length > 0 ? (
                    visibleEvents.slice(0, 6).map((e, i) => (
                      <Typography key={`${e}-${i}`} variant="body2" sx={{ opacity: 0.85, py: 0.25 }}>
                        • {e}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      Henüz olay yok. Oyun içinden bir işlem yapınca burada görünecek.
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* ── TAB CONTENT ── */}
            <Fade in key={tab}>
              <Box>
                {tab === 'learn' ? (
                  <LearnScreen />
                ) : (
                  <>
                    {/* Oyna modu description */}
                    <Box sx={{ mb: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.04)', p: 1.5 }}>
                      <Typography fontWeight={900} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Oyna modu</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.78, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        {playSubtitle}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                        <Chip size="small" label={playView === 'sims' ? 'Hızlı mod aktif' : 'Uzun mod aktif'} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
                        <Chip size="small" label={summary ? `Aktif gün: ${summary.day}` : 'Henüz aktif oyun yok'} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                      </Stack>
                    </Box>

                    {/* Mod seçici butonlar — mobil-öncelikli, daha büyük touch hedefi */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                      <Button
                        variant={playView === 'sims' ? 'contained' : 'outlined'}
                        onClick={() => setPlayView('sims')}
                        fullWidth
                        sx={{
                          py: { xs: 1.2, sm: 0.8 },
                          fontSize: { xs: '0.85rem', sm: '0.875rem' },
                          fontWeight: playView === 'sims' ? 900 : 600,
                          minHeight: 44,
                          borderRadius: 2,
                          ...(playView !== 'sims' ? { borderColor: 'rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.9)' } : {}),
                        }}
                      >
                        Simülasyonlar
                      </Button>
                      <Button
                        variant={playView === 'month' ? 'contained' : 'outlined'}
                        onClick={() => setPlayView('month')}
                        fullWidth
                        sx={{
                          py: { xs: 1.2, sm: 0.8 },
                          fontSize: { xs: '0.85rem', sm: '0.875rem' },
                          fontWeight: playView === 'month' ? 900 : 600,
                          minHeight: 44,
                          borderRadius: 2,
                          ...(playView !== 'month' ? { borderColor: 'rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.9)' } : {}),
                        }}
                      >
                        1 Ay Ekonomi
                      </Button>
                    </Box>

                    <Fade in key={playView}>
                      <Box>
                        {playView === 'sims' ? (
                          <SimulationsScreen />
                        ) : (
                          <MonthSimModule
                            onEvent={pushEvent}
                            onSummary={(s) => setSummary({ cash: s.cash, cardDebt: s.cardDebt, mood: s.mood, day: s.day })}
                          />
                        )}
                      </Box>
                    </Fade>
                  </>
                )}
              </Box>
            </Fade>
          </Container>
        </Box>

        {/* ─── BOTTOM NAV ─── */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: 'rgba(15,23,42,0.92)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <BottomNavigation
            showLabels
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              bgcolor: 'transparent',
              '& .MuiBottomNavigationAction-label': { color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.7rem', sm: '0.75rem' } },
              '& .MuiBottomNavigationAction-root': { minHeight: { xs: 48, sm: 56 } },
              '& .Mui-selected .MuiBottomNavigationAction-label': { color: '#60a5fa', fontWeight: 700 },
              '& .Mui-selected svg': { color: '#60a5fa' },
            }}
          >
            <BottomNavigationAction value="learn" label="Öğren" icon={<SchoolRounded />} />
            <BottomNavigationAction value="play" label="Oyna" icon={<SportsEsportsRounded />} />
          </BottomNavigation>
        </Box>
      </Box>
    </>
  );
}
