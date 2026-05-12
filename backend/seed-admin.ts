import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123123', 10);
  
  const user = await prisma.user.upsert({
    where: { phone: '9787278026' },
    update: {
      name: 'Kavin',
      email: 'kavin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Kavin',
      phone: '9787278026',
      email: 'kavin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated successfully:', user.phone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
