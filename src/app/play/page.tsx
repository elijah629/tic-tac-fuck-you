"use client";

import { Board } from "@/components/board";
import { XpSidebar } from "@/components/xp-sidebar";
import { Game } from "@/lib/game";
import { GameContext } from "@/lib/game-context";


function GameRunner() {
//  const game = useContext<Game | null>(GameContext)!;

  return <>
    <XpSidebar/>
    <Board/>
  </>;
}

export default function Play() {
return <GameContext value={new Game(0)}>
    <GameRunner/>
  </GameContext>
}
