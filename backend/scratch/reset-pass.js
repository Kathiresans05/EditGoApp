const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  const phone = '9787278026';
  const newPassword = '123'; // Simpler password for testing
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { phone },
    data: { password: hashedPassword }
  });

  console.log('Password reset successfully to: 123');
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
