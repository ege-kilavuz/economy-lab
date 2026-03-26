import assert from 'node:assert/strict';

import { applyAction, newGame, nextDay, scoreEndOfMonth } from '../src/game/engine.ts';

function main() {
  const seeded = newGame('easy', 12345);
  const sameSeed = newGame('easy', 12345);
  assert.deepEqual(seeded.quest, sameSeed.quest, 'same seed should produce same initial quest');

  const afterRent = applyAction(seeded, 'payRent', { useCard: false });
  assert.equal(afterRent.rentPaid, true, 'rent should be marked paid after successful payment');

  const poorGame = { ...newGame('easy', 999), cash: 0 };
  const failedRent = applyAction(poorGame, 'payRent', { useCard: false });
  assert.equal(failedRent.rentPaid, false, 'rent should stay unpaid when balance is insufficient');
  assert.match(failedRent.log[0] ?? '', /Yetersiz bakiye/i, 'failed payment should log insufficient balance');

  const cardGame = applyAction(newGame('easy', 777), 'grocery', { useCard: true });
  assert.ok(cardGame.cardDebt > 0, 'card mode grocery should increase card debt');

  let progressed = newGame('normal', 4242);
  for (let i = 0; i < 5; i += 1) {
    progressed = nextDay(progressed);
  }
  assert.equal(progressed.day, 6, 'five day advances should move game to day 6');
  assert.ok(progressed.log.length > 0, 'game log should continue to populate');

  const score = scoreEndOfMonth({ ...progressed, day: 31 });
  assert.equal(Number.isFinite(score), true, 'end-of-month score should be finite');

  console.log('engine smoke test passed');
}

main();
