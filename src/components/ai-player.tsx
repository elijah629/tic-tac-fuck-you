"use client";

import { useGame } from "@/lib/game";
import { PlayerIndicator } from "@/components/player-indicator";
import { cn } from "@/lib/utils";
import { StaticCardFan } from "@/components/static-card-fan";
import taunt from "@/components/taunt.module.css";

export function AIPlayer() {
  const turn = useGame((s) => s.turn);
  const ai = useGame((s) => s.ai);
  const expression = useGame((s) => s.ai_expression);

  return (
    <>
    <div className="w-full p-4 items-stretch hidden tall:flex">
      <div className={taunt.taunt}>
        <PlayerIndicator
          active={ai.team === turn}
          team={expression ?? ai.team}
        />
      </div>
      <div className="flex h-min ml-auto">
        <StaticCardFan cards={ai.cards} />
      </div>
    </div>
      <div className="block tall:hidden"></div>
    </>
  );
}
