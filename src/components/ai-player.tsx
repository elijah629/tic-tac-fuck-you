"use client";

import { useGame } from "@/lib/game-store";
import { PlayerIndicator } from "./player-indicator";
import { cn } from "@/lib/utils";
import { CardFan } from "./card-fan";
//import { useEffect } from "react";
import { useChat } from '@ai-sdk/react';
import { stateToPrompt } from "@/lib/prompts";
import { Card, GameState } from "@/lib/game";

export function AIPlayer({ className }: { className?: string }) {
  const game = useGame();

  const turn = game.turn!;
  const { team, cards } = game.ai!;

  const { messages, sendMessage } = useChat({
    maxSteps: 5,

    onToolCall({ toolCall }) {
      if (toolCall.toolName === "playCard") {
        const { card, cell } = toolCall.input as { card: Card, cell: { row: number, col: number } | null};

        console.log((cell!.row * game.board!.size.rows) + cell!.col, card);
        game.applyCardToCell((cell!.row * game.board!.size.rows) + cell!.col, card);
      }

      return true;
    },
  });

  console.log(messages);

  const process = () => {
      if (turn === team) {
         const prompt = stateToPrompt(game as GameState);

         sendMessage({ text: prompt });
      }
  };//, [team, turn, sendMessage, game]);

  const message = messages[messages.length - 1];

  return (
    <div className={cn("flex w-full p-4 items-stretch", className)} onClick={process}>
      <PlayerIndicator active={team === turn!} team={team} />
      <div className="flex-1 p-4">{message && message.parts.filter(x => x.type === "text").map((part, i) => {
          return <span className="whitespace-pre-wrap" key={`${message.id}-${i}`}>{part.text}</span>
      })}</div>
      <div className="flex h-min ml-auto">
        <CardFan for={team} cards={cards} />
      </div>
    </div>
  );
}
