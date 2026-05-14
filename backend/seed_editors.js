const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  // First, make Kathiresan live
  const kathi = await prisma.user.findFirst({ where: { name: 'kathiresan' } });
  if (kathi) {
    await prisma.editor.update({
      where: { userId: kathi.id },
      data: { 
        isOnline: true, 
        rating: 4.5, 
        skills: ['Cinematic Expert'],
        responseSpeed: '15 mins',
        totalOrders: 12
      }
    });
    console.log('Kathiresan is now LIVE!');
  }

  const proEditors = [
    { name: 'Arjun Cinematic', phone: '9876543210', level: 'MASTER', rating: 4.9, skill: 'Cinematic Expert' },
    { name: 'Sana Viral', phone: '9876543211', level: 'PRO', rating: 4.8, skill: 'Reels Specialist' },
    { name: 'Leo Gaming', phone: '9876543212', level: 'ELITE', rating: 5.0, skill: 'Gaming Edits' }
  ];

  console.log('Seeding pro editors...');

  for (const ed of proEditors) {
    try {
      const user = await prisma.user.upsert({
        where: { phone: ed.phone },
        update: { name: ed.name },
        create: {
          phone: ed.phone,
          name: ed.name,
          role: 'EDITOR',
          password: 'password123',
          referralCode: 'REF-' + Math.random().toString(36).substring(7).toUpperCase() // Ensure unique referral code
        }
      });

      await prisma.editor.upsert({
        where: { userId: user.id },
        update: {
          level: ed.level,
          rating: ed.rating,
          skills: [ed.skill],
          isOnline: true,
          totalOrders: Math.floor(Math.random() * 50) + 20,
          responseSpeed: '30 mins'
        },
        create: {
          userId: user.id,
          level: ed.level,
          rating: ed.rating,
          skills: [ed.skill],
          isOnline: true,
          totalOrders: Math.floor(Math.random() * 50) + 20,
          responseSpeed: '30 mins'
        }
      });
      console.log(`- Created/Updated ${ed.name}`);
    } catch (err) {
      console.error(`Failed to seed ${ed.name}:`, err.message);
    }
  }
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
