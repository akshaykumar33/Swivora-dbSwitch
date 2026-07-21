import { describe, it, expect } from 'vitest';
import {
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
} from '@morphdb/ast';
import { MongoCompiler } from '../src/index.js';

describe('@morphdb/adapter-mongodb Compiler', () => {
  it('should compile query AST into MongoDB Aggregation Pipeline stages', () => {
    const filter = new FilterExpressionNode('status', 'eq', 'ACTIVE');
    const join = new JoinNode('orders', '_id', 'userId', 'INNER');
    const sort = new SortNode('createdAt', 'DESC');
    const pagination = new PaginationNode(10, 0);

    const queryNode = new SelectQueryNode({
      entityName: 'users',
      projections: ['_id', 'email', 'status'],
      filters: [filter],
      joins: [join],
      sorts: [sort],
      pagination,
    });

    const compiled = MongoCompiler.compile(queryNode);

    expect(compiled.collectionName).toBe('users');
    expect(compiled.pipeline).toHaveLength(5);
    expect(compiled.pipeline[0]).toEqual({ $match: { status: 'ACTIVE' } });
    expect(compiled.pipeline[1]).toEqual({
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'userId',
        as: 'orders',
      },
    });
    expect(compiled.pipeline[2]).toEqual({ $sort: { createdAt: -1 } });
    expect(compiled.pipeline[3]).toEqual({ $limit: 10 });
    expect(compiled.pipeline[4]).toEqual({ $project: { _id: 1, email: 1, status: 1 } });
  });
});
