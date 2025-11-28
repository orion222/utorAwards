"use strict";

const { prisma, RoleType } = require("../prisma/prisma");
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


// 1 super user
const dumb_pw = "Hello.123"
createUser("Sofia Nguyen", "snguyen", "sofia.nguyen@mail.utoronto.ca", dumb_pw, RoleType.superuser).finally(() => prisma.$disconnect());

// 2 managers
createUser("Ethan Rodriguez", "erodrigu", "ethan.rod@mail.utoronto.ca", dumb_pw, RoleType.manager).finally(() => prisma.$disconnect());
createUser("Liam Patel", "lpatel34", "liam.patel@mail.utoronto.ca", dumb_pw, RoleType.manager).finally(() => prisma.$disconnect());

// 3 cashiers
createUser("Maya Thompson", "mthompso", "maya.thompson@mail.utoronto.ca", dumb_pw, RoleType.cashier).finally(() => prisma.$disconnect());
createUser("Noah Kim", "nkim3154", "noah.kim@mail.utoronto.ca", dumb_pw, RoleType.cashier).finally(() => prisma.$disconnect());
createUser("Olivia Johnson", "ojohnson", "olivia.johnson@mail.utoronto.ca", dumb_pw, RoleType.cashier).finally(() => prisma.$disconnect());

// 9 regular users
createUser("Lucas Carter", "lcarter3", "lucas.carter@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Ava Chen", "achen568", "ava.chen@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Isabella Singh", "isingh21", "isabella.singh@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Benjamin Wright", "bwright7", "ben.wright@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Elijah Brooks", "ebrooks9", "elijah.brooks@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Harper Garcia", "hgarcia5", "harper.garcia@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Amelia Davis", "adavis56", "amelia.davis@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Mateo Wilson", "mwilson3", "mateo.wilson@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());
createUser("Chloe Brown", "cbrown23", "chloe.brown@mail.utoronto.ca", dumb_pw, RoleType.regular).finally(() => prisma.$disconnect());