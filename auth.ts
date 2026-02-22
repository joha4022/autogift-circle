import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma"; // adjust if your prisma client path differs

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,

  // (Optional but recommended) ensure we always have a User row with email, etc.
  callbacks: {
    async session({ session, user }) {
      // Attach user id to session for later use
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
});