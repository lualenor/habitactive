export const CATEGORY_VALUES = [
  "SPIRITUAL",
  "INTELLECTUAL",
  "PHYSICAL",
  "SOCIAL",
] as const;

export type HabitCategoryValue = (typeof CATEGORY_VALUES)[number];

export const CATEGORY_META: Record<
  HabitCategoryValue,
  {
    label: string;
    shortLabel: string;
    description: string;
    emoji: string;
    icon: "sparkles" | "brain" | "activity" | "users";
    surface: string;
    surfaceStrong: string;
    text: string;
    dot: string;
    ring: string;
  }
> = {
  SPIRITUAL: {
    label: "Espiritual",
    shortLabel: "Espíritu",
    description: "Calma, gratitud y propósito",
    emoji: "✦",
    icon: "sparkles",
    surface: "bg-[#FFF8DE]",
    surfaceStrong: "bg-[#FFE9A8]",
    text: "text-[#8A6512]",
    dot: "bg-[#E7B73B]",
    ring: "ring-[#F1D58A]",
  },
  INTELLECTUAL: {
    label: "Intelectual",
    shortLabel: "Mente",
    description: "Aprender y crear cada día",
    emoji: "◐",
    icon: "brain",
    surface: "bg-[#F8F4E4]",
    surfaceStrong: "bg-[#F0E4B6]",
    text: "text-[#6C5A21]",
    dot: "bg-[#C6A94B]",
    ring: "ring-[#E6D6A2]",
  },
  PHYSICAL: {
    label: "Físico",
    shortLabel: "Cuerpo",
    description: "Movimiento, descanso y energía",
    emoji: "↗",
    icon: "activity",
    surface: "bg-[#F5F8E9]",
    surfaceStrong: "bg-[#E5EDC4]",
    text: "text-[#5E7131]",
    dot: "bg-[#91A957]",
    ring: "ring-[#DCE6B9]",
  },
  SOCIAL: {
    label: "Social",
    shortLabel: "Vínculos",
    description: "Presencia y generosidad",
    emoji: "◎",
    icon: "users",
    surface: "bg-[#FCF3E8]",
    surfaceStrong: "bg-[#F7E2C7]",
    text: "text-[#8A5D2E]",
    dot: "bg-[#D3985A]",
    ring: "ring-[#F0D8BC]",
  },
};

export const CATEGORY_ORDER: HabitCategoryValue[] = [
  "SPIRITUAL",
  "INTELLECTUAL",
  "PHYSICAL",
  "SOCIAL",
];

export function isHabitCategory(value: string): value is HabitCategoryValue {
  return (CATEGORY_VALUES as readonly string[]).includes(value);
}

export const FREQUENCY_LABEL = {
  DAILY: "Cada día",
  WEEKLY: "Meta semanal",
} as const;
