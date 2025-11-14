/*
 * Complete this script so that it is able to add a superuser to the database
 * Usage example: 
 *   node prisma/createsu.js clive123 clive.su@mail.utoronto.ca SuperUser123!
 */
'use strict';

const [utorid, email, password] = process.argv.slice(2);
const { prisma, RoleType } = require('../prisma/prisma')
const bcrypt = require('bcrypt');

if (!utorid || !email || !password) {
    console.error('Error: Missing required arguments.');
    console.error('Usage: node prisma/createsu.js <utorid> <email> <password>');
    process.exit(1);
}

async function createSuperUser() {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name: utorid,
            email: email,
            password: hashedPassword,
            role: RoleType.superuser,
            utorid: utorid,
            verified: true,
        }
    });
}

createSuperUser().finally(() => prisma.$disconnect());