"use client";

import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/lib/game-store';
import { useEffect, useRef } from 'react';

export function XpSidebar() {
  const { xp, xpEvents, removeXpEvent } = useGame();

  // queue of event-times to remove
  const removalQueue = useRef<number[]>([]);
  // track which event-times we've already queued
  const seenTimes = useRef<Set<number>>(new Set());

  // whenever xpEvents changes, enqueue any **new** events by their .time
  useEffect(() => {
    xpEvents.forEach((evt) => {
      console.log(evt);
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
    }, 500);
    return () => clearInterval(timer);
  }, [removeXpEvent]);


  return (
    <aside className="bg-secondary w-72 border-2 p-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="font-bold text-3xl">XP: {xp}</div>
          <ul className="space-y-2">
            {xpEvents.map((event, i) => (
              <li
                key={i}
                className={`flex justify-between items-center p-2 ${colorXp(event.xp)}`}
              >
                <span>+{event.xp} {event.label}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

function colorXp(xp: number): string {
  if (xp > 1000) {
    return "text-rare";
  }

  return "text-legendary";
}
