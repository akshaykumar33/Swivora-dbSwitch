import { describe, it, expect } from 'vitest';
import { defineSchema, field } from '@morphdb/schema';
import { QueryBuilder } from '../src/index.js';

describe('@morphdb/query-builder Fluent API & Optimizer', () => {
  const UserSchema = defineSchema('users', {
    id: field.uuid().primaryKey(),
    email: field.string(),
    age: field.int(),
    createdAt: field.dateTime(),
  });

  it('should build fluent immutable AST nodes', () => {
    const qb = new QueryBuilder(UserSchema)
      .select('id', 'email')
      .where('age', 'gt', 18)
      .orderBy('createdAt', 'DESC')
      .limit(20);

    const ast = qb.toAST();

    expect(ast.entityName).toBe('users');
    expect(ast.projections).toEqual(['id', 'email']);
    expect(ast.filters).toHaveLength(1);
    expect(ast.filters[0]?.field).toBe('age');
    expect(ast.filters[0]?.operator).toBe('gt');
    expect(ast.filters[0]?.value).toBe(18);
    expect(ast.sorts[0]?.field).toBe('createdAt');
    expect(ast.pagination?.limit).toBe(20);
  });

  it('should apply optimization pass bounds automatically', () => {
    const qbWithoutLimit = new QueryBuilder(UserSchema).where('email', 'endsWith', '@test.com');
    const optimizedAst = qbWithoutLimit.toAST();

    // Default safety boundary limit applied by optimizer
    expect(optimizedAst.pagination?.limit).toBe(100);

    const qbExcessiveLimit = new QueryBuilder(UserSchema).limit(5000);
    const optimizedExcessiveAst = qbExcessiveLimit.toAST();

    // Cap excessive limit to safety maximum
    expect(optimizedExcessiveAst.pagination?.limit).toBe(1000);
  });
});
