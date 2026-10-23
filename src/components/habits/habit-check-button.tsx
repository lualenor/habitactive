"use client";

import { Check, Flame, LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleHabitAction } from "@/actions/habits";
import { cn } from "@/lib/utils";

export function HabitCheckButton({
  habitId,
  day,
  completed,
  label,
  disabled = false,
  size = "md",
}: {
  habitId: string;
  day: string;
  completed: boolean;
  label: string;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const [checked, setChecked] = useState(completed);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setChecked(completed);
  }, [completed]);

  function toggle() {
    if (disabled || isPending) return;
    const next = !checked;
    setChecked(next);

    startTransition(async () => {
      const result = await toggleHabitAction({ habitId, day });
      if (!result.ok) {
        setChecked(!next);
        toast.error(result.message);
        return;
      }
      setChecked(result.completed);
      if (result.completed) {
        toast.success(
          result.currentStreak > 1
            ? `¡Hecho! Racha de ${result.currentStreak} días.`
            : "¡Primer paso! El hábito empieza hoy.",
          { icon: <Flame className="size-4 text-[#B88916]" /> },
        );
      }
    });
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`${checked ? "Desmarcar" : "Marcar"} ${label}`}
      onClick={toggle}
      disabled={disabled || isPending}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border-2 transition duration-200",
        size === "sm" ? "size-8" : "size-10",
        checked
          ? "border-[#D3A12D] bg-cream-500 text-[#3E300B] shadow-[0_6px_16px_-8px_rgba(166,122,22,0.8)]"
          : "border-[#E3D3AC] bg-white text-transparent hover:border-[#D3A12D] hover:bg-cream-200",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin text-[#8A6512]" />
      ) : (
        <Check
          className={cn(
            "transition",
            size === "sm" ? "size-4" : "size-5",
            checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
          strokeWidth={3.2}
        />
      )}
      {checked && (
        <span className="pointer-events-none absolute inset-0 rounded-full animate-soft-pop" />
      )}
    </button>
  );
}
