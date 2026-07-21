import { SelectQueryNode } from '@morphdb/ast';
import { CapabilitiesSet } from './capabilities.js';
import { TransactionOptions, TransactionSession } from './transaction.js';

/**
 * Standard Query Result Envelope returned by DatabaseAdapters.
 *
 * @public
 */
export interface QueryResult<T = unknown> {
  readonly rows: ReadonlyArray<T>;
  readonly affectedRows?: number | undefined;
  readonly executionTimeMs: number;
}

/**
 * Primary DatabaseAdapter Interface Contract.
 *
 * @public
 */
export interface DatabaseAdapter {
  readonly name: string;
  readonly capabilities: CapabilitiesSet;

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  execute<T = unknown>(ast: SelectQueryNode, session?: TransactionSession | undefined): Promise<QueryResult<T>>;
  beginTransaction(options?: TransactionOptions | undefined): Promise<TransactionSession>;

  /**
   * Escape hatch for executing driver-native queries directly.
   *
   * @param rawQuery - Native SQL query string or MongoDB aggregation array.
   */
  native<T = unknown>(rawQuery: unknown): Promise<T>;
}
