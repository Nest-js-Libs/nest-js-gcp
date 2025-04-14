import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { GcpService } from '../gcp.service';

interface VentasPorRegion {
  region: string;
  producto: string;
  total_vendido: number;
  precio_promedio: number;
}

interface BigQuerySchemaField {
  name: string;
  type:
    | 'STRING'
    | 'INTEGER'
    | 'FLOAT'
    | 'BOOLEAN'
    | 'TIMESTAMP'
    | 'DATE'
    | 'TIME'
    | 'DATETIME'
    | 'RECORD';
  mode?: 'NULLABLE' | 'REQUIRED' | 'REPEATED';
  fields?: BigQuerySchemaField[];
  description?: string;
}

@Injectable()
export class BigQueryService {
  private bigquery: BigQuery;

  constructor(private readonly gcpService: GcpService) {
    const projectId = this.gcpService.getProjectId();
    const credentials = this.gcpService.getCredentials();

    if (!projectId || !credentials) {
      throw new InternalServerErrorException(
        'Las credenciales o el ID del proyecto no están configurados correctamente.',
      );
    }

    this.bigquery = new BigQuery({
      projectId,
      credentials,
    });
  }

  async createDataset(datasetId: string): Promise<Dataset> {
    try {
      const [dataset] = await this.bigquery.createDataset(datasetId);
      return dataset;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el dataset: ${error.message}`,
      );
    }
  }

  async createTable(
    datasetId: string,
    tableId: string,
    schema: { fields: BigQuerySchemaField[] },
  ): Promise<Table> {
    try {
      const dataset = this.bigquery.dataset(datasetId);
      const [table] = await dataset.createTable(tableId, { schema });
      return table;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear la tabla: ${error.message}`,
      );
    }
  }

  async insertRows<T extends Record<string, any>>(
    datasetId: string,
    tableId: string,
    rows: T[],
  ): Promise<void> {
    try {
      const table = this.bigquery.dataset(datasetId).table(tableId);
      await table.insert(rows);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al insertar filas: ${error.message}`,
      );
    }
  }

  async query<T = any>(query: string): Promise<T[]> {
    try {
      const [rows] = await this.bigquery.query(query);
      return rows as T[];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al ejecutar la consulta: ${error.message}`,
      );
    }
  }

  async analizarVentasPorRegion(
    datasetId: string,
    tableId: string,
  ): Promise<VentasPorRegion[]> {
    const query = `
      SELECT 
        region,
        producto,
        SUM(cantidad) as total_vendido,
        AVG(precio) as precio_promedio
      FROM \`${this.gcpService.getProjectId()}.${datasetId}.${tableId}\`
      GROUP BY region, producto
      ORDER BY total_vendido DESC
    `;

    return this.query<VentasPorRegion>(query);
  }

  async crearTablaVentasEjemplo(datasetId: string): Promise<void> {
    const schema: BigQuerySchemaField[] = [
      { name: 'region', type: 'STRING', mode: 'REQUIRED' },
      { name: 'producto', type: 'STRING', mode: 'REQUIRED' },
      { name: 'cantidad', type: 'INTEGER', mode: 'REQUIRED' },
      { name: 'precio', type: 'FLOAT', mode: 'REQUIRED' },
      { name: 'fecha', type: 'DATETIME', mode: 'REQUIRED' },
    ];

    try {
      await this.createTable(datasetId, 'ventas', { fields: schema });

      const datosEjemplo = [
        {
          region: 'Norte',
          producto: 'Laptop',
          cantidad: 10,
          precio: 999.99,
          fecha: new Date().toISOString(),
        },
        {
          region: 'Sur',
          producto: 'Smartphone',
          cantidad: 20,
          precio: 599.99,
          fecha: new Date().toISOString(),
        },
        {
          region: 'Este',
          producto: 'Tablet',
          cantidad: 15,
          precio: 399.99,
          fecha: new Date().toISOString(),
        },
        {
          region: 'Oeste',
          producto: 'Smartwatch',
          cantidad: 30,
          precio: 199.99,
          fecha: new Date().toISOString(),
        },
      ];

      await this.insertRows(datasetId, 'ventas', datosEjemplo);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear la tabla de ventas de ejemplo: ${error.message}`,
      );
    }
  }
}
