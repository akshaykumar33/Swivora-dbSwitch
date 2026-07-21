# `@morphdb/adapter-sdk` Technical Specification

## Overview

The `@morphdb/adapter-sdk` package defines the contract interface, connection pool manager, transaction handle abstractions, and **Capabilities Matrix** that every official and third-party database adapter must implement.

---

## Adapter Architecture & Capability Hierarchy

```mermaid
graph TD
    Client[MorphDB Client Core] --> SDK[DatabaseAdapter Interface Contract]
    SDK --> CapSet[Capabilities Matrix]

    SDK <|.. PGAdapter[PostgreSQL Adapter]
    SDK <|.. MongoAdapter[MongoDB Adapter]
    SDK <|.. SQLiteAdapter[SQLite Adapter]
    SDK <|.. RedisAdapter[Redis Adapter]

    subgraph "Declared Capabilities"
        CapSet --> CapACID[ACID Transactions]
        CapSet --> CapJoin[Relational Joins]
        CapSet --> CapDoc[Nested Documents]
        CapSet --> CapSearch[Full-Text Search]
    end
```

---

## Technical Specifications

### 1. `DatabaseAdapter` Port Contract
```typescript
export interface DatabaseAdapter {
  readonly name: string;
  readonly capabilities: ReadonlySet<Capability>;
  
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  
  execute<T>(ast: ASTNode, options?: ExecutionOptions): Promise<QueryResult<T>>;
  executeTransaction<T>(
    fn: (txHandle: TransactionHandle) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T>;
  
  native<T>(rawQuery: unknown): Promise<T>;
}
```

### 2. Capabilities Matrix Detection

```typescript
export enum Capability {
  ACID_TRANSACTIONS = 'ACID_TRANSACTIONS',
  RELATIONAL_JOINS = 'RELATIONAL_JOINS',
  NESTED_DOCUMENTS = 'NESTED_DOCUMENTS',
  JSON_PATH_SEARCH = 'JSON_PATH_SEARCH',
  SAVEPOINTS = 'SAVEPOINTS',
  RETURNING_CLAUSE = 'RETURNING_CLAUSE'
}
```

---

## Detailed Rationale & Architecture Analysis

### Why Capability Matrix over Feature Sniffing?
- **Explicit Capability Declaration**: Prevents runtime surprises by failing fast at query build time if an application query demands a feature (e.g. `SAVEPOINTS` or `RELATIONAL_JOINS`) that the target database adapter does not support.

### Tradeoffs
- Custom database driver features must be registered in the central `Capability` enum.

---

## Best Practices & Common Mistakes

### Best Practices
- **Use `adapter.native()` as an Escape Hatch**: When raw native driver optimizations are necessary, use `adapter.native(rawQuery)` while keeping application code cleanly partitioned.

### Common Mistakes
- **Leaking Native Driver Connections**: Forgetting to release transaction client handles back to connection pools in adapter exception handlers.
