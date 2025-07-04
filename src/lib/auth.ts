import NextAuth from "next-auth";
import Slack from "next-auth/providers/slack";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Slack],
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
