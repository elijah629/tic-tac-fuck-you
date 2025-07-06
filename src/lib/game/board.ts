import { Board, Cell, ExtendDirection } from "@/types/game";
import { setLineMatrix, generateLineMatrix } from "./win-check";

export function getSmallestDirection(
  dL: number,
  dR: number,
  dT: number,
  dB: number,
): ExtendDirection | null {
  const dirs = [
    { dir: ExtendDirection.Left, val: dL },
    { dir: ExtendDirection.Right, val: dR },
    { dir: ExtendDirection.Up, val: dT },
    { dir: ExtendDirection.Down, val: dB },
  ];

  const min = Math.min(dL, dR, dT, dB);

  const smallest = dirs.filter((v) => v.val === min);

  if (smallest.length !== 1) {
    return null;
  }

  return smallest[0].dir;
}

export function extendBoard(
  board: Board,
  winLength: number,
  direction: ExtendDirection,
): Board {
  const { rows, cols } = board.size;
  const cells = board.cells;

  let newRows = rows;
  let newCols = cols;
  let newCells: Cell[] = [];

  switch (direction) {
    case ExtendDirection.Up:
      newRows = rows + 1;
      // Prepend one full blank row
      newCells = [...Array(cols).fill(Cell.Empty), ...cells];
      break;

    case ExtendDirection.Down:
      newRows = rows + 1;
      // Append one full blank row
      newCells = [...cells, ...Array(cols).fill(Cell.Empty)];
      break;

    case ExtendDirection.Left:
      newCols = cols + 1;
      // For each existing row, prepend one blank cell
      for (let r = 0; r < rows; r++) {
        const rowStart = r * cols;
        const rowSlice = cells.slice(rowStart, rowStart + cols);
        newCells.push(Cell.Empty, ...rowSlice);
      }
      break;

    case ExtendDirection.Right:
      newCols = cols + 1;
      // For each existing row, append one blank cell
      for (let r = 0; r < rows; r++) {
        const rowStart = r * cols;
        const rowSlice = cells.slice(rowStart, rowStart + cols);
        newCells.push(...rowSlice, Cell.Empty);
      }
      break;
  }

  // technicaly all of the old items stay the same when extending, but I might support changing winLength and shrinking in the future. also not THAT much of a perf issue.
  //
  // This will only produce an entirely new set if winLength changes.
  setLineMatrix(generateLineMatrix(newCols, newRows, winLength));

  return {
    size: { rows: newRows, cols: newCols },
    cells: newCells,
  };
}
