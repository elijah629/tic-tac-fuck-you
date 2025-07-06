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
  const cardPool: { item: Card; weight: number }[] = [
    { item: team === Team.X ? Card.X : Card.O, weight: 5 },
  ];

  if (round >= 2 + difficulty) {
    cardPool.push(
      { item: Card.Block, weight: 1 },
      { item: Card.Lowercase, weight: 1 },
      { item: Card.Neutralize, weight: 2 },
    );
  }

  if (round >= 4 + difficulty) {
    cardPool.push(
      { item: Card.Extend, weight: 2 },
      { item: Card.Block, weight: 1 },
      { item: Card.Lowercase, weight: 1 },
      { item: Card.Neutralize, weight: 1 },
    );
  }

  if (round >= 6 + difficulty) {
    cardPool.push(
      { item: Card.Extend, weight: 4 },
      { item: Card.Block, weight: 2 },
      { item: Card.Lowercase, weight: 2 },
      { item: Card.Neutralize, weight: 2 },
    );
  }

  return weightedRandom(cardPool);
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
