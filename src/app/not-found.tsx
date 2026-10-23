import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10 text-center">
      <Logo markSize={52} />
      <p className="mt-10 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#9A7B2D]">
        Error 404
      </p>
      <h1 className="mt-2 max-w-lg text-4xl font-black leading-tight tracking-[-0.05em] text-ink sm:text-5xl">
        Este sendero no lleva a ningún hábito.
      </h1>
      <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-ink-muted">
        Puede que el enlace haya cambiado o que el reto ya no esté disponible.
        Vuelve a tu espacio y sigue desde donde estabas.
      </p>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Link href="/dashboard" className="btn-primary">
          <ArrowLeft className="size-4" />
          Ir a mi día
        </Link>
        <Link href="/community" className="btn-ghost">
          <Compass className="size-4" />
          Explorar retos
        </Link>
      </div>
    </div>
  );
}
