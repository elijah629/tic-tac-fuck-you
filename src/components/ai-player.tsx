"use client"

import { useGame } from "@/lib/game-store";
import { PlayerIndicator } from "./player-indicator";

export function AIPlayer() {
  const { ai } = useGame();

  return <div className="flex w-full justify-between p-4">
       <PlayerIndicator team={ai}/> HEY...
  </div>
}
