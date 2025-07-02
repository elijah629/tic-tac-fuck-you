"use client";

import { useGame } from "@/lib/game-store";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function XpSidebar({ className }: { className?: string }) {
  const { xp, xpEvents, removeXpEvent } = useGame();

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

  return (
    <aside className={cn("p-3", className)}>
      <div className="p-4 bg-secondary rounded-md">
        <div className="font-bold text-3xl">XP: {xp}</div>
        <ul>
          {xpEvents!.map(({ xp, id, label }) => (
            <li key={id} className={`${colorXp(xp)}`}>
              +{xp} {label}
            </li>
          ))}
        </ul>
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
