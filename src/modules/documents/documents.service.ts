import { Injectable, NotFoundException } from '@nestjs/common';
import { Document } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import { DocumentCategory } from '@common/enums';
import {
  capitalizedWord,
  generateDateRange,
  generatePagination,
  generateSlug,
} from '@common/utils';
import {
  CreateDocumentDto,
  GetDocumentDto,
  UpdateDocumentDto,
} from '@modules/documents/dtos';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getAllDocumentCategory(): Promise<
    { category: string; slug: string }[]
  > {
    const categories = Object.values(DocumentCategory);

    return categories.map((category) => ({
      category: capitalizedWord(category),
      slug: generateSlug(category),
    }));
  }

  async getAllDocument(query: GetDocumentDto): Promise<Document[]> {
    const {
      title,
      category,
      uploadedBy,
      dateStart,
      dateEnd,
      sort,
      order,
      page,
      limit,
    } = query;
    const { skip, take } = generatePagination(page, limit);

    const { start: dateStarted } = generateDateRange(dateStart);
    const { end: dateEnded } = generateDateRange(dateEnd);

    const documents = this.prisma.document.findMany({
      where: {
        category,
        ...(title && { name: { contains: title, mode: 'insensitive' } }),
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

  async getDocumentBySlug(documentSlug: string): Promise<Document> {
    const document = await this.prisma.document.findFirst({
      where: {
        slug: documentSlug,
      },
      include: {
        uploader: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async createDocument(
    uploaderId: number,
    dto: CreateDocumentDto,
  ): Promise<Document> {
    const [name, slug] = await this.generateDocumentName(dto.name);

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

  async updateDocumentBySlug(
    documentSlug: string,
    uploaderId: number,
    dto: UpdateDocumentDto,
  ) {
    const existingDocument = await this.getDocumentBySlug(documentSlug);

    const updatedData: UpdateDocumentDto = { ...dto };
    updatedData.uploaderId = uploaderId;

    if (dto.name) {
      [updatedData.name, updatedData.slug] = await this.generateDocumentName(
        dto.name,
      );
    }

    const document = await this.prisma.document.update({
      where: {
        id: existingDocument.id,
      },
      data: updatedData,
    });

    return document;
  }

  async deleteDocumentBySlug(documentSlug: string): Promise<Document> {
    const existingDocument = await this.getDocumentBySlug(documentSlug);

    const document = await this.prisma.document.delete({
      where: {
        id: existingDocument.id,
      },
    });

    return document;
  }

  private async generateDocumentName(name: string): Promise<[string, string]> {
    let duplicateCount = 0;
    let documentName = name;
    let documentSlug = generateSlug(name);

    while (
      await this.prisma.document.findFirst({ where: { name: documentName } })
    ) {
      duplicateCount++;
      documentName = `${name}(${duplicateCount})`;
      console.log({ duplicateCount });
      documentSlug = generateSlug(name) + `(${duplicateCount})`;
    }

    return [documentName, documentSlug];
  }
}
