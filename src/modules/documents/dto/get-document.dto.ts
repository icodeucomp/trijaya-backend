// get-blogs.dto.ts
import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';

import { DocumentSortBy, OrderBy } from './../../../common/enums';

export class GetDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  dateStart?: string;

  @IsOptional()
  @IsString()
  dateEnd?: string;

  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @IsOptional()
  @IsEnum(DocumentSortBy)
  sort?: DocumentSortBy = DocumentSortBy.Id;

  @IsOptional()
  @IsEnum(OrderBy)
  order?: OrderBy = OrderBy.Asc;

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
