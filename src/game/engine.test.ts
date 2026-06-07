import { describe, it, expect } from 'vitest';
import { newGame, applyAction, nextDay, scoreEndOfMonth, canAfford } from './engine';

describe('newGame', () => {
  it('should create a valid game state for each difficulty', () => {
    for (const diff of ['easy', 'normal', 'hard'] as const) {
      const game = newGame(diff, 12345);
      expect(game.day).toBe(1);
      expect(game.cash).toBeGreaterThan(0);
      expect(game.cardDebt).toBe(0);
      expect(game.rentPaid).toBe(false);
      expect(game.log.length).toBeGreaterThan(0);
      expect(game.difficulty).toBe(diff);
    }
  });

  it('should be deterministic with same seed', () => {
    const a = newGame('easy', 42);
    const b = newGame('easy', 42);
    expect(a.cash).toBe(b.cash);
    expect(a.quest.title).toBe(b.quest.title);
    expect(a.holdings).toEqual(b.holdings);
  });

  it('should produce different quests with different seeds after advancing', () => {
    // Initial quest is always the same; quest changes happen in nextDay
    const titles = new Set<string>();
    for (let s = 1; s <= 20; s++) {
      let g = newGame('easy', s);
      // Advance a few days to trigger quest re-roll
      for (let d = 0; d < 3; d++) {
        g = nextDay(g);
      }
      titles.add(g.quest.title);
    }
    expect(titles.size).toBeGreaterThan(1);
  });

  it('should have all mandatory fields', () => {
    const g = newGame('normal', 0);
    expect(g).toHaveProperty('day');
    expect(g).toHaveProperty('cash');
    expect(g).toHaveProperty('cardDebt');
    expect(g).toHaveProperty('fridge');
    expect(g).toHaveProperty('mood');
    expect(g).toHaveProperty('energy');
    expect(g).toHaveProperty('discipline');
    expect(g).toHaveProperty('holdings');
    expect(g).toHaveProperty('currentRent');
    expect(g).toHaveProperty('rentPaid');
    expect(g).toHaveProperty('difficulty');
    expect(g).toHaveProperty('seed');
    expect(g).toHaveProperty('log');
    expect(g).toHaveProperty('points');
    expect(g).toHaveProperty('quest');
    expect(g).toHaveProperty('goldPrice');
    expect(g).toHaveProperty('stockIndex');
    expect(g).toHaveProperty('usdTry');
    expect(g).toHaveProperty('btcTry');
    expect(g).toHaveProperty('ethTry');
    expect(g).toHaveProperty('policyRate');
  });

  it('should have different rent by difficulty', () => {
    const easy = newGame('easy');
    const hard = newGame('hard');
    expect(easy.currentRent).toBeLessThan(hard.currentRent);
  });
});

describe('applyAction', () => {
  it('should pay rent with cash', () => {
    const g = newGame('easy', 100);
    const result = applyAction(g, 'payRent', { useCard: false });
    expect(result.rentPaid).toBe(true);
    expect(result.cash).toBeLessThan(g.cash);
    expect(result.cardDebt).toBe(0);
  });

  it('should fail rent payment when insufficient cash', () => {
    const g = { ...newGame('easy', 200), cash: 0 };
    const result = applyAction(g, 'payRent', { useCard: false });
    expect(result.rentPaid).toBe(false);
    expect(result.log[0]).toMatch(/Yetersiz bakiye/i);
  });

  it('should not double-pay rent', () => {
    const g = newGame('easy', 300);
    const first = applyAction(g, 'payRent', { useCard: false });
    const second = applyAction(first, 'payRent', { useCard: false });
    expect(second.log[0]).toMatch(/zaten ödendi/i);
  });

  it('should pay rent with card', () => {
    const g = newGame('easy', 400);
    const result = applyAction(g, 'payRent', { useCard: true });
    expect(result.rentPaid).toBe(true);
    expect(result.cardDebt).toBeGreaterThan(0);
  });

  it('should do grocery shopping with cash', () => {
    const g = newGame('easy', 500);
    const result = applyAction(g, 'grocery', { useCard: false });
    expect(result.cash).toBeLessThan(g.cash);
    expect(result.fridge).toBeGreaterThan(g.fridge);
    expect(result.mood).toBeGreaterThanOrEqual(g.mood);
  });

  it('should do grocery shopping with card', () => {
    const g = newGame('easy', 600);
    const result = applyAction(g, 'grocery', { useCard: true });
    expect(result.cardDebt).toBeGreaterThan(0);
    expect(result.cash).toBe(g.cash);
  });

  it('should increase mood with cinema', () => {
    const g = newGame('easy', 700);
    const result = applyAction(g, 'cinema', { useCard: false });
    expect(result.mood).toBeGreaterThan(g.mood);
    expect(result.cash).toBeLessThan(g.cash);
  });

  it('should handle lightsOff action', () => {
    const g = newGame('easy', 800);
    const result = applyAction(g, 'lightsOff');
    expect(result.mood).toBeGreaterThanOrEqual(g.mood);
    expect(result.discipline).toBeGreaterThan(g.discipline);
    expect(result.cash).toBe(g.cash); // free action
  });

  it('should buy assets', () => {
    const g = newGame('easy', 900);
    const result = applyAction(g, 'buyAsset', { asset: 'gold', amount: 1 });
    expect(result.holdings.gold).toBe(1);
    expect(result.cash).toBeLessThan(g.cash);
  });

  it('should fail to buy asset without cash', () => {
    const g = { ...newGame('easy', 1000), cash: 0 };
    const result = applyAction(g, 'buyAsset', { asset: 'gold', amount: 1 });
    expect(result.holdings.gold).toBe(0);
    expect(result.log[0]).toMatch(/yeterli nakit/i);
  });

  it('should sell assets', () => {
    const g = { ...newGame('easy', 1100), holdings: { gold: 5, stock: 0, usd: 0, btc: 0, eth: 0 } };
    const result = applyAction(g, 'sellAsset', { asset: 'gold', amount: 2 });
    expect(result.holdings.gold).toBe(3);
    expect(result.cash).toBeGreaterThan(g.cash);
  });

  it('should fail sell when insufficient holdings', () => {
    const g = newGame('easy', 1200);
    const result = applyAction(g, 'sellAsset', { asset: 'gold', amount: 1 });
    expect(result.log[0]).toMatch(/satacak varlık/i);
  });

  it('should pay minimum card payment', () => {
    const g = { ...newGame('easy', 1300), cardDebt: 10000, cash: 10000 };
    const result = applyAction(g, 'payCardMin');
    expect(result.cardDebt).toBeLessThan(g.cardDebt);
    expect(result.cash).toBeLessThan(g.cash);
  });

  it('should fail minimum payment without cash', () => {
    const g = { ...newGame('easy', 1400), cardDebt: 10000, cash: 0 };
    const result = applyAction(g, 'payCardMin');
    expect(result.cardDebt).toBe(10000); // unchanged
  });

  it('should pay all card debt', () => {
    const g = { ...newGame('easy', 1500), cardDebt: 5000, cash: 10000 };
    const result = applyAction(g, 'payCardAll');
    expect(result.cardDebt).toBe(0);
    expect(result.cash).toBe(5000);
    expect(result.mood).toBeGreaterThan(g.mood);
  });

  it('should not pay when no card debt', () => {
    const g = newGame('easy', 1600);
    const result = applyAction(g, 'payCardAll');
    expect(result.log[0]).toMatch(/kart borcu yok/i);
  });

  it('should handle payBill actions (electric/gas/internet/dues)', () => {
    for (const bill of ['payElectric', 'payGas', 'payInternet', 'payDues'] as const) {
      const g = newGame('easy', 1700);
      const result = applyAction(g, bill, { useCard: false });
      expect(result.cash).toBeLessThan(g.cash);
      const billKey = bill.replace('pay', '').toLowerCase() as 'electric' | 'gas' | 'internet' | 'dues';
      expect(result.billsPaid[billKey]).toBe(true);
    }
  });

  it('should detect portfolio concentration warning on buyAsset', () => {
    let g = newGame('easy', 1800);
    g = applyAction(g, 'buyAsset', { asset: 'gold', amount: 3 });
    const concentrationLog = g.log.find(l => l.includes('yoğunlaşıyor'));
    expect(concentrationLog).toBeDefined();
  });
});

describe('nextDay', () => {
  it('should advance day by 1', () => {
    const g = newGame('easy', 2000);
    const next = nextDay(g);
    expect(next.day).toBe(2);
  });

  it('should decrease fridge by ~6 each day', () => {
    const g = newGame('easy', 2100);
    const next = nextDay(g);
    expect(next.fridge).toBeLessThan(g.fridge);
  });

  it('should stop advancing at day 30', () => {
    let g = newGame('easy', 2500);
    // Advance to day 30
    for (let i = 1; i < 30; i++) {
      g = nextDay(g);
    }
    expect(g.day).toBe(30);
    // One more nextDay should stay at 30 (engine caps it)
    const final = nextDay(g);
    expect(final.day).toBe(30);
  });

  it('should add new quest entry when day advances', () => {
    let g = newGame('easy', 2600);
    while (g.day < 5) {
      g = nextDay(g);
    }
    expect(g.log.some(l => l.includes('başladı'))).toBe(true);
  });

  it('should apply rent penalty on day 10 if unpaid', () => {
    let g = newGame('easy', 2200);
    // Advance to day 9
    for (let i = 1; i < 9; i++) {
      g = nextDay(g);
    }
    expect(g.day).toBe(9);
    expect(g.rentPaid).toBe(false);

    // Advance to day 10 - penalty checks day 10 during nextDay processing
    g = nextDay(g);
    expect(g.day).toBe(10);

    // One more nextDay processes day 10 (penalty triggers at s.day === 10)
    g = nextDay(g);
    const penaltyLog = g.log.find(l => l.includes('Kira gecikti'));
    expect(penaltyLog).toBeDefined();
  });

  it('should apply card interest on day 30', () => {
    let g = { ...newGame('easy', 2400), cardDebt: 10000 };
    // Advance to day 29
    for (let i = 1; i < 29; i++) {
      g = nextDay(g);
    }
    expect(g.day).toBe(29);

    // Next call processes day 29 → becomes day 30
    g = nextDay(g);
    expect(g.day).toBe(30);

    // Next call processes day 30 → interest applied
    g = nextDay(g);
    const interestLog = g.log.find(l => l.includes('kart faizi'));
    expect(interestLog).toBeDefined();
  });

  it('should apply bill penalty on day 20 if unpaid', () => {
    let g = newGame('easy', 2700);
    // Advance to day 19
    for (let i = 1; i < 19; i++) {
      g = nextDay(g);
    }
    expect(g.day).toBe(19);

    // Day 20 processes
    g = nextDay(g);
    expect(g.day).toBe(20);

    // Process day 20 → penalty
    g = nextDay(g);
    const penaltyLog = g.log.find(l => l.includes('Faturalar gecikiyor'));
    expect(penaltyLog).toBeDefined();
  });
});

describe('canAfford', () => {
  it('should return true when cash is sufficient', () => {
    const g = { ...newGame('easy', 3000), cash: 1000 };
    expect(canAfford(g, 500)).toBe(true);
  });

  it('should return false when cash is insufficient', () => {
    const g = { ...newGame('easy', 3100), cash: 100 };
    expect(canAfford(g, 500)).toBe(false);
  });
});

describe('scoreEndOfMonth', () => {
  it('should produce a finite positive score', () => {
    const g = { ...newGame('easy', 4000), day: 31 };
    const score = scoreEndOfMonth(g);
    expect(Number.isFinite(score)).toBe(true);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should give higher score for better financial decisions', () => {
    // Good game: paid rent, paid bills, no debt, high stats
    let good = newGame('easy', 4100);
    good = applyAction(good, 'payRent', { useCard: false });
    for (const bill of ['payElectric', 'payGas', 'payInternet', 'payDues'] as const) {
      good = applyAction(good, bill, { useCard: false });
    }
    good = { ...good, day: 31, cardDebt: 0, fridge: 70, mood: 80, discipline: 80 };
    const goodScore = scoreEndOfMonth(good);

    // Bad game: unpaid rent, high debt, low stats
    const bad = { ...newGame('easy', 4200), day: 31, rentPaid: false, cardDebt: 20000, fridge: 10, mood: 20, discipline: 10 };
    const badScore = scoreEndOfMonth(bad);

    expect(goodScore).toBeGreaterThan(badScore);
  });
});
