import { describe, expect, it } from "vitest";

import { calculateStreaks } from "@/lib/streaks";

const base = {
  frequency: "DAILY" as const,
  startDay: "2026-10-01",
  todayKey: "2026-10-21",
};

describe("rachas diarias", () => {
  it("cuenta la racha aunque hoy aún no se haya completado", () => {
    const result = calculateStreaks({
      ...base,
      logs: ["2026-10-18", "2026-10-19", "2026-10-20"],
    });
    expect(result.current).toBe(3);
    expect(result.best).toBe(3);
  });

  it("incluye hoy cuando ya está completado", () => {
    const result = calculateStreaks({
      ...base,
      logs: ["2026-10-19", "2026-10-20", "2026-10-21"],
    });
    expect(result.current).toBe(3);
  });

  it("se rompe cuando ayer y hoy están vacíos", () => {
    const result = calculateStreaks({
      ...base,
      logs: ["2026-10-17", "2026-10-18"],
    });
    expect(result.current).toBe(0);
    expect(result.best).toBe(2);
  });

  it("conserva la mejor racha histórica aunque la actual sea menor", () => {
    const result = calculateStreaks({
      ...base,
      logs: [
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
        "2026-10-18",
        "2026-10-19",
      ],
    });
    expect(result.current).toBe(0);
    expect(result.best).toBe(5);
  });

  it("ignora registros futuros, anteriores al inicio o duplicados", () => {
    const result = calculateStreaks({
      ...base,
      logs: [
        "2026-09-30",
        "2026-10-19",
        "2026-10-20",
        "2026-10-20",
        "2026-10-21",
        "2026-10-22",
      ],
    });
    expect(result.current).toBe(3);
    expect(result.total).toBe(3);
  });

  it("devuelve cero sin registros", () => {
    const result = calculateStreaks({ ...base, logs: [] });
    expect(result).toEqual({ current: 0, best: 0, total: 0 });
  });
});

describe("rachas semanales", () => {
  const weekly = {
    frequency: "WEEKLY" as const,
    targetPerWeek: 3,
    startDay: "2026-09-01",
    todayKey: "2026-10-21",
  };

  it("cuenta semanas completas consecutivas y no rompe la semana actual", () => {
    const result = calculateStreaks({
      ...weekly,
      logs: [
        // Semana del 5 de octubre: 3/3
        "2026-10-05",
        "2026-10-06",
        "2026-10-07",
        // Semana del 12 de octubre: 3/3
        "2026-10-12",
        "2026-10-13",
        "2026-10-14",
        // Semana actual: 1/3, aún puede completarse
        "2026-10-21",
      ],
    });
    expect(result.current).toBe(2);
    expect(result.best).toBe(2);
  });

  it("incluye la semana actual si ya alcanzó la meta", () => {
    const result = calculateStreaks({
      ...weekly,
      logs: [
        "2026-10-12",
        "2026-10-13",
        "2026-10-14",
        "2026-10-19",
        "2026-10-20",
        "2026-10-21",
      ],
    });
    expect(result.current).toBe(2);
    expect(result.best).toBe(2);
  });

  it("no cuenta semanas que no alcanzan la meta", () => {
    const result = calculateStreaks({
      ...weekly,
      logs: [
        "2026-10-05",
        "2026-10-06",
        // solo 2 de 3
        "2026-10-12",
        "2026-10-13",
        "2026-10-14",
      ],
    });
    expect(result.current).toBe(1);
    expect(result.best).toBe(1);
  });
});
