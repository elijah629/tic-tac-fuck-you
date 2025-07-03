"use client";

import { create } from "zustand";
import {
  Card,
  Cell,
  ExtendDirection,
  GameActions,
  GameState,
  new_board,
  Team,
} from "./game";
import { getWinner } from "./win-check";

const CARD_TO_CELL: Partial<Record<Card, Cell>> = {
  [Card.X]: Cell.X,
  [Card.O]: Cell.O,
};

type GameStore = GameActions &
  Partial<GameState> & {
    has_init: boolean;
    onWin?(): Promise<void>;
    init(
      turn: Team,
      humanTeam: Team,
      aiTeam: Team,
      onWin: () => Promise<void>,
    ): void;
  };

export const useGame = create<GameStore>((set_, get) => ({
  has_init: false,
  winner: false,

  init(turn, humanTeam, aiTeam, onWin) {
    set_({
      has_init: true,
      winner: false,
      xp: 0,
      xpEvents: [],
      winLength: 3,
      xpCounter: 0,
      board: new_board(3, 3),
      turn,
      human: {
        team: humanTeam,
        cards: Array<Card>(5)
          .fill(humanTeam === Team.X ? Card.X : Card.O)
          .map((card, id) => ({ id, card })),
      },
      ai: {
        team: aiTeam,
        cards: Array<Card>(5)
          .fill(Card.TBD)
          .map((card, id) => ({ id, card })),
      },
      onWin,
    });
  },

  makeMove(move) {
    switch (move.card) {
      case Card.X:
      case Card.O:
        const game = get();
        game.applyCardToCell(move.position.row, move.position.col, move.card);

        break;

      case Card.Extend:
        get().extendBoard(move.direction);
        break;
    }
  },
  endTurn() {
    set_((s) => {
      const winState = s.winState();

      if (winState === s.human?.team) {
        s.onWin?.();

        // Setting turn could cause the AI to hallucinate a response, as it thinks it didn't win...
        return { winner: winState };
      }

      return {
        winner: winState,
        turn: s.turn! === Team.X ? Team.O : Team.X,
      };
    });
  },

  extendBoard(direction) {
    set_((state) => {
      const board = state.board!;
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

      return {
        board: {
          size: { rows: newRows, cols: newCols },
          cells: newCells,
        },
      };
    });
  },

  applyCardToCell(row, col, card) {
    let valid = true;

    switch (card) {
      case Card.X:
      case Card.O:
        const cell = CARD_TO_CELL[card];
        if (cell === undefined) return false;

        set_((s) => {
          const board = s.board!;
          const index = board.size.cols * row + col;

          if (board.cells[index] !== Cell.Empty) {
            valid = false;
            return {};
          }

          board.cells[index] = cell;

          return {
            board,
          };
        });
        break;
      case Card.Extend:
        const {
          size: { rows, cols },
        } = get().board!;

        const dL = col;
        const dR = cols - col - 1;
        const dT = row;
        const dB = rows - row - 1;

        const dir = getSmallestDirection(dL, dR, dT, dB);

        if (dir !== null) {
          // Bye bye! Your card is gone if you misplaced it. Have a good day!
          get().extendBoard(dir);
        }

        break;
    }

    return valid;
  },

  removeCard(for_, id) {
    set_(({ human, ai }) => {
      if (human!.team === for_) {
        return {
          human: {
            team: human!.team,
            cards: human!.cards.filter((x) => x.id !== id),
          },
        };
      } else {
        return {
          ai: { team: ai!.team, cards: ai!.cards.filter((x) => x.id !== id) },
        };
      }
    });
  },

  xpEvent(event) {
    set_(({ xp, xpCounter: xpC, xpEvents }) => {
      const xpCounter = xpC! + 1;
      const event_ = { ...event, id: xpCounter };

      // TODO: Make this only store like 100 as it could crash if it gets too big
      return {
        xp: xp! + event.xp,
        xpEvents: [event_, ...xpEvents!],
        xpCounter,
      };
    });
  },

  removeXpEvent(id) {
    set_(({ xpEvents }) => {
      return { xpEvents: xpEvents!.filter((x) => x.id !== id) };
    });
  },

  winState() {
    const { winLength, board: b } = get();

    const winner = getWinner(b!.cells, b!.size.rows, b!.size.cols, winLength!);

    return winner;
  },
}));

function getSmallestDirection(
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
