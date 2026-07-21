import { ASTNode, ASTNodeKind, ASTVisitor } from './ast-node.js';

/**
 * Join types supported across relational and document adapters.
 *
 * @public
 */
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

/**
 * Represents a join operation between entities in a query AST.
 *
 * @public
 */
export class JoinNode implements ASTNode {
  public readonly kind = ASTNodeKind.JOIN_EXPRESSION;

  constructor(
    public readonly targetEntity: string,
    public readonly leftKey: string,
    public readonly rightKey: string,
    public readonly type: JoinType = 'INNER'
  ) {
    Object.freeze(this);
  }

  public accept<R>(visitor: ASTVisitor<R>): R {
    return visitor.visitJoinExpression(this);
  }
}
