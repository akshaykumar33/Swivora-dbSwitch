# MorphDB Engineering Coding Standards

## Overview

The coding standards for **MorphDB** enforce strict type safety, zero-magic execution, immutability, async-first patterns, and robust error handling. All packages across the monorepo must adhere strictly to these rules.

---

## Core Guidelines

### 1. Strict TypeScript Policies
- **Strict Mode Enabled**: `tsconfig.json` must enforce `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`, and `"exactOptionalPropertyTypes": true`.
- **No Type Assertions (`as Any`)**: Type casting using `any` or `as any` is strictly forbidden. Use type guards (`is ASTNode`), discriminated unions, or `unknown` with runtime assertion functions.
- **Explicit Return Types**: All exported functions, methods, and API primitives must specify explicit TypeScript return types.

### 2. Immutability & Functional Integrity
- **Immutable AST & Schema IR**: AST nodes and schema objects must be frozen (`Readonly<T>` and `Object.freeze()`). Method calls on builders return new instances rather than mutating existing ones.
- **Zero Global State & Zero Singleton Abuse**: State must reside within instantiated client contexts (`MorphDBClient`). Global singletons are forbidden to enable clean multi-tenant and unit-testing isolated contexts.

### 3. Structured Error Handling Hierarchy
All framework exceptions must inherit from the base class `MorphDBError`:

```typescript
export abstract class MorphDBError extends Error {
  public abstract readonly code: string;
  public readonly timestamp: Date = new Date();

  constructor(message: string, public readonly cause?: Error) {
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
```

---

## Code Examples

### Immutable Builder Pattern Example
```typescript
// GOOD: Immutable chain returning new instance
export class QueryBuilder<T> {
  private readonly filters: ReadonlyArray<FilterNode>;

  constructor(filters: ReadonlyArray<FilterNode> = []) {
    this.filters = Object.freeze([...filters]);
  }

  public where(field: keyof T & string, operator: string, value: unknown): QueryBuilder<T> {
    const newFilter = new FilterNode(field, operator, value);
    return new QueryBuilder<T>([...this.filters, newFilter]);
  }
}
```

```typescript
// BAD: Mutating internal state
export class FragileQueryBuilder {
  private filters: FilterNode[] = [];

  public where(field: string, operator: string, value: unknown) {
    this.filters.push(new FilterNode(field, operator, value)); // VIOLATION
    return this;
  }
}
```

---

## Detailed Rationale & Architecture Analysis

### Why Strict Immutability & Zero Singletons?
- **Immutability**: Prevents side effects when a query builder instance is shared across multiple asynchronous operations (e.g., executing `.where('status', 'eq', 'ACTIVE')` as a base query for concurrent sub-queries).
- **Zero Singletons**: Enables multiple distinct database connections (e.g., tenant A on Postgres, tenant B on MongoDB) to run side-by-side in the same Node.js process without state bleeding.

### Tradeoffs
- **Garbage Collection Pressure**: Immutable builder calls create short-lived object allocations. *Mitigation*: Modern V8 generational garbage collectors handle ephemeral short-lived allocation efficiently.

### Alternatives
- **Mutable Fluent APIs (e.g., Knex.js)**: Rejected due to frequent race conditions when base query instances are reused in concurrent requests.

---

## Best Practices & Common Mistakes

### Best Practices
- **Use Discriminated Unions for AST Nodes**:
  ```typescript
  type ASTNode = SelectQueryNode | FilterExpressionNode | JoinExpressionNode;
  ```
- **Leverage TSDoc for Public APIs**: Provide `@param`, `@returns`, and `@example` tags on all public exports.

### Common Mistakes
- **Swallowing Exceptions**: Never use empty `catch (e) {}` blocks. Re-throw as a typed `MorphDBError` with the original error passed to `cause`.
