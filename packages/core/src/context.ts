import { AsyncLocalStorage } from 'node:async_hooks';
import { TransactionSession } from '@morphdb/adapter-sdk';
import { IdentityMap } from './identity-map.js';

/**
 * Execution Context payload stored per async call stack.
 *
 * @public
 */
export interface ExecutionContext {
  readonly tenantId?: string | undefined;
  readonly session?: TransactionSession | undefined;
  readonly identityMap: IdentityMap;
  readonly traceId?: string | undefined;
}

/**
 * Manages request-scoped execution contexts via AsyncLocalStorage.
 *
 * @public
 */
export class ContextManager {
  private static readonly storage = new AsyncLocalStorage<ExecutionContext>();

  public static run<R>(ctx: ExecutionContext, fn: () => Promise<R>): Promise<R> {
    return this.storage.run(ctx, fn);
  }

  public static get(): ExecutionContext | undefined {
    return this.storage.getStore();
  }
}
