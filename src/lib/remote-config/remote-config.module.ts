import { Module } from '@nestjs/common';
import { RemoteConfigService } from './remote-config.service';

@Module({
  providers: [RemoteConfigService],
  exports: [RemoteConfigService],
})
export class RemoteConfigModule {}
