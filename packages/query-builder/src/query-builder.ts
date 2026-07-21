import {
  SelectQueryNode,
  FilterExpressionNode,
  FilterOperator,
  JoinNode,
  JoinType,
  SortNode,
  SortDirection,
  PaginationNode,
} from '@morphdb/ast';
import { SchemaIR } from '@morphdb/schema';
import { ASTOptimizer } from './optimizer.js';

/**
 * Immutable Fluent Query Builder for constructing type-safe database queries.
 *
 * @public
 */
export class QueryBuilder<T = Record<string, unknown>> {
  private readonly entityName: string;
  private readonly projections: ReadonlyArray<string>;
  private readonly filters: ReadonlyArray<FilterExpressionNode>;
  private readonly joins: ReadonlyArray<JoinNode>;
  private readonly sorts: ReadonlyArray<SortNode>;
  private readonly pagination?: PaginationNode | undefined;

  constructor(
    schema: SchemaIR<T>,
    state?: {
      projections?: ReadonlyArray<string> | undefined;
      filters?: ReadonlyArray<FilterExpressionNode> | undefined;
      joins?: ReadonlyArray<JoinNode> | undefined;
      sorts?: ReadonlyArray<SortNode> | undefined;
      pagination?: PaginationNode | undefined;
    }
  ) {
    this.entityName = schema.entityName;
    this.projections = Object.freeze([...(state?.projections ?? [])]);
    this.filters = Object.freeze([...(state?.filters ?? [])]);
    this.joins = Object.freeze([...(state?.joins ?? [])]);
    this.sorts = Object.freeze([...(state?.sorts ?? [])]);
    this.pagination = state?.pagination;
    Object.freeze(this);
  }

  public select<K extends keyof T & string>(...fields: K[]): QueryBuilder<T> {
    return new QueryBuilder<T>(
      { entityName: this.entityName, fields: new Map() },
      {
        projections: [...this.projections, ...fields],
        filters: this.filters,
        joins: this.joins,
        sorts: this.sorts,
        pagination: this.pagination,
      }
    );
  }

  public where<K extends keyof T & string>(
    field: K,
    operator: FilterOperator,
    value: unknown
  ): QueryBuilder<T> {
    const newFilter = new FilterExpressionNode(field, operator, value);
    return new QueryBuilder<T>(
      { entityName: this.entityName, fields: new Map() },
      {
        projections: this.projections,
        filters: [...this.filters, newFilter],
        joins: this.joins,
        sorts: this.sorts,
        pagination: this.pagination,
      }
    );
  }

  public join(
    targetEntity: string,
    leftKey: string,
    rightKey: string,
    type: JoinType = 'INNER'
  ): QueryBuilder<T> {
    const newJoin = new JoinNode(targetEntity, leftKey, rightKey, type);
    return new QueryBuilder<T>(
      { entityName: this.entityName, fields: new Map() },
      {
        projections: this.projections,
        filters: this.filters,
        joins: [...this.joins, newJoin],
        sorts: this.sorts,
        pagination: this.pagination,
      }
    );
  }

  public orderBy<K extends keyof T & string>(field: K, direction: SortDirection = 'ASC'): QueryBuilder<T> {
    const newSort = new SortNode(field, direction);
    return new QueryBuilder<T>(
      { entityName: this.entityName, fields: new Map() },
      {
        projections: this.projections,
        filters: this.filters,
        joins: this.joins,
        sorts: [...this.sorts, newSort],
        pagination: this.pagination,
      }
    );
  }

  public limit(limit: number, offset = 0): QueryBuilder<T> {
    const pagination = new PaginationNode(limit, offset);
    return new QueryBuilder<T>(
      { entityName: this.entityName, fields: new Map() },
      {
        projections: this.projections,
        filters: this.filters,
        joins: this.joins,
        sorts: this.sorts,
        pagination,
      }
    );
  }

  /**
   * Constructs the un-optimized raw SelectQueryNode AST.
   */
  public toRawAST(): SelectQueryNode {
    return new SelectQueryNode({
      entityName: this.entityName,
      projections: this.projections,
      filters: this.filters,
      joins: this.joins,
      sorts: this.sorts,
      pagination: this.pagination,
    });
  }

  /**
   * Constructs the optimized SelectQueryNode AST ready for dialect compilation.
   */
  public toAST(): SelectQueryNode {
    return ASTOptimizer.optimize(this.toRawAST());
  }
}
