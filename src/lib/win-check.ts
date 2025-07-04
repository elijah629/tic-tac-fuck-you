import { Cell, Team } from "./game";

export function generateLineMatrix(
  width: number,
  height: number,
  winLength: number
): Uint16Array {
  const maxLines =
    height * (width - winLength + 1) + // →
    width * (height - winLength + 1) + // ↓
    2 * (height - winLength + 1) * (width - winLength + 1); // ↘↗

  const result = new Uint16Array(maxLines * winLength);
  let i = 0;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const idx0 = r * width + c;

      // →
      if (c + winLength <= width) {
        for (let k = 0; k < winLength; k++) {
          result[i++] = idx0 + k;
        }
      }

      // ↓
      if (r + winLength <= height) {
        for (let k = 0; k < winLength; k++) {
          result[i++] = idx0 + k * width;
        }
      }

      // ↘
      if (c + winLength <= width && r + winLength <= height) {
        for (let k = 0; k < winLength; k++) {
          result[i++] = idx0 + k * (width + 1);
        }
      }

      // ↗
      if (c + winLength <= width && r - winLength + 1 >= 0) {
        for (let k = 0; k < winLength; k++) {
          result[i++] = idx0 + k * (1 - width);
        }
      }
    }
  }

  return result;
}

function* iterateLines(
  flat: Uint16Array,
  winLength: number
): IterableIterator<Uint16Array> {
  for (let offset = 0; offset < flat.length; offset += winLength) {
    yield flat.subarray(offset, offset + winLength);
  }
}

function lineValue(board: Cell[], line: Uint16Array): Cell | null {
  let winner: Cell | null = null;

  for (const idx of line) {
    const cell = board[idx];
    if (cell === Cell.Neutral) {
      continue;
    }

    if (winner === null) { // last cell was a Cell.Neutral
      winner = cell;
    } else if (cell !== winner) {
      return null;
    }
  }

  // If we only saw Cell.Neutral, return neutral, otherwize return the other cell / null on conflict.
  return winner === null ? Cell.Neutral : winner;
}


export type Winner = Team | "tie" | false;
const CELL_TO_TEAM = {
  [Cell.X]: Team.X,
  [Cell.x]: Team.X,
  [Cell.O]: Team.O,
  [Cell.o]: Team.O,
  [Cell.Empty]: false ,  // No team
  [Cell.Blocked]: false, // No team
  [Cell.Neutral]: "tie", // Both teams
} satisfies Record<Cell, Winner>;

/*
 * k-in-a-row 2D board algorithim
 */
export function getWinner(
  board: Cell[],
  lineMatrix: Uint16Array,
  K: number,
): Winner {
  const lines = iterateLines(lineMatrix, K);
  const winners = new Set<Winner>();

  let hasNeutral = false;

  for (const line of lines) {
    const cell = lineValue(board, line);

    if (cell === null) continue;
    const team = CELL_TO_TEAM[cell];

    if (team === false) continue;

    if (team === "tie") {
      hasNeutral = true;
      continue
    }

    winners.add(team); // Just x and o.
  }

  if (winners.size === 0) {
    // no X/O winners
    return hasNeutral ? "tie" : false;
  }

  if (winners.size === 1) {
    // just one winning team
    return winners.values().next().value!;
  }

  // more than one team and no empty blocked or neutral
  return "tie";
}
