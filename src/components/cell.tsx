import { Cell as C } from "@/lib/game";
import { useGame } from "@/lib/game-store";
import { useEffect, useRef } from "react";

export function Cell({ index, cell }: { index: number, cell: C }) {
  const { applyCardToCell } = useGame();

  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cell = cellRef.current;
    if (!cell) return;

    const listener = (e: Event) => {
      const event = e as CustomEvent;

      applyCardToCell(index, event.detail.card);
    };

    cell.addEventListener("card-drop", listener);

    return () => {
      cell.removeEventListener("card-drop", listener);
    };
  }, [index, applyCardToCell]);

   const { board: { size: { rows, cols } } } = useGame();

   const x = index % cols;
   const y = (index / cols) | 0;

   const isTop = y === 0;
   const isLeft = x === 0;
   const isRight = x === cols - 1;
   const isBottom = y === rows - 1;

   return (
     <div
      data-board-cell
      ref={cellRef}
      className="flex items-center justify-center @container border-primary border-2"
       key={`${x}-${y}`}
       style={{
         borderTop: isTop ? "none" : undefined,
         borderLeft: isLeft ? "none" : undefined,
         borderRight: isRight ? "none" : undefined,
         borderBottom: isBottom ? "none" : undefined,
       }}>
          <CellContent cell={cell} />
      </div>
  );
}

function CellContent({ cell }: { cell: C }) {
  if (cell == C.X) {
    return <span className="text-enemy leading-none text-[100cqw]">X</span>;
  }

  if (cell == C.O) {
    return <span className="text-ally text-[100cqw]">O</span>;
  }

  if (cell == C.Empty) {
    return null;
  }

  if ((cell = C.Neutral)) {
    return (
      <div className="bg-neutral w-full h-full text-[100cqw] flex items-center justify-center">
        ?
      </div>
    );
  }
}
