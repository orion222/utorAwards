const { PrismaClient, RoleType, TransactionType, PromotionType } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = { prisma, RoleType, TransactionType, PromotionType };