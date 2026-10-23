import type { HabitCategory } from "@prisma/client";

import { challengeDay, todayKey } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { percentage } from "@/lib/utils";

export type ChallengeStatus = "upcoming" | "active" | "ended";

export interface ChallengeSummary {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  targetValue: number;
  unit: string;
  startDay: string;
  endDay: string;
  status: ChallengeStatus;
  daysLeft: number;
  participants: number;
  creatorName: string;
  myProgress: number;
  myJoined: boolean;
  isCreator: boolean;
  percent: number;
}

export interface CommunityData {
  today: string;
  active: ChallengeSummary[];
  mine: ChallengeSummary[];
  communityStats: {
    activeChallenges: number;
    participants: number;
    completedToday: number;
  };
}

function statusFor(
  startDay: string,
  endDay: string,
  today: string,
): ChallengeStatus {
  if (today < startDay) return "upcoming";
  if (today > endDay) return "ended";
  return "active";
}

function daysLeftFor(endDay: string, today: string) {
  const diff = Math.ceil(
    (new Date(`${endDay}T12:00:00.000Z`).getTime() -
      new Date(`${today}T12:00:00.000Z`).getTime()) /
      86_400_000,
  );
  return Math.max(0, diff + 1);
}

export async function getCommunityData(
  userId: string,
  timeZone: string,
): Promise<CommunityData> {
  const today = todayKey(timeZone);
  const now = new Date();

  const [challenges, participantsCount, completedLogs] = await Promise.all([
    prisma.socialChallenge.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdById: userId },
          { participants: { some: { userId } } },
        ],
      },
      take: 40,
      orderBy: [{ endDate: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        targetValue: true,
        unit: true,
        startDate: true,
        endDate: true,
        createdById: true,
        createdBy: { select: { name: true } },
        participants: {
          where: { userId },
          select: { progress: true },
        },
        _count: { select: { participants: true } },
      },
    }),
    prisma.challengeParticipant.count({
      where: { challenge: { isPublic: true, endDate: { gte: now } } },
    }),
    prisma.habitLog.count({
      where: {
        day: today,
        habit: { archivedAt: null },
      },
    }),
  ]);

  const summaries = challenges.map((challenge): ChallengeSummary => {
    const startDay = challengeDay(challenge.startDate);
    const endDay = challengeDay(challenge.endDate);
    const myProgress = challenge.participants[0]?.progress ?? 0;
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      targetValue: challenge.targetValue,
      unit: challenge.unit,
      startDay,
      endDay,
      status: statusFor(startDay, endDay, today),
      daysLeft: daysLeftFor(endDay, today),
      participants: challenge._count.participants,
      creatorName: challenge.createdBy.name,
      myProgress,
      myJoined: challenge.participants.length > 0,
      isCreator: challenge.createdById === userId,
      percent: percentage(myProgress, challenge.targetValue),
    };
  });

  const active = summaries
    .filter((challenge) => challenge.status !== "ended")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return a.endDay.localeCompare(b.endDay);
    });

  const mine = summaries
    .filter((challenge) => challenge.myJoined)
    .sort((a, b) => {
      const order: Record<ChallengeStatus, number> = {
        active: 0,
        upcoming: 1,
        ended: 2,
      };
      return order[a.status] - order[b.status];
    });

  return {
    today,
    active,
    mine,
    communityStats: {
      activeChallenges: active.filter(
        (challenge) => challenge.status === "active",
      ).length,
      participants: participantsCount,
      completedToday: completedLogs,
    },
  };
}

export interface ChallengeDetail {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  targetValue: number;
  unit: string;
  startDay: string;
  endDay: string;
  status: ChallengeStatus;
  daysLeft: number;
  creatorName: string;
  creatorId: string;
  isCreator: boolean;
  myProgress: number;
  myJoined: boolean;
  participants: {
    id: string;
    userId: string;
    name: string;
    image: string | null;
    progress: number;
    percent: number;
    isMe: boolean;
    isCreator: boolean;
    joinedAt: string;
  }[];
  totalProgress: number;
  completionPercent: number;
  isPublic: boolean;
}

export async function getChallengeDetail(
  challengeId: string,
  userId: string,
  timeZone: string,
): Promise<ChallengeDetail | null> {
  const today = todayKey(timeZone);
  const challenge = await prisma.socialChallenge.findFirst({
    where: {
      id: challengeId,
      OR: [
        { isPublic: true },
        { createdById: userId },
        { participants: { some: { userId } } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      targetValue: true,
      unit: true,
      startDate: true,
      endDate: true,
      isPublic: true,
      createdById: true,
      createdBy: { select: { name: true, id: true } },
      participants: {
        orderBy: [{ progress: "desc" }, { joinedAt: "asc" }],
        select: {
          id: true,
          userId: true,
          progress: true,
          joinedAt: true,
          user: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!challenge) return null;

  const startDay = challengeDay(challenge.startDate);
  const endDay = challengeDay(challenge.endDate);
  const myParticipant = challenge.participants.find(
    (participant) => participant.userId === userId,
  );
  const totalProgress = challenge.participants.reduce(
    (sum, participant) => sum + participant.progress,
    0,
  );

  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category,
    targetValue: challenge.targetValue,
    unit: challenge.unit,
    startDay,
    endDay,
    status: statusFor(startDay, endDay, today),
    daysLeft: daysLeftFor(endDay, today),
    creatorName: challenge.createdBy.name,
    creatorId: challenge.createdBy.id,
    isCreator: challenge.createdById === userId,
    myProgress: myParticipant?.progress ?? 0,
    myJoined: Boolean(myParticipant),
    participants: challenge.participants.map((participant) => ({
      id: participant.id,
      userId: participant.userId,
      name: participant.user.name,
      image: participant.user.image,
      progress: participant.progress,
      percent: percentage(participant.progress, challenge.targetValue),
      isMe: participant.userId === userId,
      isCreator: participant.userId === challenge.createdById,
      joinedAt: participant.joinedAt.toISOString(),
    })),
    totalProgress,
    completionPercent: percentage(
      challenge.participants.filter(
        (participant) => participant.progress >= challenge.targetValue,
      ).length,
      Math.max(1, challenge.participants.length),
    ),
    isPublic: challenge.isPublic,
  };
}

export async function getChallengeParticipant(
  challengeId: string,
  userId: string,
) {
  return prisma.challengeParticipant.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
    select: {
      id: true,
      progress: true,
      challenge: {
        select: {
          startDate: true,
          endDate: true,
          targetValue: true,
          createdById: true,
        },
      },
    },
  });
}
