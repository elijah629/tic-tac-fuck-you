"use server";

import { Game } from "@/components/game";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

export default async function Play() {
  async function onWin() {
    "use server";

    const session = await auth();
    const user = session?.user?.name;

    if (!user) return;

    await redis.zincrby("leaderboard", 1, user);
  }

  return <Game onWin={onWin} />;
}
