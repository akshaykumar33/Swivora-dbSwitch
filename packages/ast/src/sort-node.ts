import { ASTNode, ASTNodeKind, ASTVisitor } from './ast-node.js';

/**
 * Sort direction choices.
 *
 * @public
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Represents ordering rules in a query AST.
 *
 * @public
 */
export class SortNode implements ASTNode {
  public readonly kind = ASTNodeKind.SORT_EXPRESSION;

  constructor(
    public readonly field: string,
    public readonly direction: SortDirection = 'ASC'
  ) {
    Object.freeze(this);
  }

  public accept<R>(visitor: ASTVisitor<R>): R {
    return visitor.visitSortExpression(this);
  }
}
