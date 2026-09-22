import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { serverEnv } from "@/config/env.server";
import { loginSchema } from "@/features/users/schemas/user.schema";
import { userService } from "@/features/users/services/user.service";

export const {
  auth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  secret: serverEnv.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        try {
          const user = await userService.verifyCredentials(
            parsed.data,
          );

          return {
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            status: user.status,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId ?? "";
        session.user.role = token.role ?? "staff";
        session.user.status =
          token.status ?? "deactivated";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});