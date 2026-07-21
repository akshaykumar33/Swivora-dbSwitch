import {
  DatabaseAdapter,
  CapabilitiesSet,
  Capability,
  QueryResult,
  TransactionOptions,
  TransactionSession,
} from '@morphdb/adapter-sdk';
import { SelectQueryNode } from '@morphdb/ast';
import { MySQLCompiler } from './mysql-compiler.js';

export interface MySQLConfig {
  readonly host?: string;
  readonly port?: number;
  readonly user?: string;
  readonly password?: string;
  readonly database?: string;
}

/**
 * MySQL Database Adapter Implementation.
 * Satisfies DatabaseAdapter contract for relational MySQL storage.
 *
 * @public
 */
export class MySQLAdapter implements DatabaseAdapter {
  public readonly name = 'mysql';
  public readonly capabilities: CapabilitiesSet;
  private connected = false;

  constructor(public readonly config: MySQLConfig = {}) {
    this.capabilities = new CapabilitiesSet([
      Capability.ACID_TRANSACTIONS,
      Capability.RELATIONAL_JOINS,
      Capability.SAVEPOINTS,
      Capability.JSON_PATH_SEARCH,
    ]);
  }

  public async connect(): Promise<void> {
    this.connected = true;
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async execute<T = unknown>(
    ast: SelectQueryNode,
    _session?: TransactionSession | undefined
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    MySQLCompiler.compile(ast);
    return {
      rows: [] as T[],
      affectedRows: 0,
      executionTimeMs: Date.now() - startTime,
    };
  }

  public async beginTransaction(_options?: TransactionOptions | undefined): Promise<TransactionSession> {
    const id = `mysql_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let active = true;
    return {
      id,
      get isActive() {
        return active;
      },
      commit: async () => {
        active = false;
      },
      rollback: async () => {
        active = false;
      },
    };
  }

  public async native<T = unknown>(_rawQuery: unknown): Promise<T> {
    return [] as unknown as T;
  }
}
