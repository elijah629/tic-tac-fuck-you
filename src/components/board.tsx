"use client";

import { Cell } from "./cell";
import { useGame } from "@/lib/game";
import { cn } from "@/lib/utils";

export function Board({ className }: { className?: string }) {
  const {
    size: { rows, cols },
    cells,
  } = useGame((s) => s.board);

  return (
    <div className="flex items-center justify-center @container">
      <div
        className={cn(
          "grid max-w-[30cqw] w-full h-auto",
          className,
        )}
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
