import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';

import { DocumentSortBy, OrderBy } from '@common/enums';
import { defaultLimitPageData, defaultPage } from '@common/utils';

export class GetDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

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
  page?: string = defaultPage;

  @IsOptional()
  @IsNumberString()
  limit?: string = defaultLimitPageData;
}
