"use client";

import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { Team } from "@/lib/game";
import { useGame } from "@/lib/game-store";

export function Game({ onWin }: { onWin: () => Promise<void> }) {
  const { has_init, init, winner, human, ai } = useGame();

  return has_init ? (
    <main className="h-screen grid grid-rows-[min-content_auto_min-content] grid-cols-[1fr_2fr]">
      <Sidebar className="row-span-3" />
      <AIPlayer className="hidden sm:flex" />
      <Board />
      <HumanPlayer />

      {winner !== false && (
        <div className="flex flex-col h-full w-full absolute top-0 left-0 z-10 bg-background/80 items-center justify-center gap-4 p-4">
          {winner === ai?.team ?
            <>
              <h1 className="text-7xl text-center text-enemy">GAME OVER</h1>
              <h2 className="text-5xl text-center">PATHETIC... YOUR LOSS</h2>
            </> : winner === human?.team ? <>
              <h1 className="text-7xl text-center text-ally">WIN!</h1>
              <h2 className="text-5xl text-center">IMPOSSIBLE. VERY LUCKY. <span className="text-enemy font-bold">DON&apos;T DO IT AGAIN</span></h2>
            </> : <>
              <h1 className="text-7xl text-center text-neutral">TIE</h1>
              <h2 className="text-5xl text-center">GOOD... BUT NOT GOOD ENOUGH</h2>
            </>}
          <Button
            onClick={() => {
              location.reload();
            }}
            variant="neutral"
            className="text-2xl"
          >
            Again?
          </Button>
        </div>
      )}
    </main>
  ) : (
    <main className="flex flex-col h-screen items-center justify-center gap-4">
      <h2 className="text-5xl text-center">
        PICK YOUR TEAM. <span className="text-enemy">CHOOSE WISELY.</span>
      </h2>
      <div className="flex rounded-md w-min">
        <Button
          onClick={() => init(Team.O, Team.X, Team.O, onWin)}
          size="icon"
          variant="enemy"
          className="rounded-none text-2xl"
        >
          X
        </Button>
        <Button
          onClick={() => {
            if (Math.random() > 0.5) {
              init(Team.X, Team.O, Team.X, onWin);
            } else {
              init(Team.O, Team.X, Team.O, onWin);
            }
          }}
          variant="neutral"
          className="rounded-none text-2xl"
        >
          Random?
        </Button>
        <Button
          onClick={() => {
            init(Team.X, Team.O, Team.X, onWin);
          }}
          variant="ally"
          className="rounded-none text-2xl"
        >
          O
        </Button>
      </div>
    </main>
  );
}
