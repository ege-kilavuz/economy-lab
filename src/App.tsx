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
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import SportsEsportsRounded from '@mui/icons-material/SportsEsportsRounded';

// PhoneFrame is used only inside the game module
import { LearnScreen } from './LearnScreen';
import { MonthSimModule } from './modules/monthSim';
import { SimulationsScreen } from './SimulationsScreen';

type RootTab = 'learn' | 'play';
type PlayView = 'month' | 'sims';

export default function App() {
  const [tab, setTab] = React.useState<RootTab>('learn');
  const [playView, setPlayView] = React.useState<PlayView>('sims');
  const [events, setEvents] = React.useState<string[]>([]);
  const [summary, setSummary] = React.useState<{ cash: number; cardDebt: number; mood: number; day: number } | null>(null);
  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  const title = tab === 'learn' ? 'Öğren' : playView === 'sims' ? 'Simülasyonlar' : 'Oyun';
  const playSubtitle =
    playView === 'sims'
      ? 'Kısa laboratuvarlar: tek kavrama odaklan, sonucu hemen gör.'
      : '30 günlük telefon akışı: bütçe, borç, moral ve yatırım aynı yerde.';

  const pushEvent = React.useCallback((msg: string) => {
    setEvents((prev) => [msg, ...prev].slice(0, 12));
  }, []);

  const tags = React.useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      const match = e.match(/^\[(.+?)\]\s/);
      if (match?.[1]) set.add(match[1]);
    }
    return Array.from(set);
  }, [events]);

  const visibleEvents = React.useMemo(() => {
    if (activeTags.length === 0) return events;
    return events.filter((e) => {
      const match = e.match(/^\[(.+?)\]\s/);
      const tag = match?.[1];
      return tag ? activeTags.includes(tag) : false;
    });
  }, [events, activeTags]);

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#0b1220', color: 'white' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(11,18,32,0.92)', color: 'white' }}>
          <Toolbar sx={{ px: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 950, flex: 1, textAlign: 'center' }}>
              Finans & Ekonomi (Prototype) · {title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ py: 1.5, pb: 10 }}>
          <Container maxWidth="md" sx={{ px: 1.5 }}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.04)', p: 1.5 }}>
                <Typography fontWeight={900}>Etki-Tepki Akışı</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Oyunda olanlar uygulama genelinde burada görünür.
                </Typography>
                {summary ? (
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip size="small" label={`Gün ${summary.day}/30`} />
                      <Chip size="small" label={`Nakit: ${Math.round(summary.cash).toLocaleString()} TL`} />
                      <Chip size="small" label={`Kart: ${Math.round(summary.cardDebt).toLocaleString()} TL`} color={summary.cardDebt > 0 ? 'warning' : 'default'} />
                      <Chip size="small" label={`Moral: ${summary.mood}%`} color={summary.mood < 45 ? 'error' : summary.mood < 60 ? 'warning' : 'default'} />
                    </Stack>
                  </Box>
                ) : null}

                {tags.length ? (
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {tags.map((tag) => {
                        const active = activeTags.includes(tag);
                        return (
                          <Chip
                            key={tag}
                            size="small"
                            label={tag}
                            variant={active ? 'filled' : 'outlined'}
                            onClick={() =>
                              setActiveTags((prev) =>
                                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            sx={{ cursor: 'pointer', fontWeight: active ? 800 : 500, bgcolor: active ? 'rgba(96,165,250,0.3)' : undefined }}
                          />
                        );
                      })}
                      {activeTags.length ? (
                        <Chip size="small" label="Temizle" onClick={() => setActiveTags([])} sx={{ cursor: 'pointer' }} />
                      ) : null}
                    </Stack>
                  </Box>
                ) : null}

                <Box sx={{ mt: 1 }}>
                  {visibleEvents.length ? (
                    visibleEvents.slice(0, 6).map((e, i) => (
                      <Typography key={`${e}-${i}`} variant="body2" sx={{ opacity: 0.85 }}>
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
            </Box>

            {tab === 'learn' ? (
              <LearnScreen />
            ) : (
              <>
                <Box sx={{ mb: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(255,255,255,0.04)', p: 1.5 }}>
                  <Typography fontWeight={900}>Oyna modu</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.78 }}>
                    {playSubtitle}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    <Chip size="small" label={playView === 'sims' ? 'Hızlı mod aktif' : 'Uzun mod aktif'} sx={{ bgcolor: 'rgba(96,165,250,0.22)', color: 'white' }} />
                    <Chip size="small" label={summary ? `Aktif gün: ${summary.day}` : 'Henüz aktif oyun yok'} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
                  </Stack>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <Button
                    variant={playView === 'sims' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setPlayView('sims')}
                    sx={playView === 'sims' ? { fontWeight: 900 } : { borderColor: 'rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.9)' }}
                  >
                    Simülasyonlar
                  </Button>
                  <Button
                    variant={playView === 'month' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setPlayView('month')}
                    sx={playView === 'month' ? { fontWeight: 900 } : { borderColor: 'rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.9)' }}
                  >
                    1 Ay Ekonomi
                  </Button>
                </Box>

                {playView === 'sims' ? (
                  <SimulationsScreen />
                ) : (
                  <MonthSimModule
                    onEvent={pushEvent}
                    onSummary={(s) => setSummary({ cash: s.cash, cardDebt: s.cardDebt, mood: s.mood, day: s.day })}
                  />
                )}
              </>
            )}
          </Container>
        </Box>

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
            sx={{ bgcolor: 'transparent', '& .MuiBottomNavigationAction-label': { color: 'rgba(255,255,255,0.8)' } }}
          >
            <BottomNavigationAction value="learn" label="Öğren" icon={<SchoolRounded />} />
            <BottomNavigationAction value="play" label="Oyna" icon={<SportsEsportsRounded />} />
          </BottomNavigation>
        </Box>
      </Box>
    </>
  );
}
