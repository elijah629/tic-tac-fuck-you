"use client";

import { useGame } from "@/lib/game";
import { Winner } from "@/lib/game/win-check";
import { Button } from "@/components/ui/button";
import { Difficulty } from "@/types/game";

export default function GameOver({ winner, free }: { winner: Winner, free: boolean }) {
  const ai = useGame((s) => s.ai);
  const human = useGame((s) => s.human);
  const difficulty = useGame(s => s.difficulty);
  const reset = useGame((s) => s.reset);

  return (
    <div className="flex flex-col h-full w-full absolute top-0 left-0 z-10 bg-background/80 items-center justify-center gap-4 p-4">
      {winner === ai.team ? (
        <>
          <h1 className="text-7xl text-center text-enemy">GAME OVER</h1>
          <h2 className="text-5xl text-center">PATHETIC... YOU LOSE</h2>
        </>
      ) : winner === human.team ? (
        <>
          <h1 className="text-7xl text-center text-ally">WIN!</h1>
          <h2 className="text-5xl text-center">
            IMPOSSIBLE. VERY LUCKY.{" "}
            <span className="text-enemy font-bold">
              DON&apos;T DO IT AGAIN...
            </span>
          </h2>
          { difficulty !== Difficulty.HARD || free && <h3>TO LOG ON LEADERBOARD: PLAY {difficulty !== Difficulty.HARD && "IN HARD MODE"} {free && " WHILE SIGNED IN"}</h3> }
        </>
      ) : (
        <>
          <h1 className="text-7xl text-center text-neutral">TIE</h1>
          <h2 className="text-5xl text-center">GOOD... BUT NOT GOOD ENOUGH</h2>
        </>
      )}
      <Button
        onClick={() => {
          reset();
        }}
        variant="neutral"
        className="text-2xl"
      >
        Again?
      </Button>
    </div>
  );
}
