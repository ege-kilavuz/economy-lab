import { AppBar, Box, Chip, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import type { Difficulty, GameState, HoldingId } from '../types';

export function moneyTL(n: number): string {
  return `${Math.round(n).toLocaleString()} TL`;
}

export function diffLabel(d: Difficulty): string {
  if (d === 'easy') return 'Kolay';
  if (d === 'normal') return 'Normal';
  return 'Zor';
}

export function holdingLabel(h: HoldingId): string {
  switch (h) {
    case 'gold': return 'Altın (g)';
    case 'usd': return 'Dolar ($)';
    case 'btc': return 'BTC';
    case 'eth': return 'ETH';
    case 'stock': return 'Hisse (u)';
  }
}

export function holdingPriceTL(game: GameState, h: HoldingId): number {
  switch (h) {
    case 'gold': return game.goldPrice;
    case 'usd': return game.usdTry;
    case 'btc': return game.btcTry;
    case 'eth': return game.ethTry;
    case 'stock': return Math.round(game.stockIndex * 20);
  }
}

export function categoryForLog(line: string): string {
  const text = line.toLowerCase();
  if (text.includes('market') || text.includes('dolap')) return 'Market';
  if (text.includes('sinema') || text.includes('moral')) return 'Yaşam';
  if (text.includes('kira') || text.includes('aidat') || text.includes('elektrik') || text.includes('doğalgaz') || text.includes('internet')) return 'Fatura';
  if (text.includes('kart') || text.includes('kredi')) return 'Kredi';
  if (text.includes('alım') || text.includes('satış') || text.includes('borsa') || text.includes('altın') || text.includes('btc') || text.includes('usd')) return 'Yatırım';
  if (text.includes('haber') || text.includes('tcmb') || text.includes('enflasyon')) return 'Makro';
  return 'Genel';
}

export const panelSx = {
  borderRadius: 4,
  bgcolor: 'rgba(255,255,255,0.06)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.08)',
};

export function Top({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'transparent', color: 'white' }}>
      <Toolbar sx={{ px: 1 }}>
        {onBack ? (
          <IconButton onClick={onBack} sx={{ color: 'white' }}>
            <ArrowBackRounded />
          </IconButton>
        ) : (
          <Box sx={{ width: 44 }} />
        )}
        <Typography variant="subtitle1" sx={{ fontWeight: 900, flex: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        <Box sx={{ width: 44 }} />
      </Toolbar>
    </AppBar>
  );
}

export function StatChips({ game }: { game: GameState }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Chip size="small" label={`Gün ${Math.min(game.day, 30)}/30`} color="primary" />
      <Chip size="small" label={`Nakit: ${moneyTL(game.cash)}`} />
      <Chip
        size="small"
        label={`Kart: ${moneyTL(game.cardDebt)}`}
        color={game.cardDebt > 0 ? 'warning' : 'default'}
        variant={game.cardDebt > 0 ? 'filled' : 'outlined'}
      />
      <Chip size="small" label={`Dolap: ${game.fridge}%`} />
      <Chip size="small" label={`Moral: ${game.mood}%`} color={game.mood < 45 ? 'error' : game.mood < 60 ? 'warning' : 'default'} />
      <Chip size="small" label={`Disiplin: ${game.discipline}%`} color={game.discipline < 40 ? 'error' : game.discipline < 60 ? 'warning' : 'default'} />
      {game.mood < 45 ? <Chip size="small" color="error" label="Stresli" /> : null}
      {game.cardDebt >= 8000 ? <Chip size="small" color="error" label="Borç baskısı" /> : null}
      {game.fridge <= 35 ? <Chip size="small" color="warning" label="Dolap azalıyor" /> : null}
    </Stack>
  );
}
