"use server";

import { revalidatePath } from "next/cache";

import {
  errorState,
  type ActionState,
  successState,
} from "@/lib/action-state";
import {
  challengeDate,
  challengeDay,
  todayKey,
} from "@/lib/dates";
import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import {
  challengeSchema,
  fieldErrors,
  joinChallengeSchema,
  progressSchema,
} from "@/lib/validations";

function revalidateSocial(challengeId?: string) {
  revalidatePath("/community");
  revalidatePath("/dashboard");
  if (challengeId) revalidatePath(`/community/${challengeId}`);
}

export async function createChallengeAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = challengeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    targetValue: formData.get("targetValue"),
    unit: formData.get("unit"),
    startDay: formData.get("startDay"),
    endDay: formData.get("endDay"),
  });

  if (!parsed.success) {
    return errorState(
      "Revisa los datos del reto.",
      fieldErrors(parsed.error),
    );
  }

  const today = todayKey(user.timeZone);
  if (parsed.data.endDay < today) {
    return errorState("La fecha de cierre ya pasó.", {
      endDay: ["Elige una fecha futura."],
    });
  }

  const challenge = await prisma.socialChallenge.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      targetValue: parsed.data.targetValue,
      unit: parsed.data.unit,
      startDate: challengeDate(parsed.data.startDay),
      endDate: challengeDate(parsed.data.endDay),
      isPublic: true,
      createdById: user.id,
      participants: {
        create: {
          userId: user.id,
          progress: 0,
        },
      },
    },
    select: { id: true },
  });

  revalidateSocial(challenge.id);
  return successState("Reto creado. Invita a tu comunidad.");
}

export async function joinChallengeAction(input: {
  challengeId: string;
}): Promise<ActionState> {
  const user = await requireUser();
  const parsed = joinChallengeSchema.safeParse(input);
  if (!parsed.success) return errorState("Reto inválido.");

  const challenge = await prisma.socialChallenge.findFirst({
    where: {
      id: parsed.data.challengeId,
      isPublic: true,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      participants: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
  });

  if (!challenge) return errorState("No encontramos ese reto.");
  if (challenge.participants.length > 0) {
    return successState("Ya estás dentro de este reto.");
  }

  const today = todayKey(user.timeZone);
  if (today > challengeDay(challenge.endDate)) {
    return errorState("Este reto ya terminó.");
  }

  await prisma.challengeParticipant.create({
    data: {
      challengeId: challenge.id,
      userId: user.id,
      progress: 0,
    },
  });

  revalidateSocial(challenge.id);
  return successState("¡Ya eres parte del reto!");
}

export async function leaveChallengeAction(input: {
  challengeId: string;
}): Promise<ActionState> {
  const user = await requireUser();
  const parsed = joinChallengeSchema.safeParse(input);
  if (!parsed.success) return errorState("Reto inválido.");

  const participant = await prisma.challengeParticipant.findUnique({
    where: {
      challengeId_userId: {
        challengeId: parsed.data.challengeId,
        userId: user.id,
      },
    },
    select: {
      id: true,
      challenge: { select: { createdById: true } },
    },
  });

  if (!participant) return errorState("No participabas en este reto.");
  if (participant.challenge.createdById === user.id) {
    return errorState("Como creador no puedes abandonar tu propio reto.");
  }

  await prisma.challengeParticipant.delete({ where: { id: participant.id } });
  revalidateSocial(parsed.data.challengeId);
  return successState("Has salido del reto.");
}

export type ProgressResult =
  | {
      ok: true;
      progress: number;
      completed: boolean;
      percent: number;
    }
  | { ok: false; message: string };

export async function logChallengeProgressAction(input: {
  challengeId: string;
  delta?: number;
}): Promise<ProgressResult> {
  const user = await requireUser();
  const parsed = progressSchema.safeParse({
    challengeId: input.challengeId,
    delta: input.delta ?? 1,
  });
  if (!parsed.success) return { ok: false, message: "Avance inválido." };

  const participant = await prisma.challengeParticipant.findUnique({
    where: {
      challengeId_userId: {
        challengeId: parsed.data.challengeId,
        userId: user.id,
      },
    },
    select: {
      id: true,
      progress: true,
      challenge: {
        select: {
          startDate: true,
          endDate: true,
          targetValue: true,
        },
      },
    },
  });

  if (!participant) {
    return { ok: false, message: "Primero únete al reto." };
  }

  const today = todayKey(user.timeZone);
  const startDay = challengeDay(participant.challenge.startDate);
  const endDay = challengeDay(participant.challenge.endDate);
  if (today < startDay) {
    return { ok: false, message: "El reto aún no ha comenzado." };
  }
  if (today > endDay) {
    return { ok: false, message: "Este reto ya terminó." };
  }
  if (participant.progress >= participant.challenge.targetValue) {
    return { ok: false, message: "¡Ya alcanzaste la meta!" };
  }

  const nextProgress = Math.min(
    participant.challenge.targetValue,
    participant.progress + parsed.data.delta,
  );

  await prisma.challengeParticipant.update({
    where: { id: participant.id },
    data: { progress: nextProgress, lastCheckInAt: new Date() },
  });

  revalidateSocial(parsed.data.challengeId);
  return {
    ok: true,
    progress: nextProgress,
    completed: nextProgress >= participant.challenge.targetValue,
    percent: Math.round(
      (nextProgress / participant.challenge.targetValue) * 100,
    ),
  };
}
