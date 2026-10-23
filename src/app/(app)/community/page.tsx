import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ChallengeDialog } from "@/components/challenges/challenge-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { addDaysToKey, todayKey } from "@/lib/dates";
import { getCommunityData } from "@/lib/challenges-data";
import { requireUser } from "@/lib/guards";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Comunidad",
};

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const user = await requireUser();
  const data = await getCommunityData(user.id, user.timeZone);
  const today = todayKey(user.timeZone);
  const tab = searchParams?.tab === "mine" ? "mine" : "explore";
  const challenges = tab === "mine" ? data.mine : data.active;

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Crecer también se comparte</p>
          <h1 className="mt-2 text-[2.35rem] font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-[2.9rem]">
            Comunidad
          </h1>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-ink-muted">
            Retos con intención, progreso visible y personas que también están
            eligiendo volver cada día.
          </p>
        </div>

        <ChallengeDialog
          today={today}
          defaultEndDay={addDaysToKey(today, 30)}
          triggerClassName="self-start sm:self-auto"
        />
      </header>

      <section className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          {
            icon: Trophy,
            value: data.communityStats.activeChallenges,
            label: "Retos activos",
            tone: "bg-[#FFF3CF] text-[#8A6512]",
          },
          {
            icon: Users,
            value: data.communityStats.participants,
            label: "Participaciones",
            tone: "bg-[#EEF3DD] text-[#5E7131]",
          },
          {
            icon: CheckCircle2,
            value: data.communityStats.completedToday,
            label: "Hábitos hoy",
            tone: "bg-[#F8EADF] text-[#8A5D2E]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-[1.4rem] border border-[#EFE2C4] bg-white/60 p-3.5 sm:flex-row sm:items-center sm:gap-3 sm:p-4"
          >
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", stat.tone)}>
              <stat.icon className="size-4" />
            </span>
            <div>
              <p className="text-xl font-black leading-none tracking-[-0.04em] text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.6rem] font-bold leading-tight text-ink-muted sm:text-[0.65rem]">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE2C4] pb-1">
        <div className="flex items-center gap-1">
          <Link
            href="/community"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition",
              tab === "explore"
                ? "bg-ink text-cream-100"
                : "text-ink-soft hover:bg-cream-200 hover:text-ink",
            )}
          >
            <Compass className="size-4" />
            Explorar retos
          </Link>
          <Link
            href="/community?tab=mine"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition",
              tab === "mine"
                ? "bg-ink text-cream-100"
                : "text-ink-soft hover:bg-cream-200 hover:text-ink",
            )}
          >
            <Target className="size-4" />
            Mis retos
            {data.mine.length > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.55rem] font-black",
                  tab === "mine"
                    ? "bg-cream-300 text-ink"
                    : "bg-cream-300 text-[#7D5A0E]",
                )}
              >
                {data.mine.length}
              </span>
            )}
          </Link>
        </div>

        <p className="text-[0.65rem] font-bold text-ink-muted">
          {challenges.length} {challenges.length === 1 ? "reto" : "retos"}
        </p>
      </div>

      {challenges.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : tab === "mine" ? (
        <EmptyState
          icon={Target}
          title="Todavía no caminas en ningún reto"
          description="Explora los retos activos y únete a uno que te haga sentido. No necesitas estar listo, solo empezar."
          action={
            <Link href="/community" className="btn-primary">
              Explorar retos
              <ArrowRight className="size-4" />
            </Link>
          }
          className="surface border-dashed py-14"
        />
      ) : (
        <EmptyState
          icon={Sparkles}
          title="El próximo reto lo creas tú"
          description="Reúne a tu comunidad alrededor de una meta sencilla. Puede ser caminar, leer, meditar o simplemente agradecer."
          action={
            <ChallengeDialog
              today={today}
              defaultEndDay={addDaysToKey(today, 30)}
            />
          }
          className="surface border-dashed py-14"
        />
      )}

      <section className="relative overflow-hidden rounded-[1.8rem] border border-[#EAD8A5] bg-[#FFF8E2] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-[#FFE8A8]/70 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#8A6512] shadow-sm">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-ink">
                Tu privacidad no se negocia
              </h2>
              <p className="mt-1 max-w-xl text-xs font-semibold leading-relaxed text-ink-muted">
                En comunidad se muestra tu nombre, tu avance en el reto y los
                retos a los que te unes. Nunca tus hábitos personales, registros
                ni tu correo.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="inline-flex shrink-0 items-center gap-1.5 text-[0.68rem] font-extrabold text-[#8A6512] hover:text-ink"
          >
            Revisar mi privacidad
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 pb-2 text-[0.62rem] font-semibold text-ink-faint">
        <CalendarDays className="size-3.5" />
        Los retos se muestran en tu fecha local: {today}.
      </div>
    </div>
  );
}
