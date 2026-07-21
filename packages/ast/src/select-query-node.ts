import { ASTNode, ASTNodeKind, ASTVisitor } from './ast-node.js';
import { FilterExpressionNode } from './filter-node.js';
import { JoinNode } from './join-node.js';
import { SortNode } from './sort-node.js';
import { PaginationNode } from './pagination-node.js';

/**
 * Root query AST node representing a complete selection query.
 *
 * @public
 */
export class SelectQueryNode implements ASTNode {
  public readonly kind = ASTNodeKind.SELECT_QUERY;

  public readonly entityName: string;
  public readonly projections: ReadonlyArray<string>;
  public readonly filters: ReadonlyArray<FilterExpressionNode>;
  public readonly joins: ReadonlyArray<JoinNode>;
  public readonly sorts: ReadonlyArray<SortNode>;
  public readonly pagination?: PaginationNode | undefined;

  constructor(params: {
    entityName: string;
    projections?: ReadonlyArray<string>;
    filters?: ReadonlyArray<FilterExpressionNode>;
    joins?: ReadonlyArray<JoinNode>;
    sorts?: ReadonlyArray<SortNode> | undefined;
    pagination?: PaginationNode | undefined;
  }) {
    this.entityName = params.entityName;
    this.projections = Object.freeze([...(params.projections ?? [])]);
    this.filters = Object.freeze([...(params.filters ?? [])]);
    this.joins = Object.freeze([...(params.joins ?? [])]);
    this.sorts = Object.freeze([...(params.sorts ?? [])]);
    this.pagination = params.pagination;
    Object.freeze(this);
  }

  public accept<R>(visitor: ASTVisitor<R>): R {
    return visitor.visitSelectQuery(this);
  }
}
