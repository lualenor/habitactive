"use client";

import {
  Archive,
  CalendarRange,
  Check,
  Pencil,
  Plus,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { archiveHabitAction, createHabitAction, updateHabitAction } from "@/actions/habits";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Modal } from "@/components/ui/modal";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type HabitCategoryValue,
} from "@/lib/categories";
import { idleActionState, type ActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

export interface EditableHabit {
  id: string;
  name: string;
  description: string | null;
  category: HabitCategoryValue;
  frequency: "DAILY" | "WEEKLY";
  targetPerWeek: number;
}

interface HabitDialogProps {
  mode?: "create" | "edit";
  habit?: EditableHabit;
  triggerLabel?: string;
  triggerClassName?: string;
  iconOnly?: boolean;
}

export function HabitDialog({
  mode = "create",
  habit,
  triggerLabel,
  triggerClassName,
  iconOnly = false,
}: HabitDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">(
    habit?.frequency ?? "DAILY",
  );
  const [formKey, setFormKey] = useState(0);
  const action = mode === "edit" ? updateHabitAction : createHabitAction;
  const [state, formAction] = useFormState<ActionState, FormData>(
    action,
    idleActionState,
  );
  const lastSuccess = useRef<string | null>(null);
  const formId = useId();

  function openDialog() {
    lastSuccess.current = null;
    setAttempted(false);
    setFrequency(habit?.frequency ?? "DAILY");
    setOpen(true);
  }

  useEffect(() => {
    if (state.status !== "success" || !state.message) return;
    if (lastSuccess.current === state.message) return;
    lastSuccess.current = state.message;
    toast.success(state.message);
    setOpen(false);
    setFormKey((key) => key + 1);
    router.refresh();
  }, [state, router]);

  useEffect(() => {
    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  async function handleArchive() {
    if (!habit) return;
    const confirmed = window.confirm(
      "¿Archivar este hábito? Su historial se conservará, pero dejará de aparecer en tu día a día.",
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("habitId", habit.id);
    await archiveHabitAction(formData);
    toast.success("Hábito archivado.");
    setOpen(false);
    router.refresh();
  }

  const label =
    triggerLabel ??
    (mode === "edit" ? "Editar hábito" : "Nuevo hábito");

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={cn(
          iconOnly ? "icon-button size-9" : "btn-primary",
          triggerClassName,
        )}
        aria-label={label}
        title={label}
      >
        {mode === "edit" ? (
          <Pencil className={iconOnly ? "size-4" : "size-[1.125rem]"} />
        ) : (
          <Plus className={iconOnly ? "size-4" : "size-[1.125rem]"} />
        )}
        {!iconOnly && label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === "edit" ? "Editar hábito" : "Un nuevo hábito"}
        description={
          mode === "edit"
            ? "Ajusta el nombre, el área o la frecuencia. Tus registros se conservan."
            : "Elige algo pequeño, concreto y que puedas sostener. La constancia llega después."
        }
      >
        <form
          key={formKey}
          action={formAction}
          onSubmit={() => setAttempted(true)}
          className="space-y-5"
        >
          {mode === "edit" && habit && (
            <input type="hidden" name="habitId" value={habit.id} />
          )}

          <div>
            <label className="label" htmlFor={`${formId}-name`}>
              Nombre del hábito
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              className={cn(
                "input",
                attempted && state.errors?.name && "input-error",
              )}
              placeholder="Ej. Leer 20 páginas"
              defaultValue={habit?.name ?? ""}
              minLength={2}
              maxLength={80}
              required
              autoFocus
            />
            {attempted && state.errors?.name?.[0] && (
              <p className="field-error">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor={`${formId}-description`}>
              ¿Por qué te importa?{" "}
              <span className="font-semibold normal-case tracking-normal text-ink-faint">
                (opcional)
              </span>
            </label>
            <textarea
              id={`${formId}-description`}
              name="description"
              className={cn(
                "input min-h-24 resize-none",
                attempted && state.errors?.description && "input-error",
              )}
              placeholder="Una nota breve para recordar tu intención…"
              defaultValue={habit?.description ?? ""}
              maxLength={280}
              rows={3}
            />
            {attempted && state.errors?.description?.[0] && (
              <p className="field-error">{state.errors.description[0]}</p>
            )}
          </div>

          <fieldset>
            <legend className="label">Área de vida</legend>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORY_ORDER.map((category) => {
                const meta = CATEGORY_META[category];
                return (
                  <label
                    key={category}
                    className="group relative cursor-pointer rounded-2xl border border-[#EADBB7] bg-white/60 p-3.5 transition hover:border-[#D9BB68] has-[:checked]:border-[#D3A12D] has-[:checked]:bg-cream-200 has-[:checked]:shadow-[inset_0_0_0_1px_rgba(211,161,45,0.25)]"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      defaultChecked={
                        (habit?.category ?? "SPIRITUAL") === category
                      }
                      className="sr-only"
                      required
                    />
                    <span className={cn("flex size-9 items-center justify-center rounded-xl", meta.surfaceStrong, meta.text)}>
                      <CategoryIcon category={category} className="size-4" />
                    </span>
                    <span className="mt-2 block text-sm font-extrabold text-ink">
                      {meta.label}
                    </span>
                    <span className="mt-0.5 block text-[0.65rem] font-semibold leading-snug text-ink-muted">
                      {meta.description}
                    </span>
                    <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full border border-[#DCCB9E] bg-white opacity-0 transition group-has-[:checked]:opacity-100">
                      <Check className="size-3 text-[#8A6512]" strokeWidth={3} />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label">Frecuencia</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <FrequencyOption
                value="DAILY"
                current={frequency}
                onSelect={setFrequency}
                icon={<CalendarRange className="size-4" />}
                title="Cada día"
                description="Una racha por días consecutivos."
              />
              <FrequencyOption
                value="WEEKLY"
                current={frequency}
                onSelect={setFrequency}
                icon={<Sparkles className="size-4" />}
                title="Meta semanal"
                description="Elige cuántas veces por semana."
              />
            </div>
          </fieldset>

          {frequency === "WEEKLY" && (
            <div>
              <label className="label" htmlFor={`${formId}-target`}>
                Veces por semana
              </label>
              <select
                id={`${formId}-target`}
                name="targetPerWeek"
                className="input"
                defaultValue={String(habit?.targetPerWeek ?? 3)}
              >
                {[1, 2, 3, 4, 5, 6].map((value) => (
                  <option key={value} value={value}>
                    {value} {value === 1 ? "vez" : "veces"} por semana
                  </option>
                ))}
              </select>
              <p className="help-text">
                Una semana completa suma un punto a tu racha.
              </p>
            </div>
          )}

          {frequency === "DAILY" && (
            <input type="hidden" name="targetPerWeek" value="7" />
          )}

          {attempted &&
            state.status === "error" &&
            state.message &&
            !Object.keys(state.errors ?? {}).length && (
            <p
              role="alert"
              className="rounded-2xl border border-[#E9C0AC] bg-[#FFF5EE] px-4 py-3 text-sm font-bold text-[#914A28]"
            >
              {state.message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {mode === "edit" && habit && (
                <button
                  type="button"
                  onClick={handleArchive}
                  className="btn-quiet px-3 text-xs text-ink-muted hover:text-[#914A28]"
                >
                  <Archive className="size-4" />
                  Archivar
                </button>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <SubmitButton
                pendingText={mode === "edit" ? "Guardando…" : "Creando…"}
              >
                {mode === "edit" ? "Guardar cambios" : "Crear hábito"}
              </SubmitButton>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

function FrequencyOption({
  value,
  current,
  onSelect,
  icon,
  title,
  description,
}: {
  value: "DAILY" | "WEEKLY";
  current: "DAILY" | "WEEKLY";
  onSelect: (value: "DAILY" | "WEEKLY") => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const active = current === value;
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition",
        active
          ? "border-[#D3A12D] bg-cream-200 shadow-[inset_0_0_0_1px_rgba(211,161,45,0.18)]"
          : "border-[#EADBB7] bg-white/55 hover:border-[#D9BB68]",
      )}
    >
      <input
        type="radio"
        name="frequency"
        value={value}
        checked={active}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
          active ? "bg-[#E9B93E] text-[#4B3A0A]" : "bg-cream-200 text-ink-muted",
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block text-sm font-extrabold text-ink">{title}</span>
        <span className="mt-0.5 block text-[0.65rem] font-semibold leading-snug text-ink-muted">
          {description}
        </span>
      </span>
    </label>
  );
}
