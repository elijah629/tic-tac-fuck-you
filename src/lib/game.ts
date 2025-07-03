import { z } from "zod";
import { Winner } from "./win-check";

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
  winner: Winner;
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

  Extend = "extend",

  // Use by the AI renderer only, this is so we can assign an Id to every card, even if the value doesn't exist. This card only renders a "back" side and not a front
  // To Be Determined
  TBD = "",
}

export enum ExtendDirection {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

const position = z
  .object({
    row: z
      .number()
      .int()
      .nonnegative()
      .describe("The zero-based index of the target row"),
    col: z
      .number()
      .int()
      .nonnegative()
      .describe("The zero-based index of the target column"),
  })
  .describe("A position with (0, 0) being the top left.");

export const moveSchema = z.discriminatedUnion("card", [
  z.object({ card: z.literal(Card.X), position: position }),
  z.object({ card: z.literal(Card.O), position: position }),
  z.object({
    card: z.literal(Card.Extend),
    direction: z.nativeEnum(ExtendDirection),
  }),
]);

export type Move = z.infer<typeof moveSchema>;

export type GameActions = {
  removeCard(f: Team, id: number): void;
  makeMove(move: Move): void;
  extendBoard(direction: ExtendDirection): void;
  applyCardToCell(row: number, col: number, card: Card): boolean;
  xpEvent(event: Omit<XpEvent, "id">): void;
  removeXpEvent(id: number): void;
  winState(): Winner;
  endTurn(): void;
};

export enum Cell {
  X,
  x,
  O,
  o,

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
