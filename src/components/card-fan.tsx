import { Card as C } from "@/lib/game";
import { Card } from "./card";

export function CardFan({ cards }: { cards: C[] }) {
  return (
    <div className="flex">
      {cards.map((card, i) => {
        const mid = (cards.length - 1) / 2;
        const offset = i - mid;
        const angle = offset * 2;
        const translateY = Math.abs(offset) * 5 - 14;

        return (
          <Card
            key={i}
            id={i}
            card={card}
            angle={angle}
            translateY={translateY}
          />
        );
      })}
    </div>
  );
}
