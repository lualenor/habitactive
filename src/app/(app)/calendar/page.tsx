import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HabitCheckButton } from "@/components/habits/habit-check-button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { EmptyState } from "@/components/ui/empty-state";
import { CATEGORY_META } from "@/lib/categories";
import { formatDay } from "@/lib/dates";
import { requireUser } from "@/lib/guards";
import { getCalendarData } from "@/lib/habits-data";
import { cn, percentage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Calendario",
};

export const dynamic = "force-dynamic";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default async function CalendarPage({
  searchParams,
}: {
  searchParams?: { month?: string; day?: string };
}) {
  const user = await requireUser();
  const data = await getCalendarData(
    user.id,
    user.timeZone,
    searchParams?.month,
    searchParams?.day,
  );
  const selectedPercent = percentage(
    data.selectedHabits.filter((habit) => habit.completed).length,
    data.selectedHabits.length,
  );
  const isFuture = data.selectedDay > data.today;

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Tu proceso, con perspectiva</p>
          <h1 className="mt-2 text-[2.35rem] font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-[2.9rem]">
            Calendario
          </h1>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-ink-muted">
            Cada punto es un regreso. Puedes completar días pasados y ver cómo
            se va dibujando tu constancia.
          </p>
        </div>

        <Link href="/dashboard" className="btn-ghost self-start sm:self-auto">
          <ArrowLeft className="size-4" />
          Volver a mi día
        </Link>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.8fr)]">
        <section className="surface p-4 sm:p-6" aria-labelledby="calendar-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <Link
                href={`/calendar?month=${data.previousMonth}`}
                className="icon-button size-9"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="size-4" />
              </Link>
              <Link
                href={`/calendar?month=${data.nextMonth}`}
                className="icon-button size-9"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="size-4" />
              </Link>
              <h2
                id="calendar-title"
                className="ml-2 text-xl font-black tracking-[-0.035em] text-ink first-letter:uppercase sm:text-2xl"
              >
                {data.monthLabel}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/calendar"
                className="rounded-full border border-[#EAD8A5] bg-cream-100 px-3.5 py-1.5 text-[0.68rem] font-extrabold text-[#8A6512] transition hover:bg-cream-200"
              >
                Hoy
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 sm:gap-1.5">
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday}
                className="pb-1 text-center text-[0.58rem] font-black uppercase tracking-wider text-ink-faint sm:text-[0.65rem]"
              >
                {weekday}
              </div>
            ))}

            {data.grid.map((day) => {
              const isComplete =
                day.total > 0 && day.completed >= day.total && day.inMonth;
              const rate = percentage(day.completed, day.total);
              return (
                <Link
                  key={day.day}
                  href={`/calendar?month=${data.monthKey}&day=${day.day}`}
                  aria-label={`${formatDay(day.day, { weekday: "long", day: "numeric", month: "long" })}: ${day.completed} de ${day.total} hábitos`}
                  aria-current={day.isSelected ? "date" : undefined}
                  className={cn(
                    "group relative flex min-h-[4.35rem] flex-col rounded-xl border p-1.5 transition sm:min-h-[5.4rem] sm:rounded-2xl sm:p-2.5",
                    day.inMonth ? "bg-white/55" : "bg-transparent",
                    day.isSelected
                      ? "border-[#C89826] bg-[#FFF4CF] shadow-[inset_0_0_0_1px_rgba(211,161,45,0.22)]"
                      : day.isToday
                        ? "border-[#DCC16F] bg-cream-100"
                        : "border-transparent hover:border-[#E5D2A0] hover:bg-white",
                    !day.inMonth && "opacity-35",
                    day.isFuture && "opacity-60",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-[0.7rem] font-black sm:size-7 sm:text-xs",
                        day.isToday
                          ? "bg-ink text-cream-100"
                          : day.isSelected
                            ? "bg-[#E9B93E] text-[#3E300B]"
                            : "text-ink-soft",
                      )}
                    >
                      {Number(day.day.slice(8))}
                    </span>
                    {isComplete && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-[#E8EFCF] text-[#5E7131]">
                        <CalendarCheck className="size-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  {day.inMonth && day.total > 0 && !day.isFuture && (
                    <div className="mt-auto">
                      <div className="mb-1 hidden gap-0.5 sm:flex">
                        {Array.from({ length: Math.min(4, day.total) }).map(
                          (_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "h-1 flex-1 rounded-full",
                                index < Math.ceil((day.completed / day.total) * 4)
                                  ? "bg-[#D9AE35]"
                                  : "bg-[#EDE0C0]",
                              )}
                            />
                          ),
                        )}
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-[#EDE0C0] sm:hidden">
                        <div
                          className="h-full rounded-full bg-[#D9AE35]"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {day.isToday && (
                    <span className="mt-auto hidden text-[0.53rem] font-black uppercase tracking-wider text-[#9A7B2D] sm:block">
                      Hoy
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#F2E5C9] pt-4">
            <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold text-ink-muted">
              <span className="size-2 rounded-full bg-[#D9AE35]" />
              Día con registros
            </span>
            <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold text-ink-muted">
              <span className="size-2 rounded-full bg-[#E8EFCF]" />
              Día completo
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[0.65rem] font-bold text-ink-muted">
              <Flame className="size-3.5 text-[#B88916]" />
              {data.activeDays} días activos este mes
            </span>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="surface-solid relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-[#FFE8A8]/70 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Día seleccionado</p>
                <h2 className="mt-1 text-xl font-black leading-tight tracking-[-0.035em] text-ink first-letter:uppercase">
                  {data.selectedLabel}
                </h2>
                <p className="mt-1 text-xs font-semibold text-ink-muted">
                  {data.selectedHabits.filter((habit) => habit.completed).length}{" "}
                  de {data.selectedHabits.length} hábitos completados
                </p>
              </div>
              <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/70">
                <span className="text-lg font-black leading-none text-ink">
                  {selectedPercent}%
                </span>
                <span className="mt-0.5 text-[0.5rem] font-black uppercase tracking-wider text-ink-muted">
                  hechos
                </span>
              </span>
            </div>

            {isFuture ? (
              <p className="relative mt-4 rounded-2xl border border-[#EAD8A5] bg-white/55 px-4 py-3 text-xs font-bold text-ink-muted">
                Este día todavía no ha llegado. Vuelve cuando esté aquí para
                registrar tus hábitos.
              </p>
            ) : data.selectedHabits.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Sin hábitos para este día"
                description="Crea un hábito para empezar a llenar tu calendario."
                className="mt-4 border-0 bg-white/45 py-8"
                action={
                  <Link href="/dashboard" className="btn-ghost">
                    Ir a mi día
                  </Link>
                }
              />
            ) : (
              <ul className="relative mt-4 space-y-2">
                {data.selectedHabits.map((habit) => (
                  <li
                    key={habit.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3 transition",
                      habit.completed
                        ? "border-[#E8D399] bg-[#FFF7DC]"
                        : "border-[#F0E5CD] bg-white/55",
                    )}
                  >
                    <HabitCheckButton
                      habitId={habit.id}
                      day={data.selectedDay}
                      completed={habit.completed}
                      label={habit.name}
                      disabled={isFuture}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-ink">
                        {habit.name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[0.6rem] font-bold text-ink-muted">
                        <CategoryIcon
                          category={habit.category}
                          className="size-3"
                        />
                        {CATEGORY_META[habit.category].shortLabel}
                        {habit.frequency === "WEEKLY" && " · semanal"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        habit.completed ? "bg-[#D9AE35]" : "bg-[#E8DAB8]",
                      )}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="surface p-5">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Sparkles className="size-4 text-[#B88916]" />
              Cómo se calcula tu racha
            </h2>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-ink-muted">
              Tu racha sigue viva si aún no has marcado el día de hoy: cuenta
              desde ayer. Las fechas se guardan al mediodía local para que un
              cambio de zona horaria no te quite un día.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-cream-200/70 p-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#B88916]">
                <CalendarDays className="size-4" />
              </span>
              <p className="text-[0.68rem] font-bold leading-relaxed text-ink-soft">
                {data.monthCompleted} registros completados en{" "}
                {data.monthLabel.toLowerCase()}.
              </p>
            </div>
          </section>

          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-[1.5rem] border border-[#EAD8A5] bg-white/60 px-5 py-4 text-sm font-extrabold text-ink transition hover:border-[#D9BB68] hover:bg-white"
          >
            Volver a los hábitos de hoy
            <ArrowRight className="size-4" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
