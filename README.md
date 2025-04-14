# Módulo GCP para NestJS

### @nest-js/gcp

[![npm version](https://img.shields.io/npm/v/@nest-js/gcp.svg)](https://www.npmjs.com/package/@nest-js/gcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este módulo proporciona una integración completa con los servicios de Google Cloud Platform (GCP) para aplicaciones NestJS.

## Servicios Incluidos

- **Cloud Storage**: Almacenamiento de objetos y archivos
- **Cloud Pub/Sub**: Sistema de mensajería y eventos
- **Cloud Scheduler**: Programación de tareas
- **Cloud BigQuery**: Análisis de datos
- **Cloud Datastore**: Base de datos NoSQL
- **Cloud Firestore**: Base de datos en tiempo real

## Configuración

```typescript
// .env
GCP_PROJECT_ID=tu-proyecto-id
GCP_CLIENT_EMAIL=tu-client-email
GCP_PRIVATE_KEY=tu-private-key

// app.module.ts
import { GcpModule } from './gcp/gcp.module';

@Module({
  imports: [GcpModule],
})
export class AppModule {}
```

## Ejemplos de Uso

### Cloud Storage
```typescript
@Injectable()
export class AppService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(file: Buffer) {
    const url = await this.storageService.uploadFile('mi-bucket', 'archivo.pdf', file);
    return url;
  }
}
```

### Cloud Pub/Sub
```typescript
@Injectable()
export class AppService {
  constructor(private readonly pubsubService: PubSubService) {}

  async publishEvent(data: any) {
    await this.pubsubService.publishMessage('mi-topic', data);
  }

  async setupSubscription() {
    await this.pubsubService.subscribe('mi-subscription', async (message) => {
      console.log('Mensaje recibido:', message);
    });
  }
}
```

### Cloud Scheduler
```typescript
@Injectable()
export class AppService {
  constructor(private readonly schedulerService: SchedulerService) {}

  async scheduleJob() {
    await this.schedulerService.createHttpJob({
      name: 'mi-job',
      schedule: '0 * * * *',
      url: 'https://mi-api.com/endpoint',
      httpMethod: 'POST',
      body: { data: 'ejemplo' }
    });
  }
}
```

## Contribución
Si deseas contribuir al desarrollo de este módulo, por favor revisa las guías de contribución y envía tus pull requests.

## Licencia
MIT
