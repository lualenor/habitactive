"use server";

import { revalidatePath } from "next/cache";

import {
  errorState,
  type ActionState,
  successState,
} from "@/lib/action-state";
import { requireUser } from "@/lib/guards";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import {
  changePasswordSchema,
  fieldErrors,
  profileSchema,
} from "@/lib/validations";

export async function updateProfileAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    timeZone: formData.get("timeZone"),
  });

  if (!parsed.success) {
    return errorState(
      "Revisa tus datos.",
      fieldErrors(parsed.error),
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      timeZone: parsed.data.timeZone,
    },
  });

  revalidatePath("/", "layout");
  return successState("Perfil actualizado.");
}

export async function changePasswordAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return errorState(
      "Revisa los campos de seguridad.",
      fieldErrors(parsed.error),
    );
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  if (!record) return errorState("No encontramos tu cuenta.");

  const valid = await verifyPassword(
    parsed.data.currentPassword,
    record.passwordHash,
  );
  if (!valid) {
    return errorState("La contraseña actual no es correcta.", {
      currentPassword: ["Verifica tu contraseña actual."],
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  return successState("Contraseña actualizada.");
}
