import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { generateSlug } from '../src/common/utils';
import { BusinessSlug } from '../src/common/enums';

const prisma = new PrismaClient();

async function main() {
  const documentCategories = [
    'Financial Reports',
    'Project Proposals',
    'Technical Documentation',
    'Human Resources Policies',
    'Marketing Strategies',
  ];

  const businessTitle = [
    'Civil',
    'Construction',
    'Electrical',
    'Fabrication',
    'General Supplier',
    'Machining',
    'Mechanical',
  ];

  const businessSlug = [
    BusinessSlug.Civil,
    BusinessSlug.Construction,
    BusinessSlug.Electrical,
    BusinessSlug.Fabrication,
    BusinessSlug.General_supplier,
    BusinessSlug.Machining,
    BusinessSlug.Mechanical,
  ];

  for (let i = 1; i <= businessSlug.length; i++) {
    const index = (i - 1) % documentCategories.length;
    const randomUrlTitle = Math.random().toString(36).substring(2, 10);

    await prisma.admin.upsert({
      where: { username: `admin${i}` },
      update: {},
      create: {
        username: `admin${i}`,
        email: `admin${i}@mail.com`,
        password: await argon.hash(`Admin${i}Pass`),
      },
    });

    // Blog
    await prisma.blog.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Blog ${i}`,
        slug: generateSlug(`Blog ${i}`),
        content: `Content for blog ${i}`,
        authorId: i,
      },
    });

    // Document
    await prisma.document.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Document ${i}`,
        slug: generateSlug(`Document ${i}`),
        category: documentCategories[index],
        url: `https://example.com/document/${randomUrlTitle}`,
        size: `${String(Math.floor(Math.random() * (999 - 500 + 1)) + 500)} KB`,
        uploaderId: i,
      },
    });

    // Business
    await prisma.business.upsert({
      where: { id: i },
      update: {},
      create: {
        title: businessTitle[i - 1],
        slug: businessSlug[i - 1],
        description: `Description for ${businessTitle[i - 1]}`,
        imageHeaderUrl: `https://example.com/document/${randomUrlTitle}`,
      },
    });

    // Product
    await prisma.product.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `${businessTitle[i - 1]} Product`,
        slug: `${businessSlug[i - 1]}-product`,
        description: `Description for ${businessTitle[i - 1]}`,
        mediaUrls: [
          `https://example.com/document/${randomUrlTitle}a1`,
          `https://example.com/document/${randomUrlTitle}b2`,
          `https://example.com/document/${randomUrlTitle}c3`,
        ],
        businessId: i,
      },
    });

    // Project
    await prisma.project.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `${businessTitle[i - 1]} Project`,
        slug: `${businessSlug[i - 1]}-project`,
        description: `Description for ${businessTitle[i - 1]}`,
        mediaUrls: [
          `https://example.com/document/${randomUrlTitle}a1`,
          `https://example.com/document/${randomUrlTitle}b2`,
          `https://example.com/document/${randomUrlTitle}c3`,
        ],
        businessId: i,
      },
    });

    // service
    await prisma.service.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `${businessTitle[i - 1]} Service`,
        slug: `${businessSlug[i - 1]}-service`,
        description: `Description for ${businessTitle[i - 1]}`,
        mediaUrls: [
          `https://example.com/document/${randomUrlTitle}a1`,
          `https://example.com/document/${randomUrlTitle}b2`,
          `https://example.com/document/${randomUrlTitle}c3`,
        ],
        businessId: i,
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
