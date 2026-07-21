import { ASTNode, ASTNodeKind, ASTVisitor } from './ast-node.js';

/**
 * Represents query pagination limits and offsets in a query AST.
 *
 * @public
 */
export class PaginationNode implements ASTNode {
  public readonly kind = ASTNodeKind.PAGINATION;

  constructor(
    public readonly limit: number,
    public readonly offset: number = 0
  ) {
    Object.freeze(this);
  }

  public accept<R>(visitor: ASTVisitor<R>): R {
    return visitor.visitPagination(this);
  }
}
