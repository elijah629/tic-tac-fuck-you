import { Player, Team } from "@/types/game";
import { play } from "../settings";
import { SFX_SOUNDS } from "@/types/settings";

export async function roulette(ai: Player, human: Player): Promise<Team | false> {
  await play(SFX_SOUNDS.SPIN, false, true);

  // Player first fires at AI, then the AI fires against them.
  if (Math.floor(Math.random() * 6) === 0) { // AI loses via termination
    await play(SFX_SOUNDS.GUNSHOT, false, true);

    return human.team;
  }

  await play(SFX_SOUNDS.CLICK, false, true);
  await play(SFX_SOUNDS.SPIN, false, true);

  if (Math.floor(Math.random() * 6) === 0) {
    await play(SFX_SOUNDS.GUNSHOT, false, true);

    return ai.team;
  }

  play(SFX_SOUNDS.CLICK, false);

  return false;
}
