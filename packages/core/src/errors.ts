/**
 * Abstract base exception for all MorphDB framework errors.
 *
 * @public
 */
export abstract class MorphDBError extends Error {
  public abstract readonly code: string;
  public readonly timestamp: Date = new Date();

  constructor(message: string, public override readonly cause?: Error | undefined) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SchemaValidationError extends MorphDBError {
  public readonly code = 'ERR_SCHEMA_VALIDATION';
}

export class CapabilityMismatchError extends MorphDBError {
  public readonly code = 'ERR_CAPABILITY_MISMATCH';
}

export class QueryCompilationError extends MorphDBError {
  public readonly code = 'ERR_QUERY_COMPILATION';
}

export class TransactionExecutionError extends MorphDBError {
  public readonly code = 'ERR_TRANSACTION_EXECUTION';
}
