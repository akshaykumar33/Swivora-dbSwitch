import { describe, it, expect, vi } from 'vitest';
import { DatabaseAdapter, CapabilitiesSet, TransactionSession, QueryResult } from '@morphdb/adapter-sdk';
import { defineSchema, field } from '@morphdb/schema';
import { MorphDBClient, ContextManager, IdentityMap, UnitOfWork, EntityState } from '../src/index.js';

class MockAdapter implements DatabaseAdapter {
  public readonly name = 'MockAdapter';
  public readonly capabilities = new CapabilitiesSet([]);
  public connected = false;

  async connect(): Promise<void> {
    this.connected = true;
  }
  async disconnect(): Promise<void> {
    this.connected = false;
  }
  async execute<T = unknown>(): Promise<QueryResult<T>> {
    return { rows: [{ id: '123', name: 'Alice' } as unknown as T], executionTimeMs: 1 };
  }
  async beginTransaction(): Promise<TransactionSession> {
    return {
      id: 'tx_1',
      isActive: true,
      commit: vi.fn(),
      rollback: vi.fn(),
    };
  }
  async native<T = unknown>(): Promise<T> {
    return {} as T;
  }
}

describe('@morphdb/core Orchestrator, IdentityMap & UnitOfWork', () => {
  const UserSchema = defineSchema('users', {
    id: field.uuid().primaryKey(),
    name: field.string(),
  });

  it('should initialize client and handle lifecycle methods', async () => {
    const adapter = new MockAdapter();
    const client = new MorphDBClient({ adapter });

    await client.connect();
    expect(adapter.connected).toBe(true);

    const qb = client.query(UserSchema).where('name', 'eq', 'Alice');
    const result = await client.executeQuery(qb);

    expect(result.rows).toHaveLength(1);

    await client.disconnect();
    expect(adapter.connected).toBe(false);
  });

  it('should manage IdentityMap and UnitOfWork entity tracking', () => {
    const identityMap = new IdentityMap();
    const uow = new UnitOfWork(identityMap);

    const userEntity = { id: 'usr_1', name: 'Bob' };
    const cleanUser = uow.registerClean('users', 'usr_1', userEntity);

    expect(cleanUser).toBe(userEntity);
    expect(identityMap.get('users', 'usr_1')).toBe(userEntity);

    uow.registerDirty('users', 'usr_1', userEntity);
    const tracked = uow.getTrackedEntities();

    expect(tracked).toHaveLength(1);
    expect(tracked[0]?.state).toBe(EntityState.DIRTY);
  });

  it('should manage transaction contexts with rollback on failure', async () => {
    const adapter = new MockAdapter();
    const client = new MorphDBClient({ adapter });

    let capturedSession: TransactionSession | undefined;

    await expect(
      client.transaction(async () => {
        const ctx = ContextManager.get();
        capturedSession = ctx?.session;
        throw new Error('Simulated failure');
      })
    ).rejects.toThrow('Simulated failure');

    expect(capturedSession?.rollback).toHaveBeenCalled();
  });
});
