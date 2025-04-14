/**
 * Base interface for Firestore documents
 */
export interface FirestoreDocument {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Options for querying Firestore collections
 */
export interface QueryOptions {
  limit?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: {
    field: string;
    operator:
      | '<'
      | '<='
      | '=='
      | '>='
      | '>'
      | 'array-contains'
      | 'in'
      | 'array-contains-any';
    value: any;
  }[];
}

/**
 * Options for real-time listeners
 */
export interface ListenerOptions {
  includeMetadataChanges?: boolean;
}

/**
 * Batch write operation type
 */
export type BatchOperation = {
  type: 'set' | 'update' | 'delete';
  path: string;
  data?: any;
};

/**
 * Transaction operation type
 */
export type TransactionOperation = {
  type: 'get' | 'set' | 'update' | 'delete';
  path: string;
  data?: any;
};
