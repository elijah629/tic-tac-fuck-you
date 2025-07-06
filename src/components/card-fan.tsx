"use client";

import { Card as C, EVENTS, Team } from "@/types/game";
import { Card } from "./card";
import { useGame } from "@/lib/game";

export function CardFan(props: {
  for: Team;
  cards: { id: number; card: C }[];
}) {
  const removeCard = useGame((s) => s.removeCard);
  const turn = useGame((s) => s.turn);
  const applyCard = useGame((s) => s.applyCard);
  const addXpEvent = useGame((s) => s.addXpEvent);
  const endTurn = useGame((s) => s.endTurn);

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
          if (applyCard(y, x, card, false)) {
            switch (card) {
              case C.Lowercase:
                addXpEvent(EVENTS.ULTRA_GOOBER_BONUS);
              case C.Extend:
                addXpEvent(EVENTS.MAGICAL_BONUS);
              case C.Block:
              case C.Neutralize:
                addXpEvent(EVENTS.SPECIAL_BONUS);
              case C.X:
              case C.O:
                addXpEvent(EVENTS.PLACE);
                break;
            }

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
