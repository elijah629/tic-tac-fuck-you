export interface XpEvent {
  id: number;
  label: string;
  xp: number;
}

export const EVENTS = {
  PLACE: { xp: 10, label: "Place" },
};

export interface GameState {
  board: Board;
  winLength: number;
  turn: Team;
  human: Player;
  ai: Player;
  xp: number;
  xpCounter: number;
  xpEvents: XpEvent[];
}

export interface Player {
  team: Team;
  cards: { id: number; card: Card }[];
}

export enum Card {
  X = "X",
  O = "O",

  ExtendTop = "EXTEND_BOARD_TOP_ROW",
  ExtendLeft = "EXTEND_BOARD_LEFT_COL",
  ExtendBottom = "EXTEND_BOARD_BOTTOM_ROW",
  ExtendRight = "EXTEND_BOARD_RIGHT_ROW",

  DeleteHumanCard = "DELETE_HUMAN_CARD",

  Lowercase = "LOWERCASE_CELL",

  Back = "BACK", // NOTE: only for AI renderer, it just needs "SOMETHING" that represents a card. Even if it's cards are BS
}

export type GameActions = {
  removeCard(f: Team, id: number): void;
  applyCardToCell(index: number, card: Card): void;
  xpEvent(event: Omit<XpEvent, "id">): void;
  removeXpEvent(id: number): void;
  winState(): Team | "both" | null;
};

export enum Cell {
  X, x,
  O, o,

  Neutral,
  Empty,
  Blocked,
}

export enum Team {
  X,
  O,
}

export interface Board {
  size: Size;
  cells: Cell[];
}

export function new_board(rows: number, cols: number): Board {
  return {
    size: { rows, cols },
    cells: Array<Cell>(rows * cols).fill(Cell.Empty),
  };
}

type Size = { rows: number; cols: number };
