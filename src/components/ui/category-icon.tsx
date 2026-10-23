import {
  Activity,
  Brain,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  CATEGORY_META,
  type HabitCategoryValue,
} from "@/lib/categories";
import { cn } from "@/lib/utils";

const icons: Record<HabitCategoryValue, LucideIcon> = {
  SPIRITUAL: Sparkles,
  INTELLECTUAL: Brain,
  PHYSICAL: Activity,
  SOCIAL: Users,
};

export function CategoryIcon({
  category,
  className,
  strokeWidth = 2.2,
}: {
  category: HabitCategoryValue;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = icons[category];
  return <Icon className={cn("size-5", className)} strokeWidth={strokeWidth} />;
}

export function CategoryPill({
  category,
  className,
}: {
  category: HabitCategoryValue;
  className?: string;
}) {
  const meta = CATEGORY_META[category];
  return (
    <span className={cn("chip", meta.surface, meta.text, className)}>
      <CategoryIcon category={category} className="size-3.5" />
      {meta.label}
    </span>
  );
}
