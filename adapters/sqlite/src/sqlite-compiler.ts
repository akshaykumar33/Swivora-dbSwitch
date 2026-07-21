import {
  ASTVisitor,
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
} from '@morphdb/ast';

/**
 * Compiled SQLite statement output containing parameterized query string and extracted values.
 *
 * @public
 */
export interface CompiledSQLiteStatement {
  readonly sql: string;
  readonly params: ReadonlyArray<unknown>;
}

/**
 * SQLite Dialect Visitor Compiler.
 * Translates abstract query AST nodes into SQLite-compliant SQL with positional `?` parameters.
 *
 * @public
 */
export class SQLiteCompiler implements ASTVisitor<string> {
  public readonly params: unknown[] = [];

  public static compile(node: SelectQueryNode): CompiledSQLiteStatement {
    const compiler = new SQLiteCompiler();
    const sql = node.accept(compiler);
    return {
      sql,
      params: Object.freeze(compiler.params),
    };
  }

  public visitSelectQuery(node: SelectQueryNode): string {
    const fields =
      node.projections.length > 0
        ? node.projections.map((p) => `"${p}"`).join(', ')
        : '*';
    const table = `"${node.entityName}"`;

    let sql = `SELECT ${fields} FROM ${table}`;

    if (node.joins.length > 0) {
      const joinClause = node.joins.map((j) => j.accept(this)).join(' ');
      sql += ` ${joinClause}`;
    }

    if (node.filters.length > 0) {
      const filterClause = node.filters.map((f) => f.accept(this)).join(' AND ');
      sql += ` WHERE ${filterClause}`;
    }

    if (node.sorts.length > 0) {
      const sortClause = node.sorts.map((s) => s.accept(this)).join(', ');
      sql += ` ORDER BY ${sortClause}`;
    }

    if (node.pagination) {
      sql += ` ${node.pagination.accept(this)}`;
    }

    return `${sql};`;
  }

  public visitFilterExpression(node: FilterExpressionNode): string {
    this.params.push(node.value);

    switch (node.operator) {
      case 'eq':
        return `"${node.field}" = ?`;
      case 'neq':
        return `"${node.field}" != ?`;
      case 'gt':
        return `"${node.field}" > ?`;
      case 'gte':
        return `"${node.field}" >= ?`;
      case 'lt':
        return `"${node.field}" < ?`;
      case 'lte':
        return `"${node.field}" <= ?`;
      case 'endsWith':
        return `"${node.field}" LIKE '%' || ?`;
      default:
        return `"${node.field}" = ?`;
    }
  }

  public visitJoinExpression(node: JoinNode): string {
    return `${node.type} JOIN "${node.targetEntity}" ON "${node.leftKey}" = "${node.rightKey}"`;
  }

  public visitSortExpression(node: SortNode): string {
    return `"${node.field}" ${node.direction}`;
  }

  public visitPagination(node: PaginationNode): string {
    return `LIMIT ${node.limit} OFFSET ${node.offset}`;
  }
}
