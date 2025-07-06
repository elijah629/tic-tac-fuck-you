import NextAuth from "next-auth";
import Slack from "next-auth/providers/slack";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [Slack({
    authorization: {
      params: {
        scope: "openid" // We only need name, not email profile etc
      }
    }
  })],
  pages: {
    signIn: "/signin",
  },
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
