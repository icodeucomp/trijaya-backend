import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { generateSlug } from './../src/common/utils';

const prisma = new PrismaClient();

async function main() {
  // await prisma.admin.upsert({
  //   where: { email: 'admin1@mail.com' },
  //   update: {},
  //   create: {
  //     username: 'admin1',
  //     email: 'admin1@mail.com',
  //     password: await argon.hash('Admin1Pass'),
  //   },
  // });

  // await prisma.admin.upsert({
  //   where: { email: 'admin2@mail.com' },
  //   update: {},
  //   create: {
  //     username: 'admin2',
  //     email: 'admin2@mail.com',
  //     password: await argon.hash('Admin2Pass'),
  //   },
  // });

  const documentCategories = [
    'Financial Reports',
    'Project Proposals',
    'Technical Documentation',
    'Human Resources Policies',
    'Marketing Strategies',
  ];

  for (let i = 1; i <= 11; i++) {
    await prisma.admin.upsert({
      where: { username: `admin${i}` },
      update: {},
      create: {
        username: `admin${i}`,
        email: `admin${i}@mail.com`,
        password: await argon.hash(`Admin${i}Pass`),
      },
    });
  }

  for (let i = 1; i <= 11; i++) {
    await prisma.blog.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Blog ${i}`,
        slug: generateSlug(`Blog ${i}`),
        content: `This is content for blog ${i}`,
        authorId: i,
      },
    });
  }

  for (let i = 1; i <= 11; i++) {
    const index = (i - 1) % documentCategories.length;

    await prisma.document.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Document ${i}`,
        slug: generateSlug(`Document ${i}`),
        category: documentCategories[index],
        url: `This is url for document ${i}`,
        size: `${String(Math.floor(Math.random() * (999 - 500 + 1)) + 500)} KB`,
        uploaderId: i,
      },
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
