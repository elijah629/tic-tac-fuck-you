import { Winner } from "@/lib/game/win-check";

export interface XpEvent {
  id: number;
  label: string;
  xp: number;
}

export const EVENTS = {
  PLACE: { xp: 10, label: "Place" },
  WIN: { xp: 69420, label: "WIN!" },
  ULTRA_GOOBER_BONUS: { xp: 1000, label: "ULTRA GOOBER BONUS" },
  MAGICAL_BONUS: { xp: 500, label: "Magical bonus" },
  SPECIAL_BONUS: { xp: 100, label: "Special bonus" },
};

export enum Difficulty {
  INFANT,
  TODDLER,
  NORMAL,
  HARD,
}

export enum Card {
  X = "X",
  O = "O",

  Extend = "extend_board",

  Lowercase = "lowercase",

  Neutralize = "neutralize",

  Block = "block",

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

export enum Cell {
  X = "X",
  x = "x",
  O = "O",
  o = "o",

  Neutral = "?",
  Empty = "_",
  Blocked = "#",
}

export enum Team {
  X = "X",
  O = "O",
}

export interface GameState {
  board: Board;

  winLength: number;
  winner: Winner;

  round: number;
  turn: Team;
  startingTeam: Team;

  human: Player;
  ai: Player;

  xp: number;
  xpCounter: number;
  xpEvents: XpEvent[];
}

export type GameActions = {
  removeCard(team: Team, id?: number): void;
  extendBoard(direction: ExtendDirection): void;
  //makeMove(move: Move): void;
  applyCard(
    row: number,
    col: number,
    card: Card,
    shouldOverwite: boolean,
  ): boolean;
  addXpEvent(event: Omit<XpEvent, "id">): void;
  removeXpEvent(id: number): void;
  winState(): Winner;
  endTurn(): void;
};

export interface Player {
  team: Team;
  idCounter: number;
  cards: { id: number; card: Card }[];
}
/*
// TODO: We don't need zod anymore! No tools = no zod. I am keeping this in case hackclub/ai merges #11 and responds to #16 and #17
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

export const move = z
  .discriminatedUnion("card", [
    z.object({ card: z.literal(Card.X), position: position }),
    z.object({ card: z.literal(Card.O), position: position }),
    z.object({ card: z.literal(Card.Neutralize), position: position }),
    z.object({ card: z.literal(Card.Block), position: position }),
    z.object({
      card: z.literal(Card.Extend),
      direction: z.nativeEnum(ExtendDirection),
    }),
    z.object({ card: z.literal(Card.Lowercase), position: position }),
  ])
  .describe(
    "A move has a card, as well as optional data to tell the card what to do",
  );

export type Move = z.infer<typeof move>;
*/

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
