import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async getAllFeatureByNameNoGrouping(name: string) {
    const albums = await this.prisma.album.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
    });

    const blogs = await this.prisma.blog.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    const documents = await this.prisma.document.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
    });

    const business = await this.prisma.business.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    const products = await this.prisma.product.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    const projects = await this.prisma.project.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    return [
      ...albums,
      ...blogs,
      ...documents,
      ...business,
      ...products,
      ...projects,
    ];
  }

  async getAllFeatureByName(name: string) {
    const albums = await this.prisma.album.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
    });

    const blogs = await this.prisma.blog.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    const documents = await this.prisma.document.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
    });

    const business = await this.prisma.business.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    const products = await this.prisma.product.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    const projects = await this.prisma.project.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
    });

    return {
      albums,
      blogs,
      documents,
      business,
      products,
      projects,
    };
  }
}
