import { describe, bench } from 'vitest';
import {
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
} from '@morphdb/ast';
import { PostgresCompiler } from '../src/index.js';

describe('PostgreSQL AST Compiler Latency Benchmark', () => {
  const filter = new FilterExpressionNode('email', 'endsWith', '@morphdb.io');
  const join = new JoinNode('orders', 'users.id', 'orders.user_id', 'INNER');
  const sort = new SortNode('createdAt', 'DESC');
  const pagination = new PaginationNode(50, 0);

  const queryAST = new SelectQueryNode({
    entityName: 'users',
    projections: ['id', 'email', 'name'],
    filters: [filter],
    joins: [join],
    sorts: [sort],
    pagination,
  });

  bench('AST to Parameterized SQL Compilation', () => {
    PostgresCompiler.compile(queryAST);
  });
});
