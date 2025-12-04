import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // -----------------------------------------------------
  // 1) Hash password
  // -----------------------------------------------------
  const hashedPassword = await bcrypt.hash("password123", 10);

  // -----------------------------------------------------
  // 2) Users
  // -----------------------------------------------------
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "Alice Organizer",
        utorid: "alice1",
        email: "alice@example.com",
        password: hashedPassword,
        role: "superuser",
        points: 200,
        isEventOrganizer: true,
        grossPoints: 500,
        hideUtorid: false,
      },
      {
        id: 2,
        name: "Bob Student",
        utorid: "bob1",
        email: "bob@example.com",
        password: hashedPassword,
        role: "regular",
        points: 120,
        grossPoints: 100,
        hideUtorid: true,
      },
      {
        id: 3,
        name: "Charlie Staff",
        utorid: "charlie1",
        email: "charlie@example.com",
        password: hashedPassword,
        role: "manager",
        points: 300,
        isEventOrganizer: true,
        grossPoints: 300,
        hideUtorid: false,
      },
      {
        id: 4,
        name: "Dana Suspicious",
        utorid: "dana1",
        email: "dana@example.com",
        password: hashedPassword,
        role: "regular",
        points: 0,
        suspicious: true,
        grossPoints: 0,
        hideUtorid: false,
      },
    ],
  });

  // -----------------------------------------------------
  // 3) Events
  // -----------------------------------------------------
  await prisma.event.createMany({
    data: [
      {
        name: "Tech Expo",
        description: "Innovation showcase",
        location: "Building A",
        startTime: new Date("2025-01-20T10:00:00Z"),
        endTime: new Date("2025-01-20T15:00:00Z"),
        capacity: 100,
        points: 20,
        pointsRemain: 20,
        createdById: 1,
        published: true,
      },
      {
        name: "Wellness Workshop",
        description: "Mental health session",
        location: "Room 204",
        startTime: new Date("2025-02-05T09:00:00Z"),
        endTime: new Date("2025-02-05T11:00:00Z"),
        capacity: 20,
        points: 10,
        pointsRemain: 10,
        createdById: 3,
        published: true,
      },
      {
        name: "Career Fair",
        description: "Recruitment event",
        location: "Campus Gym",
        startTime: new Date("2025-03-10T12:00:00Z"),
        endTime: new Date("2025-03-10T17:00:00Z"),
        capacity: null,
        points: 5,
        pointsRemain: 5,
        createdById: 1,
        published: false,
      },
      {
        name: "Exam Day",
        description: "Exam exam exam event",
        location: "Death Room",
        startTime: new Date("2026-03-10T12:00:00Z"),
        endTime: new Date("2025-06-15T17:00:00Z"),
        capacity: 300,
        points: 100,
        pointsRemain: 5,
        createdById: 1,
        published: false,
      },
    ],
  });

  // -----------------------------------------------------
  // 4) Event Organizers
  // -----------------------------------------------------
  await prisma.event.update({
    where: { id: 1 },
    data: { organizers: { connect: [{ id: 1 }, { id: 3 }] } },
  });

  await prisma.event.update({
    where: { id: 2 },
    data: { organizers: { connect: [{ id: 3 }] } },
  });

  await prisma.event.update({
    where: { id: 3 },
    data: { organizers: { connect: [{ id: 1 }] } },
  });

  // -----------------------------------------------------
  // 5) RSVPs
  // -----------------------------------------------------
  await prisma.rsvp.createMany({
    data: [
      { id: 1, userId: 2, eventId: 1, status: "pending" },
      { id: 2, userId: 4, eventId: 1, status: "confirmed" },
      { id: 3, userId: 2, eventId: 2, status: "pending" },
    ],
  });

  // -----------------------------------------------------
  // 6) Promotions
  // -----------------------------------------------------
  await prisma.promotion.createMany({
    data: [
      {
        id: 1,
        name: "Winter Bonus",
        description: "Earn extra 50 points",
        type: "automatic",
        points: 50,
        startTime: new Date("2024-12-01T00:00:00Z"),
        endTime: new Date("2025-02-01T00:00:00Z"),
        createdById: 1,
      },
      {
        id: 2,
        name: "Early Bird",
        description: "10% extra points",
        type: "onetime",
        rate: 0.1,
        minSpending: 20,
        startTime: new Date("2025-03-01T00:00:00Z"),
        endTime: new Date("2025-03-31T00:00:00Z"),
        createdById: 3,
      },
      {
        id: 3,
        name: "Expired Promo",
        description: "Already expired",
        type: "automatic",
        points: 5,
        startTime: new Date("2024-01-01T00:00:00Z"),
        endTime: new Date("2024-02-01T00:00:00Z"),
        createdById: 1,
      },
    ],
  });

  // Connect redeemed promotion → user
  await prisma.user.update({
    where: { id: 2 },
    data: { promotions: { connect: [{ id: 1 }] } }, // Bob used Winter Bonus
  });

  // -----------------------------------------------------
  // 7) Transactions
  // -----------------------------------------------------
  await prisma.transaction.create({
    data: {
      id: 1,
      type: "event",
      userId: 2,
      amount: 20,
      spent: 0,
      remark: "Attended Tech Expo",
      eventInvolvedId: 1,
    },
  });

  await prisma.transaction.create({
    data: {
      id: 2,
      type: "redemption",
      userId: 2,
      amount: -5,
      spent: 5,
      remark: "Redeemed Winter Bonus",
      processed: true,
      processedById: 1,
      promotions: { connect: [{ id: 1 }] },
    },
  });

  await prisma.transaction.create({
    data: {
      id: 3,
      type: "transfer",
      userId: 2,
      targetUserId: 3,
      amount: -10,
      spent: 0,
      remark: "Gift points",
      processed: true,
      processedById: 3,
    },
  });

  await prisma.transaction.create({
    data: {
      id: 4,
      type: "transfer",
      userId: 4,
      targetUserId: 1,
      amount: 1000,
      spent: 0,
      remark: "Suspicious transfer",
      suspicious: true,
    },
  });

  await prisma.transaction.create({
    data: {
      id: 5,
      type: "purchase",
      userId: 1,
      targetUserId: 1,
      amount: 50,
      spent: 100,
      remark: "Organizer purchase",
      promotions: { connect: [{ id: 2 }] },
    },
  });

  // ADJUSTMENT – admin corrects user points
  await prisma.transaction.create({
    data: {
      id: 6,
      type: "adjustment",
      userId: 1,
      amount: 30,
      spent: 0,
      remark: "Admin manual correction",
      processed: true,
      processedById: 1,
    },
  });

  // PURCHASE – clean, basic purchase for filtering
  await prisma.transaction.create({
    data: {
      id: 7,
      type: "purchase",
      userId: 1,
      amount: 15,
      spent: 30,
      remark: "Student snack purchase",
    },
  });

  // EVENT – another event-based transaction for variety
  await prisma.transaction.create({
    data: {
      id: 8,
      type: "event",
      userId: 1,
      eventInvolvedId: 2,
      amount: 10,
      spent: 0,
      remark: "Attended Wellness Workshop",
    },
  });
}

main()
  .then(() => {
    console.log("Database seeded successfully.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
