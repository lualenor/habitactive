import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";

function ipFromRequest(req: { headers?: Record<string, string | string[] | undefined> }) {
  const forwarded = req.headers?.["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || "unknown";
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const ip = ipFromRequest(req);
        const limiter = rateLimit(
          `login:${ip}:${parsed.data.email}`,
          10,
          10 * 60 * 1000,
        );
        if (!limiter.allowed) {
          throw new Error("Demasiados intentos. Espera unos minutos.");
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
          },
        });

        // Se compara siempre, incluso si el usuario no existe, para reducir
        // diferencias de tiempo que permitan enumerar cuentas.
        const valid = await verifyPassword(
          parsed.data.password,
          user?.passwordHash ?? DUMMY_PASSWORD_HASH,
        );

        if (!user || !valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
