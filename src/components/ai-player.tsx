"use client";

import { useGame } from "@/lib/game-store";
import { PlayerIndicator } from "./player-indicator";
import { cn } from "@/lib/utils";
import { CardFan } from "./card-fan";

export function AIPlayer({ className }: { className?: string }) {
  const { ai } = useGame();

  return (
    <div className={cn("flex w-full p-4 justify-between", className)}>
      <PlayerIndicator team={ai.team} />
      <div className="flex">
        <CardFan for={ai.team} cards={ai.cards} />
      </div>
    </div>
  );
}
