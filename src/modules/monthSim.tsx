import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import type { Difficulty, HoldingId } from '../game/types';
import { applyAction, newGame, nextDay, scoreEndOfMonth } from '../game/engine';
import { balanceFor } from '../game/balance';
import { PhoneFrame } from '../ui/PhoneFrame';
import { AppIcon } from '../ui/AppIcon';
import { CandleGame } from './candleGame';
import { CardEscape } from './cardEscape';
import { BudgetTetris } from './budgetTetris';
import { NewsNoiseGame } from './newsNoise';
import { ScamRadarGame } from './scamRadar';

type Screen = 'home' | 'bank' | 'market' | 'invest' | 'news' | 'candle' | 'card-escape' | 'budget-tetris' | 'news-noise' | 'scam-radar' | 'end';

function moneyTL(n: number) {
  return `${Math.round(n).toLocaleString()} TL`;
}

function diffLabel(d: Difficulty) {
  if (d === 'easy') return 'Kolay';
  if (d === 'normal') return 'Normal';
  return 'Zor';
}

function holdingLabel(h: HoldingId) {
  switch (h) {
    case 'gold':
      return 'Altın (g)';
    case 'usd':
      return 'Dolar ($)';
    case 'btc':
      return 'BTC';
    case 'eth':
      return 'ETH';
    case 'stock':
      return 'Hisse (u)';
  }
}

function holdingPriceTL(game: any, h: HoldingId) {
  switch (h) {
    case 'gold':
      return game.goldPrice;
    case 'usd':
      return game.usdTry;
    case 'btc':
      return game.btcTry;
    case 'eth':
      return game.ethTry;
    case 'stock':
      return Math.round(game.stockIndex * 20);
  }
}

export function MonthSimModule() {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('easy');
  const [useCard, setUseCard] = React.useState(false);
  const [screen, setScreen] = React.useState<Screen>('home');
  const [game, setGame] = React.useState(() => newGame('easy'));

  React.useEffect(() => {
    setGame(newGame(difficulty));
    setScreen('home');
  }, [difficulty]);

  const b = balanceFor(game.difficulty);
  const finished = game.day > 30;

  function act(action: Parameters<typeof applyAction>[1], opts?: { amount?: number; asset?: HoldingId }) {
    setGame((g) => applyAction(g, action, { useCard, amount: opts?.amount, asset: opts?.asset }));
  }

  function advanceDay() {
    setGame((g) => {
      if (g.day >= 30) return { ...g, day: 31, log: [`Ay bitti. Skor hesaplandı.`, ...g.log] };
      return nextDay(g);
    });
  }

  React.useEffect(() => {
    if (finished) setScreen('end');
  }, [finished]);

  const endScore = scoreEndOfMonth(game);

  const Top = ({ title }: { title: string }) => (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'transparent', color: 'white' }}>
      <Toolbar sx={{ px: 1 }}>
        {screen !== 'home' && screen !== 'end' ? (
          <IconButton onClick={() => setScreen('home')} sx={{ color: 'white' }}>
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

  const StatChips = () => (
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
      <Chip size="small" label={`Moral: ${game.mood}%`} />
    </Stack>
  );

  const HomeScreen = () => (
    <>
      <Top title="Telefon" />
      <Box sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Mod: <b>{diffLabel(game.difficulty)}</b> · Faiz: <b>{game.policyRate.toFixed(1)}%</b> · Puan: <b>{game.points}</b>
        </Typography>
        <Box sx={{ mt: 1 }}>
          <StatChips />
        </Box>

        <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>Günlük Görev</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {game.quest.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              İpucu: {game.quest.hint} {game.quest.done ? '✅ (+10)' : ''}
            </Typography>

            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

            <FormControlLabel
              control={<Switch checked={useCard} onChange={(_, v) => setUseCard(v)} />}
              label={useCard ? 'Kart modu açık' : 'Nakit modu'}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
              <Button variant="outlined" onClick={() => setGame(newGame(difficulty))}>
                Sıfırla
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography sx={{ mt: 2, fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>Uygulamalar</Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ mt: 1, gap: 1 }}>
          <AppIcon label="Banka" color="#1d4ed8" emoji="🏦" onClick={() => setScreen('bank')} />
          <AppIcon label="Market" color="#16a34a" emoji="🛒" onClick={() => setScreen('market')} />
          <AppIcon label="Yatırım" color="#f59e0b" emoji="📈" onClick={() => setScreen('invest')} />
          <AppIcon label="Haber" color="#7c3aed" emoji="📰" onClick={() => setScreen('news')} />
          <AppIcon label="Kart" color="#f97316" emoji="💳" onClick={() => setScreen('card-escape')} />
          <AppIcon label="Bütçe" color="#34d399" emoji="🧩" onClick={() => setScreen('budget-tetris')} />
          <AppIcon label="Gürültü" color="#a78bfa" emoji="📰" onClick={() => setScreen('news-noise')} />
          <AppIcon label="Radar" color="#ef4444" emoji="🛡️" onClick={() => setScreen('scam-radar')} />
          <AppIcon label="Mum" color="#fb7185" emoji="🕯️" onClick={() => setScreen('candle')} />
          <AppIcon
            label="Uyku"
            color="#0ea5e9"
            emoji="🌙"
            onClick={() => {
              advanceDay();
            }}
          />
        </Stack>

        <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>Zorluk</Typography>
            <FormControl sx={{ mt: 1 }}>
              <RadioGroup row value={difficulty} onChange={(_, v) => setDifficulty(v as Difficulty)}>
                <FormControlLabel value="easy" control={<Radio sx={{ color: 'white' }} />} label={<Typography color="rgba(255,255,255,0.85)">Kolay</Typography>} />
                <FormControlLabel value="normal" control={<Radio sx={{ color: 'white' }} />} label={<Typography color="rgba(255,255,255,0.85)">Normal</Typography>} />
                <FormControlLabel value="hard" control={<Radio sx={{ color: 'white' }} />} label={<Typography color="rgba(255,255,255,0.85)">Zor</Typography>} />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Box>
    </>
  );

  const BankScreen = () => (
    <>
      <Top title="Banka" />
      <Box sx={{ pt: 1 }}>
        <StatChips />

        <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>Zorunlu Ödemeler</Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Kira {moneyTL(b.rent)} · Aidat {moneyTL(b.dues)} · Elektrik {moneyTL(b.electric)} · Doğalgaz {moneyTL(b.gas)} · İnternet {moneyTL(b.internet)}
            </Typography>
            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button size="small" variant="contained" onClick={() => act('payRent')}>Kira</Button>
              <Button size="small" variant="outlined" onClick={() => act('payDues')}>Aidat</Button>
              <Button size="small" variant="outlined" onClick={() => act('payElectric')}>Elektrik</Button>
              <Button size="small" variant="outlined" onClick={() => act('payGas')}>Doğalgaz</Button>
              <Button size="small" variant="outlined" onClick={() => act('payInternet')}>İnternet</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>Kredi Kartı</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Ay sonunda faiz işler. Asgari ödeme borcu azaltır ama maliyetli olabilir.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button size="small" variant="outlined" onClick={() => act('payCardMin')}>Asgari Öde</Button>
              <Button size="small" variant="outlined" onClick={() => act('payCardAll')}>Kapat</Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );

  const MarketScreen = () => (
    <>
      <Top title="Market" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>Alışveriş</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Dolabı doldurmak günlük performansını etkiler.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" onClick={() => act('grocery')}>Market Yap</Button>
              <Button variant="outlined" onClick={() => act('cinema')}>Sinema</Button>
              <Button variant="text" onClick={() => act('lightsOff')}>Işıkları kapat</Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </>
  );

  const AssetRow = ({ asset }: { asset: HoldingId }) => {
    const [amt, setAmt] = React.useState(1);
    const price = holdingPriceTL(game, asset);
    const owned = game.holdings[asset];
    const value = owned * price;

    return (
      <Card
        sx={{
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.06)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={900}>{holdingLabel(asset)}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Fiyat: {moneyTL(price)} · Eldeki: {owned} · Değer: {moneyTL(value)}
              </Typography>
            </Box>
            <Chip size="small" label={asset.toUpperCase()} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white' }} />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`Miktar: ${amt}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
            <Button size="small" variant="outlined" onClick={() => setAmt((a) => Math.max(1, a - 1))}>-</Button>
            <Button size="small" variant="outlined" onClick={() => setAmt((a) => Math.min(50, a + 1))}>+</Button>
            <Button size="small" variant="text" onClick={() => setAmt(1)}>1</Button>
            <Button size="small" variant="text" onClick={() => setAmt(5)}>5</Button>
            <Button size="small" variant="text" onClick={() => setAmt(10)}>10</Button>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
            <Button size="small" variant="contained" onClick={() => act('buyAsset', { amount: amt, asset })}>
              Al
            </Button>
            <Button size="small" variant="outlined" onClick={() => act('sellAsset', { amount: amt, asset })}>
              Sat
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const InvestScreen = () => (
    <>
      <Top title="Yatırım" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, color: 'rgba(255,255,255,0.75)' }}>
          Kolay: daha stabil · Zor: daha volatil. (Kurgusal fiyatlar)
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <AssetRow asset="usd" />
          <AssetRow asset="gold" />
          <AssetRow asset="btc" />
          <AssetRow asset="eth" />
          <AssetRow asset="stock" />
        </Stack>
      </Box>
    </>
  );

  const NewsScreen = () => (
    <>
      <Top title="Haber" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Card sx={{ mt: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent>
            <Typography fontWeight={900}>Akış</Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Haberler ve olaylar burada görünür. Piyasalar gün sonunda güncellenir.
            </Typography>
            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />
            <Box>
              {game.log.slice(0, 18).map((l: string, i: number) => (
                <Typography key={i} variant="body2" sx={{ opacity: 0.85 }}>
                  • {l}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );

  const EndScreen = () => {
    const assetTL =
      game.holdings.gold * game.goldPrice +
      game.holdings.usd * game.usdTry +
      game.holdings.btc * game.btcTry +
      game.holdings.eth * game.ethTry +
      game.holdings.stock * (game.stockIndex * 20);

    return (
      <>
        <Top title="Ay Sonu" />
        <Box sx={{ pt: 1 }}>
          <Card sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={950}>
                Sonuç
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.9 }}>
                Skor: <b>{endScore}</b>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                Nakit: <b>{moneyTL(game.cash)}</b> · Kart borcu: <b>{moneyTL(game.cardDebt)}</b>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                Varlıklar (≈): <b>{moneyTL(assetTL)}</b>
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                Kira: <b>{game.rentPaid ? 'ödendi' : 'ödenmedi'}</b> · Faturalar: <b>{Object.values(game.billsPaid).filter(Boolean).length}/4</b>
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {endScore >= 70
                  ? 'Dengeyi kurdun: ihtiyaçlar + borç kontrolü + birikim.'
                  : endScore >= 40
                    ? 'Kıl payı: bazı alanlarda açık var. Kart borcuna ve dolap planına dikkat.'
                    : 'Zorlu ay: borç/ödeme planı bozuldu. Önce zorunlular, sonra küçük eğlence.'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Button variant="contained" onClick={() => setGame(newGame(difficulty))}>
                  Tekrar Oyna
                </Button>
                <Button variant="outlined" onClick={() => setScreen('home')}>
                  Telefona dön
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </>
    );
  };

  const CandleScreen = () => (
    <>
      <Top title="Mum Oyunu" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Box sx={{ mt: 2 }}>
          <CandleGame />
        </Box>
      </Box>
    </>
  );

  const CardEscapeScreen = () => (
    <>
      <Top title="Kart Kaçışı" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Box sx={{ mt: 2 }}>
          <CardEscape />
        </Box>
      </Box>
    </>
  );

  const BudgetTetrisScreen = () => (
    <>
      <Top title="Bütçe Tetris" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Box sx={{ mt: 2 }}>
          <BudgetTetris />
        </Box>
      </Box>
    </>
  );

  const NewsNoiseScreen = () => (
    <>
      <Top title="Haber mi Gürültü mü?" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Box sx={{ mt: 2 }}>
          <NewsNoiseGame />
        </Box>
      </Box>
    </>
  );

  const ScamRadarScreen = () => (
    <>
      <Top title="Dolandırıcılık Radar" />
      <Box sx={{ pt: 1 }}>
        <StatChips />
        <Box sx={{ mt: 2 }}>
          <ScamRadarGame />
        </Box>
      </Box>
    </>
  );

  return (
    <PhoneFrame>
      {screen === 'home' && <HomeScreen />}
      {screen === 'bank' && <BankScreen />}
      {screen === 'market' && <MarketScreen />}
      {screen === 'invest' && <InvestScreen />}
      {screen === 'news' && <NewsScreen />}
      {screen === 'card-escape' && <CardEscapeScreen />}
      {screen === 'budget-tetris' && <BudgetTetrisScreen />}
      {screen === 'news-noise' && <NewsNoiseScreen />}
      {screen === 'scam-radar' && <ScamRadarScreen />}
      {screen === 'candle' && <CandleScreen />}
      {screen === 'end' && <EndScreen />}
    </PhoneFrame>
  );
}
