"use client";

import emoji from "emoji-regex";
import { Card, Difficulty, ExtendDirection } from "@/types/game";
import { useGame } from "@/lib/game";
import { initialPrompt, statePrompt } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

export function Sidebar({ className }: { className?: string }) {
  const removeXpEvent = useGame((s) => s.removeXpEvent);
  const removeCard = useGame((s) => s.removeCard);
  const applyCard = useGame((s) => s.applyCard);
  const extendBoard = useGame((s) => s.extendBoard);
  const endTurn = useGame((s) => s.endTurn);
  const changeWinLength = useGame((s) => s.changeWinLength);
  const xp = useGame((s) => s.xp);
  const xpEvents = useGame((s) => s.xpEvents);
  const winLength = useGame((s) => s.winLength);
  const turn = useGame((s) => s.turn);
  const ai = useGame((s) => s.ai);
  const board = useGame((s) => s.board);
  const round = useGame((s) => s.round);
  const winner = useGame((s) => s.winner);
  const difficulty = useGame((s) => s.difficulty);
  const human = useGame((s) => s.human);
  const setExpression = useGame((s) => s.setAiExpression);

  // XP
  // queue of ids to remove
  const removalQueue = useRef<number[]>([]);
  // track which ids we've already queued
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

  const [input, setInput] = useState<string>("");
  const { messages, append, status } = useChat({
    /*    onToolCall({ toolCall }) {
      if (toolCall.toolName === "playMove") {
        const move = toolCall.input as z.infer<typeof moveSchema>;

        makeMove(move);

        removeAnyCard(ai!.team);
        endTurn();
      }

      return true;
    },*/

    onFinish({ message: { parts } }) {
      const text = parts.filter((x) => x.type === "text")[0].text;

      const emojis = emoji();
      const regex = new RegExp(`<tool_call>(.*?)(?:</tool_call>|$)`, "gs");

      const expr = text.match(emojis)?.[0];

      if (expr !== undefined) {
        setExpression(expr);
      }

      const tools = regex.exec(text)![1].split(",");

      for (let i = 0; i < tools.length; i++) {
        if (difficulty === Difficulty.HARD && i !== 0) {
          break;
        }

        const tool = tools[i].split("|")
      const card = tool[0] as Card;

      switch (card) {
        case Card.X:
        case Card.O:
        case Card.Block:
        case Card.Lowercase:
        case Card.Neutralize:
          applyCard(Number(tool[1]), Number(tool[2]), card, true);
          break;

        case Card.Extend:
          if (difficulty === Difficulty.HARD) { // Larger boards make it easier for the human to win
            break;
          }

          extendBoard(tool[1] as ExtendDirection);
          break;

        case Card.IncrementWinLength:
          changeWinLength(1);
          break;

        case Card.DecrementWinLength:
          changeWinLength(-1);
          break;
      }

        removeCard(ai.team);
      }

      endTurn();
    },
  });

  useEffect(() => {
    // if it's not AI's turn (or game over), reset our guard so next AI turn will fire
    if (turn !== ai!.team || winner !== false) {
      hasSent.current = false;
      return;
    }

    // already sent this turn? bail out
    if (hasSent.current) return;
    hasSent.current = true;

    // first AI turn ever
    if (first.current) {
      append({ role: "user", parts: [{ type: "text", text: initialPrompt(ai, human, winLength, difficulty) }]});
      //sendMessage({ text: initialPrompt(ai, human, winLength, difficulty) });
      first.current = false;
    } else {
      append({ role: "user", parts: [{ type: "text", text: statePrompt(ai, human, winLength, board) }]});
      //sendMessage({ text: statePrompt(ai, human, winLength, board) });
    }
  }, [ai, difficulty, board, winLength, human, winner, append, turn]);

  const raw_msg = messages[messages.length - 1];
  const content: string[] | undefined =
    raw_msg?.role === "assistant"
      ? raw_msg.parts
          .filter((x) => x.type === "text")
          .map((x) => x.text.replace(/<tool_call>.*/g, ""))
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
      <form onSubmit={e => {
        e.preventDefault();

        if (input.trim() && turn === human.team) {
          append({  role: "user", parts: [{ type: "text", text: `The human decided not to play a move, but instead talk back to you, the game state is the same, respond to this appropriately: Human: ${input}` }]});
          hasSent.current = true;
          setInput("");
          endTurn();
        }
      }}>
        <Input           value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready' || turn === ai.team} placeholder="Talk back 😠 (uses turn)"/>
      </form>
      <div className="p-4 bg-secondary rounded-md">
        <div className="font-bold sm:text-3xl">Win Length: {winLength}</div>
        <div className="font-bold sm:text-3xl">
          Board: {board!.size.rows}x{board!.size.cols}
        </div>
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
