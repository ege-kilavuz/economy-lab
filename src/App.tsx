import React from 'react';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import SportsEsportsRounded from '@mui/icons-material/SportsEsportsRounded';

import { PhoneFrame } from './ui/PhoneFrame';
import { LearnScreen } from './LearnScreen';
import { MonthSimModule } from './modules/monthSim';

type RootTab = 'learn' | 'play';

export default function App() {
  const [tab, setTab] = React.useState<RootTab>('learn');

  const title = tab === 'learn' ? 'Öğren' : 'Oyun';

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

        <Box sx={{ py: 1.5 }}>
          <Container maxWidth="md" sx={{ px: 1.5 }}>
            {tab === 'learn' ? (
              <LearnScreen />
            ) : (
              <PhoneFrame>
                <MonthSimModule />
              </PhoneFrame>
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
