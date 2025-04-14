import { Global, Module } from '@nestjs/common';
import { GcpService } from './gcp.service';
import { PubSubModule } from './pubsub/pubsub.module';
import { StorageModule } from './storage/storage.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { RemoteConfigModule } from './remote-config/remote-config.module';
import { BigQueryModule } from './bigquery/bigquery.module';
import { FirestoreModule } from './firestore/firestore.module';

@Global()
@Module({
  imports: [
    PubSubModule,
    StorageModule,
    SchedulerModule,
    RemoteConfigModule,
    BigQueryModule,
    FirestoreModule,
  ],
  providers: [GcpService],
  exports: [
    GcpService,
    PubSubModule,
    StorageModule,
    SchedulerModule,
    RemoteConfigModule,
    BigQueryModule,
    FirestoreModule,
  ],
})
export class GcpModule {}
