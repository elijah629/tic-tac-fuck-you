"use server";

import { Game } from "@/components/game";
import { auth, signIn } from "@/lib/auth";
import { redis } from "@/lib/redis";

export default async function Play({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const free = (await searchParams).free !== undefined;
  const session = await auth();
  const user = session?.user?.name;

  // user may use ?free but be logged in
  if (!user && !free) await signIn(undefined, {
    redirectTo: "/play"
  });

  async function onWin() {
    "use server";

    if (!user) {
      return;
    }

    await redis.zincrby("leaderboard", 1, user);
  }

  return <Game free={free} onWin={onWin} />;
}
