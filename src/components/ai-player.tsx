"use client";

import { useGame } from "@/lib/game";
import { PlayerIndicator } from "./player-indicator";
import { cn } from "@/lib/utils";
import { StaticCardFan } from "./static-card-fan";

export function AIPlayer({ className }: { className?: string }) {
  const turn = useGame((s) => s.turn);
  const ai = useGame((s) => s.ai);

  return (
    <div className={cn("w-full p-4 items-stretch", className)}>
      <PlayerIndicator active={ai.team === turn} team={ai.team} />
      <div className="flex h-min ml-auto">
        <StaticCardFan cards={ai.cards} />
      </div>
    </div>
  );
}
