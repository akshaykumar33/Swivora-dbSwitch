import { Pool, PoolConfig } from 'pg';
import { SelectQueryNode } from '@morphdb/ast';
import {
  DatabaseAdapter,
  CapabilitiesSet,
  Capability,
  QueryResult,
  TransactionSession,
  TransactionOptions,
} from '@morphdb/adapter-sdk';
import { PostgresCompiler } from './postgres-compiler.js';

/**
 * Official PostgreSQL Adapter implementation for MorphDB.
 *
 * @public
 */
export class PostgresAdapter implements DatabaseAdapter {
  public readonly name = 'PostgresAdapter';
  public readonly capabilities = new CapabilitiesSet([
    Capability.ACID_TRANSACTIONS,
    Capability.RELATIONAL_JOINS,
    Capability.SAVEPOINTS,
    Capability.RETURNING_CLAUSE,
    Capability.JSON_PATH_SEARCH,
  ]);

  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  public async connect(): Promise<void> {
    // Verify connection pool readiness
    const client = await this.pool.connect();
    client.release();
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
  }

  public async execute<T = unknown>(
    ast: SelectQueryNode,
    session?: TransactionSession | undefined
  ): Promise<QueryResult<T>> {
    const compiled = PostgresCompiler.compile(ast);
    const startTime = Date.now();

    const executor = session ? (session as any).client ?? this.pool : this.pool;
    const res = await executor.query(compiled.sql, [...compiled.params]);

    return {
      rows: res.rows as T[],
      affectedRows: res.rowCount ?? 0,
      executionTimeMs: Date.now() - startTime,
    };
  }

  public async beginTransaction(options?: TransactionOptions | undefined): Promise<TransactionSession> {
    const client = await this.pool.connect();
    const isolation = options?.isolationLevel ?? 'READ_COMMITTED';
    await client.query(`BEGIN ISOLATION LEVEL ${isolation.replace('_', ' ')}`);

    let active = true;

    return {
      id: `pg_tx_${Date.now()}`,
      get isActive() {
        return active;
      },
      async commit() {
        if (!active) return;
        await client.query('COMMIT');
        client.release();
        active = false;
      },
      async rollback() {
        if (!active) return;
        await client.query('ROLLBACK');
        client.release();
        active = false;
      },
      client,
    } as TransactionSession;
  }

  public async native<T = unknown>(rawQuery: unknown): Promise<T> {
    if (typeof rawQuery === 'string') {
      const res = await this.pool.query(rawQuery);
      return res.rows as unknown as T;
    }
    throw new Error('PostgresAdapter native query expects a SQL string argument.');
  }
}
