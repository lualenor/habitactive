import type { HabitFrequency } from "@prisma/client";

import {
  CATEGORY_ORDER,
  type HabitCategoryValue,
} from "@/lib/categories";
import {
  addDaysToKey,
  currentMonthKey,
  formatDay,
  formatMonth,
  isValidDayKey,
  isValidMonthKey,
  monthBounds,
  monthGridDays,
  monthKeyOf,
  shiftMonth,
  startOfWeekKey,
  todayKey,
  toDayKey,
} from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { calculateStreaks } from "@/lib/streaks";

export interface HabitProgress {
  id: string;
  name: string;
  description: string | null;
  category: HabitCategoryValue;
  frequency: HabitFrequency;
  targetPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  weekCount: number;
  weekGoalMet: boolean;
  startDay: string;
  last7Days: { day: string; completed: boolean }[];
}

export interface DashboardData {
  today: string;
  formattedToday: string;
  greeting: string;
  habits: HabitProgress[];
  focus: {
    category: HabitCategoryValue;
    total: number;
    completed: number;
  }[];
  stats: {
    completedToday: number;
    totalToday: number;
    bestCurrentStreak: number;
    weekLogs: number;
    totalHabits: number;
  };
  weekDays: { day: string; label: string; completed: number; total: number }[];
  challenges: {
    id: string;
    title: string;
    progress: number;
    targetValue: number;
    unit: string;
    daysLeft: number;
    participants: number;
  }[];
}

function greetingForHour(hour: number) {
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function localHour(timeZone: string, now = new Date()) {
  return Number(
    new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone,
    }).format(now),
  );
}

export async function getDashboardData(
  userId: string,
  timeZone: string,
): Promise<DashboardData> {
  const today = todayKey(timeZone);
  const weekStart = startOfWeekKey(today);
  const historyStart = addDaysToKey(today, -370);
  const now = new Date();

  const [habits, logs, challengeRows] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, archivedAt: null },
      orderBy: [{ createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        frequency: true,
        targetPerWeek: true,
        bestStreak: true,
        startDate: true,
      },
    }),
    prisma.habitLog.findMany({
      where: {
        userId,
        day: { gte: historyStart, lte: today },
      },
      select: { habitId: true, day: true },
      orderBy: { day: "asc" },
    }),
    prisma.challengeParticipant.findMany({
      where: {
        userId,
        challenge: { endDate: { gte: new Date(`${today}T00:00:00.000Z`) } },
      },
      select: {
        progress: true,
        challenge: {
          select: {
            id: true,
            title: true,
            targetValue: true,
            unit: true,
            endDate: true,
            _count: { select: { participants: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      take: 3,
    }),
  ]);

  const logsByHabit = new Map<string, string[]>();
  const activeHabitIds = new Set(habits.map((habit) => habit.id));
  const activeLogs = logs.filter((log) => activeHabitIds.has(log.habitId));
  for (const log of activeLogs) {
    const list = logsByHabit.get(log.habitId) ?? [];
    list.push(log.day);
    logsByHabit.set(log.habitId, list);
  }

  const habitProgress: HabitProgress[] = habits.map((habit) => {
    const habitLogs = logsByHabit.get(habit.id) ?? [];
    const startDay = toDayKey(habit.startDate, timeZone);
    const streaks = calculateStreaks({
      frequency: habit.frequency,
      targetPerWeek: habit.targetPerWeek,
      startDay,
      logs: habitLogs,
      todayKey: today,
    });
    const weekCount = habitLogs.filter((day) => day >= weekStart).length;

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency,
      targetPerWeek: habit.targetPerWeek,
      currentStreak: streaks.current,
      bestStreak: Math.max(streaks.best, habit.bestStreak),
      completedToday: habitLogs.includes(today),
      weekCount,
      weekGoalMet:
        habit.frequency === "DAILY"
          ? weekCount >= 7
          : weekCount >= habit.targetPerWeek,
      startDay,
      last7Days: Array.from({ length: 7 }, (_, index) => {
        const day = addDaysToKey(today, index - 6);
        return { day, completed: habitLogs.includes(day) };
      }),
    };
  });

  const focus = CATEGORY_ORDER.map((category) => ({
    category,
    total: habitProgress.filter((habit) => habit.category === category).length,
    completed: habitProgress.filter(
      (habit) => habit.category === category && habit.completedToday,
    ).length,
  }));

  const bestCurrentStreak = habitProgress.reduce(
    (max, habit) => Math.max(max, habit.currentStreak),
    0,
  );

  return {
    today,
    formattedToday: formatDay(today, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    greeting: greetingForHour(localHour(timeZone, now)),
    habits: habitProgress,
    focus,
    stats: {
      completedToday: habitProgress.filter((habit) => habit.completedToday)
        .length,
      totalToday: habitProgress.length,
      bestCurrentStreak,
      weekLogs: activeLogs.filter((log) => log.day >= weekStart).length,
      totalHabits: habitProgress.length,
    },
    weekDays: Array.from({ length: 7 }, (_, index) => {
      const day = addDaysToKey(weekStart, index);
      const activeForDay = habitProgress.filter(
        (habit) => habit.startDay <= day,
      );
      const completed = activeForDay.filter((habit) =>
        habit.last7Days.some((item) => item.day === day && item.completed),
      ).length;
      return {
        day,
        label: formatDay(day, { weekday: "narrow" }),
        completed,
        total: activeForDay.length,
      };
    }),
    challenges: challengeRows.map((row) => ({
      id: row.challenge.id,
      title: row.challenge.title,
      progress: row.progress,
      targetValue: row.challenge.targetValue,
      unit: row.challenge.unit,
      daysLeft: Math.max(
        0,
        Math.ceil(
          (new Date(row.challenge.endDate).getTime() -
            new Date(`${today}T12:00:00.000Z`).getTime()) /
            86_400_000,
        ) + 1,
      ),
      participants: row.challenge._count.participants,
    })),
  };
}

export interface CalendarHabit {
  id: string;
  name: string;
  category: HabitCategoryValue;
  frequency: HabitFrequency;
  completed: boolean;
}

export interface CalendarData {
  monthKey: string;
  monthLabel: string;
  previousMonth: string;
  nextMonth: string;
  today: string;
  selectedDay: string;
  selectedLabel: string;
  grid: {
    day: string;
    inMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isFuture: boolean;
    completed: number;
    total: number;
  }[];
  selectedHabits: CalendarHabit[];
  monthCompleted: number;
  activeDays: number;
}

export async function getCalendarData(
  userId: string,
  timeZone: string,
  monthParam?: string,
  dayParam?: string,
): Promise<CalendarData> {
  const today = todayKey(timeZone);
  const monthKey = isValidMonthKey(monthParam)
    ? monthParam
    : currentMonthKey(timeZone);
  const { firstDay } = monthBounds(monthKey);
  const gridDays = monthGridDays(monthKey);
  const gridStart = gridDays[0] ?? firstDay;
  const gridEnd = gridDays[gridDays.length - 1] ?? firstDay;

  let selectedDay =
    isValidDayKey(dayParam) && monthKeyOf(dayParam) === monthKey
      ? dayParam
      : monthKeyOf(today) === monthKey
        ? today
        : firstDay;
  if (monthKeyOf(today) < monthKey) selectedDay = firstDay;

  const [habits, logs] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, archivedAt: null },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        category: true,
        frequency: true,
        startDate: true,
      },
    }),
    prisma.habitLog.findMany({
      where: { userId, day: { gte: gridStart, lte: gridEnd } },
      select: { habitId: true, day: true },
      orderBy: { day: "asc" },
    }),
  ]);

  const logsByDay = new Map<string, Set<string>>();
  const logsByHabit = new Map<string, string[]>();
  const activeHabitIds = new Set(habits.map((habit) => habit.id));
  for (const log of logs) {
    if (!activeHabitIds.has(log.habitId)) continue;
    const daySet = logsByDay.get(log.day) ?? new Set<string>();
    daySet.add(log.habitId);
    logsByDay.set(log.day, daySet);
    const list = logsByHabit.get(log.habitId) ?? [];
    list.push(log.day);
    logsByHabit.set(log.habitId, list);
  }

  const activeHabitsForDay = (day: string) =>
    habits.filter((habit) => toDayKey(habit.startDate, timeZone) <= day);

  let monthCompleted = 0;
  const activeDays = new Set<string>();
  const grid = gridDays.map((day) => {
    const total = activeHabitsForDay(day).length;
    const completed = logsByDay.get(day)?.size ?? 0;
    const inMonth = monthKeyOf(day) === monthKey;
    if (inMonth) {
      monthCompleted += completed;
      if (completed > 0) activeDays.add(day);
    }

    return {
      day,
      inMonth,
      isToday: day === today,
      isSelected: day === selectedDay,
      isFuture: day > today,
      completed,
      total,
    };
  });

  const selectedHabits: CalendarHabit[] = activeHabitsForDay(selectedDay).map(
    (habit) => {
      const habitLogs = logsByHabit.get(habit.id) ?? [];
      return {
        id: habit.id,
        name: habit.name,
        category: habit.category,
        frequency: habit.frequency,
        completed: habitLogs.includes(selectedDay),
      };
    },
  );

  return {
    monthKey,
    monthLabel: formatMonth(monthKey),
    previousMonth: shiftMonth(monthKey, -1),
    nextMonth: shiftMonth(monthKey, 1),
    today,
    selectedDay,
    selectedLabel: formatDay(selectedDay, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    grid,
    selectedHabits,
    monthCompleted,
    activeDays: activeDays.size,
  };
}

export async function getActiveHabitCount(userId: string) {
  return prisma.habit.count({ where: { userId, archivedAt: null } });
}
