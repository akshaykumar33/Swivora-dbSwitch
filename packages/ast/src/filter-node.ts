import { ASTNode, ASTNodeKind, ASTVisitor } from './ast-node.js';

/**
 * Filter comparison operators supported by MorphDB AST.
 *
 * @public
 */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'endsWith';

/**
 * Represents a single filter expression in a query AST.
 *
 * @public
 */
export class FilterExpressionNode implements ASTNode {
  public readonly kind = ASTNodeKind.FILTER_EXPRESSION;

  constructor(
    public readonly field: string,
    public readonly operator: FilterOperator,
    public readonly value: unknown
  ) {
    Object.freeze(this);
  }

  public accept<R>(visitor: ASTVisitor<R>): R {
    return visitor.visitFilterExpression(this);
  }
}
