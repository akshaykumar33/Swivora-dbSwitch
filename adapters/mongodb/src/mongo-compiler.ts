import {
  ASTVisitor,
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
} from '@morphdb/ast';

export type MongoPipelineStage = Record<string, unknown>;

/**
 * Compiled MongoDB Aggregation Pipeline output.
 *
 * @public
 */
export interface CompiledMongoPipeline {
  readonly collectionName: string;
  readonly pipeline: ReadonlyArray<MongoPipelineStage>;
}

/**
 * MongoDB Dialect Visitor Compiler.
 * Translates query AST nodes into MongoDB Aggregation Pipeline stages.
 *
 * @public
 */
export class MongoCompiler implements ASTVisitor<Record<string, unknown>> {
  public static compile(node: SelectQueryNode): CompiledMongoPipeline {
    const compiler = new MongoCompiler();
    const pipeline: MongoPipelineStage[] = [];

    // 1. $match filter stage
    if (node.filters.length > 0) {
      const matchConditions: Record<string, unknown> = {};
      for (const filter of node.filters) {
        Object.assign(matchConditions, filter.accept(compiler));
      }
      pipeline.push({ $match: matchConditions });
    }

    // 2. $lookup join stages
    if (node.joins.length > 0) {
      for (const join of node.joins) {
        pipeline.push(join.accept(compiler));
      }
    }

    // 3. $sort stage
    if (node.sorts.length > 0) {
      const sortSpec: Record<string, number> = {};
      for (const sort of node.sorts) {
        Object.assign(sortSpec, sort.accept(compiler));
      }
      pipeline.push({ $sort: sortSpec });
    }

    // 4. $skip and $limit pagination stages
    if (node.pagination) {
      const pag = node.pagination.accept(compiler) as { $skip: number; $limit: number };
      if (pag.$skip > 0) {
        pipeline.push({ $skip: pag.$skip });
      }
      pipeline.push({ $limit: pag.$limit });
    }

    // 5. $project stage
    if (node.projections.length > 0) {
      const projSpec: Record<string, number> = {};
      for (const field of node.projections) {
        projSpec[field] = 1;
      }
      pipeline.push({ $project: projSpec });
    }

    return {
      collectionName: node.entityName,
      pipeline: Object.freeze(pipeline),
    };
  }

  public visitSelectQuery(_node: SelectQueryNode): Record<string, unknown> {
    return {};
  }

  public visitFilterExpression(node: FilterExpressionNode): Record<string, unknown> {
    switch (node.operator) {
      case 'eq':
        return { [node.field]: node.value };
      case 'neq':
        return { [node.field]: { $ne: node.value } };
      case 'gt':
        return { [node.field]: { $gt: node.value } };
      case 'gte':
        return { [node.field]: { $gte: node.value } };
      case 'lt':
        return { [node.field]: { $lt: node.value } };
      case 'lte':
        return { [node.field]: { $lte: node.value } };
      case 'endsWith':
        return { [node.field]: { $regex: `${String(node.value)}$`, $options: 'i' } };
      default:
        return { [node.field]: node.value };
    }
  }

  public visitJoinExpression(node: JoinNode): Record<string, unknown> {
    return {
      $lookup: {
        from: node.targetEntity,
        localField: node.leftKey,
        foreignField: node.rightKey,
        as: node.targetEntity,
      },
    };
  }

  public visitSortExpression(node: SortNode): Record<string, unknown> {
    return { [node.field]: node.direction === 'ASC' ? 1 : -1 };
  }

  public visitPagination(node: PaginationNode): Record<string, unknown> {
    return { $skip: node.offset, $limit: node.limit };
  }
}
