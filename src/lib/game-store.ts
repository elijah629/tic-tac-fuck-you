"use client";

import { create } from "zustand";
import { Card, Cell, EVENTS, GameActions, GameState, new_board, Team } from "./game";

export const useGame = create<GameActions & GameState>((set_, get) => ({
  xp: 0,
  xpEvents: [],
  winLength: 3,
  turn: Team.O,
  human: { team: Team.O, cards: [{ id: 0, card: Card.O }, { id: 1, card: Card.O }, { id: 2, card: Card.O }] },
  ai: { team: Team.X, cards: [{ id: 0, card: Card.Back }, { id: 1, card: Card.Back }, { id: 2, card: Card.Back }] },
  xpCounter: 0,
  board: new_board(10, 10),

  applyCardToCell(index, card)
{
    const cell = cardToCell(card);

    if (!cell) return;

    set_((s) => {
      const board = s.board;
      board.cells[index] = cell;
      get().xpEvent(EVENTS.PLACE);

      return {
        board,
      };
    });

  },

  removeCard(for_, id) {
    set_((s) => {
       if (s.human.team == for_) {
          return { human: { team: s.human.team, cards: s.human.cards.filter(x => x.id !== id) } };
       } else {
          return { ai: { team: s.ai.team, cards: s.ai.cards.filter(x => x.id !== id) } };
        }
    });
  },

  xpEvent(event) {
    set_((s) => {
      const xpCounter = s.xpCounter + 1;
      const event_ = { ...event, id: xpCounter };

      // TODO: Make this only store like 100 as it could crash if it gets too big
      return {
        xp: s.xp + event.xp,
        xpEvents: [event_, ...s.xpEvents],
        xpCounter,
      };
    });
  },

  removeXpEvent(id) {
    set_((s) => {
      return { xpEvents: s.xpEvents.filter((x) => x.id !== id) };
    });
  },

  winState() {
    const {
      board: {
        size: { rows, cols },
        cells,
      },
      winLength: K,
    } = get();

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


function cardToCell(card: Card): Cell | false {
  if (card === Card.X) {
    return Cell.X;
  }

  if (card === Card.O) {
    return Cell.O;
  }

  return false;
}
