import { Injectable } from '@nestjs/common';
import { Document } from '@prisma/client';

import { CreateDocumentDto, GetDocumentDto, UpdateDocumentDto } from './dto';
import {
  generateDateRange,
  generatePagination,
  generateSlug,
} from '../../common/utils';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getAllDocument(query: GetDocumentDto): Promise<Document[]> {
    const { name, uploadedBy, dateStart, dateEnd, sort, order, page, limit } =
      query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const documents = this.prisma.document.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(uploadedBy && {
          uploaderId: Number(uploadedBy),
        }),
        ...(dateStart &&
          dateEnd && {
            uploadedAt: {
              gte: dateStarted,
              lt: dateEnded,
            },
          }),
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip,
      take,
    });

    return documents;
  }

  async getAllDocumentInCategory(
    category: string,
    query: GetDocumentDto,
  ): Promise<Document[]> {
    const { name, uploadedBy, dateStart, dateEnd, sort, order, page, limit } =
      query;

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const documents = this.prisma.document.findMany({
      where: {
        category,
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(uploadedBy && {
          uploaderId: Number(uploadedBy),
        }),
        ...(dateStart &&
          dateEnd && {
            uploadedAt: {
              gte: dateStarted,
              lt: dateEnded,
            },
          }),
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { [sort]: order },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    return documents;
  }

  async getDocumentById(documentId: number): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
      },
    });

    return document;
  }

  async createDocument(
    uploaderId: number,
    dto: CreateDocumentDto,
  ): Promise<Document> {
    const name = await this.generateDocumentName(dto.name);
    const slug = generateSlug(name);

    const document = await this.prisma.document.create({
      data: {
        name,
        slug,
        category: dto.category,
        url: dto.url,
        size: dto.size,
        uploaderId,
      },
    });

    return document;
  }

  async updateDocumentById(
    documentId: number,
    uploaderId: number,
    dto: UpdateDocumentDto,
  ) {
    const updatedData: UpdateDocumentDto = { ...dto };
    updatedData.uploaderId = uploaderId;

    if (dto.name) {
      updatedData.name = await this.generateDocumentName(dto.name);
      updatedData.slug = generateSlug(updatedData.name);
    }

    const document = await this.prisma.document.update({
      where: {
        id: documentId,
      },
      data: updatedData,
    });

    return document;
  }

  async deleteDocumentById(documentId: number): Promise<Document> {
    const document = await this.prisma.document.delete({
      where: {
        id: documentId,
      },
    });

    return document;
  }

  private async generateDocumentName(name: string): Promise<string> {
    let duplicateCount = 0;
    let documentName = name;

    while (
      await this.prisma.document.findFirst({ where: { name: documentName } })
    ) {
      duplicateCount++;
      documentName = `${name}(${duplicateCount})`;
    }

    return documentName;
  }
}
