import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Inicia sesión",
  description: "Entra a tu espacio de hábitos y retos en Habitactive.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string; error?: string };
}) {
  const callbackUrl =
    searchParams?.callbackUrl?.startsWith("/") &&
    !searchParams.callbackUrl.startsWith("//")
      ? searchParams.callbackUrl
      : "/dashboard";

  return (
    <div className="animate-fade-up">
      <p className="eyebrow">Qué bueno verte</p>
      <h1 className="mt-2 text-[2.35rem] font-black leading-[1.05] tracking-[-0.045em] text-ink">
        Hola de nuevo.
      </h1>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-muted">
        Tu racha te estaba esperando. Entra y hazle espacio a lo que importa.
      </p>

      <LoginForm
        callbackUrl={callbackUrl}
        hadError={Boolean(searchParams?.error)}
      />
    </div>
  );
}
