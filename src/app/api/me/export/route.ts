import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Exporta los datos del usuario autenticado. Nunca incluye hashes. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const [habits, challengesCreated, participations] = await Promise.all([
    prisma.habit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        frequency: true,
        targetPerWeek: true,
        currentStreak: true,
        bestStreak: true,
        startDate: true,
        archivedAt: true,
        createdAt: true,
        logs: {
          select: { day: true, date: true, createdAt: true },
          orderBy: { day: "asc" },
        },
      },
    }),
    prisma.socialChallenge.findMany({
      where: { createdById: user.id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        targetValue: true,
        unit: true,
        startDate: true,
        endDate: true,
        isPublic: true,
        createdAt: true,
      },
    }),
    prisma.challengeParticipant.findMany({
      where: { userId: user.id },
      select: {
        progress: true,
        joinedAt: true,
        challenge: {
          select: {
            id: true,
            title: true,
            targetValue: true,
            unit: true,
          },
        },
      },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    app: "Habitactive",
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      timeZone: user.timeZone,
      createdAt: user.createdAt,
    },
    habits,
    challengesCreated,
    participations,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="habitactive-${user.id}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
