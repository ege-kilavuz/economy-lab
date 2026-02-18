import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import type { Difficulty } from '../game/types';
import { applyAction, newGame, nextDay, scoreEndOfMonth } from '../game/engine';
import { balanceFor } from '../game/balance';

function money(n: number) {
  return `${Math.round(n).toLocaleString()} TL`;
}

function diffLabel(d: Difficulty) {
  if (d === 'easy') return 'Kolay';
  if (d === 'normal') return 'Normal';
  return 'Zor';
}

export function MonthSimModule() {
  const [difficulty, setDifficulty] = React.useState<Difficulty>('easy');
  const [useCard, setUseCard] = React.useState(false);
  const [game, setGame] = React.useState(() => newGame('easy'));

  React.useEffect(() => {
    setGame(newGame(difficulty));
  }, [difficulty]);

  const b = balanceFor(game.difficulty);
  const finished = game.day > 30;

  const endScore = scoreEndOfMonth(game);

  function act(action: Parameters<typeof applyAction>[1], amount?: number) {
    setGame((g) => applyAction(g, action, { useCard, amount }));
  }

  function advanceDay() {
    setGame((g) => {
      if (g.day >= 30) return { ...g, day: 31, log: [`Ay bitti. Skor hesaplandı.`, ...g.log] };
      return nextDay(g);
    });
  }

  return (
    <Stack spacing={2}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={900}>
            1 Ay Ekonomi Hayatı (Prototype)
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
            Ayın 1’inde maaş yatar. Her gün hızlı kararlar ver: kira/faturalar, market, eğlence, tasarruf, altın/borsa ve kredi kartı.
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={1}>
            <FormControl>
              <Typography fontWeight={800} sx={{ mb: 0.5 }}>
                Zorluk
              </Typography>
              <RadioGroup
                row
                value={difficulty}
                onChange={(_, v) => setDifficulty(v as Difficulty)}
              >
                <FormControlLabel value="easy" control={<Radio />} label="Kolay" />
                <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                <FormControlLabel value="hard" control={<Radio />} label="Zor" />
              </RadioGroup>
            </FormControl>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Chip label={`Mod: ${diffLabel(game.difficulty)}`} />
              <Chip label={`Gün: ${Math.min(game.day, 30)}/30`} color="primary" />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Nakit: ${money(game.cash)}`} />
              <Chip label={`Kart borcu: ${money(game.cardDebt)}`} color={game.cardDebt > 0 ? 'warning' : 'default'} />
              <Chip label={`Dolap: ${game.fridge}%`} />
              <Chip label={`Moral: ${game.mood}%`} />
              <Chip label={`Enerji: ${game.energy}%`} />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Altın: ${game.gold}g (≈ ${money(game.gold * game.goldPrice)})`} />
              <Chip label={`Borsa: ${game.stocks}u (endeks ${game.stockIndex.toFixed(1)})`} />
              <Chip label={`Faiz: ${game.policyRate.toFixed(1)}%`} />
            </Stack>

            <FormControlLabel
              control={<Switch checked={useCard} onChange={(_, v) => setUseCard(v)} />}
              label={useCard ? 'Ödemelerde kredi kartı kullan (riskli)' : 'Ödemelerde nakit kullan'}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button variant="contained" onClick={advanceDay} disabled={finished}>
            Günü Bitir
          </Button>
          <Button variant="outlined" onClick={() => setGame(newGame(difficulty))}>
            Yeniden Başlat
          </Button>
        </CardActions>
      </Card>

      {!finished ? (
        <Stack spacing={2}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight={900}>Zorunlular</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                (Kurgusal) Kira {money(b.rent)} · Aidat {money(b.dues)} · Elektrik {money(b.electric)} · Doğalgaz {money(b.gas)} · İnternet {money(b.internet)}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                <Button size="small" variant="contained" onClick={() => act('payRent')}>Kira öde</Button>
                <Button size="small" variant="outlined" onClick={() => act('payDues')}>Aidat öde</Button>
                <Button size="small" variant="outlined" onClick={() => act('payElectric')}>Elektrik öde</Button>
                <Button size="small" variant="outlined" onClick={() => act('payGas')}>Doğalgaz öde</Button>
                <Button size="small" variant="outlined" onClick={() => act('payInternet')}>İnternet öde</Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight={900}>Günlük kararlar</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                <Button variant="contained" onClick={() => act('grocery')}>Market</Button>
                <Button variant="outlined" onClick={() => act('cinema')}>Sinema</Button>
                <Button variant="text" onClick={() => act('lightsOff')}>Işıkları kapat</Button>
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.75 }}>
                Dolap her gün azalır. Dolap biterse moral/enerji düşer (ve bazen kart borcu artar).
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight={900}>Piyasa</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                <Button size="small" variant="outlined" onClick={() => act('buyGold', 1)}>Altın al (1g)</Button>
                <Button size="small" variant="outlined" onClick={() => act('sellGold', 1)}>Altın sat (1g)</Button>
                <Button size="small" variant="outlined" onClick={() => act('buyStocks', 1)}>Hisse al (1u)</Button>
                <Button size="small" variant="outlined" onClick={() => act('sellStocks', 1)}>Hisse sat (1u)</Button>
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.75 }}>
                Kolay’da daha stabil; Zor’da daha volatil. Faiz değişimi borsayı baskılayabilir (oyuncak model).
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight={900}>Kredi Kartı</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                <Button size="small" variant="outlined" onClick={() => act('payCardMin')}>Asgari öde</Button>
                <Button size="small" variant="outlined" onClick={() => act('payCardAll')}>Kapat</Button>
              </Stack>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.75 }}>
                Ay sonunda kart borcuna faiz işler. Geciken kira/faturalar ceza doğurabilir.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight={900}>Günlük Haberler</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                Bu prototipte haberler log’a düşer ve piyasa oynaklığını temsil eder.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography fontWeight={900}>Günlük akış (log)</Typography>
              <Box sx={{ mt: 1 }}>
                {game.log.slice(0, 12).map((l, i) => (
                  <Typography key={i} variant="body2" sx={{ opacity: 0.85 }}>
                    • {l}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      ) : (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={900}>Ay Sonu Sonuç</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Skor: <b>{endScore}</b>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
              Nakit: <b>{money(game.cash)}</b> · Kart borcu: <b>{money(game.cardDebt)}</b>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
              Altın değeri: <b>{money(game.gold * game.goldPrice)}</b> · Hisse değeri: <b>{money(game.stocks * game.stockIndex * 20)}</b>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
              Kira: <b>{game.rentPaid ? 'ödendi' : 'ödenmedi'}</b> · Faturalar: <b>{Object.values(game.billsPaid).filter(Boolean).length}/4</b>
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {endScore >= 70
                ? 'Dengeyi kurdun: temel ihtiyaçlar + borç kontrolü + birikim.'
                : endScore >= 40
                  ? 'Kıl payı: bazı alanlarda açık var. Kart borcuna ve dolap planına dikkat.'
                  : 'Zorlu ay: borç/ödeme planı bozuldu. Önce zorunlular, sonra küçük eğlence.'}
            </Typography>

            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, opacity: 0.7 }}>
              Not: Bu bir prototiptir; rakamlar temsilîdir.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
