import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import type { Difficulty, GameState } from '../types';
import { balanceFor } from '../balance';
import { Top, StatChips, panelSx, diffLabel } from './helpers';
import { AppIcon } from '../../ui/AppIcon';

type Screen = 'home' | 'bank' | 'market' | 'invest' | 'news' | 'candle' | 'card-escape' | 'budget-tetris' | 'news-noise' | 'scam-radar' | 'end';

interface Props {
  game: GameState;
  useCard: boolean;
  onSetUseCard: (v: boolean) => void;
  onSetDifficulty: (d: Difficulty) => void;
  onNavigate: (screen: Screen) => void;
  onAdvanceDay: () => void;
  onReset: () => void;
}

export function HomeScreen({ game, useCard, onSetUseCard, onSetDifficulty, onNavigate, onAdvanceDay, onReset }: Props) {
  return (
    <>
      <Top title="Telefon" />
      <Box sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Mod: <b>{diffLabel(game.difficulty)}</b> · Faiz: <b>{game.policyRate.toFixed(1)}%</b> · Puan: <b>{game.points}</b>
        </Typography>
        <Box sx={{ mt: 1 }}>
          <StatChips game={game} />
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
              control={<Switch checked={useCard} onChange={(_, v) => onSetUseCard(v)} />}
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
              <Button variant="outlined" onClick={onReset}>
                Sıfırla
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography sx={{ mt: 2, fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>Uygulamalar</Typography>
        <Card sx={{ mt: 1, ...panelSx }}>
          <CardContent sx={{ p: 1.5 }}>
            <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              <AppIcon label="Banka" color="#1d4ed8" emoji="🏦" onClick={() => onNavigate('bank')} />
              <AppIcon label="Market" color="#16a34a" emoji="🛒" onClick={() => onNavigate('market')} />
              <AppIcon label="Yatırım" color="#f59e0b" emoji="📈" onClick={() => onNavigate('invest')} />
              <AppIcon label="Haber" color="#7c3aed" emoji="📰" onClick={() => onNavigate('news')} />
              <AppIcon label="Kart" color="#f97316" emoji="💳" onClick={() => onNavigate('card-escape')} />
              <AppIcon label="Bütçe" color="#34d399" emoji="🧩" onClick={() => onNavigate('budget-tetris')} />
              <AppIcon label="Gürültü" color="#a78bfa" emoji="📰" onClick={() => onNavigate('news-noise')} />
              <AppIcon label="Radar" color="#ef4444" emoji="🛡️" onClick={() => onNavigate('scam-radar')} />
              <AppIcon label="Borsa" color="#fb7185" emoji="📈" onClick={() => onNavigate('candle')} />
              <AppIcon label="Uyku" color="#0ea5e9" emoji="🌙" onClick={onAdvanceDay} />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, ...panelSx }}>
          <CardContent>
            <Typography fontWeight={900}>Zorluk</Typography>
            <FormControl sx={{ mt: 1 }}>
              <RadioGroup row value={game.difficulty} onChange={(_, v) => onSetDifficulty(v as Difficulty)}>
                {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                  <FormControlLabel key={d} value={d} control={<Radio size="small" />} label={diffLabel(d)} />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
