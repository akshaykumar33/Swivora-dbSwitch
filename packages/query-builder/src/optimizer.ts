import { SelectQueryNode, PaginationNode } from '@morphdb/ast';

/**
 * AST Optimization Pass Transformer.
 *
 * @public
 */
export class ASTOptimizer {
  /**
   * Applies optimization passes (e.g. projection bounds, limit bounds) to a SelectQueryNode AST.
   *
   * @param node - Raw query AST node.
   * @returns Optimized immutable SelectQueryNode AST.
   */
  public static optimize(node: SelectQueryNode): SelectQueryNode {
    let pagination = node.pagination;

    // Apply safety boundary default if pagination limit is missing or excessively high (> 1000)
    if (!pagination) {
      pagination = new PaginationNode(100, 0);
    } else if (pagination.limit > 1000) {
      pagination = new PaginationNode(1000, pagination.offset);
    }

    return new SelectQueryNode({
      entityName: node.entityName,
      projections: node.projections,
      filters: node.filters,
      joins: node.joins,
      sorts: node.sorts,
      pagination,
    });
  }
}
