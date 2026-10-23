"use client";

import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";

export function LoginForm({
  callbackUrl,
  hadError,
}: {
  callbackUrl: string;
  hadError: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    hadError ? "No pudimos iniciar sesión. Inténtalo de nuevo." : "",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError(
          "El correo o la contraseña no son correctos. Revisa e inténtalo de nuevo.",
        );
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Ocurrió un problema de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-[#E9C0AC] bg-[#FFF5EE] px-4 py-3 text-sm font-bold text-[#914A28]"
        >
          {error}
        </div>
      )}

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
            className="input pl-11"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <span className="mb-1.5 text-[0.68rem] font-bold text-ink-faint">
            Mínimo 8 caracteres
          </span>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-ink-muted" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contraseña"
            className="input px-11"
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
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-dark mt-2 w-full py-3.5"
      >
        {loading && <LoaderCircle className="size-4 animate-spin" />}
        {loading ? "Entrando…" : "Entrar a mi espacio"}
      </button>

      <p className="pt-1 text-center text-sm font-semibold text-ink-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-extrabold text-[#8A6512] underline decoration-[#D9B858] decoration-2 underline-offset-4 transition hover:text-ink"
        >
          Crea tu cuenta
        </Link>
      </p>
    </form>
  );
}
