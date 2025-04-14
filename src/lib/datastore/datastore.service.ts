import { Injectable } from '@nestjs/common';
import { Datastore, Key } from '@google-cloud/datastore';
import { GcpService } from '../gcp.service';

@Injectable()
export class DatastoreService {
  private datastore: Datastore;

  constructor(private readonly gcpService: GcpService) {
    this.datastore = new Datastore({
      projectId: this.gcpService.getProjectId(),
      credentials: this.gcpService.getCredentials(),
    });
  }

  /**
   * Crea una nueva entidad en Datastore
   * @param kind Tipo de entidad
   * @param data Datos de la entidad
   * @returns La clave de la entidad creada
   */
  async create<T>(kind: string, data: T): Promise<string | undefined> {
    const key: Key = this.datastore.key([kind]);
    const entity = {
      key,
      data,
    };

    await this.datastore.save(entity);
    return key?.id;
  }

  /**
   * Obtiene una entidad por su ID
   * @param kind Tipo de entidad
   * @param id ID de la entidad
   * @returns La entidad encontrada o null
   */
  async findById<T>(kind: string, id: string): Promise<T | null> {
    const key = this.datastore.key([kind, this.datastore.int(id)]);
    const [entity]: [T] = await this.datastore.get(key);
    return entity || null;
  }

  /**
   * Actualiza una entidad existente
   * @param kind Tipo de entidad
   * @param id ID de la entidad
   * @param data Datos actualizados
   */
  async update<T>(kind: string, id: string, data: Partial<T>): Promise<void> {
    const key = this.datastore.key([kind, this.datastore.int(id)]);
    const entity = {
      key,
      data,
    };

    await this.datastore.update(entity);
  }

  /**
   * Elimina una entidad
   * @param kind Tipo de entidad
   * @param id ID de la entidad
   */
  async delete(kind: string, id: string): Promise<void> {
    const key = this.datastore.key([kind, this.datastore.int(id)]);
    await this.datastore.delete(key);
  }

  /**
   * Realiza una consulta con filtros
   * @param kind Tipo de entidad
   * @param filters Filtros a aplicar
   * @returns Lista de entidades que coinciden con los filtros
   */
  async query<T>(
    kind: string,
    filters?: Array<{
      property: string;
      operator: '=' | '<' | '<=' | '>' | '>=' | 'HAS_ANCESTOR';
      value: any;
    }>,
  ): Promise<T[]> {
    let query = this.datastore.createQuery(kind);

    if (filters) {
      filters.forEach(({ property, operator, value }) => {
        query = query.filter(property, operator, value);
      });
    }

    const [entities] = await this.datastore.runQuery(query);
    return entities as T[];
  }

  /**
   * Ejecuta una transacción
   * @param callback Función que contiene las operaciones de la transacción
   */
  async runInTransaction<T>(
    callback: (
      transaction: import('@google-cloud/datastore').Transaction,
    ) => Promise<T>,
  ): Promise<T> {
    const transaction = this.datastore.transaction();
    try {
      await transaction.run();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
