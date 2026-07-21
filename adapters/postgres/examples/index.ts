import { defineSchema, field } from '@morphdb/schema';
import { MorphDBClient } from '@morphdb/core';
import { PostgresAdapter } from '../src/index.js';

async function runPostgresExample() {
  console.log('--- MorphDB PostgreSQL Adapter Example ---');

  const UserSchema = defineSchema('users', {
    id: field.uuid().primaryKey(),
    email: field.string().unique(),
    name: field.string(),
    createdAt: field.dateTime().defaultToNow(),
  });

  const adapter = new PostgresAdapter({
    host: process.env.PG_HOST ?? 'localhost',
    port: Number(process.env.PG_PORT ?? 5432),
    database: process.env.PG_DB ?? 'morphdb_test',
    user: process.env.PG_USER ?? 'postgres',
    password: process.env.PG_PASSWORD ?? 'postgres',
  });

  const client = new MorphDBClient({ adapter });

  console.log('PostgresAdapter initialized with capabilities:', adapter.capabilities.toArray());

  const queryBuilder = client.query(UserSchema)
    .where('email', 'endsWith', '@enterprise.com')
    .orderBy('createdAt', 'DESC')
    .limit(10);

  const ast = queryBuilder.toAST();
  console.log('Generated Query AST Entity:', ast.entityName);
}

runPostgresExample().catch(console.error);
