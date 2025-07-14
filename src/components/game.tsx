"use client";

import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { Difficulty, Team } from "@/types/game";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useMaybeGame } from "@/lib/game";

export function Game({ onWin }: { onWin: () => Promise<void> }) {
  const init = useMaybeGame((s) => s.init);
  const status = useMaybeGame((s) => s.status);
  const winner = useMaybeGame((s) => s.winner);
  const ai = useMaybeGame((s) => s.ai);
  const human = useMaybeGame((s) => s.human);

  const [difficulty, setDifficulty] = useState([50]);
  const d = diff(difficulty[0]);

  const [unset, setUnset] = useState(true);

  return status === "initialized" ? (
    <main className="h-screen grid grid-rows-[min-content_auto_min-content] grid-cols-[1fr_2fr]">
      <Sidebar className="row-span-3" />
      <AIPlayer className="hidden sm:flex" />
      <Board />
      <HumanPlayer />

      {winner !== false && (
        <div className="flex flex-col h-full w-full absolute top-0 left-0 z-10 bg-background/80 items-center justify-center gap-4 p-4">
          {winner === ai!.team ? (
            <>
              <h1 className="text-7xl text-center text-enemy">GAME OVER</h1>
              <h2 className="text-5xl text-center">PATHETIC... YOU LOSE</h2>
            </>
          ) : winner === human!.team ? (
            <>
              <h1 className="text-7xl text-center text-ally">WIN!</h1>
              <h2 className="text-5xl text-center">
                IMPOSSIBLE. VERY LUCKY.{" "}
                <span className="text-enemy font-bold">
                  DON&apos;T DO IT AGAIN...
                </span>
              </h2>
            </>
          ) : (
            <>
              <h1 className="text-7xl text-center text-neutral">TIE</h1>
              <h2 className="text-5xl text-center">
                GOOD... BUT NOT GOOD ENOUGH
              </h2>
            </>
          )}
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
    <main className="flex flex-col h-screen items-center justify-center gap-4 p-5">
      <h2 className="text-5xl text-center">
        {unset ? (
          <>
            PICK YOUR TEAM &amp; DIFFICULTY.{" "}
            <span className="text-enemy">CHOOSE WISELY.</span>
          </>
        ) : d === Difficulty.HARD ? (
          <>I DON&apos;T HAVE A NOSE AND I CAN SMELL YOUR DEFEAT.</>
        ) : d === Difficulty.NORMAL ? (
          <>YOU SELECTED THE DEFAULT. GOOD JOB IDIOT 👍</>
        ) : d === Difficulty.TODDLER ? (
          <>
            YOU&apos;RE <span className="italic">REALLY</span> THAT SCARED OF ME?
          </>
        ) : (
          <>🫵 ar fuckng stoped. (level impossible, pass ✅)</>
        )}
      </h2>
        <span>{difficulty[0].toFixed(1)}%{(difficulty[0] === 69 || difficulty[0] === 42) && ", nice"}</span>

        <div className="flex max-w-[80vw] w-full gap-4">
        <span className="text-neutral">👨‍🦲 INFANT</span> {/* Emoji font makes 👨‍🦲 appear like a baby ish */}
      <Slider
        max={100}
        min={0}
        step={1}
            className="flex-1"
        value={difficulty}
        onValueChange={(v) => {
          setUnset(false);
          setDifficulty(v);
        }}
      />
        <span className="text-enemy text-3xl">HARD ☠️</span>
        </div>
      <div className="flex rounded-md w-min">
        <Button
          onClick={() => init(Team.O, Team.X, Team.O, onWin, d)}
          size="icon"
          variant="enemy"
          className="rounded-none text-2xl"
        >
          X
        </Button>
        <Button
          onClick={() => {
            if (Math.random() > 0.51) { // Not random
              init(Team.X, Team.O, Team.X, onWin, d);
            } else {
              init(Team.O, Team.X, Team.O, onWin, d);
            }
          }}
          variant="neutral"
          className="rounded-none text-2xl"
        >
          Random?
        </Button>
        <Button
          onClick={() => {
            init(Team.X, Team.O, Team.X, onWin, d);
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

function diff(d: number): Difficulty {
  if (d >= 100) {
    return Difficulty.HARD;
  }

  if (d >= 50) {
    return Difficulty.NORMAL;
  }

  if (d >= 1) {
    return Difficulty.TODDLER;
  }

  return Difficulty.INFANT;
}
