"use server";

import { revalidatePath } from "next/cache";

import {
  errorState,
  type ActionState,
  successState,
} from "@/lib/action-state";
import { localNoon, toDayKey, todayKey } from "@/lib/dates";
import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { calculateStreaks } from "@/lib/streaks";
import {
  archiveHabitSchema,
  fieldErrors,
  habitSchema,
  toggleHabitSchema,
  updateHabitSchema,
} from "@/lib/validations";

function revalidateHabitViews() {
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
}

export async function createHabitAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = habitSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    frequency: formData.get("frequency"),
    targetPerWeek: formData.get("targetPerWeek") ?? 7,
  });

  if (!parsed.success) {
    return errorState(
      "Revisa los campos del hábito.",
      fieldErrors(parsed.error),
    );
  }

  const today = todayKey(user.timeZone);
  await prisma.habit.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category,
      frequency: parsed.data.frequency,
      targetPerWeek: parsed.data.targetPerWeek,
      startDate: localNoon(today, user.timeZone),
    },
  });

  revalidateHabitViews();
  return successState("Hábito creado. Un paso más cerca.");
}

export async function updateHabitAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = updateHabitSchema.safeParse({
    habitId: formData.get("habitId"),
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    frequency: formData.get("frequency"),
    targetPerWeek: formData.get("targetPerWeek") ?? 7,
  });

  if (!parsed.success) {
    return errorState(
      "Revisa los campos del hábito.",
      fieldErrors(parsed.error),
    );
  }

  const { habitId, ...data } = parsed.data;
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId: user.id },
    select: { id: true },
  });
  if (!habit) return errorState("No encontramos ese hábito.");

  await prisma.habit.update({
    where: { id: habit.id },
    data,
  });

  revalidateHabitViews();
  return successState("Hábito actualizado.");
}

export async function archiveHabitAction(
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const parsed = archiveHabitSchema.safeParse({
    habitId: formData.get("habitId"),
  });
  if (!parsed.success) return;

  await prisma.habit.updateMany({
    where: { id: parsed.data.habitId, userId: user.id, archivedAt: null },
    data: { archivedAt: new Date() },
  });

  revalidateHabitViews();
}

export type ToggleHabitResult =
  | {
      ok: true;
      completed: boolean;
      currentStreak: number;
      bestStreak: number;
    }
  | { ok: false; message: string };

export async function toggleHabitAction(input: {
  habitId: string;
  day: string;
}): Promise<ToggleHabitResult> {
  const user = await requireUser();
  const parsed = toggleHabitSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "La fecha o el hábito no son válidos." };
  }

  const habit = await prisma.habit.findFirst({
    where: { id: parsed.data.habitId, userId: user.id, archivedAt: null },
    select: {
      id: true,
      frequency: true,
      targetPerWeek: true,
      startDate: true,
    },
  });

  if (!habit) {
    return { ok: false, message: "No encontramos ese hábito." };
  }

  const today = todayKey(user.timeZone);
  const startDay = toDayKey(habit.startDate, user.timeZone);
  if (parsed.data.day > today) {
    return { ok: false, message: "Aún no puedes marcar un día futuro." };
  }
  if (parsed.data.day < startDay) {
    return { ok: false, message: "Ese día es anterior al inicio del hábito." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.habitLog.findUnique({
        where: {
          habitId_day: { habitId: habit.id, day: parsed.data.day },
        },
        select: { id: true },
      });

      let completed: boolean;
      if (existing) {
        await tx.habitLog.delete({ where: { id: existing.id } });
        completed = false;
      } else {
        await tx.habitLog.create({
          data: {
            habitId: habit.id,
            userId: user.id,
            day: parsed.data.day,
            date: localNoon(parsed.data.day, user.timeZone),
          },
        });
        completed = true;
      }

      const logs = await tx.habitLog.findMany({
        where: { habitId: habit.id, userId: user.id },
        select: { day: true },
      });
      const streaks = calculateStreaks({
        frequency: habit.frequency,
        targetPerWeek: habit.targetPerWeek,
        startDay,
        logs: logs.map((log) => log.day),
        todayKey: today,
      });

      await tx.habit.update({
        where: { id: habit.id },
        data: {
          currentStreak: streaks.current,
          bestStreak: Math.max(streaks.best, streaks.current),
        },
      });

      return {
        completed,
        currentStreak: streaks.current,
        bestStreak: Math.max(streaks.best, streaks.current),
      };
    });

    revalidateHabitViews();
    return { ok: true, ...result };
  } catch {
    return {
      ok: false,
      message: "No se pudo guardar el registro. Inténtalo de nuevo.",
    };
  }
}
