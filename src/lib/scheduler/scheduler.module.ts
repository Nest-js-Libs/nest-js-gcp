import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { GcpModule } from '../gcp.module';

@Module({
  imports: [GcpModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
