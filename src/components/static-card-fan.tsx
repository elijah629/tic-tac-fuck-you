import { Card as C } from "@/types/game";
import { StaticCard } from "@/components/static-card";

export function StaticCardFan(props: { cards: { id: number; card: C }[] }) {
  return props.cards.map(({ card, id }, i) => {
    const mid = (props.cards.length - 1) / 2;
    const offset = i - mid;
    const angle = offset * 2;
    const translateY = Math.abs(offset) * 5 - 14;

    return (
      <StaticCard
        key={id}
        id={id}
        card={card}
        angle={angle}
        translateY={translateY}
      />
    );
  });
}
