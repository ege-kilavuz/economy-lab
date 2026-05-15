import React from 'react';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import type { GameState, ActionId, HoldingId } from '../types';
import { Top, StatChips, panelSx, moneyTL, holdingLabel, holdingPriceTL } from './helpers';

interface Props {
  game: GameState;
  onAction: (action: ActionId, opts?: { amount?: number; asset?: HoldingId }) => void;
  onBack: () => void;
}

const ALL_ASSETS: HoldingId[] = ['gold', 'usd', 'btc', 'eth', 'stock'];

export function InvestScreen({ game, onAction, onBack }: Props) {
  return (
    <>
      <Top title="Yatırım" onBack={onBack} />
      <Box sx={{ pt: 1 }}>
        <StatChips game={game} />

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>📈 Portföy</Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {ALL_ASSETS.map((h) => {
                const qty = game.holdings[h];
                const price = holdingPriceTL(game, h);
                const value = qty * price;
                return (
                  <Typography key={h} variant="body2" sx={{ opacity: 0.85 }}>
                    {holdingLabel(h)}: {qty} adet × {moneyTL(price)} = <b>{moneyTL(value)}</b>
                  </Typography>
                );
              })}
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Toplam: {moneyTL(
                  ALL_ASSETS.reduce((sum, h) => sum + game.holdings[h] * holdingPriceTL(game, h), 0)
                )}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

            <Typography fontWeight={900}>Al / Sat</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              {ALL_ASSETS.map((h) => (
                <React.Fragment key={h}>
                  <Button size="small" variant="outlined" onClick={() => onAction('buyAsset', { asset: h, amount: 1 })}>
                    Al {holdingLabel(h)}
                  </Button>
                  {game.holdings[h] > 0 ? (
                    <Button size="small" variant="outlined" color="warning" onClick={() => onAction('sellAsset', { asset: h, amount: 1 })}>
                      Sat {holdingLabel(h)}
                    </Button>
                  ) : null}
                </React.Fragment>
              ))}
            </Stack>

            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
              Politika faizi: %{game.policyRate.toFixed(1)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
