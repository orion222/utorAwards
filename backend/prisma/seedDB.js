import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        res.resume(); // Consume response data to free up memory
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode} for ${url}`));
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
};

async function main() {
  console.log("Start seeding ...");

  // -----------------------------------------------------
  // 0) Prepare Avatars
  // -----------------------------------------------------
  console.log("Preparing avatars...");
  const avatarsDir = path.join(__dirname, '..', 'uploads', 'avatars');
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log("Created avatars directory.");
  } else {
    // Clean up old seeded avatars
    console.log("Cleaning up old seeded avatars...");
    const files = fs.readdirSync(avatarsDir);
    let deletedCount = 0;
    for (const file of files) {
      if (file.startsWith('avatar-')) {
        try {
          fs.unlinkSync(path.join(avatarsDir, file));
          deletedCount++;
        } catch (err) {
          console.error(`Failed to delete old avatar ${file}:`, err);
        }
      }
    }
    console.log(`Deleted ${deletedCount} old seeded avatars.`);
  }

  const avatarFiles = [];
  const numAvatars = 10;
  console.log(`Downloading ${numAvatars} avatars...`);
  for (let i = 0; i < numAvatars; i++) {
    const avatarUrl = faker.image.avatar();
    const filename = `avatar-${Date.now()}-${i}.jpg`;
    const filepath = path.join(avatarsDir, filename);
    try {
      await downloadImage(avatarUrl, filepath);
      avatarFiles.push(`uploads/avatars/${filename}`);
    } catch (error) {
      console.error(`Failed to download avatar from ${avatarUrl}:`, error.message);
    }
  }
  console.log(`Downloaded ${avatarFiles.length} avatars.`);
  if (avatarFiles.length === 0) {
    console.error("No avatars were downloaded. Cannot proceed with user seeding that requires avatars.");
    process.exit(1);
  }

  // Prepare avatar assignments: 20 users with avatars, 30 without
  const avatarAssignments = [];
  if (avatarFiles.length > 0) {
    for (let i = 0; i < 20; i++) {
      avatarAssignments.push(faker.helpers.arrayElement(avatarFiles));
    }
  }
  for (let i = 0; i < 30; i++) {
    avatarAssignments.push(null);
  }
  faker.helpers.shuffle(avatarAssignments);

  // -----------------------------------------------------
  // Clean up existing data to prevent conflicts
  // -----------------------------------------------------
  console.log("Cleaning up database...");
  await prisma.transaction.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleaned.");

  // -----------------------------------------------------
  // 1) Users
  // -----------------------------------------------------
  const hashedPassword = await bcrypt.hash("Password@123", 10);
  const usersToCreate = [];

  // Create 2 superusers
  for (let i = 0; i < 2; i++) {
    const superuserUtorid = faker.string.alphanumeric(8).toLowerCase();
    usersToCreate.push({
      name: faker.person.fullName(),
      utorid: superuserUtorid,
      email: `${superuserUtorid}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "superuser",
      points: faker.number.int({ min: 100, max: 1000 }),
      grossPoints: faker.number.int({ min: 1000, max: 5000 }),
      isEventOrganizer: true,
      hideUtorid: faker.datatype.boolean(),
      verified: true,
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  // Create 3 managers
  for (let i = 0; i < 3; i++) {
    const managerUtorid = faker.string.alphanumeric(8).toLowerCase();
    usersToCreate.push({
      name: faker.person.fullName(),
      utorid: managerUtorid,
      email: `${managerUtorid}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "manager",
      points: faker.number.int({ min: 50, max: 500 }),
      grossPoints: faker.number.int({ min: 500, max: 2000 }),
      isEventOrganizer: true,
      hideUtorid: false,
      verified: true,
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  // Create 15 cashiers
  for (let i = 0; i < 15; i++) {
    const cashierUtorid = faker.string.alphanumeric(8).toLowerCase();
    usersToCreate.push({
      name: faker.person.fullName(),
      utorid: cashierUtorid,
      email: `${cashierUtorid}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "cashier",
      points: faker.number.int({ min: 20, max: 200 }),
      grossPoints: faker.number.int({ min: 200, max: 1000 }),
      isEventOrganizer: false,
      hideUtorid: faker.datatype.boolean(),
      suspicious: i < 7, // ~half are suspicious
      verified: true,
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  // Create 30 regular users
  for (let i = 0; i < 30; i++) {
    const regularUserUtorid = faker.string.alphanumeric(8).toLowerCase();
    usersToCreate.push({
      name: faker.person.fullName(),
      utorid: regularUserUtorid,
      email: `${regularUserUtorid}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "regular",
      points: faker.number.int({ min: 0, max: 300 }),
      grossPoints: faker.number.int({ min: 0, max: 1000 }),
      isEventOrganizer: faker.datatype.boolean(0.2), // 20% chance
      hideUtorid: faker.datatype.boolean(),
      suspicious: i < 3, // ~10% are suspicious
      verified: true,
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  await prisma.user.createMany({
    data: usersToCreate,
  });
  const createdUsers = await prisma.user.findMany();
  console.log(`Created ${createdUsers.length} users.`);

  const superusers = createdUsers.filter(u => u.role === 'superuser');
  const managers = createdUsers.filter(u => u.role === 'manager');
  const cashiers = createdUsers.filter(u => u.role === 'cashier');
  const regularUsers = createdUsers.filter(u => u.role === 'regular');
  const eventOrganizers = createdUsers.filter(u => u.isEventOrganizer);

  // -----------------------------------------------------
  // 2) Events
  // -----------------------------------------------------
  const eventsToCreate = [];
  const now = new Date();
  for (let i = 0; i < 32; i++) {
    const startTime = faker.date.between({ from: new Date(new Date().setMonth(now.getMonth() - 6)), to: new Date(new Date().setMonth(now.getMonth() + 6)) });
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    eventsToCreate.push({
      name: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      location: faker.location.streetAddress(),
      startTime: startTime,
      endTime: new Date(startTime.getTime() + weekInMs + faker.number.int({ max: weekInMs })), // 1-2 weeks duration
      capacity: faker.datatype.boolean() ? faker.number.int({ min: 20, max: 200 }) : null,
      points: faker.number.int({ min: 5, max: 50 }),
      pointsRemain: faker.number.int({ min: 5, max: 50 }),
      createdById: faker.helpers.arrayElement(eventOrganizers).id,
      published: faker.datatype.boolean(),
    });
  }
  await prisma.event.createMany({ data: eventsToCreate });
  const createdEvents = await prisma.event.findMany();
  console.log(`Created ${createdEvents.length} events.`);

  // Connect organizers to events
  // and make some events active
  console.log("Connecting organizers to events...");
  for (let i = 0; i < createdEvents.length; i++) {
    const event = createdEvents[i];
    const creator = eventOrganizers.find(u => u.id === event.createdById);
    const organizersToConnect = creator ? [creator] : [];

    // Add 1-2 more random organizers
    const otherOrganizers = eventOrganizers.filter(u => u.id !== event.createdById);
    if (otherOrganizers.length > 0) {
      const numExtra = faker.number.int({ min: 0, max: Math.min(2, otherOrganizers.length) });
      if (numExtra > 0) {
        organizersToConnect.push(...faker.helpers.arrayElements(otherOrganizers, numExtra));
      }
    }

    await prisma.event.update({
      where: { id: event.id },
      data: {
        organizers: {
          connect: [...new Set(organizersToConnect.map(o => o.id))].map(id => ({ id })),
        },
      },
    });
  }
  console.log("Organizers connected to events.");

  // -----------------------------------------------------
  // 3) Promotions
  // -----------------------------------------------------
  const promotionsToCreate = [];
  for (let i = 0; i < 20; i++) {
    const type = faker.helpers.arrayElement(["automatic", "onetime"]);
    // Create promotions spanning from 1 year ago to 1 year in the future
    const startTime = faker.date.between({ from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
    promotionsToCreate.push({
      name: faker.commerce.productName() + " Promo",
      description: faker.lorem.sentence(),
      type: type,
      points: type === "automatic" ? faker.number.int({ min: 10, max: 100 }) : null,
      rate: type === "onetime" ? faker.number.float({ min: 0.05, max: 0.5, precision: 0.01 }) : null,
      minSpending: type === "onetime" ? faker.number.int({ min: 10, max: 50 }) : null,
      startTime: startTime,
      endTime: new Date(startTime.getTime() + faker.number.int({ min: 7, max: 90 }) * 24 * 60 * 60 * 1000),
      createdById: faker.helpers.arrayElement([...managers, ...superusers]).id,
    });
  }

  // Create 10 promotions starting on Dec 1, 2025
  const decFirst2025 = new Date("2025-12-01T00:00:00.000Z");
  for (let i = 0; i < 10; i++) {
    const type = faker.helpers.arrayElement(["automatic", "onetime"]);
    promotionsToCreate.push({
      name: "December Special " + (i + 1),
      description: faker.lorem.sentence(),
      type: type,
      points: type === "automatic" ? faker.number.int({ min: 20, max: 150 }) : null,
      rate: type === "onetime" ? faker.number.float({ min: 0.1, max: 0.4, precision: 0.01 }) : null,
      minSpending: type === "onetime" ? faker.number.int({ min: 20, max: 60 }) : null,
      startTime: decFirst2025,
      endTime: new Date(decFirst2025.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days duration
      createdById: faker.helpers.arrayElement([...managers, ...superusers]).id,
    });
  }
  await prisma.promotion.createMany({ data: promotionsToCreate });
  const createdPromotions = await prisma.promotion.findMany();
  console.log(`Created ${createdPromotions.length} promotions.`);

  // -----------------------------------------------------
  // 4) Transactions
  // -----------------------------------------------------
  let transactionCount = 0;
  const purchaseTransactions = [];
  const usedOnetimePromosByUser = new Map(); // Keep track of used onetime promos to avoid re-using them for a user

  // Purchase transactions (50)
  const activePromos = createdPromotions.filter(p => new Date(p.startTime) < new Date() && new Date(p.endTime) > new Date());
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    const spent = faker.number.int({ min: 50, max: 100 });
    const processor = faker.helpers.arrayElement([...cashiers, ...managers]);

    let promosToUse = [];
    // Every other transaction will try to use promos
    if (i % 2 === 0 && activePromos.length > 0) {
      const userUsedOnetimePromoIds = usedOnetimePromosByUser.get(user.id) || new Set();
      const eligiblePromos = activePromos.filter(p =>
        p.type === 'onetime' &&
        p.minSpending <= spent &&
        !userUsedOnetimePromoIds.has(p.id)
      );

      if (eligiblePromos.length > 0) {
        const numPromos = faker.number.int({ min: 1, max: Math.min(2, eligiblePromos.length) });
        promosToUse = faker.helpers.arrayElements(eligiblePromos, numPromos);
      }
    }

    const purchaseData = {
      type: "purchase",
      userId: processor.id,
      targetUserId: user.id,
      amount: Math.floor(spent / 10),
      spent: spent,
      remark: `Purchase of ${faker.commerce.product()}`,
      processed: true,
      processedById: processor.id,
      createdAt: faker.date.past({ years: 1 }),
    };

    if (promosToUse.length > 0) {
      purchaseData.promotions = { connect: promosToUse.map(p => ({ id: p.id })) };
      const promoAmount = promosToUse.reduce((total, p) => total + Math.floor(spent * p.rate), 0);
      purchaseData.amount += promoAmount;
      purchaseData.remark += ` with promos: ${promosToUse.map(p => p.name).join(', ')}`;
    }

    const newPurchase = await prisma.transaction.create({
      data: purchaseData,
      select: { id: true, createdAt: true, targetUserId: true },
    });

    // Record that the user has used these onetime promotions
    if (promosToUse.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { promotions: { connect: promosToUse.map(p => ({ id: p.id })) } }
      });
      const userUsedOnetimePromoIds = usedOnetimePromosByUser.get(user.id) || new Set();
      promosToUse.forEach(p => userUsedOnetimePromoIds.add(p.id));
      usedOnetimePromosByUser.set(user.id, userUsedOnetimePromoIds);
    }
    purchaseTransactions.push(newPurchase);
    transactionCount++;
  }
  console.log(`Created ${purchaseTransactions.length} purchase transactions.`);

  // Adjustment transactions (10)
  for (let i = 0; i < 10; i++) {
    if (purchaseTransactions.length === 0) break;
    const transactionToAdjust = faker.helpers.arrayElement(purchaseTransactions);
    const manager = faker.helpers.arrayElement(managers);
    await prisma.transaction.create({
      data: {
        type: "adjustment",
        userId: manager.id,
        targetUserId: transactionToAdjust.targetUserId,
        amount: faker.number.int({ min: -20, max: 20 }),
        spent: 0,
        remark: `Adjustment for transaction #${transactionToAdjust.id}`,
        processed: true,
        processedById: manager.id,
        relatedId: transactionToAdjust.id,
        createdAt: faker.date.between({ from: transactionToAdjust.createdAt, to: new Date() }),
      }
    });
    transactionCount++;
  }
  console.log(`Created 10 adjustment transactions.`);

  // Event transactions (20)
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    // Only award points for events that have ended
    const pastEvents = createdEvents.filter(e => new Date(e.endTime) < new Date());
    if (pastEvents.length === 0) continue;
    const event = faker.helpers.arrayElement(pastEvents);
    const organizer = faker.helpers.arrayElement(eventOrganizers);
    await prisma.transaction.create({
      data: {
        type: "event",
        userId: organizer.id,
        targetUserId: user.id,
        amount: event.points,
        spent: 0,
        remark: `Attended ${event.name}`,
        relatedId: event.id,
        eventInvolvedId: event.id,
        createdAt: faker.date.between({ from: new Date(event.endTime), to: new Date() }),
      }
    });
    transactionCount++;
  }
  console.log(`Created 20 event transactions.`);

  // Redemption transactions (35)
  for (let i = 0; i < 35; i++) {
    const user = faker.helpers.arrayElement(createdUsers.filter(u => u.points > 50));
    if (!user) continue;

    const availableAutomaticPromos = createdPromotions.filter(p => p.type === 'automatic' && p.points);
    if (availableAutomaticPromos.length === 0) continue;

    // Use 1 to 2 automatic promotions
    const numPromosToRedeem = faker.number.int({ min: 1, max: Math.min(2, availableAutomaticPromos.length) });
    const promosToRedeem = faker.helpers.arrayElements(availableAutomaticPromos, numPromosToRedeem);
    
    const totalPointsToRedeem = promosToRedeem.reduce((sum, p) => sum + p.points, 0);
    if (user.points < totalPointsToRedeem) continue;

    const shouldBeProcessed = faker.datatype.boolean();
    const processor = faker.helpers.arrayElement([...cashiers, ...managers]);

    const createdAt = faker.date.past({ years: 1 });
    const redemptionData = {
      type: "redemption",
      userId: user.id,
      targetUserId: user.id,
      amount: -totalPointsToRedeem,
      spent: totalPointsToRedeem,
      remark: `Redeemed: ${promosToRedeem.map(p => p.name).join(', ')}`,
      promotions: { connect: promosToRedeem.map(p => ({ id: p.id })) },
      processed: shouldBeProcessed,
      processedById: shouldBeProcessed ? processor.id : null,
      createdAt: createdAt,
    };

    // Delete 7 redemptions at different times
    if (i % 5 === 0) {
      redemptionData.deletedAt = faker.date.between({ from: createdAt, to: new Date() });
    }
    const newRedemption = await prisma.transaction.create({ data: redemptionData });

    // Record that the user has used these promotions
    if (promosToRedeem.length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { promotions: { connect: promosToRedeem.map(p => ({ id: p.id })) } }
      });
    }
    transactionCount++;
  }
  console.log(`Created 35 redemption transactions.`);

  // Transfer transactions (15 pairs)
  for (let i = 0; i < 15; i++) {
    const sender = faker.helpers.arrayElement(createdUsers.filter(u => u.points > 50 && u.verified));
    if (!sender) continue;
    let recipient = faker.helpers.arrayElement(createdUsers);
    while (recipient.id === sender.id) { recipient = faker.helpers.arrayElement(createdUsers); }
    const amount = faker.number.int({ min: 5, max: 50 });
    if (sender.points < amount) continue;

    const transferDate = faker.date.past({ years: 1 });
    await prisma.transaction.create({
      data: { type: "transfer", userId: sender.id, targetUserId: recipient.id, amount: -amount, spent: 0, remark: `Gift points to ${recipient.utorid}`, relatedId: recipient.id, createdAt: transferDate }
    });
    await prisma.transaction.create({
      data: { type: "transfer", userId: recipient.id, targetUserId: sender.id, amount: amount, spent: 0, remark: `Received points from ${sender.utorid}`, relatedId: sender.id, createdAt: transferDate }
    });
    transactionCount += 2;
  }
  console.log(`Created 30 transfer transactions (15 pairs).`);

  // Suspicious transactions
  const suspiciousUsers = createdUsers.filter(u => u.suspicious);
  if (suspiciousUsers.length > 0) {
      // 3 suspicious transfer pairs
      for (let i = 0; i < 3; i++) {
          const sender = faker.helpers.arrayElement(suspiciousUsers);
          let recipient = faker.helpers.arrayElement(regularUsers);
          while (recipient.id === sender.id) { recipient = faker.helpers.arrayElement(regularUsers); }
          const amount = faker.number.int({ min: 500, max: 1500 });
          const transferDate = faker.date.past({ years: 1 });

          await prisma.transaction.create({ data: { type: "transfer", userId: sender.id, targetUserId: recipient.id, amount: -amount, spent: 0, remark: "Large suspicious transfer", suspicious: true, relatedId: recipient.id, createdAt: transferDate } });
          await prisma.transaction.create({ data: { type: "transfer", userId: recipient.id, targetUserId: sender.id, amount: amount, spent: 0, remark: `Received large suspicious transfer from ${sender.utorid}`, suspicious: true, relatedId: sender.id, createdAt: transferDate } });
          transactionCount += 2;
      }

      // 2 suspicious adjustments
      for (let i = 0; i < 2; i++) {
          const userToAdjust = faker.helpers.arrayElement(suspiciousUsers);
          const manager = faker.helpers.arrayElement(managers);
          await prisma.transaction.create({
              data: { type: "adjustment", userId: manager.id, targetUserId: userToAdjust.id, amount: faker.number.int({ min: 200, max: 500 }), spent: 0, remark: "Suspicious manual point adjustment", suspicious: true, processed: true, processedById: manager.id, createdAt: faker.date.past({ years: 1 }) }
          });
          transactionCount++;
      }
      console.log(`Created more suspicious transactions.`);
  }
  console.log(`Created ${transactionCount} transactions.`);

  // -----------------------------------------------------
  // 5) RSVPs
  // -----------------------------------------------------
  const rsvpsToCreate = [];
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(regularUsers);
    const event = faker.helpers.arrayElement(createdEvents.filter(e => e.published));
    if (event && !rsvpsToCreate.some(r => r.userId === user.id && r.eventId === event.id)) {
      rsvpsToCreate.push({
        userId: user.id,
        eventId: event.id,
        status: faker.helpers.arrayElement(["confirmed", "pending", "declined"]),
      });
    }
  }
  await prisma.rsvp.createMany({ data: rsvpsToCreate });
  console.log(`Created ${rsvpsToCreate.length} RSVPs.`);

  // Update event stats based on RSVPs
  console.log("Updating event stats (numGuests, pointsAwarded)...");
  const allEventsForStats = await prisma.event.findMany({ include: { rsvps: true } });
  for (const event of allEventsForStats) {
      const confirmedGuests = event.rsvps.filter(r => r.status === 'confirmed').length;
      const guestsAwardedPoints = faker.number.int({ min: 0, max: confirmedGuests });
      const pointsAwarded = guestsAwardedPoints * event.points;

      await prisma.event.update({
          where: { id: event.id },
          data: {
              numGuests: confirmedGuests,
              pointsAwarded: pointsAwarded,
          }
      });
  }
  console.log("Event stats updated.");

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });