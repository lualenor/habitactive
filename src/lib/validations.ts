import { z } from "zod";

import { isValidDayKey } from "@/lib/dates";

const dayKeySchema = z
  .string()
  .refine(isValidDayKey, "La fecha no es válida.");

const passwordSchema = z
  .string()
  .min(8, "Usa al menos 8 caracteres.")
  .max(72, "La contraseña no puede superar 72 caracteres.")
  .refine(
    (value) => new TextEncoder().encode(value).length <= 72,
    "La contraseña ocupa demasiado espacio. Usa una más corta.",
  )
  .refine(
    (value) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value) && /\d/.test(value),
    "Incluye al menos una letra y un número.",
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Escribe tu nombre.")
      .max(60, "El nombre es demasiado largo."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Escribe un correo válido.")
      .max(254),
    password: passwordSchema,
    confirmPassword: z.string(),
    timeZone: z
      .string()
      .trim()
      .max(80)
      .refine((value) => {
        if (!value) return true;
        try {
          new Intl.DateTimeFormat("es", { timeZone: value }).format();
          return true;
        } catch {
          return false;
        }
      }, "La zona horaria no es válida.")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72),
});

export const habitSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Ponle un nombre al hábito.")
      .max(80, "Máximo 80 caracteres."),
    description: z
      .string()
      .trim()
      .max(280, "Máximo 280 caracteres.")
      .optional()
      .or(z.literal("")),
    category: z.enum(["SPIRITUAL", "INTELLECTUAL", "PHYSICAL", "SOCIAL"]),
    frequency: z.enum(["DAILY", "WEEKLY"]),
    targetPerWeek: z.coerce.number().int().min(1).max(7).default(7),
  })
  .transform((data) => ({
    ...data,
    description: data.description || null,
    targetPerWeek: data.frequency === "DAILY" ? 7 : data.targetPerWeek,
  }));

export const updateHabitSchema = habitSchema.and(
  z.object({ habitId: z.string().min(1) }),
);

export const toggleHabitSchema = z.object({
  habitId: z.string().min(1),
  day: dayKeySchema,
});

export const archiveHabitSchema = z.object({
  habitId: z.string().min(1),
});

export const challengeSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "El título debe tener al menos 3 caracteres.")
      .max(80, "Máximo 80 caracteres."),
    description: z
      .string()
      .trim()
      .min(10, "Cuéntanos un poco más sobre el reto.")
      .max(500, "Máximo 500 caracteres."),
    category: z.enum(["SPIRITUAL", "INTELLECTUAL", "PHYSICAL", "SOCIAL"]),
    targetValue: z.coerce
      .number()
      .int("Usa un número entero.")
      .min(1, "La meta debe ser mayor que cero.")
      .max(100_000),
    unit: z
      .string()
      .trim()
      .min(1, "Indica la unidad.")
      .max(20, "Máximo 20 caracteres."),
    startDay: dayKeySchema,
    endDay: dayKeySchema,
  })
  .refine((data) => data.startDay <= data.endDay, {
    message: "La fecha final debe ser posterior a la inicial.",
    path: ["endDay"],
  });

export const joinChallengeSchema = z.object({
  challengeId: z.string().min(1),
});

export const progressSchema = z.object({
  challengeId: z.string().min(1),
  delta: z.coerce.number().int().min(1).max(100).default(1),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre.")
    .max(60, "El nombre es demasiado largo."),
  timeZone: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("es", { timeZone: value }).format();
        return true;
      } catch {
        return false;
      }
    }, "Selecciona una zona horaria válida."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Escribe tu contraseña actual."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas nuevas no coinciden.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente.",
    path: ["newPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type HabitInput = z.infer<typeof habitSchema>;
export type ChallengeInput = z.infer<typeof challengeSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    errors[key] = [...(errors[key] ?? []), issue.message];
  }
  return errors;
}
