"use strict";

const { prisma, PromotionType } = require("../prisma/prisma");
const bcrypt = require("bcrypt");

async function createUser(name, utorid, email, password, role) {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      utorid: utorid,
      verified: true,
    },
  });
}

async function createEvent(name, description, location, startTime, endTime, capacity, points) {
    await prisma.event.create({
      data: {
        name: name,
        description: description,
        location: location,
        startTime: startTime,
        endTime: endTime,
        capacity: capacity,
        points: points,
        pointsRemain: points,
        published: true,
        createdBy: { connect: { id: 1 }}
      },
    });
  }


async function createPromotion(name, description, type, startTime, endTime, minSpending, rate, points) {
    await prisma.promotion.create({
      data: {
        name: name,
        description: description,
        type: type,
        startTime: startTime,
        endTime: endTime,
        minSpending: minSpending,
        rate: rate,
        points: points,
        createdBy: { connect: { id: 1 }}
      },
    });
  }

// 6 events
createEvent("Winter Gala", "Dress up for an elegant night", "Toronto Convention Centre", "2025-12-20T18:00:00.000Z", "2025-12-20T23:00:00.000Z", 300, 1500).finally(() => prisma.$disconnect());
createEvent("Tech Expo 2026", "Explore the latest in tech innovations", "Metro Toronto Convention Centre", "2026-01-15T09:00:00.000Z", "2026-01-17T17:00:00.000Z", 1000, 3000).finally(() => prisma.$disconnect());
createEvent("New Year's Bash", "Ring in the new year with a bang", "Nathan Phillips Square", "2025-12-31T20:00:00.000Z", "2026-01-01T02:00:00.000Z", 800, 2500).finally(() => prisma.$disconnect());
createEvent("Spring Film Festival", "Premieres and indie films", "TIFF Bell Lightbox", "2026-03-10T10:00:00.000Z", "2026-03-15T23:00:00.000Z", 400, 1800).finally(() => prisma.$disconnect());
createEvent("Artisan Market", "Shop local art and crafts", "Distillery District", "2026-02-05T11:00:00.000Z", "2026-02-07T19:00:00.000Z", 200, 800).finally(() => prisma.$disconnect());
createEvent("Charity Run", "5K run to support local charities", "High Park", "2026-04-12T07:00:00.000Z", "2026-04-12T12:00:00.000Z", 1000, 1000).finally(() => prisma.$disconnect());

// 3 promotions
createPromotion("Holiday Discount", "20% off on all items", PromotionType.automatic, "2025-11-26T20:16:00.000Z", "2025-12-26T20:00:00.000Z", 100, 0.20, 0).finally(() => prisma.$disconnect());
createPromotion("Double Points Weekend", "Earn double loyalty points", PromotionType.onetime, "2025-11-26T20:16:00.000Z", "2025-11-30T20:00:00.000Z", 0, 0, 2).finally(() => prisma.$disconnect());
createPromotion("Free Shipping Promo", "Free shipping on orders above $50", PromotionType.automatic, "2025-12-26T20:16:00.000Z", "2025-12-29T20:00:00.000Z", 50, 0, 0).finally(() => prisma.$disconnect());
createPromotion("Black Friday Sale", "30% off on electronics", PromotionType.onetime, "2025-12-22T20:16:00.000Z", "2025-12-29T20:00:00.000Z", 200, 0.30, 0).finally(() => prisma.$disconnect());

