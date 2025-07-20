import { Board, Card, Cell, GameState, Team } from "@/types/game";
import { extendBoard, getSmallestDirection } from "@/lib/game/board";
import { InitializedGameStore } from "@/lib/game";
import { sampleCard } from "@/lib/game/cards";
import { changeWinLength } from "@/lib/game/win-length";
import { Winner } from "./win-check";

export function endTurn({
  onWin,
  ai,
  startingTeam,
  human,
  round,
  turn,
  difficulty,
  winState,
  board,
}: InitializedGameStore, forced_winner?: Winner): Partial<GameState> {

  if (forced_winner) {
    if (forced_winner === "tie") {
      onWin("tie");
    } else if (forced_winner === ai?.team) {
      onWin("ai");
    } else if (forced_winner === human?.team) {
      onWin("human");
    }

    return { winner: forced_winner }
  }

  const winner = winState();

  if (winner === false && board?.cells.every((x) => x !== Cell.Empty)) {
    // Every cell is filled and no one has won.
    // You could extend the board, but it is safe to say the game is a Tie according to standard TTT rules.
    onWin("tie");
    return { winner: "tie" };
  }

  if (winner !== false) {
    if (winner === "tie") {
      onWin("tie");
    } else if (winner === ai?.team) {
      onWin("ai");
    } else if (winner === human?.team) {
      onWin("human");
    }

    return { winner };
  }

  let newRound = round ?? 0;

  const nextTurn = turn! === Team.X ? Team.O : Team.X;

  if (turn === startingTeam) {
    // A full round has been completed and we are back! Now we deal cards proportionally to the round if the round is a multiple of two.
    newRound += 1;

    if (newRound % 2 === 0) {
      return {
        board: spreadChemical(board),
        winner,
        round: newRound,
        turn: nextTurn,
        ai: {
          ...ai,
          idCounter: ai.idCounter + 2,
          cards: [
            ...ai.cards,
            { id: ai.idCounter + 1, card: Card.TBD },
            { id: ai.idCounter + 2, card: Card.TBD },
          ],
        },
        human: {
          ...human,
          idCounter: human.idCounter + 2,
          cards: [
            ...human.cards,
            {
              id: human.idCounter + 1,
              card: sampleCard(newRound, human.team, difficulty),
            },
            {
              id: human.idCounter + 2,
              card: sampleCard(newRound, human.team, difficulty),
            },
          ],
        },
      };
    }
  }

  return {
    winner,
    round: newRound,
    turn: nextTurn,
  };
}

function spreadChemical(board: Board): Board {
  const {
    size: { rows, cols },
    cells,
  } = board;

  const chemicalPositions: [number, number][] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (cells[row * cols + col] === Cell.Chemical) {
        chemicalPositions.push([row, col]);
      }
    }
  }

  for (const [row, col] of chemicalPositions) {
    const neighbors = [
      [row - 1, col], // up
      [row + 1, col], // down
      [row, col - 1], // left
      [row, col + 1], // right
    ];

    for (const [nRow, nCol] of neighbors) {
      if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
        board.cells[nRow * cols + nCol] = Cell.Chemical;
      }
    }
  }

  return { size: { rows, cols }, cells: [...board.cells] };
}

export async function applyCard(
  row: number,
  col: number,
  card: Card,
  board: Board,
  winLength: number,
  shouldOverwrite: boolean,
): Promise<{ valid: false } | ({ valid: true } & Partial<GameState>)> {
  const index = row * board.size.cols + col;
  const current = board.cells[index];

  if (card === Card.Lowercase) {
    const LOWERCASE: Partial<Record<Cell, Cell>> = {
      [Cell.X]: Cell.x,
      [Cell.O]: Cell.o,
    };

    const newCell = LOWERCASE[current];

    if (newCell === undefined) {
      return { valid: false };
    }

    board.cells[index] = newCell;

    return { valid: true, board };
  }

  if (card === Card.Extend) {
    const {
      size: { rows, cols },
    } = board;

    const dL = col;
    const dR = cols - col - 1;
    const dT = row;
    const dB = rows - row - 1;

    const dir = getSmallestDirection(dL, dR, dT, dB);

    if (dir !== null) {
      return { valid: true, board: extendBoard(board, winLength, dir) };
    } else {
      return { valid: false };
    }
  }

  if (card === Card.IncrementWinLength) {
    if (winLength + 1 > Math.max(board.size.rows, board.size.cols)) {
      return { valid: false };
    }

    return { valid: true, ...changeWinLength(1, winLength, board) };
  }

  if (card === Card.DecrementWinLength) {
    if (winLength - 1 < 2) {
      return { valid: false };
    }

    return { valid: true, ...changeWinLength(-1, winLength, board) };
  }

  if (card === Card.Roulette) {
    return { valid: true };
  }

  const CARD_TO_CELL: Partial<Record<Card, Cell>> = {
    [Card.X]: Cell.X,
    [Card.O]: Cell.O,
    [Card.Neutralize]: Cell.Neutral,
    [Card.Block]: Cell.Blocked,
    [Card.ScientificReaction]: Cell.Chemical,
  };

  const cell = CARD_TO_CELL[card];
  if (cell === undefined) return { valid: false };

  const overwite =
    shouldOverwrite ||
    current === Cell.Empty ||
    current === Cell.Chemical ||
    (cell === Cell.Blocked && current !== Cell.Blocked);
  //if (shouldOverwrite || current === Cell.Empty || current === Cell.Chemical || ((cell === Cell.Blocked) && cell !== current)) {

  if (!overwite) return { valid: false };

  board.cells[index] = cell;
  return {
    valid: true,
    board: {
      ...board,
      cells: [...board.cells],
    },
  };
}
