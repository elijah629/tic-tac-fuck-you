import { Difficulty } from "@/types/game";

export function getDifficultySettings(difficulty: Difficulty): {
  rows: number;
  cols: number;
  winLength: number;
  humanCards: number;
  aiCards: number;
} {
  if (difficulty === Difficulty.INFANT) {
    return { rows: 3, cols: 3, winLength: 3, humanCards: 8, aiCards: 3 };
  }

  if (difficulty === Difficulty.TODDLER) {
    return { rows: 3, cols: 3, winLength: 3, humanCards: 5, aiCards: 5 };
  }

  if (difficulty === Difficulty.NORMAL) {
    return { rows: 4, cols: 4, winLength: 3, humanCards: 5, aiCards: 5 };
  }

  // if (difficulty === Difficulty.HARD) {
  return { rows: 5, cols: 2, winLength: 4, humanCards: 5, aiCards: 5 };
  // }
}
