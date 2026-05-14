const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const editors = await prisma.editor.findMany({
    include: {
      user: {
        select: { name: true, phone: true }
      }
    }
  });

  console.log('--- REGISTERED EDITORS ---');
  if (editors.length === 0) {
    console.log('No editors found in database.');
  } else {
    editors.forEach(e => {
      console.log(JSON.stringify(e, null, 2));
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
