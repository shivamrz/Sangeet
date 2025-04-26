import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/app/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        await prismaClient.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            provider: "Google"
          }
        });
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
    },
    async session({ session }) {
      if (!session.user?.email) return session;

      const dbUser = await prismaClient.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });

      if (dbUser) {
        session.user.id = dbUser.id;
      }

      return session;
    }
  }
};
