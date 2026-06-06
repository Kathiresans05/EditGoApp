const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const order = await prisma.order.findUnique({
    where: { id: '6a22503a88a844ea27106556' }
  });
  console.log(order?.title);
}
main().catch(console.error).finally(() => prisma.$disconnect());
