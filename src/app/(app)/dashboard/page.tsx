import {
  ArrowRight,
  CalendarDays,
  Check,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HabitDialog } from "@/components/habits/habit-dialog";
import { HabitRow } from "@/components/habits/habit-row";
import { CategoryIcon } from "@/components/ui/category-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressRing } from "@/components/ui/progress";
import { CATEGORY_META, isHabitCategory } from "@/lib/categories";
import { nextStreakMessage } from "@/lib/dates";
import { requireUser } from "@/lib/guards";
import { getDashboardData } from "@/lib/habits-data";
import { cn, percentage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mi día",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { focus?: string | string[] };
}) {
  const user = await requireUser();
  const data = await getDashboardData(user.id, user.timeZone);
  const focusParam =
    typeof searchParams?.focus === "string" ? searchParams.focus : undefined;
  const focus = focusParam && isHabitCategory(focusParam) ? focusParam : null;
  const visibleHabits = focus
    ? data.habits.filter((habit) => habit.category === focus)
    : data.habits;
  const firstName = user.name.trim().split(/\s+/)[0] ?? user.name;
  const dayPercent = percentage(data.stats.completedToday, data.stats.totalToday);
  const featuredChallenge = data.challenges[0];

  return (
    <div className="space-y-7 animate-fade-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#9A7B2D]">
            <CalendarDays className="size-3.5" />
            {data.formattedToday}
          </p>
          <h1 className="mt-2 text-[2.35rem] font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-[2.9rem]">
            {data.greeting}, {firstName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-ink-muted sm:text-[0.95rem]">
            {data.stats.totalToday === 0
              ? "Tu espacio está listo. Elige el primer hábito que quieras cuidar."
              : data.stats.completedToday === data.stats.totalToday
                ? "Completaste todo lo de hoy. Ahora puedes descansar sin culpa."
                : "No hace falta hacerlo perfecto. Solo hazle un poco de espacio a lo importante."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex h-11 items-center gap-2 rounded-full border border-[#EAD8A5] bg-cream-100/80 px-4 text-xs font-extrabold text-[#8A6512]">
            <Flame className="size-4" />
            {data.stats.bestCurrentStreak === 0
              ? "Empieza tu racha"
              : `${data.stats.bestCurrentStreak} días de racha`}
          </span>
          <div className="hidden sm:block lg:hidden">
            <HabitDialog />
          </div>
        </div>
      </header>

      <section aria-labelledby="focus-title">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="focus-title" className="text-xl font-black tracking-[-0.035em] text-ink">
              Enfoque actual
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-ink-muted">
              Tus cuatro dimensiones, de un vistazo.
            </p>
          </div>
          <Link
            href="/dashboard"
            className={cn(
              "rounded-full px-3 py-1.5 text-[0.68rem] font-extrabold transition",
              focus
                ? "bg-white text-ink-soft hover:bg-cream-200"
                : "bg-cream-300 text-ink",
            )}
          >
            {focus ? "Ver todo" : "Todas las áreas"}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.focus.map((item) => {
            const meta = CATEGORY_META[item.category];
            const active = focus === item.category;
            const percent = percentage(item.completed, item.total);
            return (
              <Link
                key={item.category}
                href={`/dashboard?focus=${item.category}`}
                className={cn(
                  "group relative overflow-hidden rounded-[1.45rem] border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft",
                  active
                    ? "border-[#D3A12D] bg-[#FFF5D2] shadow-[inset_0_0_0_1px_rgba(211,161,45,0.2)]"
                    : "border-[#EFE2C4] bg-white/70",
                )}
                aria-current={active ? "true" : undefined}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={cn("flex size-9 items-center justify-center rounded-xl", meta.surfaceStrong, meta.text)}>
                    <CategoryIcon category={item.category} className="size-4" />
                  </span>
                  <span className="text-[0.65rem] font-black text-ink-muted">
                    {item.total === 0 ? "—" : `${item.completed}/${item.total}`}
                  </span>
                </div>
                <p className="mt-3 text-sm font-extrabold text-ink">
                  {meta.label}
                </p>
                <p className="mt-0.5 truncate text-[0.63rem] font-semibold text-ink-muted">
                  {item.total === 0 ? "Aún sin hábitos" : meta.description}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F1E4C3]">
                  <div
                    className="h-full rounded-full bg-[#E7B73B] transition-all"
                    style={{ width: `${item.total === 0 ? 0 : percent}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.85fr)]">
        <section aria-labelledby="habits-title" className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2
                id="habits-title"
                className="text-xl font-black tracking-[-0.035em] text-ink"
              >
                {focus ? `Hábitos de ${CATEGORY_META[focus].label.toLowerCase()}` : "Hábitos de hoy"}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-ink-muted">
                {data.stats.completedToday} de {data.stats.totalToday} completados
                {focus ? " · filtro activo" : " · un paso a la vez"}
              </p>
            </div>
            <div className="sm:hidden">
              <HabitDialog
                triggerLabel="Crear"
                triggerClassName="px-4 text-xs"
              />
            </div>
          </div>

          <div className="surface space-y-2.5 p-2.5 sm:p-3">
            {visibleHabits.length > 0 ? (
              visibleHabits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  day={data.today}
                />
              ))
            ) : data.habits.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Tu primer hábito empieza aquí"
                description="Elige algo tan pequeño que no puedas decir que no. Dos minutos también cuentan."
                action={<HabitDialog triggerLabel="Crear mi primer hábito" />}
                className="border-0 bg-transparent py-12"
              />
            ) : (
              <EmptyState
                icon={Target}
                title="Sin hábitos en esta área"
                description="Puedes crear uno nuevo para esta dimensión o volver a ver todos tus hábitos."
                action={
                  <Link href="/dashboard" className="btn-ghost">
                    Ver todos los hábitos
                  </Link>
                }
                className="border-0 bg-transparent py-10"
              />
            )}
          </div>

          <p className="mt-3 flex items-center gap-2 px-1 text-[0.66rem] font-semibold text-ink-faint">
            <Check className="size-3.5" />
            Toca el círculo para marcar o desmarcar. Puedes sumar días pasados
            desde el calendario.
          </p>
        </section>

        <aside className="space-y-4">
          <section className="surface-solid relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-[#FFE8A8]/60 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Tu día</p>
                <h2 className="mt-1 text-[1.65rem] font-black leading-tight tracking-[-0.045em] text-ink">
                  {dayPercent === 100
                    ? "Día completo"
                    : dayPercent >= 50
                      ? "Buen ritmo"
                      : "A tu tiempo"}
                </h2>
                <p className="mt-1 max-w-[11rem] text-xs font-semibold leading-relaxed text-ink-muted">
                  {nextStreakMessage(data.stats.bestCurrentStreak)}
                </p>
              </div>
              <ProgressRing value={dayPercent} size={106} stroke={9}>
                <span className="text-2xl font-black tracking-[-0.05em] text-ink">
                  {dayPercent}%
                </span>
                <span className="text-[0.55rem] font-black uppercase tracking-[0.12em] text-ink-muted">
                  hoy
                </span>
              </ProgressRing>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white/65 p-3">
                <div className="flex items-center gap-1.5 text-[#8A6512]">
                  <Flame className="size-3.5" />
                  <span className="text-[0.6rem] font-black uppercase tracking-wider">
                    Racha
                  </span>
                </div>
                <p className="mt-1 text-xl font-black tracking-tight text-ink">
                  {data.stats.bestCurrentStreak}
                  <span className="ml-1 text-[0.65rem] font-bold text-ink-muted">
                    días
                  </span>
                </p>
              </div>
              <div className="rounded-2xl bg-white/65 p-3">
                <div className="flex items-center gap-1.5 text-[#6C7C39]">
                  <TrendingUp className="size-3.5" />
                  <span className="text-[0.6rem] font-black uppercase tracking-wider">
                    Semana
                  </span>
                </div>
                <p className="mt-1 text-xl font-black tracking-tight text-ink">
                  {data.stats.weekLogs}
                  <span className="ml-1 text-[0.65rem] font-bold text-ink-muted">
                    registros
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section className="surface p-4 sm:p-5" aria-labelledby="week-title">
            <div className="flex items-center justify-between">
              <h2 id="week-title" className="text-sm font-extrabold text-ink">
                Esta semana
              </h2>
              <Link
                href="/calendar"
                className="text-[0.65rem] font-extrabold text-[#8A6512] hover:text-ink"
              >
                Ver calendario
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {data.weekDays.map((day) => {
                const future = day.day > data.today;
                const full =
                  day.total > 0 && day.completed >= day.total;
                return (
                  <div key={day.day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[0.55rem] font-black uppercase text-ink-faint">
                      {day.label}
                    </span>
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-xl text-[0.65rem] font-black transition",
                        day.day === data.today
                          ? "bg-ink text-cream-100"
                          : full
                            ? "bg-cream-400 text-ink"
                            : day.completed > 0
                              ? "bg-cream-300 text-[#7D5A0E]"
                              : future
                                ? "border border-dashed border-[#E8D9B6] text-ink-faint"
                                : "bg-cream-200 text-ink-faint",
                      )}
                      title={`${day.day}: ${day.completed} de ${day.total}`}
                    >
                      {day.day.slice(8)}
                    </span>
                    <span
                      className={cn(
                        "size-1 rounded-full",
                        day.completed > 0 ? "bg-[#D9AE35]" : "bg-transparent",
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {featuredChallenge ? (
            <Link
              href={`/community/${featuredChallenge.id}`}
              className="group relative block overflow-hidden rounded-[1.75rem] border border-[#E3C97F] bg-[#3E3521] p-5 text-cream-100 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#F2C14E]/20 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="chip bg-white/10 text-[#FFE8A8]">
                  <Users className="size-3" />
                  Reto en comunidad
                </span>
                <ArrowRight className="size-4 text-cream-300/70 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
              <h3 className="relative mt-3 text-lg font-black leading-snug text-white">
                {featuredChallenge.title}
              </h3>
              <div className="relative mt-4">
                <div className="flex items-center justify-between text-[0.65rem] font-bold text-cream-300/75">
                  <span>Tu avance</span>
                  <span>
                    {featuredChallenge.progress} / {featuredChallenge.targetValue}{" "}
                    {featuredChallenge.unit}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-[#F2C14E]"
                    style={{
                      width: `${percentage(featuredChallenge.progress, featuredChallenge.targetValue)}%`,
                    }}
                  />
                </div>
                <p className="mt-2.5 text-[0.62rem] font-semibold text-cream-300/60">
                  {featuredChallenge.participants} personas avanzando ·{" "}
                  {featuredChallenge.daysLeft} días restantes
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/community"
              className="group flex items-center gap-3 rounded-[1.75rem] border border-[#EAD8A5] bg-white/65 p-4 transition hover:border-[#D9BB68] hover:bg-white"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cream-300 text-[#8A6512]">
                <Users className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-ink">
                  Suma un reto en comunidad
                </span>
                <span className="mt-0.5 block text-[0.65rem] font-semibold text-ink-muted">
                  Crecer también se comparte.
                </span>
              </span>
              <ArrowRight className="size-4 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-ink" />
            </Link>
          )}
        </aside>
      </div>

      <div className="fixed bottom-24 right-4 z-30 lg:hidden">
        <HabitDialog
          iconOnly
          triggerClassName="size-14 rounded-full bg-ink text-cream-100 shadow-lift hover:bg-[#423820]"
          triggerLabel="Crear hábito"
        />
      </div>
    </div>
  );
}
