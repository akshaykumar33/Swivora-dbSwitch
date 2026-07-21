# `@morphdb/adapter-sqlite`

> Official SQLite Embedded Database Adapter for MorphDB Engine.

---

## 1. Responsibility
Compiles abstract query AST nodes into SQLite-compliant SQL statements (`SELECT ... FROM "table" WHERE "field" = ?`) and executes queries against SQLite databases or in-memory instances.

---

## 2. Usage
```typescript
import { SQLiteAdapter } from '@morphdb/adapter-sqlite';
import { MorphDBClient } from '@morphdb/core';

const adapter = new SQLiteAdapter({ inMemory: true });
const client = new MorphDBClient({ adapter });
await client.connect();
```
