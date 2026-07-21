# `@morphdb/caching`

> Multi-Tier Query Result and Compilation Plan Caching Engine for MorphDB.

---

## 1. Responsibility
Provides in-memory LRU and distributed Redis caching implementations for compiled AST execution plans and query results.

---

## 2. Public API
```typescript
export interface CacheProvider {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}
```

---

## 3. Folder Structure
```
packages/caching/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    └── index.ts
```
