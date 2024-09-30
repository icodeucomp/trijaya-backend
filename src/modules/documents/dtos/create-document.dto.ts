import { DocumentCategory } from '@common/enums';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DocumentCategory)
  @IsNotEmpty()
  category: DocumentCategory;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  size: string;
}
