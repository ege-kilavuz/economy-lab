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

import type { Difficulty, GameState, HoldingId } from '../game/types';
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

function holdingPriceTL(game: GameState, h: HoldingId) {
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

const panelSx = {
  borderRadius: 4,
  bgcolor: 'rgba(255,255,255,0.06)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.08)',
};

function categoryForLog(line: string) {
  const text = line.toLowerCase();
  if (text.includes('market') || text.includes('dolap')) return 'Market';
  if (text.includes('sinema') || text.includes('moral')) return 'Yaşam';
  if (text.includes('kira') || text.includes('aidat') || text.includes('elektrik') || text.includes('doğalgaz') || text.includes('internet')) return 'Fatura';
  if (text.includes('kart') || text.includes('kredi')) return 'Kredi';
  if (text.includes('alım') || text.includes('satış') || text.includes('borsa') || text.includes('altın') || text.includes('btc') || text.includes('usd')) return 'Yatırım';
  if (text.includes('haber') || text.includes('tcmb') || text.includes('enflasyon')) return 'Makro';
  return 'Genel';
}

export function MonthSimModule({
  onEvent,
  onSummary,
}: {
  onEvent?: (msg: string) => void;
  onSummary?: (s: { cash: number; cardDebt: number; mood: number; day: number }) => void;
}) {
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

  const lastTopRef = React.useRef<string | null>(null);
  const prevSnapRef = React.useRef({ cash: game.cash, cardDebt: game.cardDebt, mood: game.mood, fridge: game.fridge, discipline: game.discipline });

  function diffText(label: string, diff: number, unit = '') {
    if (diff === 0) return null;
    const sign = diff > 0 ? '+' : '';
    return `${label} ${sign}${Math.round(diff)}${unit}`;
  }

  React.useEffect(() => {
    const top = game.log[0];
    if (!top) return;
    if (top === lastTopRef.current) return;

    const prev = prevSnapRef.current;
    const parts = [
      diffText('Nakit', game.cash - prev.cash, ' TL'),
      diffText('Kart', game.cardDebt - prev.cardDebt, ' TL'),
      diffText('Moral', game.mood - prev.mood, '%'),
      diffText('Dolap', game.fridge - prev.fridge, '%'),
      diffText('Disiplin', game.discipline - prev.discipline, '%'),
    ].filter(Boolean);

    lastTopRef.current = top;
    prevSnapRef.current = { cash: game.cash, cardDebt: game.cardDebt, mood: game.mood, fridge: game.fridge, discipline: game.discipline };

    const suffix = parts.length ? ` (${parts.join(', ')})` : '';
    const tag = categoryForLog(top);
    onEvent?.(`[${tag}] ${top}${suffix}`);
  }, [game.log, game.cash, game.cardDebt, game.mood, game.fridge, game.discipline, onEvent]);

  React.useEffect(() => {
    onSummary?.({ cash: game.cash, cardDebt: game.cardDebt, mood: game.mood, day: game.day });
  }, [game.cash, game.cardDebt, game.mood, game.day, onSummary]);

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
      <Chip size="small" label={`Moral: ${game.mood}%`} color={game.mood < 45 ? 'error' : game.mood < 60 ? 'warning' : 'default'} />
      <Chip size="small" label={`Disiplin: ${game.discipline}%`} color={game.discipline < 40 ? 'error' : game.discipline < 60 ? 'warning' : 'default'} />
      {game.mood < 45 ? <Chip size="small" color="error" label="Stresli" /> : null}
      {game.cardDebt >= 8000 ? <Chip size="small" color="error" label="Borç baskısı" /> : null}
      {game.fridge <= 35 ? <Chip size="small" color="warning" label="Dolap azalıyor" /> : null}
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

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>Günlük Görev</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {game.quest.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              İpucu: {game.quest.hint} {game.quest.done ? '✅ (+10)' : ''}
            </Typography>
            {game.mood < 45 ? (
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#fca5a5' }}>
                Moral düşük: olumsuz olay ihtimali artar, küçük harcamalar bile etkili olur.
              </Typography>
            ) : null}

            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />

            <FormControlLabel
              control={<Switch checked={useCard} onChange={(_, v) => setUseCard(v)} />}
              label={useCard ? 'Kart modu açık' : 'Nakit modu'}
            />

            <Stack spacing={0.75} sx={{ mt: 1.25 }}>
              <Typography variant="caption" sx={{ opacity: 0.78 }}>
                Durum yorumu:
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, color: 'rgba(255,255,255,0.92)' }}>
                Görev odağı: {game.quest.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.88 }}>
                {game.cardDebt >= 10000
                  ? 'Kart borcu ciddi baskı oluşturuyor; yeni harcamalarda kart yerine ödeme/azaltma odaklı gitmek daha güvenli.'
                  : game.cardDebt > 0
                    ? 'Kart borcun var; ay sonu faiz baskısını azaltmak için asgari yerine mümkünse daha yüksek ödeme düşün.'
                    : 'Kart borcun kontrol altında. Bu, bütçe ve birikim kararlarında alan açar.'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.88 }}>
                {game.fridge <= 30
                  ? 'Dolap seviyesi düşük. Günlük yaşam konforu ve moral için market tarafını ihmal etmemek gerekiyor.'
                  : game.fridge <= 55
                    ? 'Dolap orta seviyede; plansız birkaç gün daha geçerse zorlayabilir.'
                    : 'Dolap tarafı rahat; bu sana diğer kararlarda biraz esneklik sağlar.'}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
              <Button variant="outlined" onClick={() => setGame(newGame(difficulty))}>
                Sıfırla
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography sx={{ mt: 2, fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>Uygulamalar</Typography>
        <Card sx={{ mt: 1, ...panelSx }}>
          <CardContent sx={{ p: 1.5 }}>
            <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              <AppIcon label="Banka" color="#1d4ed8" emoji="🏦" onClick={() => setScreen('bank')} />
              <AppIcon label="Market" color="#16a34a" emoji="🛒" onClick={() => setScreen('market')} />
              <AppIcon label="Yatırım" color="#f59e0b" emoji="📈" onClick={() => setScreen('invest')} />
              <AppIcon label="Haber" color="#7c3aed" emoji="📰" onClick={() => setScreen('news')} />
              <AppIcon label="Kart" color="#f97316" emoji="💳" onClick={() => setScreen('card-escape')} />
              <AppIcon label="Bütçe" color="#34d399" emoji="🧩" onClick={() => setScreen('budget-tetris')} />
              <AppIcon label="Gürültü" color="#a78bfa" emoji="📰" onClick={() => setScreen('news-noise')} />
              <AppIcon label="Radar" color="#ef4444" emoji="🛡️" onClick={() => setScreen('scam-radar')} />
              <AppIcon label="Borsa" color="#fb7185" emoji="📈" onClick={() => setScreen('candle')} />
              <AppIcon
                label="Uyku"
                color="#0ea5e9"
                emoji="🌙"
                onClick={() => {
                  advanceDay();
                }}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, ...panelSx }}>
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

        <Card sx={{ mt: 2, ...panelSx }}>
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
            <Typography variant="caption" sx={{ display: 'block', mt: 1.1, opacity: 0.72 }}>
              Yorum: Zorunlu ödemeleri geciktirmek kısa vadede nakit bırakabilir ama ay sonu dengesini ve skoru bozar.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, ...panelSx }}>
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
        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>Alışveriş</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Dolabı doldurmak günlük performansını etkiler.
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.72 }}>
              Market harcaması kısa vadede nakdi azaltır ama dolabı ve günlük dengeyi güçlendirir. Eğlence harcaması morali toparlayabilir; ancak borç baskısı varken öncelik değişebilir.
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
    const totalPortfolio =
      game.holdings.gold * game.goldPrice +
      game.holdings.usd * game.usdTry +
      game.holdings.btc * game.btcTry +
      game.holdings.eth * game.ethTry +
      game.holdings.stock * (game.stockIndex * 20);
    const weight = totalPortfolio > 0 ? value / totalPortfolio : 0;

    return (
      <Card sx={panelSx}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={900}>{holdingLabel(asset)}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Fiyat: {moneyTL(price)} · Eldeki: {owned} · Değer: {moneyTL(value)}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.35, opacity: 0.72 }}>
                Portföy payı: %{Math.round(weight * 100)} {weight >= 0.75 ? '· yoğun risk' : weight >= 0.5 ? '· dikkat' : totalPortfolio > 0 ? '· dengeli' : ''}
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
        <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.72, color: 'rgba(255,255,255,0.72)' }}>
          Yorum: Yatırım tarafı kısa vadeli heyecan için değil, risk-getiri ve çeşitlendirme mantığını hissettirmek için var. Tüm nakdi tek araca yığmak ay sonu dengesini bozabilir.
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.55, opacity: 0.72, color: 'rgba(255,255,255,0.72)' }}>
          Pratik kural: nakit tamponun zayıfsa önce ihtiyaç ve borç tarafını toparlamak, sonra yatırım düşünmek daha güvenli olur.
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.72, color: 'rgba(255,255,255,0.72)' }}>
          Öğrenme mantığı: yatırım tarafında tek amaç “en çok artanı kovalamak” değil; risk, çeşitlendirme ve nakit ihtiyacını birlikte düşünmektir.
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

  const NewsScreen = () => {
    const marketValue =
      game.holdings.gold * game.goldPrice +
      game.holdings.usd * game.usdTry +
      game.holdings.btc * game.btcTry +
      game.holdings.eth * game.ethTry +
      game.holdings.stock * (game.stockIndex * 20);

    return (
      <>
        <Top title="Haber" />
        <Box sx={{ pt: 1 }}>
          <StatChips />

          <Card sx={{ mt: 2, ...panelSx }}>
            <CardContent>
              <Typography fontWeight={900}>Günün ekonomik resmi</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                <Chip size="small" label={`Faiz: ${game.policyRate.toFixed(1)}%`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
                <Chip size="small" label={`Dolar: ${game.usdTry.toFixed(2)} TL`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
                <Chip size="small" label={`Altın: ${Math.round(game.goldPrice).toLocaleString()} TL`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
                <Chip size="small" label={`Borsa endeksi: ${game.stockIndex.toFixed(1)}`} sx={{ bgcolor: 'rgba(255,255,255,0.10)', color: 'white' }} />
                <Chip size="small" label={`Portföy ≈ ${moneyTL(marketValue)}`} sx={{ bgcolor: 'rgba(96,165,250,0.20)', color: 'white' }} />
                {game.marketMood && game.marketMood !== 'neutral' ? (
                  <Chip
                    size="small"
                    label={
                      game.marketMood === 'inflation'
                        ? 'Tema: Enflasyon baskısı'
                        : game.marketMood === 'fx'
                          ? 'Tema: Kur hareketi'
                          : game.marketMood === 'credit'
                            ? 'Tema: Faiz / kredi baskısı'
                            : 'Tema: Piyasa iştahı'
                    }
                    sx={{ bgcolor: 'rgba(245,158,11,0.18)', color: 'white' }}
                  />
                ) : null}
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.9, opacity: 0.72 }}>
                İpucu: Haberleri tek tek değil, nakit–borç–ihtiyaç dengesiyle birlikte okumak daha sağlıklıdır.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2, ...panelSx }}>
            <CardContent>
              <Typography fontWeight={900}>Akış</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Haberler ve olaylar burada görünür. Piyasalar gün sonunda güncellenir.
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.72 }}>
                İpucu: Her haber tek başına işlem sinyali değildir; önce nakit, borç ve günlük ihtiyaç dengene bakmak daha güvenlidir.
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
  };

  const EndScreen = () => {
    const assetTL =
      game.holdings.gold * game.goldPrice +
      game.holdings.usd * game.usdTry +
      game.holdings.btc * game.btcTry +
      game.holdings.eth * game.ethTry +
      game.holdings.stock * (game.stockIndex * 20);

    const strengths: string[] = [];
    const risks: string[] = [];

    if (game.rentPaid && Object.values(game.billsPaid).filter(Boolean).length >= 3) strengths.push('zorunlu ödemeleri büyük ölçüde kontrol ettin');
    else risks.push('zorunlu ödemelerde açık bıraktın');

    if (game.cardDebt <= 2000) strengths.push('kart borcunu düşük tuttun');
    else if (game.cardDebt >= 8000) risks.push('kart borcu ay sonu dengesini zorladı');

    if (game.fridge >= 50) strengths.push('ihtiyaç tarafını ihmal etmedin');
    else if (game.fridge < 35) risks.push('dolap seviyesi çok düştü');

    if (assetTL >= 3000) strengths.push('birikim / yatırım tarafında alan oluşturdun');
    if (game.cash < 500) risks.push('nakit tamponun zayıf kaldı');

    const portfolioValues = [
      game.holdings.gold * game.goldPrice,
      game.holdings.usd * game.usdTry,
      game.holdings.btc * game.btcTry,
      game.holdings.eth * game.ethTry,
      game.holdings.stock * (game.stockIndex * 20),
    ];
    const maxWeight = assetTL > 0 ? Math.max(...portfolioValues) / assetTL : 0;
    if (assetTL > 0 && maxWeight >= 0.75) risks.push('yatırım tarafında tek varlığa fazla yoğunlaştın');
    else if (assetTL > 0 && maxWeight <= 0.45) strengths.push('yatırım tarafında çeşitlendirme mantığını korudun');

    return (
      <>
        <Top title="Ay Sonu" />
        <Box sx={{ pt: 1 }}>
          <Card sx={panelSx}>
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
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                Moral durumu: <b>{game.mood}%</b> {game.mood < 45 ? '— stres etkisiyle olaylar zorlaşır.' : ''}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                Dolap seviyesi: <b>{game.fridge}%</b> {game.fridge < 35 ? '— ihtiyaç tarafı zayıf kaldı.' : ''}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                Finansal disiplin: <b>{game.discipline}%</b> {game.discipline < 40 ? '— günlük kararlar çok dağınık kaldı.' : ''}
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.12)' }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {endScore >= 70
                  ? 'Dengeyi kurdun: ihtiyaçlar + borç kontrolü + birikim.'
                  : endScore >= 40
                    ? 'Kıl payı: bazı alanlarda açık var. Kart borcuna ve dolap planına dikkat.'
                    : 'Zorlu ay: borç/ödeme planı bozuldu. Önce zorunlular, sonra küçük eğlence.'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.9, opacity: 0.72 }}>
                Ay sonu yorumu: iyi sonuç için tek bir doğru yok; ama genelde düzenli ödeme, kontrollü harcama ve acele yatırım kararlarından kaçınmak dengeyi güçlendirir.
              </Typography>
              <Stack spacing={0.75} sx={{ mt: 1.1 }}>
                <Typography variant="caption" sx={{ opacity: 0.72 }}>Ay sonu analizi:</Typography>
                {strengths.length ? (
                  <Typography variant="body2" sx={{ opacity: 0.88 }}>
                    Güçlü tarafların: {strengths.join(' · ')}.
                  </Typography>
                ) : null}
                {risks.length ? (
                  <Typography variant="body2" sx={{ opacity: 0.88 }}>
                    Geliştirilecek taraflar: {risks.join(' · ')}.
                  </Typography>
                ) : null}
              </Stack>

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
      <Top title="Borsa Oyunu" />
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
