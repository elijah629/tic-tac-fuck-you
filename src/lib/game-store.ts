"use client";

import { create } from "zustand";
import {
  Card,
  Cell,
  Difficulty,
  EVENTS,
  ExtendDirection,
  GameActions,
  GameState,
  new_board,
  Team,
} from "./game";
import { generateLineMatrix, getWinner } from "./win-check";

type GameStore = GameActions &
  Partial<GameState> & {
    has_init: boolean;
    difficulty: Difficulty;
    onWin?(): Promise<void>;
    init(
      turn: Team,
      humanTeam: Team,
      aiTeam: Team,
      onWin: () => Promise<void>,
      difficulty: Difficulty
    ): void;
  };

// BAD! BUT NESSICARY. NEVER USE LET TOP LEVEL! This is here to avoid a state refresh when recomputing this big ass matrix.
let lineMatrix: Uint16Array | null = null;
let startingTeam: Team | null = null;

export const useGame = create<GameStore>((set_, get) => ({
  has_init: false,
  winner: false,
  difficulty: Difficulty.NORMAL,

  init(turn, humanTeam, aiTeam, onWin, difficulty) {
    const ROWS = difficulty === Difficulty.INFANT ? 2 : difficulty === Difficulty.TODDLER ? 2 : difficulty === Difficulty.NORMAL ? 3 : 5;

    const COLS = difficulty === Difficulty.INFANT ? 2 : difficulty === Difficulty.TODDLER ? 2 : difficulty === Difficulty.NORMAL ? 3 : 2;

    const L = difficulty === Difficulty.INFANT ? 2 : difficulty === Difficulty.TODDLER ? 2 : difficulty === Difficulty.NORMAL ? 3 : 4;

    set_({
      difficulty,
      has_init: true,
      winner: false,
      xp: difficulty === Difficulty.INFANT ? 10000 : 0,
      xpEvents: [],
      winLength: L,
      xpCounter: 0,
      round: 0,
      board: new_board(ROWS, COLS),
      turn,
      human: {
        team: humanTeam,
        idCounter: difficulty === Difficulty.INFANT ? 7 : 4,
        cards: Array<Card>(difficulty === Difficulty.INFANT ? 8 : 5)
          .fill(humanTeam === Team.X ? Card.X : Card.O)
          .map((card, id) => ({ id, card })),
      },
      ai: {
        team: aiTeam,
        idCounter: difficulty === Difficulty.INFANT ? 2 : 4,
        cards: Array<Card>(difficulty === Difficulty.INFANT ? 3 : 5)
          .fill(Card.TBD)
          .map((card, id) => ({ id, card })),
      },
      onWin: difficulty === Difficulty.HARD ? onWin : async () => {
        alert("You won! Now, to log your score on the leaderboard, play in Hard mode.")
      },
    });

    lineMatrix = generateLineMatrix(COLS, ROWS, L);
    startingTeam = turn;
  },

  // Only called by AI, so we can assume it is an AI here
  makeMove(move) {
    switch (move.card) {
      case Card.X:
      case Card.O:
      case Card.Lowercase:
      case Card.Neutralize:
      case Card.Block:
        const game = get();
        game.applyCardToCell(
          move.position.row,
          move.position.col,
          move.card,
          true,
        ); // Due to the previous assumption, we can overwrite since the AI always overwrites

        break;

      case Card.Extend:
        get().extendBoard(move.direction);
        break;
    }
  },
  endTurn() {
    set_(({ xpEvent, onWin, ai, human, round, turn, difficulty, winState, board }) => {
      const winner = winState();

      if (winner === human?.team) {
        xpEvent(EVENTS.WIN);
        onWin?.(); // This only logs the win for the human on the leaderboard
      }

      if (winner !== false) {
        // All other win states
        return { winner }; // If we set the rest of the stuff, the AI will retrigger and hallucinate.
      }

      if (winner === false && board?.cells.every((x) => x !== Cell.Empty)) {
        // Every cell is filled and no one has won.
        // You could extend the board, but it is safe to say the game is a Tie according to standard TTT rules.
        return { winner: "tie" };
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
              team: ai!.team,
              idCounter: ai!.idCounter + 2,
              cards: [
                ...ai!.cards,
                { id: ai!.idCounter + 1, card: Card.TBD },
                { id: ai!.idCounter + 2, card: Card.TBD },
              ],
            },
            human: {
              team: human!.team,
              idCounter: human!.idCounter + 2,
              cards: [
                ...human!.cards,
                {
                  id: human!.idCounter + 1,
                  card: sampleCard(newRound, human!.team, difficulty),
                },
                {
                  id: human!.idCounter + 2,
                  card: sampleCard(newRound, human!.team, difficulty),
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

      // technicaly all of the old items stay the same when extending, but I might support changing winLength and shrinking in the future. also not THAT much of a perf issue.
      //
      // This will only produce an entirely new set if winLength changes.
      lineMatrix = generateLineMatrix(newCols, newRows, state.winLength!);

      return {
        board: {
          size: { rows: newRows, cols: newCols },
          cells: newCells,
        },
      };
    });
  },

  applyCardToCell(row, col, card, shouldOverwrite) {
    let valid = true;

    switch (card) {
      case Card.X:
      case Card.O:
      case Card.Neutralize:
      case Card.Block:
        const CARD_TO_CELL: Partial<Record<Card, Cell>> = {
          [Card.X]: Cell.X,
          [Card.O]: Cell.O,
          [Card.Neutralize]: Cell.Neutral,
          [Card.Block]: Cell.Blocked,
        };

        const cell = CARD_TO_CELL[card];
        if (cell === undefined) return false;

        set_((s) => {
          const board = s.board!;
          const index = board.size.cols * row + col;

          if (!shouldOverwrite && board.cells[index] !== Cell.Empty) {
            valid = false;
            return {};
          }

          board.cells[index] = cell;

          return {
            board,
          };
        });
        break;
      case Card.Lowercase:
        set_((s) => {
          const board = s.board!;
          const index = board.size.cols * row + col;
          const cell = board.cells[index];

          const LOWERCASE: Partial<Record<Cell, Cell>> = {
            [Cell.X]: Cell.x,
            [Cell.O]: Cell.o,
          };

          const newCell = LOWERCASE[cell];

          if (newCell === undefined) {
            valid = false;
            return {};
          }

          board.cells[index] = newCell;

          return { board };
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
          get().extendBoard(dir);
        } else {
          valid = false;
        }

        break;
    }

    return valid;
  },

  removeAnyCard(team) {
    set_(({ human, ai }) => {
      if (human!.team === team) {
        const cards = human!.cards;
        cards.pop();

        return {
          human: {
            team: human!.team,
            idCounter: human!.idCounter,
            cards,
          },
        };
      } else {
        const cards = ai!.cards;
        cards.pop();

        return {
          ai: { team: ai!.team, idCounter: ai!.idCounter, cards },
        };
      }
    });
  },

  removeCard(team, id) {
    set_(({ human, ai }) => {
      if (human!.team === team) {
        return {
          human: {
            team: human!.team,
            idCounter: human!.idCounter,
            cards: human!.cards.filter((x) => x.id !== id),
          },
        };
      } else {
        const cards = ai!.cards;
        cards.pop();

        return {
          ai: { team: ai!.team, idCounter: human!.idCounter, cards },
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

    if (!lineMatrix) {
      lineMatrix = generateLineMatrix(b!.size.cols, b!.size.rows, winLength!);
    }

    const winner = getWinner(b!.cells, lineMatrix, winLength!);

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

function weightedRandom<T>(items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, entry) => sum + entry.weight, 0);
  const r = Math.random() * totalWeight;
  let acc = 0;
  for (const { item, weight } of items) {
    acc += weight;
    if (r < acc) return item;
  }
  // Fallback (should never happen if weights are correct)
  return items[0].item;
}

function sampleCard(round: number, team: Team, difficulty: Difficulty): Card {
  const cardPool: { item: Card; weight: number }[] = [
    { item: team === Team.X ? Card.X : Card.O, weight: 5 },
  ];

  if (round >= 2 + difficulty) {
    cardPool.push(
      { item: Card.Block, weight: 1 },
      { item: Card.Lowercase, weight: 1 },
      { item: Card.Neutralize, weight: 2 },
    );
  }

  if (round >= 4 + difficulty) {
    cardPool.push(
      { item: Card.Extend, weight: 2 },
      { item: Card.Block, weight: 1 },
      { item: Card.Lowercase, weight: 1 },
      { item: Card.Neutralize, weight: 1 },
    );
  }

  if (round >= 6 + difficulty) {
    cardPool.push(
      { item: Card.Extend, weight: 4 },
      { item: Card.Block, weight: 2 },
      { item: Card.Lowercase, weight: 2 },
      { item: Card.Neutralize, weight: 2 },
    );
  }

  return weightedRandom(cardPool);
}
