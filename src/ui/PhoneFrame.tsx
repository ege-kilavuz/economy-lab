import React from 'react';
import { Box, Paper } from '@mui/material';

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 430,
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          bgcolor: '#0b1220',
          position: 'relative',
        }}
      >
        {/* status bar */}
        <Box
          sx={{
            height: 28,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 12,
            letterSpacing: 0.2,
          }}
        >
          <Box>09:41</Box>
          <Box sx={{ display: 'flex', gap: 1, opacity: 0.8 }}>
            <Box>4G</Box>
            <Box>▮▮▮</Box>
            <Box>🔋</Box>
          </Box>
        </Box>

        {/* content */}
        <Box sx={{ bgcolor: '#0f172a', minHeight: 720, px: 2, pb: 3 }}>{children}</Box>

        {/* home indicator */}
        <Box sx={{ height: 18, display: 'flex', justifyContent: 'center', bgcolor: '#0f172a' }}>
          <Box sx={{ width: 120, height: 4, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.25)' }} />
        </Box>
      </Paper>
    </Box>
  );
}
