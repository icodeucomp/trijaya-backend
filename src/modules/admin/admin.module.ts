import { Module } from '@nestjs/common';

import { AdminController } from '@modules/admin/admin.controller';
import { AdminService } from '@modules/admin/admin.service';
import { ProfileModule } from '@modules/admin/profile/profile.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [ProfileModule],
})
export class AdminModule {}
