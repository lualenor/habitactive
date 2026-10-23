"use client";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";

type FieldErrors = Record<string, string[] | undefined>;

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const passwordReady =
    password.length >= 8 && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(password) && /\d/.test(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setErrors({});

    if (!accepted) {
      setError("Acepta los términos y la política de privacidad para continuar.");
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Las contraseñas no coinciden."] });
      return;
    }

    setLoading(true);

    try {
      const timeZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Bogota";
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          timeZone,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        errors?: FieldErrors;
      };

      if (!response.ok) {
        setError(payload.message ?? "No pudimos crear tu cuenta.");
        setErrors(payload.errors ?? {});
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError(
          "Tu cuenta se creó, pero no pudimos iniciar sesión. Ve a iniciar sesión.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Ocurrió un problema de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-[#E9C0AC] bg-[#FFF5EE] px-4 py-3 text-sm font-bold text-[#914A28]"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">
          Tu nombre
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-ink-muted" />
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="¿Cómo te llamas?"
            className={`input pl-11 ${errors.name ? "input-error" : ""}`}
          />
        </div>
        {errors.name?.[0] && <p className="field-error">{errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="label">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-ink-muted" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            className={`input pl-11 ${errors.email ? "input-error" : ""}`}
          />
        </div>
        {errors.email?.[0] && <p className="field-error">{errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="password" className="label">
          Contraseña
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-ink-muted" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Al menos 8 caracteres"
            className={`input px-11 ${errors.password ? "input-error" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-200 hover:text-ink"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <PasswordHint
            active={password.length >= 8}
            label="8 caracteres"
          />
          <PasswordHint
            active={/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(password)}
            label="una letra"
          />
          <PasswordHint active={/\d/.test(password)} label="un número" />
        </div>
        {errors.password?.[0] && (
          <p className="field-error">{errors.password[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirma tu contraseña
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-ink-muted" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repite tu contraseña"
            className={`input pl-11 ${errors.confirmPassword ? "input-error" : ""}`}
          />
        </div>
        {errors.confirmPassword?.[0] && (
          <p className="field-error">{errors.confirmPassword[0]}</p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-cream-200/60 p-3.5">
        <input
          id="terms"
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[#B88916]"
        />
        <label htmlFor="terms" className="cursor-pointer text-[0.72rem] font-semibold leading-relaxed text-ink-soft">
          Acepto los{" "}
          <Link href="/terms" className="font-extrabold text-[#8A6512] underline decoration-[#D9B858] underline-offset-2">
            términos de uso
          </Link>{" "}
          y la{" "}
          <Link href="/privacy" className="font-extrabold text-[#8A6512] underline decoration-[#D9B858] underline-offset-2">
            política de privacidad
          </Link>
          . Mis hábitos serán privados; solo compartiré lo que decida en los
          retos.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !passwordReady}
        className="btn-dark w-full py-3.5"
      >
        {loading && <LoaderCircle className="size-4 animate-spin" />}
        {loading ? "Creando tu espacio…" : "Crear mi cuenta gratis"}
      </button>

      <p className="pt-1 text-center text-sm font-semibold text-ink-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-extrabold text-[#8A6512] underline decoration-[#D9B858] decoration-2 underline-offset-4 transition hover:text-ink"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}

function PasswordHint({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[0.68rem] font-bold transition ${
        active ? "text-[#6C7C39]" : "text-ink-faint"
      }`}
    >
      <CheckCircle2
        className={`size-3.5 ${active ? "text-[#7C9A4A]" : "text-ink-faint"}`}
      />
      {label}
    </span>
  );
}
