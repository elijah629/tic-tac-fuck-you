import { Board, GameState } from "@/types/game";
import { generateLineMatrix, setLineMatrix } from "./win-check";

export function changeWinLength(change: number, winLength: number, board: Board): Partial<GameState> {
  const L = Math.min(Math.max(2, winLength + change),  Math.max(board.size.rows, board.size.cols));

  setLineMatrix(generateLineMatrix(board.size.cols, board.size.rows, L));

  return { winLength: L };
}
