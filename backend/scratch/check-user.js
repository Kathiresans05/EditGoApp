const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { phone: '9787278026' }
    });
    if (user) {
      console.log('User found:', user.name, user.role);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
