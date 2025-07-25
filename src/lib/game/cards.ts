import { Card, Difficulty, Player, Team } from "@/types/game";

export function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, entry) => sum + entry.weight, 0);
  const r = Math.random() * totalWeight;
  let acc = 0;
  for (const { item, weight } of items) {
    acc += weight;
    if (r < acc) return item;
  }
  // Fallback (should never happen if weights are correct)
  return items[0].item;
}

export function sampleCard(
  round: number,
  team: Team,
  difficulty: Difficulty,
): Card {
  const teamCard = team === Team.X ? Card.X : Card.O;

  // RBN Algo
  // R - Rate per round
  // B - Base value
  // N - Unlock round
  //
  // max(b, b + r(x - n))
  const rates =
    difficulty === Difficulty.HARD
      ? new Map<Card, [number, number, number]>([
          [teamCard, [2, 0, 3]],

          [Card.Block, [0.5, 10, 0]],
          [Card.Lowercase, [0.9, 0.2, 6]],
          [Card.Neutralize, [0.9, 0.2, 6]],

          [Card.Extend, [2, 0.2, 1]],
          [Card.DecrementWinLength, [0.6, 0.2, 11]],
          [Card.IncrementWinLength, [0.6, 0.2, 11]],
          [Card.Roulette, [1, 0.1, 14]],
          [Card.ScientificReaction, [1, 0.1, 14]],
        ]) :new Map<Card, [number, number, number]>([
          [teamCard, [1.2, 10, difficulty]],

          [Card.Block, [0.9, 2, 5 + difficulty]],
          [Card.Lowercase, [0.9, 2, 5 + difficulty]],
          [Card.Neutralize, [0.9, 2, 5 + difficulty]],

          [Card.Extend, [0.6, 1, 6 + difficulty]],
          [Card.DecrementWinLength, [0.6, 1, 6 + difficulty]],
          [Card.IncrementWinLength, [0.6, 1, 6 + difficulty]],
          [Card.Roulette, [0.5, 1, 8 + difficulty]],
          [Card.ScientificReaction, [0.5, 1, 8 + difficulty]],
        ]);

  const weights = new Map<Card, number>([]);

  for (const [card, [r, b, n]] of rates) {
    weights.set(card, Math.max(b, b + r * (round - n)));
  }

  const pool = Array.from(weights.entries())
    .filter(([, w]) => w > 0)
    .map(([item, weight]) => ({ item, weight }));

  return weightedRandom(pool);
}

export function removeCard(player: Player, id?: number): Player {
  if (id !== undefined) {
    return {
      ...player,
      cards: player.cards.filter((x) => x.id !== id),
    };
  } else {
    const cards = player.cards;
    cards.pop();

    return {
      ...player,
      cards,
    };
  }
}
