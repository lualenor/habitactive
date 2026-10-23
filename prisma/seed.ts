import bcrypt from "bcryptjs";
import {
  HabitCategory,
  HabitFrequency,
  PrismaClient,
} from "@prisma/client";

import {
  addDaysToKey,
  localNoon,
  toDayKey,
  todayKey,
  utcNoon,
} from "../src/lib/dates";
import { calculateStreaks } from "../src/lib/streaks";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "Demo1234!";
const DEMO_EMAILS = [
  "demo@habitactive.app",
  "ana@habitactive.app",
  "mateo@habitactive.app",
] as const;

const demoUsers = [
  {
    id: "usr_demo_luis",
    name: "Luis Rojas",
    email: DEMO_EMAILS[0],
    timeZone: "America/Bogota",
  },
  {
    id: "usr_demo_ana",
    name: "Ana Restrepo",
    email: DEMO_EMAILS[1],
    timeZone: "America/Bogota",
  },
  {
    id: "usr_demo_mateo",
    name: "Mateo Silva",
    email: DEMO_EMAILS[2],
    timeZone: "America/Mexico_City",
  },
] as const;

type HabitSeed = {
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetPerWeek?: number;
  streak: number;
  todayDone: boolean;
};

const habitsByUser: Record<string, HabitSeed[]> = {
  usr_demo_luis: [
    {
      name: "Meditar 10 minutos",
      description: "Antes de abrir el teléfono. Solo respirar y estar.",
      category: HabitCategory.SPIRITUAL,
      frequency: HabitFrequency.DAILY,
      streak: 12,
      todayDone: true,
    },
    {
      name: "Leer 20 páginas",
      description: "Un libro a la vez. Sin prisa, sin pantallas.",
      category: HabitCategory.INTELLECTUAL,
      frequency: HabitFrequency.DAILY,
      streak: 8,
      todayDone: true,
    },
    {
      name: "Caminar 30 minutos",
      description: "Al final del día, para ordenar la cabeza.",
      category: HabitCategory.PHYSICAL,
      frequency: HabitFrequency.DAILY,
      streak: 5,
      todayDone: true,
    },
    {
      name: "Llamar a alguien querido",
      description: "Una llamada sin motivo, solo por estar.",
      category: HabitCategory.SOCIAL,
      frequency: HabitFrequency.WEEKLY,
      targetPerWeek: 3,
      streak: 2,
      todayDone: false,
    },
  ],
  usr_demo_ana: [
    {
      name: "Escribir 5 gratitudes",
      description: "Tres minutos por la mañana.",
      category: HabitCategory.SPIRITUAL,
      frequency: HabitFrequency.DAILY,
      streak: 21,
      todayDone: true,
    },
    {
      name: "Estudiar francés",
      description: "Una lección corta, todos los días.",
      category: HabitCategory.INTELLECTUAL,
      frequency: HabitFrequency.DAILY,
      streak: 6,
      todayDone: false,
    },
    {
      name: "Yoga suave",
      description: "Movilidad y respiración.",
      category: HabitCategory.PHYSICAL,
      frequency: HabitFrequency.WEEKLY,
      targetPerWeek: 4,
      streak: 3,
      todayDone: true,
    },
  ],
  usr_demo_mateo: [
    {
      name: "Correr 5K",
      description: "Sin mirar el reloj.",
      category: HabitCategory.PHYSICAL,
      frequency: HabitFrequency.DAILY,
      streak: 9,
      todayDone: true,
    },
    {
      name: "Leer al sol",
      description: "15 páginas antes del trabajo.",
      category: HabitCategory.INTELLECTUAL,
      frequency: HabitFrequency.DAILY,
      streak: 4,
      todayDone: false,
    },
    {
      name: "Almuerzo con un amigo",
      description: "Una conversación real cada semana.",
      category: HabitCategory.SOCIAL,
      frequency: HabitFrequency.WEEKLY,
      targetPerWeek: 2,
      streak: 2,
      todayDone: false,
    },
  ],
};

function logsForSeed(
  streak: number,
  todayDone: boolean,
  today: string,
): string[] {
  const days: string[] = [];
  const lastCompleted = todayDone ? 0 : 1;
  for (let index = 0; index < streak; index += 1) {
    days.push(addDaysToKey(today, -(lastCompleted + index)));
  }
  // Un par de registros anteriores para que "mejor racha" tenga historia.
  for (let index = 0; index < 3; index += 1) {
    days.push(addDaysToKey(today, -(streak + 4 + index)));
  }
  return [...new Set(days)];
}

async function main() {
  console.log("🌱 Sembrando datos de demostración de Habitactive…");

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const users = [] as { id: string; name: string; email: string; timeZone: string }[];

  for (const seed of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: seed.email },
      update: {
        name: seed.name,
        timeZone: seed.timeZone,
        passwordHash,
      },
      create: {
        id: seed.id,
        name: seed.name,
        email: seed.email,
        passwordHash,
        timeZone: seed.timeZone,
      },
      select: { id: true, name: true, email: true, timeZone: true },
    });
    users.push(user);
  }

  const userIds = users.map((user) => user.id);

  // Sólo se limpian datos de los usuarios demo, nunca datos reales.
  await prisma.socialChallenge.deleteMany({
    where: { createdById: { in: userIds } },
  });
  await prisma.habit.deleteMany({ where: { userId: { in: userIds } } });

  for (const user of users) {
    const today = todayKey(user.timeZone);
    const seeds = habitsByUser[user.id] ?? [];

    for (const seed of seeds) {
      const days = logsForSeed(seed.streak, seed.todayDone, today);
      const startDay = addDaysToKey(today, -45);
      const streaks = calculateStreaks({
        frequency: seed.frequency,
        targetPerWeek: seed.targetPerWeek ?? 7,
        startDay,
        logs: days,
        todayKey: today,
      });

      await prisma.habit.create({
        data: {
          userId: user.id,
          name: seed.name,
          description: seed.description,
          category: seed.category,
          frequency: seed.frequency,
          targetPerWeek:
            seed.frequency === HabitFrequency.DAILY
              ? 7
              : (seed.targetPerWeek ?? 3),
          currentStreak: streaks.current,
          bestStreak: streaks.best,
          startDate: localNoon(startDay, user.timeZone),
          logs: {
            create: days.map((day) => ({
              userId: user.id,
              day,
              date: localNoon(day, user.timeZone),
            })),
          },
        },
      });
    }
  }

  const luis = users.find((user) => user.email === DEMO_EMAILS[0]);
  const ana = users.find((user) => user.email === DEMO_EMAILS[1]);
  const mateo = users.find((user) => user.email === DEMO_EMAILS[2]);

  if (!luis || !ana || !mateo) {
    throw new Error("No se pudieron crear los usuarios demo.");
  }

  const today = todayKey("America/Bogota");
  const challenges = [
    {
      title: "21 días de gratitud",
      description:
        "Cada día, escribe una cosa pequeña por la que estés agradecido. Al final, comparte una que te haya sorprendido.",
      category: HabitCategory.SPIRITUAL,
      targetValue: 21,
      unit: "días",
      startDay: addDaysToKey(today, -10),
      endDay: addDaysToKey(today, 11),
      createdById: ana.id,
      participants: [
        { userId: ana.id, progress: 14 },
        { userId: luis.id, progress: 11 },
        { userId: mateo.id, progress: 7 },
      ],
    },
    {
      title: "Leer 300 páginas juntos",
      description:
        "Un reto tranquilo: suma las páginas que leas este mes y comparte tu libro favorito en el camino.",
      category: HabitCategory.INTELLECTUAL,
      targetValue: 300,
      unit: "páginas",
      startDay: addDaysToKey(today, -5),
      endDay: addDaysToKey(today, 25),
      createdById: luis.id,
      participants: [
        { userId: luis.id, progress: 84 },
        { userId: ana.id, progress: 126 },
        { userId: mateo.id, progress: 51 },
      ],
    },
    {
      title: "100 km en comunidad",
      description:
        "Camina, corre o pedalea. Cada kilómetro cuenta y cada persona avanza a su ritmo.",
      category: HabitCategory.PHYSICAL,
      targetValue: 100,
      unit: "km",
      startDay: addDaysToKey(today, -18),
      endDay: addDaysToKey(today, 12),
      createdById: mateo.id,
      participants: [
        { userId: mateo.id, progress: 72 },
        { userId: luis.id, progress: 38 },
        { userId: ana.id, progress: 24 },
      ],
    },
    {
      title: "Una conversación real al día",
      description:
        "Durante dos semanas, cambia un mensaje por una llamada o un café. La presencia también se entrena.",
      category: HabitCategory.SOCIAL,
      targetValue: 14,
      unit: "conversaciones",
      startDay: addDaysToKey(today, -3),
      endDay: addDaysToKey(today, 11),
      createdById: luis.id,
      participants: [
        { userId: luis.id, progress: 4 },
        { userId: mateo.id, progress: 6 },
      ],
    },
  ];

  for (const challenge of challenges) {
    await prisma.socialChallenge.create({
      data: {
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        targetValue: challenge.targetValue,
        unit: challenge.unit,
        startDate: utcNoon(challenge.startDay),
        endDate: utcNoon(challenge.endDay),
        isPublic: true,
        createdById: challenge.createdById,
        participants: {
          create: challenge.participants.map((participant) => ({
            userId: participant.userId,
            progress: participant.progress,
          })),
        },
      },
    });
  }

  console.log("✅ Datos demo listos.");
  console.log("");
  console.log("   Correo:   demo@habitactive.app");
  console.log("   Password: Demo1234!");
  console.log("");
  console.log("   También: ana@habitactive.app / mateo@habitactive.app");
  console.log("   (misma contraseña)");
  console.log("");
  console.log("   Usa estos datos solo en desarrollo.");
  console.log(`   Día demo: ${toDayKey(new Date(), "America/Bogota")}`);
}

main()
  .catch((error) => {
    console.error("Error sembrando datos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
