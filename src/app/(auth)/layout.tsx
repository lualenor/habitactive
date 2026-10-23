import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/guards";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-10 size-[34rem] rounded-full bg-[#FFE8A8]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[28rem] rounded-full bg-[#F3E6BD]/60 blur-3xl" />

      <div className="relative mx-auto grid min-h-dvh max-w-[92rem] lg:grid-cols-[1.02fr_1fr]">
        <aside className="relative hidden overflow-hidden p-6 lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
          <div className="absolute inset-4 -z-10 rounded-[2.75rem] border border-[#EBD8A8] bg-[#FFF4CE]/80 shadow-soft" />
          <div className="absolute bottom-24 right-8 -z-10 size-64 rounded-full border border-[#DFC16C]/35 bg-[#FFE9A8]/45 blur-sm" />

          <Logo href="/" markSize={48} />

          <div className="max-w-[34rem]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5CD8B] bg-cream-100/80 px-3.5 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#8A6512]">
              <Sparkles className="size-3.5" />
              Crecer también es compartir
            </span>
            <h1 className="mt-6 text-balance text-5xl font-black leading-[1.04] tracking-[-0.055em] text-ink xl:text-[4.2rem]">
              Pequeños hábitos.
              <br />
              <span className="text-[#B88916]">Grandes comunidades.</span>
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base font-semibold leading-relaxed text-ink-soft xl:text-lg">
              Tu espacio privado para construir constancia, con la energía de
              una comunidad que camina contigo.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#EBD8A8]/80 bg-white/55 p-4 backdrop-blur-sm">
                <ShieldCheck className="size-5 text-[#8A6512]" />
                <p className="mt-2 text-sm font-extrabold text-ink">
                  Privado por diseño
                </p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-muted">
                  Tus hábitos solo te pertenecen a ti.
                </p>
              </div>
              <div className="rounded-3xl border border-[#EBD8A8]/80 bg-white/55 p-4 backdrop-blur-sm">
                <HeartHandshake className="size-5 text-[#8A6512]" />
                <p className="mt-2 text-sm font-extrabold text-ink">
                  Comunidad real
                </p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-muted">
                  Retos compartidos, progreso visible.
                </p>
              </div>
            </div>
          </div>

          <p className="max-w-sm text-xs font-semibold leading-relaxed text-ink-muted">
            «La constancia no es perfección. Es volver, una y otra vez, a lo que
            le da sentido a tu día.»
          </p>
        </aside>

        <main
          id="contenido"
          className="flex min-h-dvh flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-20"
        >
          <div className="flex items-center justify-between lg:justify-end">
            <div className="lg:hidden">
              <Logo href="/" markSize={38} />
            </div>
            <Link
              href="/"
              className="text-sm font-bold text-ink-soft transition hover:text-ink"
            >
              Volver al inicio
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
            <div className="w-full max-w-[28rem]">{children}</div>
          </div>

          <p className="text-center text-[0.68rem] font-semibold text-ink-faint">
            Habitactive es open source · Hecho para personas, no para algoritmos.
          </p>
        </main>
      </div>
    </div>
  );
}
