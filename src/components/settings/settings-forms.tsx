"use client";

import { Check, LoaderCircle, Mail, MapPin, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import {
  changePasswordAction,
  updateProfileAction,
} from "@/actions/profile";
import { SubmitButton } from "@/components/ui/submit-button";
import { idleActionState, type ActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

const COMMON_TIMEZONES = [
  "America/Bogota",
  "America/Mexico_City",
  "America/Lima",
  "America/Santiago",
  "America/Argentina/Buenos_Aires",
  "America/Caracas",
  "America/Guayaquil",
  "America/Panama",
  "America/Santo_Domingo",
  "America/Sao_Paulo",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/Madrid",
  "Europe/London",
  "Europe/Paris",
  "UTC",
];

export function ProfileForm({
  name,
  email,
  timeZone,
}: {
  name: string;
  email: string;
  timeZone: string;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<ActionState, FormData>(
    updateProfileAction,
    idleActionState,
  );
  const lastMessage = useRef("");

  useEffect(() => {
    if (state.status === "success" && state.message) {
      if (lastMessage.current === state.message) return;
      lastMessage.current = state.message;
      toast.success(state.message);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className="label">
            Nombre
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="profile-name"
              name="name"
              defaultValue={name}
              minLength={2}
              maxLength={60}
              required
              className={cn(
                "input pl-11",
                state.errors?.name && "input-error",
              )}
            />
          </div>
          {state.errors?.name?.[0] && (
            <p className="field-error">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="profile-email" className="label">
            Correo
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              id="profile-email"
              value={email}
              readOnly
              disabled
              className="input cursor-not-allowed bg-cream-200/50 pl-11 text-ink-muted"
            />
          </div>
          <p className="help-text">El correo de acceso no se puede cambiar aquí.</p>
        </div>
      </div>

      <div>
        <label htmlFor="profile-timezone" className="label">
          Zona horaria
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            id="profile-timezone"
            name="timeZone"
            list="habitactive-timezones"
            defaultValue={timeZone}
            required
            className={cn(
              "input pl-11",
              state.errors?.timeZone && "input-error",
            )}
          />
          <datalist id="habitactive-timezones">
            {COMMON_TIMEZONES.map((zone) => (
              <option key={zone} value={zone} />
            ))}
          </datalist>
        </div>
        <p className="help-text">
          Se usa para decidir qué día es “hoy” y calcular tus rachas. Si viajas
          o te mudas, cámbiala aquí.
        </p>
        {state.errors?.timeZone?.[0] && (
          <p className="field-error">{state.errors.timeZone[0]}</p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-2xl border border-[#E9C0AC] bg-[#FFF5EE] px-4 py-3 text-sm font-bold text-[#914A28]"
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton pendingText="Guardando…">
          <Check className="size-4" />
          Guardar perfil
        </SubmitButton>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(
    changePasswordAction,
    idleActionState,
  );
  const [formKey, setFormKey] = useState(0);
  const lastMessage = useRef("");

  useEffect(() => {
    if (state.status === "success" && state.message) {
      if (lastMessage.current === state.message) return;
      lastMessage.current = state.message;
      toast.success(state.message);
      setFormKey((key) => key + 1);
    }
  }, [state]);

  return (
    <form key={formKey} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="label">
          Contraseña actual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={cn(
            "input",
            state.errors?.currentPassword && "input-error",
          )}
        />
        {state.errors?.currentPassword?.[0] && (
          <p className="field-error">{state.errors.currentPassword[0]}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="newPassword" className="label">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            className={cn(
              "input",
              state.errors?.newPassword && "input-error",
            )}
          />
          {state.errors?.newPassword?.[0] && (
            <p className="field-error">{state.errors.newPassword[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className={cn(
              "input",
              state.errors?.confirmPassword && "input-error",
            )}
          />
          {state.errors?.confirmPassword?.[0] && (
            <p className="field-error">{state.errors.confirmPassword[0]}</p>
          )}
        </div>
      </div>

      <p className="help-text">
        Mínimo 8 caracteres, con al menos una letra y un número.
      </p>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-2xl border border-[#E9C0AC] bg-[#FFF5EE] px-4 py-3 text-sm font-bold text-[#914A28]"
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton variant="ghost" pendingText="Actualizando…">
          Actualizar contraseña
        </SubmitButton>
      </div>
    </form>
  );
}

export function SignOutWide() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/" });
      }}
      disabled={loading}
      className="btn-ghost w-full"
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <span className="size-2 rounded-full bg-[#B88916]" />
      )}
      Cerrar sesión en este dispositivo
    </button>
  );
}
