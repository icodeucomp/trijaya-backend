import { DocumentCategory } from '@common/enums';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(DocumentCategory)
  category: DocumentCategory;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  size: string;
}
