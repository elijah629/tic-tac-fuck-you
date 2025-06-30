export interface XpEvent {
  id: number;
  label: string;
  xp: number;
}

export const EVENTS = {
  PLACE: { xp: 10, label: "Place"},
};

export interface GameState {
  board: Board;
  winLength: number;
  human: Team;
  ai: Team;
  xp: number;
  xpCounter: number;
  xpEvents: XpEvent[];
}

export type GameActions = {
  set(index: number, cell: Cell): void;
  xpEvent(event: Omit<XpEvent, 'id'>): void;
  removeXpEvent(id: number): void;
  winState(): Team | "both" | null;
}

export enum Cell {
  X,
  O,
  Neutral,
  Empty,
  Blocked
}

export enum Team {
  X,
  O,
}

export interface Board {
  size: Size,
  cells: Cell[]
}

export function new_board(rows: number, cols: number): Board {
  return {
    size: { rows, cols },
    cells: Array<Cell>(rows * cols).fill(Cell.Empty)
  }
}

type Size = { rows: number, cols: number };
