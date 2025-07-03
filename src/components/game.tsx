"use client";

import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { Team } from "@/lib/game";
import { useGame } from "@/lib/game-store";
import { useRouter } from "next/navigation";

export function Game({ onWin }: { onWin: () => Promise<void> }) {
  const { has_init, init, winner, human, ai } = useGame();
  const router = useRouter();

  return has_init ? (
    <main className="h-screen grid grid-rows-[min-content_auto_min-content] grid-cols-[1fr_2fr]">
      <Sidebar className="row-span-3" />
      <AIPlayer />
      <Board className="row-span-1 col-span-1 col-start-2 row-start-2" />
      <HumanPlayer />

      {winner !== false && (
        <div className="flex flex-col h-full w-full absolute top-0 left-0 z-10 bg-background/80 items-center justify-center gap-4 p-4">
          <h2 className="text-5xl text-center">
            {winner === ai?.team
              ? "PATHETIC... YOUR LOSS."
              : winner === human?.team
                ? "IMPOSSIBLE... VIA SHEER LUCK."
                : "GOOD... BUT NOT THAT GOOD."}
          </h2>
          <Button
            onClick={() => {
              router.refresh();
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
          onClick={() => init(Team.X, Team.X, Team.O, onWin)}
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
