import { describe, it, expect } from 'vitest';
import {
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
} from '@morphdb/ast';
import { PostgresCompiler } from '../src/index.js';

describe('@morphdb/adapter-postgres Compiler', () => {
  it('should compile query AST into parameterized PostgreSQL query string', () => {
    const filter = new FilterExpressionNode('email', 'endsWith', '@morphdb.io');
    const join = new JoinNode('orders', 'users.id', 'orders.user_id', 'INNER');
    const sort = new SortNode('createdAt', 'DESC');
    const pagination = new PaginationNode(10, 20);

    const queryNode = new SelectQueryNode({
      entityName: 'users',
      projections: ['id', 'email'],
      filters: [filter],
      joins: [join],
      sorts: [sort],
      pagination,
    });

    const compiled = PostgresCompiler.compile(queryNode);

    expect(compiled.sql).toBe(
      'SELECT "id", "email" FROM "users" INNER JOIN "orders" ON "users.id" = "orders.user_id" WHERE "email" LIKE \'%\' || $1 ORDER BY "createdAt" DESC LIMIT 10 OFFSET 20;'
    );
    expect(compiled.params).toEqual(['@morphdb.io']);
  });
});
