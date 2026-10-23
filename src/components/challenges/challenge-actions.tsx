"use client";

import { LogIn, LogOut, LoaderCircle, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  joinChallengeAction,
  leaveChallengeAction,
  logChallengeProgressAction,
} from "@/actions/challenges";
import { cn } from "@/lib/utils";

export function JoinChallengeButton({
  challengeId,
  joined,
  isCreator,
  status,
  className,
  size = "md",
}: {
  challengeId: string;
  joined: boolean;
  isCreator: boolean;
  status: "upcoming" | "active" | "ended";
  className?: string;
  size?: "sm" | "md";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (isCreator) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-cream-300 px-3 py-1.5 text-[0.68rem] font-extrabold text-[#7D5A0E]",
          className,
        )}
      >
        <Target className="size-3.5" />
        Tu reto
      </span>
    );
  }

  if (!joined && status === "ended") {
    return (
      <span className={cn("text-[0.68rem] font-bold text-ink-faint", className)}>
        Reto finalizado
      </span>
    );
  }

  function handleJoin() {
    startTransition(async () => {
      const result = joined
        ? await leaveChallengeAction({ challengeId })
        : await joinChallengeAction({ challengeId });
      if (result.status === "error") {
        toast.error(result.message ?? "No pudimos actualizar tu participación.");
        return;
      }
      toast.success(result.message ?? "Listo.");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (joined && !window.confirm("¿Salir de este reto? Tu avance se eliminará.")) {
          return;
        }
        handleJoin();
      }}
      disabled={isPending}
      className={cn(
        joined ? "btn-ghost" : "btn-primary",
        size === "sm" && "min-h-9 px-3.5 py-1.5 text-xs",
        className,
      )}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : joined ? (
        <LogOut className="size-4" />
      ) : (
        <LogIn className="size-4" />
      )}
      {joined ? "Salir" : "Unirme"}
    </button>
  );
}

export function LogProgressButton({
  challengeId,
  disabled,
  completed,
}: {
  challengeId: string;
  disabled: boolean;
  completed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (completed) {
    return (
      <span className="btn bg-[#E8EFCF] text-[#4E672A]">
        <Target className="size-4" />
        Meta alcanzada
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await logChallengeProgressAction({ challengeId });
          if (!result.ok) {
            toast.error(result.message);
            return;
          }
          toast.success(
            result.completed
              ? "¡Meta alcanzada! Qué gran constancia."
              : `Avance registrado: ${result.progress}.`,
            { icon: <Target className="size-4 text-[#B88916]" /> },
          );
          router.refresh();
        })
      }
      className="btn-primary w-full py-3"
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Target className="size-4" />
      )}
      {isPending ? "Registrando…" : "Registrar +1"}
    </button>
  );
}
