import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '@common/decorators';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Get()
  async getAllFeatureByNameNoGrouping(@Query('name') name: string) {
    return await this.searchService.getAllFeatureByNameNoGrouping(name);
  }

  @Public()
  @Get('grouped')
  async getAllFeatureByName(@Query('name') name: string) {
    return await this.searchService.getAllFeatureByName(name);
  }
}
