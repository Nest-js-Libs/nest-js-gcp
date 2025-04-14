import { Injectable } from '@nestjs/common';
import {
  Firestore,
  CollectionReference,
  DocumentReference,
  Transaction,
} from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
  private readonly firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  /**
   * Get a collection reference
   */
  collection(path: string): CollectionReference {
    return this.firestore.collection(path);
  }

  /**
   * Get a document reference
   */
  doc(path: string): DocumentReference {
    return this.firestore.doc(path);
  }

  /**
   * Create a document with auto-generated ID
   */
  async create<T>(collectionPath: string, data: T): Promise<DocumentReference> {
    const collection = this.collection(collectionPath);
    return await collection.add(data as any);
  }

  /**
   * Create or update a document with a specific ID
   */
  async set<T>(path: string, data: T): Promise<void> {
    const docRef = this.doc(path);
    await docRef.set(data as any);
  }

  /**
   * Update specific fields of a document
   */
  async update(path: string, data: any): Promise<void> {
    const docRef = this.doc(path);
    await docRef.update(data);
  }

  /**
   * Get a document by path
   */
  async get<T>(path: string): Promise<T | null> {
    const docRef = this.doc(path);
    const doc = await docRef.get();
    return doc.exists ? (doc.data() as T) : null;
  }

  /**
   * Delete a document
   */
  async delete(path: string): Promise<void> {
    const docRef = this.doc(path);
    await docRef.delete();
  }

  /**
   * Listen to real-time updates on a document
   */
  onDocumentSnapshot<T>(
    path: string,
    callback: (data: T | null) => void,
  ): () => void {
    const docRef = this.doc(path);
    return docRef.onSnapshot(snapshot => {
      callback(snapshot.exists ? (snapshot.data() as T) : null);
    });
  }

  /**
   * Listen to real-time updates on a collection
   */
  onCollectionSnapshot<T>(
    path: string,
    callback: (data: T[]) => void,
  ): () => void {
    const collectionRef = this.collection(path);
    return collectionRef.onSnapshot(snapshot => {
      const data = snapshot.docs.map(doc => doc.data() as T);
      callback(data);
    });
  }

  /**
   * Run a transaction
   */
  async runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    return await this.firestore.runTransaction(updateFunction);
  }

  /**
   * Run a batch write
   */
  batch(): import('@google-cloud/firestore').WriteBatch {
    return this.firestore.batch();
  }
}
