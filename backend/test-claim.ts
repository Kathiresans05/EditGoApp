import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const orderId = '6a0dd841b26e1b4d53afe3d9';
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        editorId: null,
        status: 'SEARCHING',
        progress: 0,
        privacyAgreementSigned: false
      }
    });
    console.log('Reset Order:', updated);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
