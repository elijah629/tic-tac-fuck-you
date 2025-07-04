"use server";

import { Game } from "@/components/game";
import { auth, signIn } from "@/lib/auth";
import { redis } from "@/lib/redis";

export default async function Play() {
  const session = await auth();
  const user = session?.user?.name;

  if (!user && process.env.NODE_ENV === "production") await signIn();

  async function onWin() {
    "use server";

    if (!user) {
      return;
    }

    await redis.zincrby("leaderboard", 1, user);
  }

  return <Game onWin={onWin} />;
}
