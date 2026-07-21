# `@morphdb/adapter-mysql`

> Official MySQL Database Adapter for MorphDB Engine.

---

## 1. Responsibility
Compiles abstract query AST nodes into MySQL-compliant SQL statements (`SELECT ... FROM \`table\` WHERE \`field\` = ?`) and executes queries against MySQL servers.

---

## 2. Usage
```typescript
import { MySQLAdapter } from '@morphdb/adapter-mysql';
import { MorphDBClient } from '@morphdb/core';

const adapter = new MySQLAdapter({
  host: 'localhost',
  user: 'root',
  password: 'secretpassword',
  database: 'app_db',
});

const client = new MorphDBClient({ adapter });
await client.connect();
```
