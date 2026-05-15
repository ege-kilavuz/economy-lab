import React from 'react';
import { PhoneFrame } from '../ui/PhoneFrame';
import type { Difficulty, HoldingId, ActionId } from './types';
import { applyAction, newGame, nextDay } from './engine';
import { categoryForLog } from './screens/helpers';
import { HomeScreen } from './screens/HomeScreen';
import { BankScreen } from './screens/BankScreen';
import { MarketScreen } from './screens/MarketScreen';
import { InvestScreen } from './screens/InvestScreen';
import { NewsScreen } from './screens/NewsScreen';
import { EndScreen } from './screens/EndScreen';
import { MiniGameScreen, type MiniGameId } from './screens/MiniGameScreens';

type Screen = 'home' | 'bank' | 'market' | 'invest' | 'news' | MiniGameId | 'end';

interface Props {
  onEvent?: (msg: string) => void;
  onSummary?: (s: { cash: number; cardDebt: number; mood: number; day: number }) => void;
}

export function MonthSimModule({ onEvent, onSummary }: Props) {
  const [difficulty, setDifficultyState] = React.useState<Difficulty>('easy');
  const [useCard, setUseCard] = React.useState(false);
  const [screen, setScreen] = React.useState<Screen>('home');
  const [game, setGame] = React.useState(() => newGame('easy'));

  React.useEffect(() => {
    setGame(newGame(difficulty));
    setScreen('home');
  }, [difficulty]);

  const finished = game.day > 30;

  function act(action: ActionId, opts?: { amount?: number; asset?: HoldingId }) {
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

  return (
    <PhoneFrame>
      {screen === 'home' && (
        <HomeScreen
          game={game}
          useCard={useCard}
          onSetUseCard={setUseCard}
          onSetDifficulty={setDifficultyState}
          onNavigate={setScreen}
          onAdvanceDay={advanceDay}
          onReset={() => setGame(newGame(difficulty))}
        />
      )}
      {screen === 'bank' && (
        <BankScreen game={game} onAction={act} onBack={() => setScreen('home')} />
      )}
      {screen === 'market' && (
        <MarketScreen game={game} onAction={act} onBack={() => setScreen('home')} />
      )}
      {screen === 'invest' && (
        <InvestScreen game={game} onAction={act} onBack={() => setScreen('home')} />
      )}
      {screen === 'news' && (
        <NewsScreen game={game} onAction={act} onBack={() => setScreen('home')} />
      )}
      {(['candle', 'card-escape', 'budget-tetris', 'news-noise', 'scam-radar'] as const).includes(screen as any) && (
        <MiniGameScreen game={game} gameId={screen as MiniGameId} onBack={() => setScreen('home')} />
      )}
      {screen === 'end' && (
        <EndScreen
          game={game}
          onRestart={(d) => setGame(newGame(d))}
          onBack={() => setScreen('home')}
        />
      )}
    </PhoneFrame>
  );
}
