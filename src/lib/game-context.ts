"use client";

import { createContext } from "react";
import { Game } from "./game";

export const GameContext = createContext({
  game: new Game(0),
  setGame: () => {}
});
