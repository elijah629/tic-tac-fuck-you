import NextAuth, { Session } from "next-auth";
import Slack from "next-auth/providers/slack";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  trustHost: true,
  providers: [Slack],
  pages: {
    signIn: "/signin",
  },
    callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) { // Initial login
        token.hardcore = false;
      }

      if (trigger === "update" && session?.user?.hardcore !== undefined) { // Sync token and auth;
        token.hardcore = session.user.hardcore;
      }

      return token;
    },
    async session({ session, token }) { // Get session
      // FUCK YEAH! ENABLE SWEARING!
      (session.user as unknown as { hardcore: boolean }).hardcore = token.hardcore as boolean;

      return session;
    }
  }
  /* callbacks: {
    authorized({ request, auth }) {
      const pathname = new URL(request.url).pathname;

      const isProtected =
        pathname.startsWith("/api/chat") || pathname.startsWith("/play");

      // No auth in dev bc slack sucks
      return process.env.NODE_ENV !== "production" ? !isProtected || !!auth : true;
    },
  },*/
});

export async function isHardcore(session?: Session | null): Promise<boolean> {
  const s = session ?? await auth();

  return !!((s?.user as unknown as ({ hardcore: boolean | undefined } | undefined))?.hardcore)
}
