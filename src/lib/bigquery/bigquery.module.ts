import { Module } from '@nestjs/common';
import { BigQueryService } from './bigquery.service';
import { GcpModule } from '../gcp.module';

@Module({
  imports: [GcpModule],
  providers: [BigQueryService],
  exports: [BigQueryService],
})
export class BigQueryModule {}
