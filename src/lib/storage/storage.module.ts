import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GcpModule } from '../gcp.module';

@Module({
  imports: [GcpModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
