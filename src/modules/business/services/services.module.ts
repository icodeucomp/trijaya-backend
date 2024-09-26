import { Module } from '@nestjs/common';

import { ServicesService } from '@modules/business/services/services.service';
import { ServicesController } from '@modules/business/services/services.controller';

@Module({
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}
