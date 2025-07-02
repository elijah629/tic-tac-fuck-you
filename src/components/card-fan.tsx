"use client";

import { Card as C, Team } from "@/lib/game";
import { Card } from "./card";
import { useGame } from "@/lib/game-store";

export function CardFan(props: {
  for: Team;
  cards: { id: number; card: C }[];
}) {
  const { removeCard } = useGame();

  return (
      props.cards.map(({ card, id }, i) => {
        const mid = (props.cards.length - 1) / 2;
        const offset = i - mid;
        const angle = offset * 2;
        const translateY = Math.abs(offset) * 5 - 14;

        return (
          <Card
            key={id}
            id={id}
            onDrop={() => {
              removeCard(props.for, id);
            }}
            card={card}
            angle={angle}
            translateY={translateY}
          />
        );
      })  );
}
