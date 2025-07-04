"use client";

import { Cell } from "./cell";
import { useGame } from "@/lib/game-store";
import { cn } from "@/lib/utils";

export function Board({ className }: { className?: string }) {
  const {
    size: { rows, cols },
    cells,
  } = useGame().board!;

  return (
    <div className="flex items-center justify-center">
    <div
      className={cn("grid max-w-[50vw] w-full sm:max-h-[50vh] md:h-full md:w-auto md:max-w-none", className)}
      style={{
        aspectRatio: `${cols}/${rows}`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell, index) => (
        <Cell key={index} index={index} cell={cell} />
      ))}
    </div>
    </div>
  );
}
