import {
  addDaysToKey,
  startOfWeekKey,
} from "@/lib/dates";

export type StreakFrequency = "DAILY" | "WEEKLY";

export interface StreakInput {
  frequency: StreakFrequency;
  targetPerWeek?: number;
  startDay: string;
  logs: string[];
  todayKey: string;
}

export interface StreakResult {
  current: number;
  best: number;
  total: number;
}

export interface WeeklyCompletion {
  weekStart: string;
  count: number;
  completed: boolean;
}

/**
 * Calcula rachas usando días civiles (YYYY-MM-DD), nunca timestamps.
 *
 * Diaria:
 *  - La racha sigue viva si hoy aún no se ha completado; en ese caso se cuenta
 *    desde ayer. No se “rompe” hasta que termina el día.
 *  - Un día sin registro corta la secuencia.
 *
 * Semanal:
 *  - Cada semana (lunes a domingo) que alcanza `targetPerWeek` suma 1.
 *  - La semana actual no rompe la racha mientras aún pueda completarse.
 */
export function calculateStreaks(input: StreakInput): StreakResult {
  const logs = [...new Set(input.logs)]
    .filter((day) => day >= input.startDay && day <= input.todayKey)
    .sort();

  if (logs.length === 0) {
    return { current: 0, best: 0, total: 0 };
  }

  return input.frequency === "DAILY"
    ? dailyStreaks(logs, input.startDay, input.todayKey)
    : weeklyStreaks(
        logs,
        input.startDay,
        input.todayKey,
        Math.min(7, Math.max(1, input.targetPerWeek ?? 7)),
      );
}

function dailyStreaks(
  logs: string[],
  startDay: string,
  today: string,
): StreakResult {
  const logSet = new Set(logs);
  let current = 0;
  let cursor = logSet.has(today) ? today : addDaysToKey(today, -1);

  while (cursor >= startDay && logSet.has(cursor)) {
    current += 1;
    cursor = addDaysToKey(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let previous: string | null = null;

  for (const day of logs) {
    if (previous && addDaysToKey(previous, 1) === day) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    previous = day;
  }

  return { current, best, total: logs.length };
}

function weeklyStreaks(
  logs: string[],
  startDay: string,
  today: string,
  target: number,
): StreakResult {
  const counts = new Map<string, number>();
  for (const day of logs) {
    const week = startOfWeekKey(day);
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }

  const completedWeeks = [...counts.entries()]
    .filter(([, count]) => count >= target)
    .map(([week]) => week)
    .sort();
  const completedSet = new Set(completedWeeks);

  let current = 0;
  const currentWeek = startOfWeekKey(today);
  let cursor = (counts.get(currentWeek) ?? 0) >= target
    ? currentWeek
    : addDaysToKey(currentWeek, -7);

  while (cursor >= startOfWeekKey(startDay) && completedSet.has(cursor)) {
    current += 1;
    cursor = addDaysToKey(cursor, -7);
  }

  let best = 0;
  let run = 0;
  let previous: string | null = null;

  for (const week of completedWeeks) {
    if (previous && addDaysToKey(previous, 7) === week) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    previous = week;
  }

  return { current, best, total: logs.length };
}

export function weeklyBreakdown(input: StreakInput): WeeklyCompletion[] {
  const target = Math.min(7, Math.max(1, input.targetPerWeek ?? 7));
  const counts = new Map<string, number>();

  for (const day of new Set(input.logs)) {
    if (day < input.startDay || day > input.todayKey) continue;
    const week = startOfWeekKey(day);
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([weekStart, count]) => ({
      weekStart,
      count,
      completed: count >= target,
    }));
}
