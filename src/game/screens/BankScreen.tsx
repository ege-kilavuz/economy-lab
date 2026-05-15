import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import type { GameState, ActionId, HoldingId } from '../types';
import { balanceFor } from '../balance';
import { Top, StatChips, panelSx, moneyTL } from './helpers';

interface Props {
  game: GameState;
  onAction: (action: ActionId, opts?: { amount?: number; asset?: HoldingId }) => void;
  onBack: () => void;
}

export function BankScreen({ game, onAction, onBack }: Props) {
  const b = balanceFor(game.difficulty);

  return (
    <>
      <Top title="Banka" onBack={onBack} />
      <Box sx={{ pt: 1 }}>
        <StatChips game={game} />

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>Hesap Özeti</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2">Nakit: <b>{moneyTL(game.cash)}</b></Typography>
              <Typography variant="body2">Kart borcu: <b>{moneyTL(game.cardDebt)}</b></Typography>
              <Typography variant="body2">Maaş (aylık): <b>{moneyTL(b.startingCash)}</b></Typography>
            </Stack>

            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

            <Typography fontWeight={900}>İşlemler</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              {!game.rentPaid ? (
                <Button variant="outlined" size="small" onClick={() => onAction('payRent')}>
                  Kira öde ({moneyTL(b.rent)})
                </Button>
              ) : null}
              {!game.billsPaid.dues ? (
                <Button variant="outlined" size="small" onClick={() => onAction('payDues')}>
                  Aidat ({moneyTL(b.dues)})
                </Button>
              ) : null}
              {!game.billsPaid.electric ? (
                <Button variant="outlined" size="small" onClick={() => onAction('payElectric')}>
                  Elektrik ({moneyTL(b.electric)})
                </Button>
              ) : null}
              {!game.billsPaid.gas ? (
                <Button variant="outlined" size="small" onClick={() => onAction('payGas')}>
                  Doğalgaz ({moneyTL(b.gas)})
                </Button>
              ) : null}
              {!game.billsPaid.internet ? (
                <Button variant="outlined" size="small" onClick={() => onAction('payInternet')}>
                  İnternet ({moneyTL(b.internet)})
                </Button>
              ) : null}
            </Stack>

            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

            <Typography fontWeight={900}>Kredi Kartı</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              <Button variant="outlined" size="small" onClick={() => onAction('payCardMin')}>
                Asgari öde
              </Button>
              <Button variant="outlined" size="small" onClick={() => onAction('payCardAll')}>
                Tamamını kapat
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {game.rentPaid ? '✅ Kira ödendi' : '❌ Kira ödenmedi'} · 
              Faturalar: {Object.values(game.billsPaid).filter(Boolean).length}/4 ödendi · 
              Kart: {game.cardDebt > 0 ? `${moneyTL(game.cardDebt)} borç` : '✅ temiz'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
