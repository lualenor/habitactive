import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#E7D5A8] bg-cream-100/60 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-cream-300 text-[#9B741C]">
        <Icon className="size-6" strokeWidth={1.9} />
      </span>
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm font-semibold leading-relaxed text-ink-muted">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
