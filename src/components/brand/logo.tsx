import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function LogoMark({
  size = 44,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-300/60 ring-1 ring-cream-600/25",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo-mark.png"
        alt=""
        width={size}
        height={size}
        priority={priority}
        className="size-[86%] object-contain"
      />
    </span>
  );
}

export function Logo({
  href = "/",
  compact = false,
  className,
  markSize = 42,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
  markSize?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-2xl",
        className,
      )}
      aria-label="Habitactive, ir al inicio"
    >
      <LogoMark size={markSize} priority />
      {!compact && (
        <span className="font-display text-[1.45rem] font-black tracking-[-0.045em] text-ink">
          Habit<span className="text-[#B88916]">active</span>
        </span>
      )}
    </Link>
  );
}
