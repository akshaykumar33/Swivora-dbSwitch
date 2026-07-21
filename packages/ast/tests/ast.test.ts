import { describe, it, expect } from 'vitest';
import {
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
  ASTNormalizer,
  ASTVisitor,
} from '../src/index.js';

describe('@morphdb/ast Node Hierarchy & Normalizer', () => {
  it('should construct immutable SelectQueryNode AST', () => {
    const filter = new FilterExpressionNode('status', 'eq', 'ACTIVE');
    const join = new JoinNode('orders', 'id', 'userId', 'INNER');
    const sort = new SortNode('createdAt', 'DESC');
    const pagination = new PaginationNode(10, 0);

    const queryNode = new SelectQueryNode({
      entityName: 'users',
      projections: ['id', 'email', 'status'],
      filters: [filter],
      joins: [join],
      sorts: [sort],
      pagination,
    });

    expect(queryNode.entityName).toBe('users');
    expect(queryNode.filters).toHaveLength(1);
    expect(queryNode.filters[0]?.field).toBe('status');
    expect(Object.isFrozen(queryNode)).toBe(true);
    expect(Object.isFrozen(queryNode.filters)).toBe(true);
  });

  it('should support double dispatch via Visitor pattern', () => {
    class MockVisitor implements ASTVisitor<string> {
      visitSelectQuery(node: SelectQueryNode): string {
        return `SELECT[${node.entityName}]`;
      }
      visitFilterExpression(node: FilterExpressionNode): string {
        return `FILTER[${node.field}=${node.value}]`;
      }
      visitJoinExpression(node: JoinNode): string {
        return `JOIN[${node.targetEntity}]`;
      }
      visitSortExpression(node: SortNode): string {
        return `SORT[${node.field}]`;
      }
      visitPagination(node: PaginationNode): string {
        return `PAGINATION[${node.limit}]`;
      }
    }

    const visitor = new MockVisitor();
    const queryNode = new SelectQueryNode({ entityName: 'users' });
    const filterNode = new FilterExpressionNode('age', 'gt', 18);

    expect(queryNode.accept(visitor)).toBe('SELECT[users]');
    expect(filterNode.accept(visitor)).toBe('FILTER[age=18]');
  });

  it('should generate identical structural hashes for queries with different scalar parameter values', () => {
    const queryA = new SelectQueryNode({
      entityName: 'users',
      filters: [new FilterExpressionNode('email', 'endsWith', '@a.com')],
    });

    const queryB = new SelectQueryNode({
      entityName: 'users',
      filters: [new FilterExpressionNode('email', 'endsWith', '@b.com')],
    });

    const normA = ASTNormalizer.normalize(queryA);
    const normB = ASTNormalizer.normalize(queryB);

    expect(normA.structuralHash).toBe(normB.structuralHash);
    expect(normA.extractedParameters).toEqual(['@a.com']);
    expect(normB.extractedParameters).toEqual(['@b.com']);
  });
});
