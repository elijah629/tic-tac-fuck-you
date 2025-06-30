"use client";

import { create } from "zustand";
import { Cell, GameActions, GameState, new_board, Team } from "./game";

export const useGame = create<GameActions & GameState>((set_, get) => ({
  xp: 0,
  xpEvents: [],
  winLength: 3,
  human: Team.X,
  ai: Team.O,
  xpCounter: 0,
  board: new_board(3, 3),
  set(index, cell) {
     set_(s => {
      const board = s.board;
      board.cells[index] = cell;

      return {
        board
      }
    })
  },

  xpEvent(event) {
    set_(s => {
      const xpCounter = s.xpCounter + 1;
      const event_ = { ...event, id: xpCounter };

    // TODO: Make this only store like 100 as it could crash if it gets too big
      return { xp: s.xp + event.xp, xpEvents: [event_, ...s.xpEvents], xpCounter };
    })
  },

  removeXpEvent(id) {
    set_(s => {
      return { xpEvents: s.xpEvents.filter(x => x.id !== id) };
    });
  },

  winState() {
    const { board: { size: { rows, cols }, cells }, winLength: K } = get();

  const get_ = (x: number, y: number): Cell | undefined =>
    x < 0 || y < 0 || x >= cols || y >= rows
      ? undefined
      : cells[y * cols + x];

  const lineWinsFor = (x: number, y: number, dx: number, dy: number, T: Team): boolean => {
    let sawActualT = false;
    for (let i = 0; i < K; i++) {
      const c = get_(x + dx*i, y + dy*i);
      // treat both Empty and Blocked as stopping the line
      if (c === undefined || c === Cell.Empty || c === Cell.Blocked) return false;
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
      for (const [dx, dy] of [[1,0],[0,1],[1,1],[1,-1]] as const) {
        if (lineWinsFor(x, y, dx, dy, Team.X)) winners.add(Team.X);
        if (lineWinsFor(x, y, dx, dy, Team.O)) winners.add(Team.O);
      }
    }
  }

  if (winners.size === 0)     return null;
  if (winners.size === 1)     return [...winners][0];
  return "both";
  },
}));
