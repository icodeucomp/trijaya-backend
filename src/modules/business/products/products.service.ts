import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import { OrderBy } from '@common/enums';
import { GetData } from '@common/interfaces';
import {
  generateDateRange,
  generatePagination,
  generateReadableDateTime,
  generateSlug,
} from '@common/utils';
import {
  CreateProductDto,
  GetProductDto,
  UpdateProductDto,
} from '@modules/business/products/dtos';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProduct(query: GetProductDto): Promise<GetData<Product[]>> {
    const { title, dateStart, dateEnd, sort, order, page, limit } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const whereCondition: any = {
      ...(title && { title: { contains: title, mode: 'insensitive' } }),
      ...(dateStart &&
        dateEnd && {
          updatedAt: {
            gte: dateStarted,
            lt: dateEnded,
          },
        }),
    };

    const [products, total, newest] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: whereCondition,
        include: {
          business: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take,
      }),
      this.prisma.product.count({
        where: whereCondition,
      }),
      this.prisma.product.findFirst({
        where: whereCondition,
        orderBy: {
          updatedAt: OrderBy.Desc,
        },
        select: {
          updatedAt: true,
        },
      }),
    ]);

    return {
      total,
      data: products,
      newest: generateReadableDateTime(newest?.updatedAt),
    };
  }

  async getProductBySlug(productSlug: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: {
        slug: productSlug,
      },
      include: {
        business: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const slug = generateSlug(dto.title);

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        mediaUrls: dto.mediaUrls,
        businessId: dto.businessId,
      },
    });

    return product;
  }

  async updateProductBySlug(productslug: string, dto: UpdateProductDto) {
    const existingProduct = await this.getProductBySlug(productslug);

    const updatedData: UpdateProductDto = { ...dto };

    if (dto.title) {
      updatedData.slug = generateSlug(updatedData.title);
    }

    const product = await this.prisma.product.update({
      where: {
        id: existingProduct.id,
      },
      data: updatedData,
    });

    return product;
  }

  async deleteProductBySlug(productslug: string): Promise<Product> {
    const existingProduct = await this.getProductBySlug(productslug);

    const product = await this.prisma.product.delete({
      where: {
        id: existingProduct.id,
      },
    });

    return product;
  }
}

/*
Draft Idea for handle uplaod :
async createProduct() {
    // wait for upload success
    // upload return array object of : name, url, size
    // loop array object
    // each loop used to create media table
    // while specifically for the url loop also be stored in an array
    // used all the array value to be the data of mediaUrls in product
  }
*/
