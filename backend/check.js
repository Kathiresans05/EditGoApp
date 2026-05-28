const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.portfolioItem.findMany().then(res => {
  console.log(JSON.stringify(res, null, 2));
  return prisma.$disconnect();
}).catch(console.error);
