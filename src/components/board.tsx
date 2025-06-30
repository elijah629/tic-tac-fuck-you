import Cell from "./cell";
import { useContext } from "react";
import { GameContext } from "@/lib/game-context";

export function Board() {
  const game = useContext(GameContext).game;

  const { size: { rows, cols }, cells } = game.board;

  return (
    <div
      className="grid w-full max-w-2xl"
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
        >
          <Cell cell={cell}/>
        </div>

      })}
    </div>
  );
};
