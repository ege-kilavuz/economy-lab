import { Box, ButtonBase, Typography } from '@mui/material';

export function AppIcon({
  label,
  color,
  emoji,
  onClick,
}: {
  label: string;
  color: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <ButtonBase onClick={onClick} sx={{ borderRadius: 4 }}>
      <Box sx={{ width: 92, py: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 4,
            bgcolor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: 28,
          }}
        >
          {emoji}
        </Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
          {label}
        </Typography>
      </Box>
    </ButtonBase>
  );
}
