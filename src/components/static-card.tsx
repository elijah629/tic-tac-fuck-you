import Image from "next/image";

import styles from "@/components/card.module.css";
import { Card as C } from "@/lib/game";
import { cardSrc } from "./card";

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
  angle: number;
  translateY: number;
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
        zIndex: 10,
        ["--base-transform" as string]: `translate(0px, ${translateY}px) rotate(${angle}deg)`,
        animationDelay: `-${((id * 16807) % 1000) / 1000}s`,
      }}
    />
  );
}
