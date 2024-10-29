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
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    const blogs = await this.prisma.blog.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    const documents = await this.prisma.document.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
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
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    const projects = await this.prisma.project.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    const mappedAlbums = albums.map((album) => ({
      ...album,
      creator: album.creator.username,
    }));

    const mappedBlogs = blogs.map((blog) => ({
      ...blog,
      author: blog.author.username,
    }));

    const mappedDocuments = documents.map((document) => ({
      ...document,
      uploader: document.uploader.username,
    }));

    const mappedProducts = products.map((product) => ({
      ...product,
      business: product.business.title,
    }));

    const mappedProjects = projects.map((project) => ({
      ...project,
      business: project.business.title,
    }));

    return [
      ...mappedAlbums,
      ...mappedBlogs,
      ...mappedDocuments,
      ...business,
      ...mappedProducts,
      ...mappedProjects,
    ];
  }

  async getAllFeatureByName(name: string) {
    const albums = await this.prisma.album.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    const blogs = await this.prisma.blog.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    const documents = await this.prisma.document.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
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
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    const projects = await this.prisma.project.findMany({
      where: {
        title: { contains: name, mode: 'insensitive' },
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    const mappedAlbums = albums.map((album) => ({
      ...album,
      creator: album.creator.username,
    }));

    const mappedBlogs = blogs.map((blog) => ({
      ...blog,
      author: blog.author.username,
    }));

    const mappedDocuments = documents.map((document) => ({
      ...document,
      uploader: document.uploader.username,
    }));

    const mappedProducts = products.map((product) => ({
      ...product,
      business: product.business.title,
    }));

    const mappedProjects = projects.map((project) => ({
      ...project,
      business: project.business.title,
    }));

    return {
      mappedAlbums,
      mappedBlogs,
      mappedDocuments,
      business,
      mappedProducts,
      mappedProjects,
    };
  }
}
