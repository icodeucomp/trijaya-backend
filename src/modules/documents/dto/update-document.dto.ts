import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CreateDocumentDto } from './create-document.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsOptional()
  uploaderId?: number;
}
