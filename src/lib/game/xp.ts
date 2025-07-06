import { XpEvent } from "@/types/game";

export function addXpEvent(
  event: Omit<XpEvent, "id">,
  xpCounter: number,
  xp: number,
  xpEvents: XpEvent[],
) {
  const idEvent = { ...event, id: xpCounter + 1 };

  // TODO: Make this only store like 100 as it could crash if it gets too big
  return {
    xp: xp! + event.xp,
    xpEvents: [idEvent, ...xpEvents!],
    xpCounter: xpCounter + 1,
  };
}

export function removeXpEvent(id: number, xpEvents: XpEvent[]) {
  return { xpEvents: xpEvents!.filter((x) => x.id !== id) };
}
