import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { generateSlug } from '../src/common/utils';
import { BusinessSlug } from '../src/common/enums';

const prisma = new PrismaClient();

async function main() {
  const totalBusinessItem: number = 5;

  const documentCategories = ['legality', 'certification', 'award'];

  const businessData = [
    {
      title: 'Civil',
      slug: BusinessSlug.Civil,
      description: "This is description for business 'civil'",
      imageHeader: {
        slug: 'civil-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'civil-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
    {
      title: 'Construction',
      slug: BusinessSlug.Construction,
      description: "This is description for business 'construction'",
      imageHeader: {
        slug: 'construction-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'construction-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
    {
      title: 'Electrical',
      slug: BusinessSlug.Electrical,
      description: "This is description for business 'electrical'",
      imageHeader: {
        slug: 'electrical-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'electrical-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
    {
      title: 'Fabrication',
      slug: BusinessSlug.Fabrication,
      description: "This is description for business 'fabrication'",
      imageHeader: {
        slug: 'fabrication-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'fabrication-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
    {
      title: 'General Supplier',
      slug: BusinessSlug.General_supplier,
      description: "This is description for business 'general supplier'",
      imageHeader: {
        slug: 'general-supplier-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'general-supplier-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
    {
      title: 'Machining',
      slug: BusinessSlug.Machining,
      description: "This is description for business 'machining'",
      imageHeader: {
        slug: 'machining-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'machining-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
    {
      title: 'Mechanical',
      slug: BusinessSlug.Mechanical,
      description: "This is description for business 'mechanical'",
      imageHeader: {
        slug: 'mechanical-business-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
      productHeader: {
        slug: 'mechanical-business-product-header',
        url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
      },
    },
  ];

  for (let i = 1; i <= businessData.length; i++) {
    const index = (i - 1) % documentCategories.length;

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
        url: `https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/documents/gitkraken-git-basics-cheat-sheet-1726203463649.pdf`,
        size: `${String(Math.floor(Math.random() * (999 - 500 + 1)) + 500)} KB`,
        uploaderId: i,
      },
    });

    await prisma.media.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Media ${i}`,
        slug: generateSlug(`media ${i}`),
        url: `https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png`,
        size: `${String(Math.floor(Math.random() * (999 - 500 + 1)) + 500)} KB`,
        uploaderId: i,
      },
    });

    // Business
    await prisma.business.upsert({
      where: { id: i },
      update: {},
      create: {
        title: businessData[i - 1].title,
        slug: businessData[i - 1].slug,
        description: businessData[i - 1].description,
        imageHeader: businessData[i - 1].imageHeader,
        productHeader: businessData[i - 1].productHeader,
      },
    });

    for (let j = 1; j <= totalBusinessItem; j++) {
      // Product
      await prisma.product.upsert({
        where: { id: (i - 1) * totalBusinessItem + j },
        update: {},
        create: {
          title: `${businessData[i - 1].title} Product ${j}`,
          slug: `${businessData[i - 1].slug}-product-${j}`,
          description: `${businessData[i - 1].title} product ${j}`,
          media: [
            {
              slug: `${businessData[i - 1].slug}-product-image${i}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
            {
              slug: `${businessData[i - 1].slug}-product-image${i + 1}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
            {
              slug: `${businessData[i - 1].slug}-product-image${i + 1}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
          ],
          businessId: i,
        },
      });

      // Project
      await prisma.project.upsert({
        where: { id: (i - 1) * totalBusinessItem + j },
        update: {},
        create: {
          title: `${businessData[i - 1].title} Project ${j}`,
          slug: `${businessData[i - 1].slug}-project-${j}`,
          description: `${businessData[i - 1].title} project ${j}`,
          media: [
            {
              slug: `${businessData[i - 1].slug}-project-image${i}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
            {
              slug: `${businessData[i - 1].slug}-project-image${i + 1}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
            {
              slug: `${businessData[i - 1].slug}-project-image${i + 1}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
          ],
          businessId: i,
        },
      });

      // Service
      await prisma.service.upsert({
        where: { id: (i - 1) * totalBusinessItem + j },
        update: {},
        create: {
          title: `${businessData[i - 1].title} Service ${j}`,
          slug: `${businessData[i - 1].slug}-service-${j}`,
          description: `${businessData[i - 1].title} service ${j}`,
          media: [
            {
              slug: `${businessData[i - 1].slug}-service-image${i}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
            {
              slug: `${businessData[i - 1].slug}-service-image${i + 1}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
            {
              slug: `${businessData[i - 1].slug}-service-image${i + 1}`,
              url: 'https://icodeu-storage.s3.ap-southeast-1.amazonaws.com/images/blogs/uiux1-1726546759614.png',
            },
          ],
          businessId: i,
        },
      });
    }
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
