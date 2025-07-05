"use client";

import { Card, ExtendDirection, GameState } from "@/lib/game";
import { useGame } from "@/lib/game-store";
import { initialPrompt, statePrompt } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

export function Sidebar({ className }: { className?: string }) {
  const game = useGame();
  const {
    xp,
    xpEvents,
    removeXpEvent,
    removeAnyCard,
    winLength,
    turn,
    ai,
    board,
    endTurn,
    round,
    makeMove,
  } = game;

  // XP
  // queue of event-times to remove
  const removalQueue = useRef<number[]>([]);
  // track which event-times we've already queued
  const seenTimes = useRef<Set<number>>(new Set());

  // whenever xpEvents changes, enqueue any **new** events by their .time
  useEffect(() => {
    xpEvents!.forEach((evt) => {
      if (!seenTimes.current.has(evt.id)) {
        seenTimes.current.add(evt.id);
        removalQueue.current.push(evt.id);
      }
    });
  }, [xpEvents]);

  // every second, dequeue a time and remove that event
  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = removalQueue.current.shift();
      if (nextTime !== undefined) {
        removeXpEvent(nextTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [removeXpEvent]);

  // + AI

  const first = useRef(true);
  const hasSent = useRef(false);

  const { messages, sendMessage } = useChat({
/*    onToolCall({ toolCall }) {
      if (toolCall.toolName === "playMove") {
        const move = toolCall.input as z.infer<typeof moveSchema>;

        makeMove(move);

        removeAnyCard(ai!.team);
        endTurn();
      }

      return true;
    },*/

    onFinish({ message: { parts }}) {
      const text = parts.filter(x => x.type === "text")[0].text;

      const regex = new RegExp(
        `<tool_call>(.*?)(?:</tool_call>|$)`,
        "gs"
      );

      const tool = regex.exec(text)![1].split("|");
      const card = tool[0] as Card;

      switch (card) {
        case Card.X:
        case Card.O:
        case Card.Block:
        case Card.Lowercase:
        case Card.Neutralize:
          makeMove({ card, position: { row: Number(tool[1]), col: Number(tool[2]) } });
          break;

        case Card.Extend:
          makeMove({ card, direction: tool[1] as ExtendDirection });
          break;
      }

      removeAnyCard(ai!.team);
      endTurn();
    },
  });

  useEffect(() => {
    // if it's not AI's turn (or game over), reset our guard so next AI turn will fire
    if (turn !== ai!.team || game.winner !== false) {
      hasSent.current = false;
      return;
    }

    // already sent this turn? bail out
    if (hasSent.current) return;
    hasSent.current = true;

    // first AI turn ever?
    if (first.current) {
      sendMessage({ text: initialPrompt(game as GameState) });
      first.current = false;
    } else {
      sendMessage({ text: statePrompt(game as GameState) });
    }
  }, [ai, game, sendMessage, turn]);

  const raw_msg = messages[messages.length - 1];
  const content: string[] | undefined =
    raw_msg?.role === "assistant"
      ? raw_msg.parts.filter((x) => x.type === "text").map((x) => x.text.replace(/<tool_call>.*/g, ""))
      : undefined;

  return (
    <aside className={cn("p-3 flex flex-col gap-3", className)}>
      <div className="p-4 bg-secondary rounded-md">
        <div className="font-bold sm:text-3xl">XP: {xp}</div>
        <ul>
          {xpEvents!.map(({ xp, id, label }) => (
            <li key={id} className={`${colorXp(xp)}`}>
              +{xp} {label}
            </li>
          ))}
        </ul>
      </div>
      {content && (
        <div className="p-4 bg-secondary rounded-md">
          {content?.map((text, i) => {
            return (
              <span className="whitespace-pre-wrap" key={`${raw_msg.id}-${i}`}>
                {text}
              </span>
            );
          })}
        </div>
      )}
      <div className="p-4 bg-secondary rounded-md">
        <div className="font-bold sm:text-3xl">Win Length: {winLength}</div>
        <div className="font-bold sm:text-3xl">Board: {board!.size.rows}x{board!.size.cols}</div>
        <div className="font-bold sm:text-3xl">Round: {round}</div>
      </div>
    </aside>
  );
}

function colorXp(xp: number): string {
  if (xp > 1000) {
    return "text-rare";
  }

  return "text-legendary";
}
