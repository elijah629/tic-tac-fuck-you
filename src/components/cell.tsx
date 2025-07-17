"use client";

import { Cell as C } from "@/types/game";
import { useGame } from "@/lib/game";

export function Cell({ index, cell }: { index: number; cell: C }) {
  const { rows, cols } = useGame((s) => s.board.size);

  const x = index % cols;
  const y = (index / cols) | 0;

  const isTop = y === 0;
  const isLeft = x === 0;
  const isRight = x === cols - 1;
  const isBottom = y === rows - 1;

  return (
    <div
      data-board-cell
      data-board-cell-x={x}
      data-board-cell-y={y}
      className="flex items-center justify-center hover:bg-secondary @container border-primary border-2"
      key={`${x}-${y}`}
      style={{
        borderTop: isTop ? "none" : undefined,
        borderLeft: isLeft ? "none" : undefined,
        borderRight: isRight ? "none" : undefined,
        borderBottom: isBottom ? "none" : undefined,
      }}
    >
      <CellContent cell={cell} />
    </div>
  );
}

function CellContent({ cell }: { cell: C }) {
  if (cell === C.X) {
    return <span className="text-enemy leading-none text-[100cqw]">X</span>;
  }

  if (cell === C.O) {
    return <span className="text-ally text-[100cqw]">O</span>;
  }

  if (cell === C.x) {
    return <span className="text-enemy leading-none text-[100cqw]">x</span>;
  }

  if (cell === C.o) {
    return <span className="text-ally text-[100cqw]">o</span>;
  }

  if (cell === C.Empty) {
    return null;
  }

  if (cell === C.Neutral) {
    return (
      <div className="bg-neutral/80 w-full h-full text-[100cqw] flex items-center justify-center">
        ?
      </div>
    );
  }

  if (cell === C.Blocked) {
    return <span className="-rotate-45 text-[30cqw]">BLOCKED</span>;
  }
}
