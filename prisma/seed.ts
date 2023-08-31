import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.userType.upsert({
      where: {
        type: 'Cliente',
      },
      update: {},
      create: {
        type: 'Cliente',
      },
    }),
    prisma.userType.upsert({
      where: {
        type: 'Anunciante',
      },
      update: {},
      create: {
        type: 'Anunciante',
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
