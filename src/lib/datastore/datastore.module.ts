import { Module } from '@nestjs/common';
import { DatastoreService } from './datastore.service';
import { GcpModule } from '../gcp.module';

@Module({
  imports: [GcpModule],
  providers: [DatastoreService],
  exports: [DatastoreService],
})
export class DatastoreModule {}
