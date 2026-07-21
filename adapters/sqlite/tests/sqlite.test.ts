import { describe, it, expect } from 'vitest';
import { SelectQueryNode, FilterExpressionNode } from '@morphdb/ast';
import { Capability } from '@morphdb/adapter-sdk';
import { SQLiteCompiler } from '../src/sqlite-compiler.js';
import { SQLiteAdapter } from '../src/sqlite-adapter.js';

describe('SQLiteAdapter & SQLiteCompiler Test Suite', () => {
  it('should compile SelectQueryNode to SQLite SQL with positional ? params', () => {
    const node = new SelectQueryNode({
      entityName: 'users',
      filters: [new FilterExpressionNode('status', 'eq', 'ACTIVE')],
    });

    const compiled = SQLiteCompiler.compile(node);
    expect(compiled.sql).toBe('SELECT * FROM "users" WHERE "status" = ?;');
    expect(compiled.params).toEqual(['ACTIVE']);
  });

  it('should report correct capabilities for SQLite', () => {
    const adapter = new SQLiteAdapter();
    expect(adapter.capabilities.has(Capability.ACID_TRANSACTIONS)).toBe(true);
    expect(adapter.capabilities.has(Capability.RELATIONAL_JOINS)).toBe(true);
    expect(adapter.capabilities.has(Capability.RETURNING_CLAUSE)).toBe(true);
  });
});
