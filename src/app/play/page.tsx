"use client";

import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { Button } from "@/components/ui/button";
import { XpSidebar } from "@/components/xp-sidebar";
import { Team } from "@/lib/game";
import { useGame } from "@/lib/game-store";

export default function Play() {
  const { has_init, init } = useGame();

  return has_init ? (
    <main className="grid max-h-full grid-cols-[1fr_2fr] gap-4">
      <XpSidebar className="row-span-3" />
      <AIPlayer />
      <Board className="col-start-2 row-start-2" />
      <HumanPlayer className="col-start-2 row-start-3" />
    </main>
  ) : (
    <main className="flex flex-col h-full items-center justify-center gap-4">
      <h2 className="text-5xl text-center">PICK YOUR TEAM. CHOOSE WISELY.</h2>
      <div className="flex rounded-md w-min">
        <Button
          onClick={() => init(Team.O, Team.X, Team.O)}
          size="icon"
          variant="enemy"
          className="rounded-none text-2xl"
        >
          X
        </Button>
        <Button
          onClick={() => {
            if (Math.random() > 0.5) {
              init(Team.X, Team.O, Team.X);
            } else {
              init(Team.O, Team.X, Team.O);
            }
          }}
          variant="neutral"
          className="rounded-none text-2xl"
        >
          Random?
        </Button>
        <Button
          onClick={() => {
            init(Team.X, Team.O, Team.X);
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
