import { describe, expect, it } from "vitest";

import {
  addDaysToKey,
  diffInDays,
  formatDay,
  isValidDayKey,
  isValidMonthKey,
  localNoon,
  monthBounds,
  monthGridDays,
  parseDayKey,
  startOfWeekKey,
  toDayKey,
  todayKey,
  utcNoon,
} from "@/lib/dates";

describe("day keys", () => {
  it("obtiene la fecha civil correcta a ambos lados de la medianoche UTC", () => {
    const instant = new Date("2026-10-22T02:30:00.000Z");
    expect(toDayKey(instant, "America/Bogota")).toBe("2026-10-21");
    expect(toDayKey(instant, "Europe/Madrid")).toBe("2026-10-22");
    expect(toDayKey(instant, "Pacific/Kiritimati")).toBe("2026-10-22");
  });

  it("valida fechas reales y rechaza las imposibles", () => {
    expect(isValidDayKey("2026-02-28")).toBe(true);
    expect(isValidDayKey("2024-02-29")).toBe(true);
    expect(isValidDayKey("2026-02-29")).toBe(false);
    expect(isValidDayKey("2026-13-01")).toBe(false);
    expect(isValidDayKey("21-10-2026")).toBe(false);
  });

  it("parsea y avanza días cruzando meses, años y bisiestos", () => {
    expect(parseDayKey("2026-10-21")).toEqual({
      year: 2026,
      month: 10,
      day: 21,
    });
    expect(addDaysToKey("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDaysToKey("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDaysToKey("2024-02-29", 1)).toBe("2024-03-01");
    expect(addDaysToKey("2026-03-01", -1)).toBe("2026-02-28");
    expect(diffInDays("2026-10-01", "2026-10-21")).toBe(20);
  });
});

describe("localNoon", () => {
  it("guarda el mediodía de Bogotá como 17:00 UTC", () => {
    const date = localNoon("2026-10-21", "America/Bogota");
    expect(date.toISOString()).toBe("2026-10-21T17:00:00.000Z");
    expect(toDayKey(date, "America/Bogota")).toBe("2026-10-21");
  });

  it("maneja horario de verano en Madrid sin cambiar de día", () => {
    const summer = localNoon("2026-07-15", "Europe/Madrid");
    const winter = localNoon("2026-12-15", "Europe/Madrid");
    expect(summer.toISOString()).toBe("2026-07-15T10:00:00.000Z");
    expect(winter.toISOString()).toBe("2026-12-15T11:00:00.000Z");
    expect(toDayKey(summer, "Europe/Madrid")).toBe("2026-07-15");
    expect(toDayKey(winter, "Europe/Madrid")).toBe("2026-12-15");
  });

  it("conserva el día civil en zonas extremas (+14 y -11)", () => {
    for (const timeZone of ["Pacific/Kiritimati", "Pacific/Pago_Pago"]) {
      const noon = localNoon("2026-10-21", timeZone);
      expect(toDayKey(noon, timeZone)).toBe("2026-10-21");
    }
  });
});

describe("calendario", () => {
  it("empieza las semanas en lunes", () => {
    expect(startOfWeekKey("2026-10-21")).toBe("2026-10-19");
    expect(startOfWeekKey("2026-10-19")).toBe("2026-10-19");
    expect(startOfWeekKey("2026-10-25")).toBe("2026-10-19");
  });

  it("calcula límites y rejilla de un mes", () => {
    expect(monthBounds("2026-02")).toEqual({
      firstDay: "2026-02-01",
      lastDay: "2026-02-28",
    });
    expect(monthBounds("2024-02").lastDay).toBe("2024-02-29");

    const grid = monthGridDays("2026-10");
    expect(grid[0]).toBe("2026-09-28");
    expect(grid).toContain("2026-10-01");
    expect(grid).toContain("2026-10-31");
    expect(grid.length % 7).toBe(0);
  });

  it("formatea sin desplazar el día por zona horaria", () => {
    expect(
      formatDay("2026-10-21", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    ).toContain("21");
    expect(utcNoon("2026-10-21").toISOString()).toBe(
      "2026-10-21T12:00:00.000Z",
    );
  });

  it("valida claves de mes", () => {
    expect(isValidMonthKey("2026-10")).toBe(true);
    expect(isValidMonthKey("2026-13")).toBe(false);
    expect(isValidMonthKey("octubre")).toBe(false);
  });

  it("usa la zona del usuario para decidir qué día es hoy", () => {
    const instant = new Date("2026-10-22T03:00:00.000Z");
    expect(todayKey("America/Bogota", instant)).toBe("2026-10-21");
    expect(todayKey("Europe/Madrid", instant)).toBe("2026-10-22");
  });
});
