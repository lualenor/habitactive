import { Flame } from "lucide-react";

import { HabitCheckButton } from "@/components/habits/habit-check-button";
import { HabitDialog } from "@/components/habits/habit-dialog";
import { CategoryPill } from "@/components/ui/category-icon";
import type { HabitProgress } from "@/lib/habits-data";
import { cn, pluralize } from "@/lib/utils";

export function HabitRow({
  habit,
  day,
  disabled = false,
  compact = false,
}: {
  habit: HabitProgress;
  day: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  const goalLabel =
    habit.frequency === "DAILY"
      ? "Cada día"
      : `${habit.weekCount}/${habit.targetPerWeek} esta semana`;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-[1.35rem] border p-3 transition duration-200 sm:gap-4 sm:p-4",
        habit.completedToday
          ? "border-[#E9D59A] bg-[#FFF8DF]"
          : "border-[#F1E5C9] bg-white/65 hover:border-[#E4CF97] hover:bg-white",
      )}
    >
      <HabitCheckButton
        habitId={habit.id}
        day={day}
        completed={habit.completedToday}
        label={habit.name}
        disabled={disabled}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-[0.94rem] font-extrabold leading-snug text-ink sm:text-base",
                habit.completedToday && "text-ink",
              )}
            >
              {habit.name}
            </p>
            {habit.description && !compact && (
              <p className="mt-0.5 line-clamp-1 text-[0.72rem] font-semibold text-ink-muted">
                {habit.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.65rem] font-extrabold",
                habit.currentStreak > 0
                  ? "bg-[#FFF0C7] text-[#8A6512]"
                  : "bg-cream-200 text-ink-faint",
              )}
              title={`Racha actual: ${pluralize(habit.currentStreak, "día")}`}
            >
              <Flame className="size-3.5" />
              {habit.currentStreak}
            </span>
            {!compact && (
              <HabitDialog
                mode="edit"
                habit={habit}
                iconOnly
                triggerClassName="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                triggerLabel={`Editar ${habit.name}`}
              />
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CategoryPill category={habit.category} />
          <span className="text-[0.63rem] font-bold text-ink-faint">
            {goalLabel}
          </span>
        </div>
      </div>

      {!compact && (
        <div
          className="hidden shrink-0 items-center gap-1 sm:flex"
          aria-label="Últimos siete días"
        >
          {habit.last7Days.map((item) => (
            <span
              key={item.day}
              title={item.day}
              className={cn(
                "size-1.5 rounded-full",
                item.completed ? "bg-[#D9AE35]" : "bg-[#EBDDBB]",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
