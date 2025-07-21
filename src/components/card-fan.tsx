"use client";

import { Card as C, EVENTS, Team } from "@/types/game";
import { Card } from "@/components/card";
import { useGame } from "@/lib/game";
import { SFX_SOUNDS } from "@/types/settings";
import { play } from "@/lib/settings";
import { useState } from "react";
import { roulette } from "@/lib/game/roulette";

export function CardFan(props: {
  for: Team;
  cards: { id: number; card: C }[];
}) {
  const removeCard = useGame((s) => s.removeCard);
  const turn = useGame((s) => s.turn);
  const applyCard = useGame((s) => s.applyCard);
  const addXpEvent = useGame((s) => s.addXpEvent);
  const endTurn = useGame((s) => s.endTurn);
    const ai = useGame((s) => s.ai);
    const human = useGame((s) => s.human);
  const [isPlaying, setPlaying] = useState(false); // i hate this

  return props.cards.map(({ card, id }, i) => {
    const mid = (props.cards.length - 1) / 2;
    const offset = i - mid;
    const angle = offset * 2;
    const translateY = Math.abs(offset) * 5 - 14;

    return (
      <Card
        droppable={props.for === turn}
        key={id}
        id={id}
        onDrop={async (card, x, y) => {
          if (isPlaying) return false;

          setPlaying(true);

          if (await applyCard(y, x, card, false)) {
            removeCard(props.for, id);

            switch (card) {
              case C.Lowercase:
                addXpEvent(EVENTS.ULTRA_GOOBER_BONUS);
                play(SFX_SOUNDS.POWERUP);
                break;
              case C.Extend:
              case C.DecrementWinLength:
              case C.IncrementWinLength:
                play(SFX_SOUNDS.POWERUP);
                addXpEvent(EVENTS.MAGICAL_BONUS);
                break;
              case C.Block:
              case C.Neutralize:
              case C.ScientificReaction:
                addXpEvent(EVENTS.SPECIAL_BONUS);
                play(SFX_SOUNDS.PLACE);
                break;
              case C.X:
              case C.O:
                addXpEvent(EVENTS.PLACE);
                play(SFX_SOUNDS.PLACE);
                break;
            }

            if (card === C.Roulette) {
              const forced_winner = await roulette(ai, human);

              endTurn(forced_winner);
            } else {
              endTurn();
            }

            setPlaying(false);
            return true;
          } else {
            setPlaying(false);
            return false;
          }
        }}
        card={card}
        angle={angle}
        translateY={translateY}
      />
    );
  });
}
