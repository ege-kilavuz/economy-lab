import React from 'react';
import { AppBar, Box, Container, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { MODULES } from './modules/registry';
import type { ModuleId } from './modules/types';
import { InflationModule } from './modules/inflation';
import { InterestModule } from './modules/interest';
import { CentralBankModule } from './modules/centralBank';

function ModuleView({ id }: { id: ModuleId }) {
  switch (id) {
    case 'inflation':
      return <InflationModule />;
    case 'interest':
      return <InterestModule />;
    case 'central-bank':
      return <CentralBankModule />;
    default:
      return null;
  }
}

export default function App() {
  const [tab, setTab] = React.useState<ModuleId>('inflation');

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Ekonomi Laboratuvarı (Prototype)
          </Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {MODULES.map((m) => (
            <Tab key={m.id} value={m.id} label={m.title} />
          ))}
        </Tabs>
      </AppBar>

      <Box sx={{ py: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 2, opacity: 0.85 }}>
            <Typography variant="body2">
              Amaç: Gençlere enflasyon, faiz ve temel makro trade-off’ları etkileşimli deneylerle öğretmek.
            </Typography>
          </Box>
          <ModuleView id={tab} />
        </Container>
      </Box>

      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Not: Bu modeller eğitim amaçlı basitleştirilmiştir; gerçek ekonomi daha karmaşıktır.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
