import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateDocumentDto, GetDocumentDto, UpdateDocumentDto } from './dto';
import { DocumentsService } from './documents.service';
import { GetUser, Public } from '../../common/decorators';
import { JwtGuard } from '../../common/guards';
import { successResponsePayload } from '../../common/utils';

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
  @Get('category/:category')
  async getAllDocumentInCategory(
    @Param('category') category: string,
    @Query() query: GetDocumentDto,
  ) {
    const documents = await this.documentService.getAllDocumentInCategory(
      category,
      query,
    );

    return successResponsePayload(
      `Get all document in category ${category}`,
      documents,
    );
  }

  @Public()
  @Get(':id')
  async getDocumentById(@Param('id', ParseIntPipe) documentId: number) {
    const document = await this.documentService.getDocumentById(documentId);

    return successResponsePayload(`Get document by id ${documentId}`, document);
  }

  @Post()
  async createDocument(
    @GetUser('id') uploaderId: number,
    @Body() dto: CreateDocumentDto,
  ) {
    const document = await this.documentService.createDocument(uploaderId, dto);

    return successResponsePayload('Create document', document);
  }

  @Patch(':id')
  async updateDocumentById(
    @Param('id', ParseIntPipe) documentId: number,
    @GetUser('id') uploaderId: number,
    @Body() dto: UpdateDocumentDto,
  ) {
    const document = await this.documentService.updateDocumentById(
      documentId,
      uploaderId,
      dto,
    );

    return successResponsePayload(
      `Update document by id ${documentId}`,
      document,
    );
  }

  @Delete(':id')
  async deleteDocumentById(@Param('id', ParseIntPipe) documentId: number) {
    const document = await this.documentService.deleteDocumentById(documentId);

    return successResponsePayload(
      `Delete document by id ${documentId}`,
      document,
    );
  }
}
