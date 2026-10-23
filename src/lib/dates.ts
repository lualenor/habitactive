const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

export interface DayParts {
  year: number;
  month: number;
  day: number;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  const key = `parts:${timeZone}`;
  const cached = formatterCache.get(key);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  formatterCache.set(key, formatter);
  return formatter;
}

function getParts(date: Date, timeZone: string) {
  const parts = partsFormatter(timeZone).formatToParts(date);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal" && part.type !== "dayPeriod") {
      map[part.type] = Number(part.value);
    }
  }
  return {
    year: map.year ?? 1970,
    month: map.month ?? 1,
    day: map.day ?? 1,
    hour: map.hour ?? 0,
    minute: map.minute ?? 0,
    second: map.second ?? 0,
  };
}

/** Fecha civil local del usuario en formato YYYY-MM-DD. */
export function toDayKey(date: Date, timeZone: string): string {
  const parts = getParts(date, timeZone);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function todayKey(timeZone: string, now = new Date()): string {
  return toDayKey(now, timeZone);
}

export function isValidDayKey(value: unknown): value is string {
  if (typeof value !== "string" || !DAY_KEY_PATTERN.test(value)) return false;
  const parts = parseDayKey(value);
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
  return (
    date.getUTCFullYear() === parts.year &&
    date.getUTCMonth() === parts.month - 1 &&
    date.getUTCDate() === parts.day
  );
}

export function parseDayKey(dayKey: string): DayParts {
  if (!DAY_KEY_PATTERN.test(dayKey)) {
    throw new Error(`Día inválido: ${dayKey}`);
  }
  const [year, month, day] = dayKey.split("-").map(Number);
  if (!year || !month || !day) throw new Error(`Día inválido: ${dayKey}`);
  return { year, month, day };
}

export function dayKeyFromUtcDate(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

/** Mediodía UTC del día civil. Útil para fechas que no dependen de zona horaria. */
export function utcNoon(dayKey: string): Date {
  return new Date(`${parseDayKey(dayKey).year}-${String(parseDayKey(dayKey).month).padStart(2, "0")}-${String(parseDayKey(dayKey).day).padStart(2, "0")}T12:00:00.000Z`);
}

/** Convierte un día civil a un Date con el reloj en el mediodía local. */
export function localNoon(dayKey: string, timeZone: string): Date {
  const { year, month, day } = parseDayKey(dayKey);
  const utcGuess = Date.UTC(year, month - 1, day, 12, 0, 0);
  const offset = timeZoneOffsetMs(new Date(utcGuess), timeZone);
  let result = new Date(utcGuess - offset);
  const adjustedOffset = timeZoneOffsetMs(result, timeZone);
  if (adjustedOffset !== offset) {
    result = new Date(utcGuess - adjustedOffset);
  }
  return result;
}

function timeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = getParts(date, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

export function addDaysToKey(dayKey: string, amount: number): string {
  const { year, month, day } = parseDayKey(dayKey);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return dayKeyFromUtcDate(date);
}

export function diffInDays(from: string, to: string): number {
  const a = utcNoon(from).getTime();
  const b = utcNoon(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function compareDayKeys(a: string, b: string): number {
  return a === b ? 0 : a < b ? -1 : 1;
}

/** Semana ISO simplificada: lunes = primer día. Devuelve el lunes de esa semana. */
export function startOfWeekKey(dayKey: string): string {
  const { year, month, day } = parseDayKey(dayKey);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  const weekday = date.getUTCDay(); // 0 domingo … 6 sábado
  const offset = (weekday + 6) % 7;
  return addDaysToKey(dayKey, -offset);
}

export function endOfWeekKey(dayKey: string): string {
  return addDaysToKey(startOfWeekKey(dayKey), 6);
}

export function monthKeyOf(dayKey: string): string {
  return dayKey.slice(0, 7);
}

export function isValidMonthKey(value: unknown): value is string {
  if (typeof value !== "string" || !MONTH_KEY_PATTERN.test(value)) return false;
  const month = Number(value.slice(5, 7));
  return month >= 1 && month <= 12;
}

export function currentMonthKey(timeZone: string, now = new Date()): string {
  return monthKeyOf(todayKey(timeZone, now));
}

export function monthBounds(monthKey: string): {
  firstDay: string;
  lastDay: string;
} {
  if (!isValidMonthKey(monthKey)) throw new Error("Mes inválido");
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const first = new Date(Date.UTC(year, month - 1, 1, 12));
  const last = new Date(Date.UTC(year, month, 0, 12));
  return {
    firstDay: dayKeyFromUtcDate(first),
    lastDay: dayKeyFromUtcDate(last),
  };
}

export function shiftMonth(monthKey: string, amount: number): string {
  const [yearValue, monthValue] = monthKey.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const date = new Date(Date.UTC(year, month - 1 + amount, 1, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthGridDays(monthKey: string): string[] {
  const { firstDay, lastDay } = monthBounds(monthKey);
  const gridStart = startOfWeekKey(firstDay);
  const gridEnd = endOfWeekKey(lastDay);
  const days: string[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDaysToKey(cursor, 1);
  }
  return days;
}

export function formatDay(
  dayKey: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  },
  locale = "es-CO",
): string {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: "UTC",
  }).format(utcNoon(dayKey));
}

export function formatMonth(monthKey: string, locale = "es-CO"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcNoon(`${monthKey}-01`));
}

export function formatMonthShort(monthKey: string, locale = "es-CO"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  })
    .format(utcNoon(`${monthKey}-01`))
    .replace(".", "");
}

export function formatWeekdayShort(dayKey: string, locale = "es-CO"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  })
    .format(utcNoon(dayKey))
    .replace(".", "");
}

export function friendlyDayLabel(dayKey: string, today: string): string {
  const diff = diffInDays(today, dayKey);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  if (diff === -1) return "Ayer";
  return formatDay(dayKey, { weekday: "long", day: "numeric", month: "short" });
}

export function daysUntil(dayKey: string, today: string): number {
  return diffInDays(today, dayKey);
}

/** Las fechas de retos se guardan como día civil a mediodía UTC. */
export function challengeDate(dayKey: string): Date {
  return utcNoon(dayKey);
}

export function challengeDay(date: Date): string {
  return dayKeyFromUtcDate(date);
}

export function elapsedDays(startDay: string, today: string): number {
  return Math.max(0, diffInDays(startDay, today));
}

export function nextStreakMessage(streak: number): string {
  if (streak === 0) return "Hoy es un gran día para empezar.";
  if (streak === 1) return "El primer paso ya cuenta.";
  return `${streak} días de constancia. Sigue así.`;
}
