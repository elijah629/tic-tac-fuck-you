"use client";

import { useGame } from "@/lib/game";
import { PlayerIndicator } from "@/components/player-indicator";
import { cn } from "@/lib/utils";

import { CardFan } from "@/components/card-fan";

export function HumanPlayer({ className }: { className?: string }) {
  const human = useGame((s) => s.human);
  const turn = useGame((s) => s.turn);

  return (
    <div className={cn("flex w-full justify-between p-4", className)}>
      <div className="flex h-min">
        <CardFan for={human.team} cards={human.cards} />
      </div>

      <PlayerIndicator active={human.team === turn} team={human.team} />
    </div>
  );
}
