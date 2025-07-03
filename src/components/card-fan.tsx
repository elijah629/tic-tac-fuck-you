"use client";

import { Card as C, EVENTS, Team } from "@/lib/game";
import { Card } from "./card";
import { useGame } from "@/lib/game-store";

export function CardFan(props: {
  for: Team;
  cards: { id: number; card: C }[];
}) {
  const { removeCard, turn, applyCardToCell, endTurn, xpEvent } = useGame();

  return props.cards.map(({ card, id }, i) => {
    const mid = (props.cards.length - 1) / 2;
    const offset = i - mid;
    const angle = offset * 2;
    const translateY = Math.abs(offset) * 5 - 14;

    return (
      <Card
        droppable={props.for === turn}
        key={id}
        id={id}
        onDrop={(card, x, y) => {
          if (applyCardToCell(y, x, card)) {
            xpEvent(EVENTS.PLACE);

            removeCard(props.for, id);
            endTurn();
            return true;
          } else {
            return false;
          }
        }}
        card={card}
        angle={angle}
        translateY={translateY}
      />
    );
  });
}
