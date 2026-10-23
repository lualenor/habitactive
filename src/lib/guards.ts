import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      timeZone: true,
      createdAt: true,
    },
  });
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("No autorizado");
    this.name = "UnauthorizedError";
  }
}
