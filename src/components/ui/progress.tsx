import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  className,
  trackClassName = "text-cream-300",
  indicatorClassName = "text-[#E7B73B]",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  children?: React.ReactNode;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(clamped)}% completado`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            indicatorClassName,
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function LinearProgress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-cream-300",
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[#E7B73B] transition-[width] duration-500 ease-out",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
