"use client";

import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { Sidebar } from "@/components/sidebar";

import { useMaybeGame } from "@/lib/game";
import { NewGame } from "@/components/new-game";
import GameOver from "@/components/game-over";

export function Game({
  free,
  onWin,
}: {
  free: boolean;
  onWin: () => Promise<void>;
}) {
  const status = useMaybeGame((s) => s.status);
  const winner = useMaybeGame((s) => s.winner);

  return status === "initialized" ? (
    <main className="h-screen grid grid-rows-[min-content_auto_min-content] grid-cols-[1fr_2fr]">
      <Sidebar className="row-span-3" />
      <AIPlayer className="hidden sm:flex" />
      <Board />
      <HumanPlayer />

      {winner !== false && <GameOver free={free} winner={winner!} />}
    </main>
  ) : (
    <NewGame onWin={onWin} free={free} />
  );
}
