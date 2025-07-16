import Image from "next/image";

import styles from "@/components/card.module.css";
import { Card as C } from "@/types/game";
import { cardSrc } from "@/lib/cards";

const WIDTH = 71;
const HEIGHT = 95;

export function StaticCard({
  card,
  id,
  angle,
  translateY,
}: {
  card: C;
  id: number;
  angle?: number;
  translateY?: number;
}) {
  return (
    <Image
      width={WIDTH}
      height={HEIGHT}
      draggable={false}
      alt="Card"
      src={cardSrc(card)}
      className={`transition-transform duration-300 ease-out hover:-translate-y-4 ${styles.wave}`}
      style={{
        ["--base-transform" as string]: `translate(0px, ${translateY ?? 0}px) rotate(${angle ?? 0}deg)`,
        animationDelay: `-${((id * 16807) % 1000) / 1000}s`,
      }}
    />
  );
}
