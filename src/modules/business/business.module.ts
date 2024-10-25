import { Module } from '@nestjs/common';

import { BusinessController } from '@modules/business/business.controller';
import { BusinessService } from '@modules/business/business.service';
import { ProductsModule } from '@modules/business/products/products.module';
import { ProjectsModule } from '@modules/business/projects/projects.module';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [ProductsModule, ProjectsModule],
})
export class BusinessModule {}
