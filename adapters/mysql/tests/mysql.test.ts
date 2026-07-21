import { describe, it, expect } from 'vitest';
import { SelectQueryNode, FilterExpressionNode } from '@morphdb/ast';
import { Capability } from '@morphdb/adapter-sdk';
import { MySQLCompiler } from '../src/mysql-compiler.js';
import { MySQLAdapter } from '../src/mysql-adapter.js';

describe('MySQLAdapter & MySQLCompiler Test Suite', () => {
  it('should compile SelectQueryNode to MySQL SQL with backticks and ? params', () => {
    const node = new SelectQueryNode({
      entityName: 'users',
      filters: [new FilterExpressionNode('status', 'eq', 'ACTIVE')],
    });

    const compiled = MySQLCompiler.compile(node);
    expect(compiled.sql).toBe('SELECT * FROM `users` WHERE `status` = ?;');
    expect(compiled.params).toEqual(['ACTIVE']);
  });

  it('should report correct capabilities for MySQL', () => {
    const adapter = new MySQLAdapter();
    expect(adapter.capabilities.has(Capability.ACID_TRANSACTIONS)).toBe(true);
    expect(adapter.capabilities.has(Capability.RELATIONAL_JOINS)).toBe(true);
    expect(adapter.capabilities.has(Capability.RETURNING_CLAUSE)).toBe(false);
  });
});
