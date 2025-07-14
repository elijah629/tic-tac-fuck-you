"use client";

import { create, ExtractState, StoreApi } from "zustand";

import {
  Card,
  Difficulty,
  GameActions,
  GameState,
  new_board,
  Team,
} from "@/types/game";
import {
  generateLineMatrix,
  setLineMatrix,
  winState,
} from "@/lib/game/win-check";
import { getDifficultySettings } from "./difficulty";
import { removeCard, sampleCard } from "./cards";
import { extendBoard } from "./board";
import { addXpEvent, removeXpEvent } from "./xp";
import { applyCard, endTurn } from "./move";
import { changeWinLength } from "./win-length";

type GameStore = {
  status: "uninitialized" | "initialized";
  difficulty?: Difficulty;
  onWin?: () => Promise<void>;
} & Partial<GameState> &
  GameActions & {
    init: (
      turn: Team,
      humanTeam: Team,
      aiTeam: Team,
      onWin: () => Promise<void>,
      difficulty: Difficulty,
    ) => void;
  };

export type InitializedGameStore = {
  status: "initialized";
  difficulty: Difficulty;
  onWin: () => Promise<void>;
} & GameState &
  GameActions;

type ReadonlyStoreApi<T> = Pick<
  StoreApi<T>,
  "getState" | "getInitialState" | "subscribe"
>;
export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(selector: (state: ExtractState<S>) => U): U;
} & S;

export function useGame(): InitializedGameStore;
export function useGame<U>(selector: (state: InitializedGameStore) => U): U;
export function useGame<U>(
  selector?: (state: InitializedGameStore) => U,
): InitializedGameStore | U {
  const store = useMaybeGame((state) => {
    const inited = asInit(state);
    return selector ? selector(inited) : inited;
  });

  return store;
}

function withInit(
  fn: (store: InitializedGameStore) => GameStore | Partial<GameStore>,
): (store: GameStore) => GameStore | Partial<GameStore> {
  return (store) => {
    return fn(asInit(store));
  };
}

function asInit(store: GameStore) {
  if (store.status !== "initialized") {
    throw new Error("Store used before initialization");
  }

  return store as InitializedGameStore;
}

export const useMaybeGame = create<GameStore>((set, get) => ({
  status: "uninitialized",

  init(turn, humanTeam, aiTeam, onWin, difficulty) {
    const { rows, cols, winLength, aiCards, humanCards } =
      getDifficultySettings(difficulty);

    set({
      status: "initialized",
      difficulty,
      winner: false,
      xp: difficulty === Difficulty.INFANT ? 10000 : 0,
      xpEvents: [],
      winLength,
      xpCounter: 0,
      round: 0,
      board: new_board(rows, cols),
      turn,
      startingTeam: turn,
      human: {
        team: humanTeam,
        idCounter: humanCards - 1,
        cards: Array.from({ length: humanCards }, (_, id) => ({
          id,
          card: sampleCard(0, humanTeam, difficulty),
        })),
      },
      ai: {
        team: aiTeam,
        idCounter: aiCards - 1,
        cards: Array<Card>(aiCards)
          .fill(Card.TBD)
          .map((card, id) => ({ id, card })),
      },
      ai_expression: aiTeam === Team.X ? "X" : "O",
      onWin:
        difficulty === Difficulty.HARD
          ? onWin
          : async () => {
              alert(
                "You won! Now, to log your score on the leaderboard, play in Hard mode.",
              );
            },
    });

    setLineMatrix(generateLineMatrix(cols, rows, winLength)); // CAN BE VERY BIG! Not storing in state due to updates
  },

  setAiExpression(emoji) {
    set({ ai_expression: emoji });
  },

  endTurn() {
    set(
      withInit((game) => {
        return endTurn(game);
      }),
    );
  },

  changeWinLength(change) {
    set(
      withInit(({ winLength, board }) => {
        return changeWinLength(change, winLength, board);
      }),
    );
  },

  applyCard(row, col, card, shouldOverwite) {
    let valid = true;

    set(
      withInit(({ board, winLength }) => {
        const application = applyCard(
          row,
          col,
          card,
          board,
          winLength,
          shouldOverwite,
        );

        if (application.valid) {
          return { ...application };
        } else {
          valid = false;
          return {};
        }
      }),
    );

    return valid;
  },

  winState() {
    const { winLength, board } = asInit(get());
    return winState(winLength, board);
  },

  addXpEvent(event) {
    set(
      withInit(({ xpCounter, xp, xpEvents }) => {
        return addXpEvent(event, xpCounter, xp, xpEvents);
      }),
    );
  },

  removeXpEvent(id) {
    set(
      withInit(({ xpEvents }) => {
        return removeXpEvent(id, xpEvents);
      }),
    );
  },

  extendBoard(direction) {
    set(
      withInit(({ board, winLength }) => {
        return { board: extendBoard(board, winLength, direction) };
      }),
    );
  },

  removeCard(team, id) {
    set(
      withInit(({ human, ai }) => {
        if (team === human.team) {
          return { human: removeCard(human, id) };
        } else {
          return { ai: removeCard(ai, id) };
        }
      }),
    );
  },
}));
