"use client";

import { Difficulty, EVENTS, Team } from "@/types/game";
import { Slider } from "@/components/ui/slider";
import { play } from "@/lib/settings";
import { useMaybeGame } from "@/lib/game";
import { SFX_SOUNDS } from "@/types/settings";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export function NewGame({
  onWin: ow,
  free,
}: {
  onWin: () => Promise<void>;
  free: boolean;
}) {
  const init = useMaybeGame((s) => s.init);
  const addXpEvent = useMaybeGame((s) => s.addXpEvent);

  const [difficulty, setDifficulty] = useState([50]);
  const d = diff(difficulty[0]);

  const [unset, setUnset] = useState(true);

  const onWin = async (winner: "human" | "tie" | "ai") => {
    if (winner === "human") {
      if (d === Difficulty.HARD && !free) {
        await ow(); // Also prevents server side, but no need for an API call!
      }
      addXpEvent(EVENTS.WIN);
      play(SFX_SOUNDS.WIN, false);
    } else if (winner === "tie") {
      play(SFX_SOUNDS.TIE, false);
    } else {
      play(SFX_SOUNDS.LOSS, false);
    }
  };

  return (
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
            YOU&apos;RE <span className="italic">REALLY</span> THAT SCARED OF
            ME?
          </>
        ) : (
          <>🫵 ar fuckng stoped. (level impossible, pass ✅)</>
        )}
      </h2>
      <span>
        {difficulty[0].toFixed(1)}%
        {(difficulty[0] === 69 || difficulty[0] === 42) && ", nice"}
      </span>

      <div className="flex max-w-[80vw] w-full gap-4">
        <span className="text-neutral">👨‍🦲 INFANT</span>{" "}
        {/* Emoji font makes 👨‍🦲 appear like a baby ish */}
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
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => init(Team.O, Team.X, Team.O, onWin, d)}
          variant="enemy"
          className="text-2xl"
        >
          X
        </Button>
        <Button
          onClick={() => {
            if (Math.random() > 0.51) {
              // Not random
              init(Team.X, Team.O, Team.X, onWin, d);
            } else {
              init(Team.O, Team.X, Team.O, onWin, d);
            }
          }}
          size="lg"
          variant="neutral"
          className="text-2xl"
        >
          Random?
        </Button>
        <Button
          onClick={() => {
            init(Team.X, Team.O, Team.X, onWin, d);
          }}
          variant="ally"
          className="text-2xl"
        >
          O
        </Button>
      </div>
    </main>
  );
}
