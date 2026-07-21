import { DatabaseAdapter, TransactionOptions, QueryResult } from '@morphdb/adapter-sdk';
import { SchemaIR } from '@morphdb/schema';
import { QueryBuilder } from '@morphdb/query-builder';
import { ContextManager } from './context.js';
import { IdentityMap } from './identity-map.js';

/**
 * Client Configuration for MorphDBClient.
 *
 * @public
 */
export interface MorphDBConfig {
  readonly adapter: DatabaseAdapter;
}

/**
 * Main MorphDB Client Orchestrator.
 *
 * @public
 */
export class MorphDBClient {
  public readonly adapter: DatabaseAdapter;

  constructor(config: MorphDBConfig) {
    this.adapter = config.adapter;
  }

  public async connect(): Promise<void> {
    await this.adapter.connect();
  }

  public async disconnect(): Promise<void> {
    await this.adapter.disconnect();
  }

  public query<T = Record<string, unknown>>(schema: SchemaIR<T>): QueryBuilder<T> {
    return new QueryBuilder<T>(schema);
  }

  public async executeQuery<T = unknown>(builder: QueryBuilder<any>): Promise<QueryResult<T>> {
    const ast = builder.toAST();
    const ctx = ContextManager.get();
    return this.adapter.execute<T>(ast, ctx?.session);
  }

  public async transaction<R>(
    fn: (txClient: MorphDBClient) => Promise<R>,
    options?: TransactionOptions | undefined
  ): Promise<R> {
    const session = await this.adapter.beginTransaction(options);
    const identityMap = new IdentityMap();

    return ContextManager.run({ session, identityMap }, async () => {
      try {
        const result = await fn(this);
        await session.commit();
        return result;
      } catch (err) {
        await session.rollback();
        throw err;
      }
    });
  }
}
