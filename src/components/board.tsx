"use client";

import { EVENTS } from "@/lib/game";
import Cell from "./cell";
import { useGame } from "@/lib/game-store";

export function Board() {
  const { board: { size: { rows, cols }, cells }, set, xpEvent } = useGame();

  return (
    <div
      className="grid w-full mx-auto max-w-2xl"
      style={{
        aspectRatio: `${cols}/${rows}`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {cells.map((cell, index) => {
        const x = index % cols;
        const y = index / cols | 0;

        const isTop    = y === 0;
        const isLeft   = x === 0;
        const isRight  = x === cols - 1;
        const isBottom = y === rows - 1;

        return <div
          className="flex items-center justify-center border-primary border-2"
          key={`${x}-${y}`}
          style={{
            borderTop:    isTop    ? 'none' : undefined,
            borderLeft:   isLeft   ? 'none' : undefined,
            borderRight:  isRight  ? 'none' : undefined,
            borderBottom: isBottom ? 'none' : undefined,
          }}
          onClick={() => {
            set(index, index % 3);
            xpEvent(EVENTS.PLACE);
          }}
        >
          <Cell cell={cell}/>
        </div>

      })}
    </div>
  );
};
