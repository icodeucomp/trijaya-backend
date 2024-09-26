import { Module } from '@nestjs/common';

import { BusinessController } from '@modules/business/business.controller';
import { BusinessService } from '@modules/business/business.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
