import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Crown,
  Flag,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  JoinChallengeButton,
  LogProgressButton,
} from "@/components/challenges/challenge-actions";
import { Avatar } from "@/components/ui/avatar";
import { CategoryIcon } from "@/components/ui/category-icon";
import {
  LinearProgress,
  ProgressRing,
} from "@/components/ui/progress";
import { CATEGORY_META } from "@/lib/categories";
import {
  getChallengeDetail,
  type ChallengeStatus,
} from "@/lib/challenges-data";
import { formatDay } from "@/lib/dates";
import { requireUser } from "@/lib/guards";
import { cn, pluralize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const user = await requireUser();
  const challenge = await getChallengeDetail(params.id, user.id, user.timeZone);
  if (!challenge) return { title: "Reto no encontrado" };
  return {
    title: challenge.title,
    description: challenge.description,
  };
}

const statusLabels: Record<ChallengeStatus, string> = {
  active: "Reto activo",
  upcoming: "Próximamente",
  ended: "Finalizado",
};

export default async function ChallengeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const challenge = await getChallengeDetail(params.id, user.id, user.timeZone);
  if (!challenge) notFound();

  const meta = CATEGORY_META[challenge.category];
  const myPercent = challenge.myJoined
    ? Math.round((challenge.myProgress / challenge.targetValue) * 100)
    : 0;
  const myCompleted = challenge.myProgress >= challenge.targetValue;
  const leader = challenge.participants[0];
  const canLog =
    challenge.myJoined && challenge.status === "active" && !myCompleted;

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Volver a comunidad
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold text-ink-muted">
          <ShieldCheck className="size-3.5" />
          Solo se comparte tu avance del reto
        </span>
      </div>

      <section className={cn("relative overflow-hidden rounded-[2rem] border border-[#EAD8A5] p-5 sm:p-8", meta.surface)}>
        <div className="pointer-events-none absolute -right-10 -top-20 opacity-10">
          <CategoryIcon category={challenge.category} className="size-80" strokeWidth={1} />
        </div>
        <div className="relative grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-white/65 text-ink-soft">
                <CategoryIcon category={challenge.category} className="size-3" />
                {meta.label}
              </span>
              <span
                className={cn(
                  "chip",
                  challenge.status === "active"
                    ? "bg-[#E8EFCF] text-[#53652C]"
                    : challenge.status === "upcoming"
                      ? "bg-[#E7F1F2] text-[#416B73]"
                      : "bg-white/60 text-ink-faint",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    challenge.status === "active"
                      ? "bg-[#7C9A4A]"
                      : challenge.status === "upcoming"
                        ? "bg-[#5F8C99]"
                        : "bg-[#B4A98F]",
                  )}
                />
                {statusLabels[challenge.status]}
              </span>
            </div>

            <h1 className="mt-4 max-w-2xl text-balance text-[2.25rem] font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-[3rem]">
              {challenge.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-ink-soft sm:text-base">
              {challenge.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[0.68rem] font-bold text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDay(challenge.startDay, {
                  day: "numeric",
                  month: "short",
                })}{" "}
                —{" "}
                {formatDay(challenge.endDay, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" />
                {pluralize(challenge.participants.length, "participante")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-4" />
                Creado por {challenge.creatorName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-[1.6rem] border border-white/70 bg-white/60 p-4 backdrop-blur-sm sm:p-5">
            <ProgressRing
              value={myPercent}
              size={102}
              stroke={8}
              trackClassName="text-white/70"
              indicatorClassName="text-[#C99A24]"
            >
              <span className="text-2xl font-black tracking-[-0.05em] text-ink">
                {myPercent}%
              </span>
              <span className="text-[0.5rem] font-black uppercase tracking-wider text-ink-muted">
                mi avance
              </span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-ink-muted">
                Meta del reto
              </p>
              <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-ink">
                {challenge.targetValue}
                <span className="ml-1.5 text-xs font-bold text-ink-muted">
                  {challenge.unit}
                </span>
              </p>
              <p className="mt-2 text-[0.65rem] font-semibold leading-snug text-ink-soft">
                {challenge.status === "active"
                  ? `Quedan ${pluralize(challenge.daysLeft, "día")}.`
                  : challenge.status === "upcoming"
                    ? "Aún no comienza."
                    : "Este reto ya terminó."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
        <section className="surface p-5 sm:p-6" aria-labelledby="participants-title">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="participants-title"
                className="text-xl font-black tracking-[-0.035em] text-ink"
              >
                Progreso de la comunidad
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-ink-muted">
                Un vistazo honesto a cómo avanza cada persona.
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1.5 text-[0.62rem] font-extrabold text-ink-soft sm:inline-flex">
              <Trophy className="size-3.5 text-[#B88916]" />
              {challenge.completionPercent}% completó la meta
            </span>
          </div>

          {leader && challenge.participants.length > 1 && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#EAD8A5] bg-[#FFF8E2] p-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#FFE8A8] text-[#8A6512]">
                <Crown className="size-4" />
              </span>
              <p className="text-xs font-bold text-ink-soft">
                <span className="font-black text-ink">{leader.name}</span> lidera
                con {leader.progress} de {challenge.targetValue}{" "}
                {challenge.unit}.
              </p>
            </div>
          )}

          <ul className="mt-5 space-y-2.5">
            {challenge.participants.map((participant, index) => (
              <li
                key={participant.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 transition sm:gap-4",
                  participant.isMe
                    ? "border-[#DCC16F] bg-[#FFF8E2]"
                    : "border-[#F1E5C9] bg-white/55",
                )}
              >
                <span className="w-5 shrink-0 text-center text-[0.68rem] font-black text-ink-faint">
                  {index + 1}
                </span>
                <Avatar name={participant.name} image={participant.image} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-extrabold text-ink">
                      {participant.name}
                      {participant.isMe && (
                        <span className="ml-1.5 text-[0.6rem] font-black text-[#8A6512]">
                          (tú)
                        </span>
                      )}
                    </p>
                    {participant.isCreator && (
                      <span className="chip bg-cream-300 text-[0.55rem] text-[#7D5A0E]">
                        Creador
                      </span>
                    )}
                    {participant.progress >= challenge.targetValue && (
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#7C9A4A]" />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <LinearProgress
                      value={participant.percent}
                      className="h-1.5"
                      barClassName={
                        participant.progress >= challenge.targetValue
                          ? "bg-[#8FAF5B]"
                          : "bg-[#E7B73B]"
                      }
                    />
                    <span className="w-20 shrink-0 text-right text-[0.62rem] font-extrabold text-ink-muted">
                      {participant.progress}/{challenge.targetValue}{" "}
                      {challenge.unit}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <section className="surface-solid relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-[#FFE8A8]/60 blur-2xl" />
            <div className="relative">
              <p className="eyebrow">Mi participación</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-4xl font-black leading-none tracking-[-0.055em] text-ink">
                    {challenge.myProgress}
                    <span className="ml-1 text-base font-bold text-ink-muted">
                      / {challenge.targetValue}
                    </span>
                  </p>
                  <p className="mt-1 text-[0.68rem] font-bold text-ink-muted">
                    {challenge.unit} registrados
                  </p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/70 text-[#B88916]">
                  {myCompleted ? (
                    <Trophy className="size-5" />
                  ) : (
                    <Target className="size-5" />
                  )}
                </span>
              </div>

              <LinearProgress value={myPercent} className="mt-4 h-2.5" />

              <div className="mt-5">
                {!challenge.myJoined ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold leading-relaxed text-ink-muted">
                      Únete para registrar tu avance y aparecer en el progreso
                      de la comunidad.
                    </p>
                    <JoinChallengeButton
                      challengeId={challenge.id}
                      joined={challenge.myJoined}
                      isCreator={challenge.isCreator}
                      status={challenge.status}
                      className="w-full justify-center py-3"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <LogProgressButton
                      challengeId={challenge.id}
                      disabled={!canLog}
                      completed={myCompleted}
                    />
                    {challenge.isCreator && (
                      <div className="rounded-2xl border border-[#EAD8A5] bg-white/60 p-3">
                        <p className="flex items-center gap-1.5 text-[0.65rem] font-extrabold text-[#8A6512]">
                          <Flag className="size-3.5" />
                          Eres el creador de este reto
                        </p>
                        <p className="mt-1 text-[0.62rem] font-semibold leading-relaxed text-ink-muted">
                          Comparte el enlace con tu comunidad. Tu propio avance
                          también cuenta.
                        </p>
                      </div>
                    )}
                    {!challenge.isCreator && (
                      <JoinChallengeButton
                        challengeId={challenge.id}
                        joined
                        isCreator={false}
                        status={challenge.status}
                        className="w-full justify-center"
                        size="sm"
                      />
                    )}
                    <p className="text-center text-[0.6rem] font-semibold text-ink-faint">
                      Registra tu avance con honestidad.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </section>

          <section className="surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Users className="size-4 text-[#B88916]" />
              El grupo en números
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-cream-200/70 p-3">
                <p className="text-[0.58rem] font-black uppercase tracking-wider text-ink-muted">
                  Participantes
                </p>
                <p className="mt-1 text-xl font-black text-ink">
                  {challenge.participants.length}
                </p>
              </div>
              <div className="rounded-2xl bg-cream-200/70 p-3">
                <p className="text-[0.58rem] font-black uppercase tracking-wider text-ink-muted">
                  Avance total
                </p>
                <p className="mt-1 text-xl font-black text-ink">
                  {challenge.totalProgress}
                  <span className="ml-1 text-[0.6rem] font-bold text-ink-muted">
                    {challenge.unit}
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-[0.62rem] font-semibold leading-relaxed text-ink-muted">
              {challenge.isPublic
                ? "Este reto es público: cualquier persona con cuenta puede verlo y unirse."
                : "Este reto es privado para sus participantes."}
            </p>
          </section>

          <Link
            href="/community"
            className="flex items-center justify-between rounded-[1.5rem] border border-[#EAD8A5] bg-white/60 px-5 py-4 text-sm font-extrabold text-ink transition hover:border-[#D9BB68] hover:bg-white"
          >
            Descubrir más retos
            <ArrowLeft className="size-4 rotate-180" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
