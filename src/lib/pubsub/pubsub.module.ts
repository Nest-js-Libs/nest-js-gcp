import { Module } from '@nestjs/common';
import { PubSubService } from './pubsub.service';
import { GcpModule } from '../gcp.module';

@Module({
  imports: [GcpModule],
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
