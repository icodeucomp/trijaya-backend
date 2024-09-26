import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser, Public } from '@common/decorators';
import { JwtGuard } from '@common/guards';
import { successResponsePayload } from '@common/utils';
import {
  CreateDocumentDto,
  GetDocumentDto,
  UpdateDocumentDto,
} from '@modules/documents/dtos';
import { DocumentsService } from '@modules/documents/documents.service';

@UseGuards(JwtGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private documentService: DocumentsService) {}

  @Public()
  @Get()
  async getAllDocument(@Query() query: GetDocumentDto) {
    const documents = await this.documentService.getAllDocument(query);

    return successResponsePayload('Get all document', documents);
  }

  @Public()
  @Get(':documentSlug')
  async getDocumentBySlug(@Param('documentSlug') documentSlug: string) {
    const document = await this.documentService.getDocumentBySlug(documentSlug);

    return successResponsePayload(
      `Get document by slug ${documentSlug}`,
      document,
    );
  }

  @Post()
  async createDocument(
    @GetUser('id') uploaderId: number,
    @Body() dto: CreateDocumentDto,
  ) {
    console.log({ uploaderId });
    const document = await this.documentService.createDocument(uploaderId, dto);

    return successResponsePayload('Create document', document);
  }

  @Patch(':documentSlug')
  async updateDocumentBySlug(
    @GetUser('id') uploaderId: number,
    @Param('documentSlug') documentSlug: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    const document = await this.documentService.updateDocumentBySlug(
      documentSlug,
      uploaderId,
      dto,
    );

    return successResponsePayload(
      `Update document by slug ${documentSlug}`,
      document,
    );
  }

  @Delete(':documentSlug')
  async deleteDocumentBySlug(@Param('documentSlug') documentSlug: string) {
    const document =
      await this.documentService.deleteDocumentBySlug(documentSlug);

    return successResponsePayload(
      `Delete document by slug ${documentSlug}`,
      document,
    );
  }
}
