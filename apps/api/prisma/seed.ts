import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@projectmanager.com' },
    update: {},
    create: {
      email: 'admin@projectmanager.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Usuário admin criado:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 