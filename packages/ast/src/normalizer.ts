import { SelectQueryNode } from './select-query-node.js';

/**
 * Result of AST parameter normalization.
 *
 * @public
 */
export interface NormalizedASTResult {
  /**
   * Structural hash signature representing static query layout independent of parameter values.
   */
  readonly structuralHash: string;

  /**
   * Extracted positional parameters in left-to-right order.
   */
  readonly extractedParameters: ReadonlyArray<unknown>;
}

/**
 * Normalizes a query AST by separating structural layout from dynamic parameters.
 * Enables LRU compiled execution plan caching.
 *
 * @public
 */
export class ASTNormalizer {
  /**
   * Generates a structural hash key and extracts dynamic parameter values.
   *
   * @param node - The root SelectQueryNode AST instance.
   * @returns Normalized AST structure and extracted parameter array.
   */
  public static normalize(node: SelectQueryNode): NormalizedASTResult {
    const extractedParameters: unknown[] = [];

    const filterSignatures = node.filters.map((filter, index) => {
      extractedParameters.push(filter.value);
      return `${filter.field}:${filter.operator}:$${index + 1}`;
    });

    const joinSignatures = node.joins.map(
      (j) => `${j.type}:${j.targetEntity}:${j.leftKey}=${j.rightKey}`
    );

    const sortSignatures = node.sorts.map((s) => `${s.field}:${s.direction}`);

    const projSignature = node.projections.length > 0 ? node.projections.join(',') : '*';

    const paginationSignature = node.pagination
      ? `L:${node.pagination.limit}:O:${node.pagination.offset}`
      : 'NONE';

    const rawSignature = [
      `ENTITY:${node.entityName}`,
      `PROJ:${projSignature}`,
      `FILTERS:[${filterSignatures.join(';')}]`,
      `JOINS:[${joinSignatures.join(';')}]`,
      `SORTS:[${sortSignatures.join(';')}]`,
      `PAGINATION:${paginationSignature}`,
    ].join('|');

    return {
      structuralHash: rawSignature,
      extractedParameters: Object.freeze(extractedParameters),
    };
  }
}
