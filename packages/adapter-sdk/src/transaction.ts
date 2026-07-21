/**
 * Transaction Isolation Levels.
 *
 * @public
 */
export type IsolationLevel = 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';

/**
 * Options for starting a transaction.
 *
 * @public
 */
export interface TransactionOptions {
  readonly isolationLevel?: IsolationLevel | undefined;
  readonly readOnly?: boolean | undefined;
}

/**
 * Represents an active database transaction session.
 *
 * @public
 */
export interface TransactionSession {
  readonly id: string;
  readonly isActive: boolean;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
