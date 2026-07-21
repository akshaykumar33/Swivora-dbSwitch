import { MongoClient, MongoClientOptions, ClientSession } from 'mongodb';
import { SelectQueryNode } from '@morphdb/ast';
import {
  DatabaseAdapter,
  CapabilitiesSet,
  Capability,
  QueryResult,
  TransactionSession,
  TransactionOptions,
} from '@morphdb/adapter-sdk';
import { MongoCompiler } from './mongo-compiler.js';

/**
 * Official MongoDB Adapter implementation for MorphDB.
 *
 * @public
 */
export class MongoAdapter implements DatabaseAdapter {
  public readonly name = 'MongoAdapter';
  public readonly capabilities = new CapabilitiesSet([
    Capability.ACID_TRANSACTIONS,
    Capability.NESTED_DOCUMENTS,
    Capability.JSON_PATH_SEARCH,
    Capability.FULLTEXT_SEARCH,
  ]);

  private client: MongoClient;
  private readonly dbName: string;

  constructor(connectionUri: string, dbName: string, options?: MongoClientOptions | undefined) {
    this.client = new MongoClient(connectionUri, options);
    this.dbName = dbName;
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
  }

  public async execute<T = unknown>(
    ast: SelectQueryNode,
    session?: TransactionSession | undefined
  ): Promise<QueryResult<T>> {
    const compiled = MongoCompiler.compile(ast);
    const startTime = Date.now();

    const db = this.client.db(this.dbName);
    const collection = db.collection(compiled.collectionName);

    const mongoSession = session ? ((session as any).mongoSession as ClientSession) : undefined;
    const aggregateOptions = mongoSession ? { session: mongoSession } : {};
    const cursor = collection.aggregate(compiled.pipeline as any[], aggregateOptions);

    const rows = (await cursor.toArray()) as T[];

    return {
      rows,
      affectedRows: rows.length,
      executionTimeMs: Date.now() - startTime,
    };
  }

  public async beginTransaction(_options?: TransactionOptions | undefined): Promise<TransactionSession> {
    const mongoSession = this.client.startSession();
    mongoSession.startTransaction();

    let active = true;

    return {
      id: `mongo_tx_${Date.now()}`,
      get isActive() {
        return active;
      },
      async commit() {
        if (!active) return;
        await mongoSession.commitTransaction();
        await mongoSession.endSession();
        active = false;
      },
      async rollback() {
        if (!active) return;
        await mongoSession.abortTransaction();
        await mongoSession.endSession();
        active = false;
      },
      mongoSession,
    } as TransactionSession;
  }

  public async native<T = unknown>(rawQuery: unknown): Promise<T> {
    if (Array.isArray(rawQuery)) {
      return rawQuery as unknown as T;
    }
    throw new Error('MongoAdapter native query expects an aggregation pipeline array.');
  }
}
