import { Box } from '@mui/material';
import type { GameState } from '../types';
import { StatChips, Top } from './helpers';
import { CandleGame } from '../../modules/candleGame';
import { CardEscape } from '../../modules/cardEscape';
import { BudgetTetris } from '../../modules/budgetTetris';
import { NewsNoiseGame } from '../../modules/newsNoise';
import { ScamRadarGame } from '../../modules/scamRadar';

type MiniGameId = 'candle' | 'card-escape' | 'budget-tetris' | 'news-noise' | 'scam-radar';

interface Props {
  game: GameState;
  gameId: MiniGameId;
  onBack: () => void;
}

const TITLES: Record<MiniGameId, string> = {
  candle: 'Borsa Oyunu',
  'card-escape': 'Kart Kaçışı',
  'budget-tetris': 'Bütçe Tetris',
  'news-noise': 'Haber mi Gürültü mü?',
  'scam-radar': 'Dolandırıcılık Radar',
};

export function MiniGameScreen({ game, gameId, onBack }: Props) {
  const content = (() => {
    switch (gameId) {
      case 'candle': return <CandleGame />;
      case 'card-escape': return <CardEscape />;
      case 'budget-tetris': return <BudgetTetris />;
      case 'news-noise': return <NewsNoiseGame />;
      case 'scam-radar': return <ScamRadarGame />;
    }
  })();

  return (
    <>
      <Top title={TITLES[gameId]} onBack={onBack} />
      <Box sx={{ pt: 1 }}>
        <StatChips game={game} />
        <Box sx={{ mt: 2 }}>{content}</Box>
      </Box>
    </>
  );
}

export type { MiniGameId };
