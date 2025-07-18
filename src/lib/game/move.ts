import { Board, Card, Cell, EVENTS, GameState, Team } from "@/types/game";
import { extendBoard, getSmallestDirection } from "@/lib/game/board";
import { InitializedGameStore } from "@/lib/game";
import { sampleCard } from "@/lib/game/cards";
import { changeWinLength } from "@/lib/game/win-length";

export function endTurn({
  addXpEvent,
  onWin,
  ai,
  startingTeam,
  human,
  round,
  turn,
  difficulty,
  winState,
  board,
}: InitializedGameStore): Partial<GameState> {
  const winner = winState();

  if (winner === human?.team) {
    onWin("human");
    addXpEvent(EVENTS.WIN);
  }

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

export function applyCard(
  row: number,
  col: number,
  card: Card,
  board: Board,
  winLength: number,
  shouldOverwrite: boolean,
): { valid: false } | ({ valid: true } & Partial<GameState>) {
  const index = board.size.cols * row + col;
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

  // [Card.X, Card.O, Card.Neutralize, Card.Block] {
  const CARD_TO_CELL: Partial<Record<Card, Cell>> = {
    [Card.X]: Cell.X,
    [Card.O]: Cell.O,
    [Card.Neutralize]: Cell.Neutral,
    [Card.Block]: Cell.Blocked,
  };

  const cell = CARD_TO_CELL[card];
  if (cell === undefined) return { valid: false };

  if (shouldOverwrite || (cell === Cell.Blocked && current !== Cell.Blocked)) {
    board.cells[index] = cell;
  } else {
    const valid = cell !== current && current === Cell.Empty;

    if (valid) {
      board.cells[index] = cell;
    } else {
      return { valid: false };
    }
  }

  board.cells[index] = cell;

  return {
    valid: true,
    board,
  };
}
