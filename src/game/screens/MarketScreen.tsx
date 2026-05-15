import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import type { GameState, ActionId, HoldingId } from '../types';
import { Top, StatChips, panelSx } from './helpers';

interface Props {
  game: GameState;
  onAction: (action: ActionId, opts?: { amount?: number; asset?: HoldingId }) => void;
  onBack: () => void;
}

export function MarketScreen({ game, onAction, onBack }: Props) {
  return (
    <>
      <Top title="Market" onBack={onBack} />
      <Box sx={{ pt: 1 }}>
        <StatChips game={game} />

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>🛒 Market</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <Button variant="outlined" onClick={() => onAction('grocery')}>
                Market alışverişi yap
              </Button>
              <Button variant="outlined" onClick={() => onAction('cinema')}>
                Sinema (eğlence)
              </Button>
              <Button variant="outlined" onClick={() => onAction('lightsOff')}>
                Tasarruf: ışıkları kapat
              </Button>
            </Stack>

            <Box sx={{ mt: 1.5 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Dolap: {game.fridge}% {game.fridge <= 30 ? '⚠️ düşük' : game.fridge <= 55 ? '─ orta' : '✅ iyi'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Moral: {game.mood}% {game.mood < 45 ? '😟 düşük' : game.mood < 60 ? '😐 orta' : '😊 iyi'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
