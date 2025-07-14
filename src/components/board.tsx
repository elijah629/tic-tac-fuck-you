"use client";

import { Cell } from "./cell";
import { useGame } from "@/lib/game";
import { cn } from "@/lib/utils";

export function Board({ className }: { className?: string }) {
  const {
    size: { rows, cols },
    cells,
  } = useGame((s) => s.board);

  const colBound = cols > rows;

  return (
    <div className="flex items-center justify-center @container">
      <div
        className={cn(
          "grid",
          colBound
            ? "max-w-[90cqw] lg:max-w-[60cqw] xl:max-w-[50cqw] w-full h-auto"
            : "max-h-[90cqw] xl:max-h-[50cqw] h-full w-auto",
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
