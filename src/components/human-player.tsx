"use client"

import { useGame } from "@/lib/game-store";
import { PlayerIndicator } from "./player-indicator";

export function HumanPlayer() {
  const { human } = useGame();

  return <div className="flex w-full justify-between p-4">
       Hey <PlayerIndicator team={human}/>
  </div>
}
