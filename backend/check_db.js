const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { editorProfile: true }
  });
  console.log('Total Users:', users.length);
  users.forEach(u => {
    console.log(`User: ${u.name} (${u.phone}), Role: ${u.role}, Has Profile: ${!!u.editorProfile}`);
    if (u.editorProfile) {
      console.log(`  - Editor Online: ${u.editorProfile.isOnline}`);
    }
  });
  const editors = await prisma.editor.findMany();
  console.log('Total Editors in table:', editors.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
