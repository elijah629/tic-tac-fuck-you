"use client";

import { Cell } from "./cell";
import { useGame } from "@/lib/game-store";
import { cn } from "@/lib/utils";

export function Board({ className }: { className?: string }) {
  const {
    board: {
      size: { rows, cols },
      cells,
    },
  } = useGame();

  return (
    <div
      // w-h is intentional
      className={cn("grid max-w-[50vh] w-full mx-auto", className)}
      style={{
        aspectRatio: `${cols}/${rows}`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell, index) => <Cell key={index} index={index} cell={cell}/>)}
    </div>
  );
}
