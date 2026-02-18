import React from 'react';
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import { MODULES } from './modules/registry';
import type { ModuleId } from './modules/types';
import { MonthSimModule } from './modules/monthSim';

function ModuleView({ id }: { id: ModuleId }) {
  switch (id) {
    case 'month-sim':
      return <MonthSimModule />;
    default:
      return null;
  }
}

export default function App() {
  const [tab] = React.useState<ModuleId>('month-sim');

  const m = MODULES[0];

  return (
    <>
      <CssBaseline />
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {m?.title} (Mobile Prototype)
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ py: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 2, opacity: 0.85 }}>
            <Typography variant="body2">{m?.description}</Typography>
          </Box>
          <ModuleView id={tab} />
        </Container>
      </Box>

      <Box sx={{ py: 3 }}>
        <Container maxWidth="md">
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Not: Bu bir prototiptir. Rakamlar/etkiler temsilîdir.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
