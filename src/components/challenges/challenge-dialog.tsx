"use client";

import { Check, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { createChallengeAction } from "@/actions/challenges";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Modal } from "@/components/ui/modal";
import { SubmitButton } from "@/components/ui/submit-button";
import { idleActionState, type ActionState } from "@/lib/action-state";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
} from "@/lib/categories";
import { cn } from "@/lib/utils";

export function ChallengeDialog({
  today,
  defaultEndDay,
  triggerClassName,
}: {
  today: string;
  defaultEndDay: string;
  triggerClassName?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [state, formAction] = useFormState<ActionState, FormData>(
    createChallengeAction,
    idleActionState,
  );
  const lastSuccess = useRef<string | null>(null);

  useEffect(() => {
    if (state.status !== "success" || !state.message) return;
    if (lastSuccess.current === state.message) return;
    lastSuccess.current = state.message;
    toast.success(state.message);
    setOpen(false);
    setFormKey((key) => key + 1);
    router.refresh();
  }, [state, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          lastSuccess.current = null;
          setAttempted(false);
          setOpen(true);
        }}
        className={cn("btn-primary", triggerClassName)}
      >
        <Plus className="size-4" />
        Crear un reto
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Crea un reto"
        description="Una meta clara y un grupo que camina contigo. Los retos son públicos dentro de Habitactive."
        className="sm:max-w-2xl"
      >
        <form
          key={formKey}
          action={formAction}
          onSubmit={() => setAttempted(true)}
          className="space-y-5"
        >
          <div>
            <label htmlFor="challenge-title" className="label">
              Título del reto
            </label>
            <input
              id="challenge-title"
              name="title"
              className={cn(
                "input",
                attempted && state.errors?.title && "input-error",
              )}
              placeholder="Ej. 21 días de gratitud"
              minLength={3}
              maxLength={80}
              required
              autoFocus
            />
            {attempted && state.errors?.title?.[0] && (
              <p className="field-error">{state.errors.title[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="challenge-description" className="label">
              ¿De qué se trata?
            </label>
            <textarea
              id="challenge-description"
              name="description"
              className={cn(
                "input min-h-24 resize-none",
                attempted && state.errors?.description && "input-error",
              )}
              placeholder="Explica la idea, el ritmo y cómo se puede participar…"
              minLength={10}
              maxLength={500}
              rows={3}
              required
            />
            {attempted && state.errors?.description?.[0] && (
              <p className="field-error">{state.errors.description[0]}</p>
            )}
          </div>

          <fieldset>
            <legend className="label">Área del reto</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORY_ORDER.map((category) => {
                const meta = CATEGORY_META[category];
                return (
                  <label
                    key={category}
                    className="group relative cursor-pointer rounded-2xl border border-[#EADBB7] bg-white/60 p-3 text-center transition has-[:checked]:border-[#D3A12D] has-[:checked]:bg-cream-200"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      defaultChecked={category === "SPIRITUAL"}
                      className="sr-only"
                    />
                    <span className={cn("mx-auto flex size-8 items-center justify-center rounded-xl", meta.surfaceStrong, meta.text)}>
                      <CategoryIcon category={category} className="size-4" />
                    </span>
                    <span className="mt-1.5 block text-[0.7rem] font-extrabold text-ink">
                      {meta.label}
                    </span>
                    <Check className="absolute right-2 top-2 hidden size-3 text-[#8A6512] group-has-[:checked]:block" strokeWidth={3} />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="targetValue" className="label">
                Meta
              </label>
              <input
                id="targetValue"
                name="targetValue"
                type="number"
                min={1}
                max={100000}
                defaultValue={21}
                className={cn(
                  "input",
                  attempted && state.errors?.targetValue && "input-error",
                )}
                required
              />
              {attempted && state.errors?.targetValue?.[0] && (
                <p className="field-error">{state.errors.targetValue[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="unit" className="label">
                Unidad
              </label>
              <input
                id="unit"
                name="unit"
                maxLength={20}
                defaultValue="días"
                placeholder="días, veces, km…"
                className={cn(
                  "input",
                  attempted && state.errors?.unit && "input-error",
                )}
                required
              />
              {attempted && state.errors?.unit?.[0] && (
                <p className="field-error">{state.errors.unit[0]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startDay" className="label">
                Empieza
              </label>
              <input
                id="startDay"
                name="startDay"
                type="date"
                defaultValue={today}
                className={cn(
                  "input",
                  attempted && state.errors?.startDay && "input-error",
                )}
                required
              />
              {attempted && state.errors?.startDay?.[0] && (
                <p className="field-error">{state.errors.startDay[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="endDay" className="label">
                Termina
              </label>
              <input
                id="endDay"
                name="endDay"
                type="date"
                defaultValue={defaultEndDay}
                className={cn(
                  "input",
                  attempted && state.errors?.endDay && "input-error",
                )}
                required
              />
              {attempted && state.errors?.endDay?.[0] && (
                <p className="field-error">{state.errors.endDay[0]}</p>
              )}
            </div>
          </div>

          {attempted && state.status === "error" && state.message && (
            <p
              role="alert"
              className="rounded-2xl border border-[#E9C0AC] bg-[#FFF5EE] px-4 py-3 text-sm font-bold text-[#914A28]"
            >
              {state.message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-[#F0E5C9] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold text-ink-muted">
              <Sparkles className="size-3.5 text-[#B88916]" />
              Podrás invitar compartiendo el enlace del reto.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <SubmitButton pendingText="Creando reto…">
                Crear reto
              </SubmitButton>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
