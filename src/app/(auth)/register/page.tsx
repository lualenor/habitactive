import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Crea tu cuenta",
  description:
    "Empieza gratis en Habitactive: hábitos privados, rachas y retos en comunidad.",
};

export default function RegisterPage() {
  return (
    <div className="animate-fade-up">
      <p className="eyebrow">Empieza hoy</p>
      <h1 className="mt-2 text-[2.35rem] font-black leading-[1.05] tracking-[-0.045em] text-ink">
        Crea tu espacio.
      </h1>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-ink-muted">
        Un lugar solo tuyo para tus hábitos. Y una comunidad para los retos que
        valen la pena.
      </p>

      <RegisterForm />
    </div>
  );
}
