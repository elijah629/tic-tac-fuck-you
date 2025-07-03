import { Cell, Team } from "./game";

export type Winner = Team | "tie" | false;

// Precomputed direction offsets based on matrix width
function getOffsets(cols: number) {
  return [
    1, // right
    cols, // down
    cols + 1, // diag down-right
    cols - 1, // diag down-left
  ];
}

/**
 * Check if the specified team has an L-length run on the board.
 * @param board Flat Cell array of length cols * rows
 * @param cols Number of columns
 * @param rows Number of rows
 * @param L    Length of run needed
 * @param team Team to check (Team.X or Team.O)
 */
function checkRun(
  board: Cell[],
  cols: number,
  rows: number,
  L: number,
  team: Team,
): boolean {
  const offsets = getOffsets(cols);
  const total = cols * rows;

  // Determine the uppercase and lowercase markers for this team
  const [upper, lower] = team === Team.X ? [Cell.X, Cell.x] : [Cell.O, Cell.o];

  for (let idx = 0; idx < total; idx++) {
    // skip if not a starting marker or neutral
    if (
      board[idx] !== upper &&
      board[idx] !== lower &&
      board[idx] !== Cell.Neutral
    )
      continue;

    const r = Math.floor(idx / cols);
    const c = idx % cols;

    for (let d = 0; d < offsets.length; d++) {
      const offset = offsets[d];
      // derive dr, dc for boundary checks
      let dr = 0,
        dc = 0;
      switch (d) {
        case 0:
          dc = 1;
          break;
        case 1:
          dr = 1;
          break;
        case 2:
          dr = 1;
          dc = 1;
          break;
        case 3:
          dr = 1;
          dc = -1;
          break;
      }
      const endR = r + dr * (L - 1);
      const endC = c + dc * (L - 1);
      if (endR < 0 || endR >= rows || endC < 0 || endC >= cols) continue;

      // need to check both uppercase-run and lowercase-run
      for (const mode of ["upper", "lower"] as const) {
        let current = idx;
        let k = 1;
        for (; k < L; k++) {
          current += offset;
          const cell = board[current];
          if (cell === Cell.Empty || cell === Cell.Blocked) {
            k = -1;
            break; // break both loops
          }
          if (mode === "upper") {
            if (cell !== upper && cell !== Cell.Neutral) {
              k = -1;
              break;
            }
          } else {
            if (cell !== lower && cell !== Cell.Neutral) {
              k = -1;
              break;
            }
          }
        }
        if (k === L) return true;
      }
    }
  }
  return false;
}

/**
 * Determine the winner on an N×K board for a two-player game.
 * @returns Team.X or Team.O if one wins,
 *          'tie' if both have runs,
 *          false if neither does.
 */
export function getWinner(
  board: Cell[],
  cols: number,
  rows: number,
  L: number,
): Winner {
  if (board.length !== cols * rows) {
    throw new Error(
      `Board length ${board.length} does not match ${cols}×${rows}`,
    );
  }

  const xWin = checkRun(board, cols, rows, L, Team.X);
  const oWin = checkRun(board, cols, rows, L, Team.O);

  if (xWin && oWin) return "tie";
  if (xWin) return Team.X;
  if (oWin) return Team.O;
  return false;
}

// Example usage
if (require.main === module) {
  const example: Cell[] = [
    Cell.x,
    Cell.Neutral,
    Cell.x,
    Cell.Empty,
    Cell.O,
    Cell.Blocked,
    Cell.X,
    Cell.Neutral,
    Cell.X,
  ];
  console.log(getWinner(example, 3, 3, 3)); // Team.X
}
