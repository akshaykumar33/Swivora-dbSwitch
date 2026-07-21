import { DatabaseAdapter, CapabilitiesSet, QueryResult, TransactionSession } from '@morphdb/adapter-sdk';
import { defineSchema, field } from '@morphdb/schema';
import { MorphDBClient, ContextManager } from '../src/index.js';

class DemoAdapter implements DatabaseAdapter {
  public readonly name = 'DemoAdapter';
  public readonly capabilities = new CapabilitiesSet([]);

  async connect(): Promise<void> {
    console.log('[DemoAdapter] Connected to storage engine.');
  }

  async disconnect(): Promise<void> {
    console.log('[DemoAdapter] Disconnected from storage engine.');
  }

  async execute<T = unknown>(): Promise<QueryResult<T>> {
    return {
      rows: [
        { id: 'usr_100', name: 'Alice Smith', email: 'alice@example.com' } as unknown as T,
      ],
      executionTimeMs: 2,
    };
  }

  async beginTransaction(): Promise<TransactionSession> {
    return {
      id: 'tx_demo',
      isActive: true,
      commit: async () => console.log('[DemoAdapter] Transaction COMMITTED.'),
      rollback: async () => console.log('[DemoAdapter] Transaction ROLLED BACK.'),
    };
  }

  async native<T = unknown>(): Promise<T> {
    return {} as T;
  }
}

async function runExample() {
  console.log('--- MorphDB Core Engine Example ---');

  const UserSchema = defineSchema('users', {
    id: field.uuid().primaryKey(),
    name: field.string(),
    email: field.string().unique(),
  });

  const adapter = new DemoAdapter();
  const client = new MorphDBClient({ adapter });

  await client.connect();

  const queryBuilder = client.query(UserSchema).where('email', 'endsWith', '@example.com');
  const result = await client.executeQuery(queryBuilder);

  console.log('Query Executed Successfully:', result.rows);

  await client.transaction(async (tx) => {
    console.log('Active Transaction Session:', ContextManager.get()?.session?.id);
    const txQuery = tx.query(UserSchema).where('id', 'eq', 'usr_100');
    const txResult = await tx.executeQuery(txQuery);
    console.log('Transactional Query Results:', txResult.rows);
  });

  await client.disconnect();
}

runExample().catch(console.error);
