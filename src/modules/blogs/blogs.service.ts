import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Blog } from '@prisma/client';

import { CreateBlogDto, GetBlogDto, UpdateBlogDto } from '@modules/blogs/dtos';
import {
  generateDateRange,
  generatePagination,
  generateSlug,
} from '@common/utils';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getAllBlog(query: GetBlogDto): Promise<Blog[]> {
    const {
      title,
      author,
      dateCreateStart,
      dateCreateEnd,
      dateUpdateStart,
      dateUpdateEnd,
      sort,
      order,
      page,
      limit,
    } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateCreatedStart } = generateDateRange(dateCreateStart);
    const { end: dateCreatedEnd } = generateDateRange(dateCreateEnd);
    const { start: dateUpdatedStart } = generateDateRange(dateUpdateStart);
    const { end: dateUpdatedEnd } = generateDateRange(dateUpdateEnd);

    const blogs = await this.prisma.blog.findMany({
      where: {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
        ...(author && {
          authorId: Number(author),
        }),
        ...(dateCreateStart &&
          dateCreateEnd && {
            uploadedAt: {
              gte: dateCreatedStart,
              lt: dateCreatedEnd,
            },
          }),
        ...(dateUpdateStart &&
          dateUpdateEnd && {
            uploadedAt: {
              gte: dateUpdatedStart,
              lt: dateUpdatedEnd,
            },
          }),
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return blogs;
  }

  async getBlogBySlug(blogSlug: string): Promise<Blog> {
    const blog = await this.prisma.blog.findFirst({
      where: {
        slug: blogSlug,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async createBlog(authorId: number, dto: CreateBlogDto): Promise<Blog> {
    const slug = generateSlug(dto.title);
    const imageHeader = this.extractImageHeaderFromContent(dto.content);

    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        imageHeader,
        authorId: authorId,
      },
    });

    return blog;
  }

  async updateBlogBySlug(blogSlug: string, dto: UpdateBlogDto): Promise<Blog> {
    const existingBlog = await this.getBlogBySlug(blogSlug);

    const updatedData: UpdateBlogDto = { ...dto };

    if (dto.title) {
      updatedData.slug = generateSlug(updatedData.title);
    }

    if (dto.content) {
      updatedData.imageHeader = this.extractImageHeaderFromContent(dto.content);
    }

    const blog = await this.prisma.blog.update({
      where: {
        id: existingBlog.id,
      },
      data: updatedData,
    });

    return blog;
  }

  async deleteBlogBySlug(blogSlug: string): Promise<Blog> {
    const existingBlog = await this.getBlogBySlug(blogSlug);

    const Blog = await this.prisma.blog.delete({
      where: {
        id: existingBlog.id,
      },
    });

    return Blog;
  }

  private extractImageHeaderFromContent(content: string | null): string | null {
    const regex = /<img [^>]*src="([^"]+)"/;
    const firstImage = content.match(regex);

    return firstImage[1] ?? this.config.get<string>('DEFAULT_IMAGE');
  }
}
