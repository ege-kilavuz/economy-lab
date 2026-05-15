import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { GameState, ActionId, HoldingId } from '../types';
import { Top, StatChips, panelSx } from './helpers';

interface Props {
  game: GameState;
  onAction: (action: ActionId, opts?: { amount?: number; asset?: HoldingId }) => void;
  onBack: () => void;
}

export function NewsScreen({ game, onBack }: Props) {
  return (
    <>
      <Top title="Haberler" onBack={onBack} />
      <Box sx={{ pt: 1 }}>
        <StatChips game={game} />

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>📰 Ekonomi Haberleri</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Politika faizi: <b>%{game.policyRate.toFixed(1)}</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Altın: <b>{moneyTL(game.goldPrice)}/g</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Dolar: <b>{moneyTL(game.usdTry)}</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                BIST (endeks): <b>{game.stockIndex.toFixed(1)}</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                BTC: <b>{moneyTL(game.btcTry)}</b>
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                ETH: <b>{moneyTL(game.ethTry)}</b>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

function moneyTL(n: number): string {
  return `${Math.round(n).toLocaleString()} TL`;
}
