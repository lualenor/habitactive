import {
  ArrowUpRight,
  CalendarDays,
  Flame,
  Users,
} from "lucide-react";
import Link from "next/link";

import { JoinChallengeButton } from "@/components/challenges/challenge-actions";
import { CategoryIcon } from "@/components/ui/category-icon";
import { LinearProgress } from "@/components/ui/progress";
import { CATEGORY_META } from "@/lib/categories";
import type { ChallengeSummary } from "@/lib/challenges-data";
import { formatDay } from "@/lib/dates";
import { cn } from "@/lib/utils";

const statusMeta = {
  active: {
    label: "Activo",
    className: "bg-[#E8EFCF] text-[#53652C]",
    dot: "bg-[#7C9A4A]",
  },
  upcoming: {
    label: "Próximamente",
    className: "bg-[#E7F1F2] text-[#416B73]",
    dot: "bg-[#5F8C99]",
  },
  ended: {
    label: "Finalizado",
    className: "bg-cream-200 text-ink-faint",
    dot: "bg-[#B4A98F]",
  },
} as const;

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary }) {
  const meta = CATEGORY_META[challenge.category];
  const status = statusMeta[challenge.status];

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.8rem] border border-[#EFE2C4] bg-white/70 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-[#E5CE8F] hover:bg-white">
      <div className={cn("relative overflow-hidden p-5 pb-4", meta.surface)}>
        <div className="pointer-events-none absolute -right-6 -top-8 opacity-[0.13]">
          <CategoryIcon category={challenge.category} className="size-32" strokeWidth={1.2} />
        </div>
        <div className="relative flex items-center justify-between">
          <span className="chip bg-white/65 text-ink-soft">
            <CategoryIcon category={challenge.category} className="size-3" />
            {meta.label}
          </span>
          <span className={cn("chip", status.className)}>
            <span className={cn("size-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>

        <Link href={`/community/${challenge.id}`} className="relative mt-4 block">
          <h3 className="text-[1.25rem] font-black leading-tight tracking-[-0.035em] text-ink">
            {challenge.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.76rem] font-semibold leading-relaxed text-ink-soft">
            {challenge.description}
          </p>
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="flex items-center justify-between text-[0.65rem] font-bold text-ink-muted">
          <span>Mi avance</span>
          <span className="font-extrabold text-ink">
            {challenge.myProgress} / {challenge.targetValue} {challenge.unit}
          </span>
        </div>
        <LinearProgress value={challenge.percent} className="mt-2 h-2" />

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.62rem] font-bold text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            {challenge.participants}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {challenge.status === "ended"
              ? "Terminado"
              : `${challenge.daysLeft} días`}
          </span>
          {challenge.status === "active" && (
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-3.5 text-[#B88916]" />
              {formatDay(challenge.endDay, { day: "numeric", month: "short" })}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F2E7CD] pt-4">
          <JoinChallengeButton
            challengeId={challenge.id}
            joined={challenge.myJoined}
            isCreator={challenge.isCreator}
            status={challenge.status}
            size="sm"
          />
          <Link
            href={`/community/${challenge.id}`}
            className="inline-flex items-center gap-1 text-[0.68rem] font-extrabold text-ink-soft transition hover:text-ink"
          >
            Ver reto
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
