import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// IMPORTANT: This file runs on the server.
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      // Add user id to session for convenience
      if (session.user) (session.user as any).id = user.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };