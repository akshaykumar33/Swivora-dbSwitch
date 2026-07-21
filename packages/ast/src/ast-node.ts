/**
 * Enum representing all supported AST Node kinds within MorphDB.
 *
 * @public
 */
export enum ASTNodeKind {
  SELECT_QUERY = 'SELECT_QUERY',
  FILTER_EXPRESSION = 'FILTER_EXPRESSION',
  JOIN_EXPRESSION = 'JOIN_EXPRESSION',
  SORT_EXPRESSION = 'SORT_EXPRESSION',
  PAGINATION = 'PAGINATION',
}

/**
 * Base AST Visitor interface for visitor pattern compilers.
 *
 * @public
 */
export interface ASTVisitor<R> {
  visitSelectQuery(node: import('./select-query-node.js').SelectQueryNode): R;
  visitFilterExpression(node: import('./filter-node.js').FilterExpressionNode): R;
  visitJoinExpression(node: import('./join-node.js').JoinNode): R;
  visitSortExpression(node: import('./sort-node.js').SortNode): R;
  visitPagination(node: import('./pagination-node.js').PaginationNode): R;
}

/**
 * Base AST Node interface for immutable syntax tree nodes.
 *
 * @public
 */
export interface ASTNode {
  /**
   * Discriminated union kind identifier.
   */
  readonly kind: ASTNodeKind;

  /**
   * Accepts a visitor instance for double dispatch compilation.
   *
   * @param visitor - The compiler visitor instance.
   */
  accept<R>(visitor: ASTVisitor<R>): R;
}
