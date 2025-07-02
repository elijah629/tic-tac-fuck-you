"use client";

import { create } from "zustand";
import {
  Card,
  Cell,
  EVENTS,
  GameActions,
  GameState,
  new_board,
  Team,
} from "./game";

type GameStore = GameActions &
  Partial<GameState> & {
    has_init: boolean;
    init(turn: Team, humanTeam: Team, aiTeam: Team): void;
  };

export const useGame = create<GameStore>((set_, get) => ({
  has_init: false,

   init(turn, humanTeam, aiTeam) {
    set_({
      has_init: true,
      xp: 0,
      xpEvents: [],
      winLength: 3,
      turn,
      human: { team: humanTeam, cards: Array<Card>(5).fill(humanTeam === Team.X ? Card.X : Card.O).map((card, id) => ({ id, card })) },
      ai: { team: aiTeam, cards: Array<Card>(5).fill(Card.Back).map((card, id) => ({ id, card })) },
      xpCounter: 0,
      board: new_board(3, 3),
    });
  },

  applyCardToCell(index, card) {
    const cell = cardToCell(card);

    if (cell === null) return;

    set_((s) => {
      const board = s.board;
      board!.cells[index] = cell;
      get().xpEvent(EVENTS.PLACE);

      return {
        board,
      };
    });
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
    const game = get();

    const {
      size: { rows, cols },
      cells,
    } = game.board!;

    const K = game.winLength!;

    const get_ = (x: number, y: number): Cell | undefined =>
      x < 0 || y < 0 || x >= cols || y >= rows
        ? undefined
        : cells[y * cols + x];

    const lineWinsFor = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      T: Team,
    ): boolean => {
      let sawActualT = false;
      for (let i = 0; i < K; i++) {
        const c = get_(x + dx * i, y + dy * i);
        // treat both Empty and Blocked as stopping the line
        if (c === undefined || c === Cell.Empty || c === Cell.Blocked)
          return false;
        // if it’s the “other” team's mark, fail
        if (c === Cell.X && T !== Team.X) return false;
        if (c === Cell.O && T !== Team.O) return false;
        // Neutral always ok; actual T mark we record
        if (c === Cell.Neutral) {
          // counts for both, but doesn’t count as “actual T”
        } else {
          sawActualT = true;
        }
      }
      // require at least one real T to avoid all‑neutral lines
      return sawActualT;
    };

    const winners = new Set<Team>();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // you could even skip if get(x,y) is Empty/Blocked, but we test both teams anyway
        for (const [dx, dy] of [
          [1, 0],
          [0, 1],
          [1, 1],
          [1, -1],
        ] as const) {
          if (lineWinsFor(x, y, dx, dy, Team.X)) winners.add(Team.X);
          if (lineWinsFor(x, y, dx, dy, Team.O)) winners.add(Team.O);
        }
      }
    }

    if (winners.size === 0) return null;
    if (winners.size === 1) return [...winners][0];
    return "both";
  },
}));

function cardToCell(card: Card): Cell | null {
  if (card === Card.X) {
    return Cell.X;
  }

  if (card === Card.O) {
    return Cell.O;
  }

  return null;
}
