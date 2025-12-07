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
  const numAvatars = 30; // Increased to guarantee avatars for fixed users
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

  // Prepare avatar assignments
  const numFixedUsers = 1 + 3 + 5 + 9; // 18
  const numRandomUsers = 3 + 3 + 15 + 30; // 51
  const numRandomWithAvatars = 20;

  faker.helpers.shuffle(avatarFiles);

  // Guarantee unique avatars for fixed users by taking them from the pool first.
  const fixedUserAvatars = avatarFiles.splice(0, numFixedUsers);

  // Prepare assignments for random users (some with, some without avatars)
  const randomUserAvatarAssignments = [];
  for (let i = 0; i < numRandomWithAvatars; i++) {
    // Use the remaining avatars for the random pool
    randomUserAvatarAssignments.push(faker.helpers.arrayElement(avatarFiles));
  }
  for (let i = 0; i < numRandomUsers - numRandomWithAvatars; i++) {
    randomUserAvatarAssignments.push(null);
  }
  faker.helpers.shuffle(randomUserAvatarAssignments);

  const avatarAssignments = [];
  // The fixed users are created last, so their avatars go at the start of the assignment array.
  // As .pop() is used, the random users will consume the end of the array first.
  avatarAssignments.push(...fixedUserAvatars, ...randomUserAvatarAssignments);

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

  // Create 3 superusers
  for (let i = 0; i < 3; i++) {
    const superuserUtorid = faker.string.alphanumeric(8).toLowerCase();
    usersToCreate.push({
      name: faker.person.fullName(),
      utorid: i === 0 ? 'admin': superuserUtorid,
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
      verified: faker.datatype.boolean(),
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  // -----------------------------------------------------
  // 1.1) Fixed Identifiable Users
  // -----------------------------------------------------
  console.log("Creating fixed users...");
  // 1 superuser
  usersToCreate.push({
    name: 'Super User',
    utorid: 'supuser',
    email: 'supuser@mail.utoronto.ca',
    password: hashedPassword,
    role: "superuser",
    points: 1000, grossPoints: 5000, isEventOrganizer: true, verified: true,
    avatarUrl: avatarAssignments.pop(),
    birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
  });

  // 3 managers
  for (let i = 1; i <= 3; i++) {
    usersToCreate.push({
      name: `Manager User ${i}`,
      utorid: `manager${i}`,
      email: `manager${i}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "manager",
      points: 500, grossPoints: 2000, isEventOrganizer: true, verified: true,
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  // 5 cashiers
  for (let i = 1; i <= 5; i++) {
    usersToCreate.push({
      name: `Cashier User ${i}`,
      utorid: `cashier${i}`,
      email: `cashier${i}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "cashier",
      points: 200, grossPoints: 1000, isEventOrganizer: false, verified: true,
      avatarUrl: avatarAssignments.pop(),
      birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
    });
  }

  // 9 regular users
  for (let i = 1; i <= 9; i++) {
    usersToCreate.push({
      name: `Regular User ${i}`,
      utorid: `reguser${i}`,
      email: `reguser${i}@mail.utoronto.ca`,
      password: hashedPassword,
      role: "regular",
      points: 100, grossPoints: 500, isEventOrganizer: false, verified: true,
      verified: i > 3, // Make first 3 not verified
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

  // Get fixed users for connecting later
  const fixedSupuser = createdUsers.find(u => u.utorid === 'supuser');
  const fixedManagers = createdUsers.filter(u => u.utorid.startsWith('manager'));
  const fixedCashiers = createdUsers.filter(u => u.utorid.startsWith('cashier'));
  const fixedRegulars = createdUsers.filter(u => u.utorid.startsWith('reguser'));
  const fixedOrganizers = createdUsers.filter(u => u.isEventOrganizer && (u.utorid.startsWith('manager') || u.utorid === 'supuser'));

  // -----------------------------------------------------
  // 2) Events
  // -----------------------------------------------------
  const eventsToCreate = [];
  const now = new Date();
  for (let i = 0; i < 32; i++) {
    const startTime = faker.date.between({ from: new Date(new Date().setMonth(now.getMonth() - 6)), to: new Date(new Date().setMonth(now.getMonth() + 6)) });
    const duration = faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000; // 1-14 days
    eventsToCreate.push({
      name: faker.company.buzzPhrase(),
      description: faker.company.catchPhraseDescriptor(),
      location: faker.location.streetAddress(),
      startTime: startTime,
      endTime: new Date(startTime.getTime() + duration),
      capacity: faker.datatype.boolean() ? faker.number.int({ min: 20, max: 200 }) : null,
      points: faker.number.int({ min: 5, max: 50 }),
      pointsRemain: faker.number.int({ min: 5, max: 50 }),
      createdById: faker.helpers.arrayElement(eventOrganizers).id,
      published: faker.datatype.boolean(),
    });
  }

  // Add 7 fixed active events
  console.log("Creating 7 fixed active events...");
  for (let i = 1; i <= 7; i++) {
    const startTime = faker.date.past({ years: 0.1 }); // Active now
    const endTime = faker.date.future({ years: 0.2 });
    eventsToCreate.push({
      name: `Active Event ${i}`,
      description: faker.company.catchPhrase(),
      location: faker.location.streetAddress(),
      startTime: startTime,
      endTime: endTime,
      capacity: faker.number.int({ min: 50, max: 100 }),
      points: faker.number.int({ min: 10, max: 30 }),
      pointsRemain: faker.number.int({ min: 10, max: 30 }),
      createdById: faker.helpers.arrayElement(fixedOrganizers).id,
      published: true,
    });
  }

  // Add 3 fixed inactive events
  console.log("Creating 3 fixed inactive events...");
  for (let i = 1; i <= 3; i++) {
    const endTime = faker.date.past({ years: 0.1 }); // Ended in the past
    const startTime = faker.date.past({ years: 0.2, refDate: endTime });
    eventsToCreate.push({
      name: `Inactive Event ${i}`,
      description: faker.company.catchPhrase(),
      location: faker.location.streetAddress(),
      startTime: startTime,
      endTime: endTime,
      capacity: faker.number.int({ min: 50, max: 100 }),
      points: faker.number.int({ min: 10, max: 30 }),
      pointsRemain: 0,
      createdById: faker.helpers.arrayElement(fixedOrganizers).id,
      published: true, // It was published, but now it's over
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
      name: `${faker.commerce.productAdjective()} ${faker.commerce.product()} Promo`,
      description: faker.commerce.productDescription(),
      type: type,
      points: type === "automatic" ? faker.number.int({ min: 10, max: 100 }) : null,
      rate: type === "onetime" ? faker.number.float({ min: 0.05, max: 0.5, precision: 0.01 }) : null,
      minSpending: type === "onetime" ? faker.number.int({ min: 10, max: 50 }) : null,
      startTime: startTime,
      endTime: new Date(startTime.getTime() + faker.number.int({ min: 7, max: 90 }) * 24 * 60 * 60 * 1000),
      createdById: faker.helpers.arrayElement([...managers, ...superusers]).id,
    });
  }

  // Add 7 fixed active promotions
  console.log("Creating 7 fixed active promotions...");
  for (let i = 1; i <= 7; i++) {
    const type = faker.helpers.arrayElement(["automatic", "onetime"]);
    const startTime = faker.date.past({ years: 0.1 });
    const endTime = faker.date.future({ years: 0.2 });
    promotionsToCreate.push({
      name: `Active Promotion ${i}`,
      description: faker.commerce.productDescription(),
      type: type,
      points: type === "automatic" ? faker.number.int({ min: 10, max: 100 }) : null,
      rate: type === "onetime" ? faker.number.float({ min: 0.05, max: 0.5, precision: 0.01 }) : null,
      minSpending: type === "onetime" ? faker.number.int({ min: 10, max: 50 }) : null,
      startTime: startTime,
      endTime: endTime,
      createdById: faker.helpers.arrayElement([...fixedManagers, fixedSupuser]).id,
    });
  }

  // Add 3 fixed inactive promotions
  console.log("Creating 3 fixed inactive promotions...");
  for (let i = 1; i <= 3; i++) {
    const type = faker.helpers.arrayElement(["automatic", "onetime"]);
    const endTime = faker.date.past({ years: 0.1 });
    const startTime = faker.date.past({ years: 0.2, refDate: endTime });
    promotionsToCreate.push({
      name: `Inactive Promotion ${i}`,
      description: faker.commerce.productDescription(),
      type: type,
      points: type === "automatic" ? faker.number.int({ min: 10, max: 100 }) : null,
      rate: type === "onetime" ? faker.number.float({ min: 0.05, max: 0.5, precision: 0.01 }) : null,
      minSpending: type === "onetime" ? faker.number.int({ min: 10, max: 50 }) : null,
      startTime: startTime,
      endTime: endTime,
      createdById: faker.helpers.arrayElement([...fixedManagers, fixedSupuser]).id,
    });
  }

  // Create 10 promotions starting on Dec 1, 2025
  const decFirst2025 = new Date("2025-12-01T00:00:00.000Z");
  for (let i = 0; i < 10; i++) {
    const type = faker.helpers.arrayElement(["automatic", "onetime"]);
    promotionsToCreate.push({
      name: "December Special " + (i + 1),
      description: `A special deal for the month of December!`,
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

  // Get fixed active events and promotions
  const fixedActiveEvents = await prisma.event.findMany({ where: { name: { startsWith: 'Active Event' } } });
  const fixedActivePromotions = await prisma.promotion.findMany({ where: { name: { startsWith: 'Active Promotion' } } });
  const fixedInactiveEvents = await prisma.event.findMany({ where: { name: { startsWith: 'Inactive Event' } } });

  // -----------------------------------------------------
  // 4) Transactions
  // -----------------------------------------------------
  let transactionCount = 0;
  const purchaseTransactions = [];
  const usedOnetimePromosByUser = new Map(); // Keep track of used onetime promos to avoid re-using them for a user

  // Purchase transactions (50)
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    const spent = faker.number.int({ min: 50, max: 100 });
    const processor = faker.helpers.arrayElement([...cashiers, ...managers]);
    const transactionDate = faker.date.past({ years: 1 });

    let promosToUse = [];
    // Every other transaction will try to use promos
    if (i % 2 === 0) {
      const userUsedOnetimePromoIds = usedOnetimePromosByUser.get(user.id) || new Set();
      // Find promos that were active at the time of transaction
      const eligiblePromos = createdPromotions.filter(p =>
        p.type === 'onetime' &&
        p.minSpending <= spent &&
        new Date(p.startTime) <= transactionDate &&
        new Date(p.endTime) >= transactionDate &&
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
      createdAt: transactionDate,
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
    const pastEvents = createdEvents.filter(e => new Date(e.endTime) < new Date() && !e.name.startsWith('Inactive Event'));
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
        createdAt: faker.date.between({ from: new Date(event.startTime), to: new Date(event.endTime) }),
      }
    });
    transactionCount++;
  }
  console.log(`Created 20 event transactions.`);

  // Redemption transactions (35)
  for (let i = 0; i < 35; i++) {
    const user = faker.helpers.arrayElement(createdUsers.filter(u => u.points > 50));
    if (!user) continue;

    const transactionDate = faker.date.past({ years: 1 });

    const availableAutomaticPromos = createdPromotions.filter(p =>
      p.type === 'automatic' &&
      p.points &&
      new Date(p.startTime) <= transactionDate &&
      new Date(p.endTime) >= transactionDate
    );
    if (availableAutomaticPromos.length === 0) continue;

    // Use 1 to 2 automatic promotions
    const numPromosToRedeem = faker.number.int({ min: 1, max: Math.min(2, availableAutomaticPromos.length) });
    const promosToRedeem = faker.helpers.arrayElements(availableAutomaticPromos, numPromosToRedeem);
    
    const totalPointsToRedeem = promosToRedeem.reduce((sum, p) => sum + p.points, 0);
    if (user.points < totalPointsToRedeem) continue;

    const shouldBeProcessed = faker.datatype.boolean();
    const processor = faker.helpers.arrayElement([...cashiers, ...managers]);

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
      createdAt: transactionDate,
    };

    // Delete 7 redemptions at different times
    if (i % 5 === 0) {
      redemptionData.deletedAt = faker.date.between({ from: transactionDate, to: new Date() });
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
  const usersToFlagAsSuspicious = new Set();
  if (suspiciousUsers.length > 0) {
      // 3 suspicious transfer pairs
      for (let i = 0; i < 3; i++) {
          const sender = faker.helpers.arrayElement(suspiciousUsers);
          let recipient = faker.helpers.arrayElement(regularUsers);
          while (recipient.id === sender.id) { recipient = faker.helpers.arrayElement(regularUsers); }
          const amount = faker.number.int({ min: 500, max: 1500 });
          const transferDate = faker.date.past({ years: 1 });

          usersToFlagAsSuspicious.add(recipient.id);

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

  if (usersToFlagAsSuspicious.size > 0) {
    await prisma.user.updateMany({
      where: { id: { in: [...usersToFlagAsSuspicious] } },
      data: { suspicious: true },
    });
    console.log(`Flagged ${usersToFlagAsSuspicious.size} recipient users as suspicious.`);
  }

  console.log(`Created ${transactionCount} transactions.`);

  // -----------------------------------------------------
  // 4.1) Fixed Transactions
  // -----------------------------------------------------
  console.log("Creating fixed transactions...");
  let fixedTransactionCount = 0;

  // 10 Purchase
  for (let i = 1; i <= 10; i++) {
    await prisma.transaction.create({
      data: {
        type: "purchase",
        userId: faker.helpers.arrayElement(fixedCashiers).id,
        targetUserId: faker.helpers.arrayElement(fixedRegulars).id,
        amount: faker.number.int({ min: 5, max: 20 }),
        spent: faker.number.int({ min: 50, max: 200 }),
        remark: `Purchase ${i}: ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
        processed: true,
        processedById: faker.helpers.arrayElement(fixedCashiers).id,
        createdAt: faker.date.past({ years: 1 }),
      }
    });
    fixedTransactionCount++;
  }
  console.log("Created 10 fixed purchase transactions.");

  // 10 Adjustment
  for (let i = 1; i <= 10; i++) {
    await prisma.transaction.create({
      data: {
        type: "adjustment",
        userId: faker.helpers.arrayElement(fixedManagers).id,
        targetUserId: faker.helpers.arrayElement(fixedRegulars).id,
        amount: faker.number.int({ min: -15, max: 15 }),
        spent: 0,
        remark: `Adjustment ${i}: Correcting ${faker.hacker.noun()}`,
        processed: true,
        processedById: faker.helpers.arrayElement(fixedManagers).id,
        createdAt: faker.date.past({ years: 1 }),
      }
    });
    fixedTransactionCount++;
  }
  console.log("Created 10 fixed adjustment transactions.");

  // 10 Event
  for (let i = 1; i <= 10; i++) {
    const event = faker.helpers.arrayElement(fixedInactiveEvents);
    await prisma.transaction.create({
      data: {
        type: "event",
        userId: faker.helpers.arrayElement(fixedOrganizers).id,
        targetUserId: faker.helpers.arrayElement(fixedRegulars).id,
        amount: event.points,
        spent: 0,
        remark: `Event ${i}: Attended ${event.name}`,
        eventInvolvedId: event.id,
        createdAt: faker.date.between({ from: new Date(event.startTime), to: new Date(event.endTime) }),
      }
    });
    fixedTransactionCount++;
  }
  console.log("Created 10 fixed event transactions.");

  // 10 Redemption
  for (let i = 1; i <= 10; i++) {
    const automaticPromos = fixedActivePromotions.filter(p => p.type === 'automatic');
    if (automaticPromos.length > 0) {
      const promo = faker.helpers.arrayElement(automaticPromos);
      const promoStart = new Date(promo.startTime);
      const promoEnd = new Date(promo.endTime);
      const validEnd = promoEnd > new Date() ? new Date() : promoEnd;
      const transactionDate = faker.date.between({ from: promoStart, to: validEnd });
      await prisma.transaction.create({
        data: {
          type: "redemption",
          userId: faker.helpers.arrayElement(fixedRegulars).id,
          amount: -promo.points,
          spent: promo.points,
          remark: `Redemption ${i}: Redeemed ${promo.name}`,
          promotions: { connect: { id: promo.id } },
          processed: faker.datatype.boolean(),
          createdAt: transactionDate,
        }
      });
      fixedTransactionCount++;
    }
  }
  console.log("Created 10 fixed redemption transactions.");

  // 10 Transfer (pairs)
  for (let i = 1; i <= 10; i++) {
    const sender = faker.helpers.arrayElement(fixedRegulars);
    let recipient = faker.helpers.arrayElement(fixedRegulars);
    while (recipient.id === sender.id) { recipient = faker.helpers.arrayElement(fixedRegulars); }
    const amount = faker.number.int({ min: 5, max: 25 });
    const transferDate = faker.date.past({ years: 1 });

    await prisma.transaction.create({ data: { type: "transfer", userId: sender.id, targetUserId: recipient.id, amount: -amount, spent: 0, remark: `Transfer ${i}: Gift to ${recipient.utorid}`, createdAt: transferDate } });
    await prisma.transaction.create({ data: { type: "transfer", userId: recipient.id, targetUserId: sender.id, amount: amount, spent: 0, remark: `Transfer ${i}: Received from ${sender.utorid}`, createdAt: transferDate } });
    fixedTransactionCount += 2;
  }
  console.log("Created 10 fixed transfer transaction pairs.");

  // -----------------------------------------------------
  // 5) RSVPs
  // -----------------------------------------------------
  console.log("Creating RSVPs...");
  const rsvpsToCreate = [];

  // Add fixed RSVPs
  for (const user of fixedRegulars) {
    const event = faker.helpers.arrayElement(fixedActiveEvents);
    rsvpsToCreate.push({
      userId: user.id,
      eventId: event.id,
      status: faker.helpers.arrayElement(["confirmed", "declined"]),
    });
  }

  // Add random RSVPs
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(regularUsers);
    const event = faker.helpers.arrayElement(createdEvents.filter(e => e.published));
    rsvpsToCreate.push({
      userId: user.id,
      eventId: event.id,
      status: faker.helpers.arrayElement(["confirmed", "declined"]),
    });
  }

  // De-duplicate the list of RSVPs before creation
  const uniqueRsvps = [...new Map(rsvpsToCreate.map(item => [`${item.userId}-${item.eventId}`, item])).values()];

  await prisma.rsvp.createMany({ data: uniqueRsvps });
  console.log(`Created ${uniqueRsvps.length} RSVPs.`);

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