"use client";

import { useGame } from "@/lib/game-store";
import { PlayerIndicator } from "./player-indicator";
import { cn } from "@/lib/utils";

import { CardFan } from "./card-fan";

export function HumanPlayer({ className }: { className?: string }) {
  const { human } = useGame();

  return (
    <div className={cn("flex w-full justify-between p-4", className)}>
      <CardFan cards={human.cards} />

      <PlayerIndicator team={human.team} />
    </div>
  );
}
