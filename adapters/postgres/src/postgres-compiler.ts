import {
  ASTVisitor,
  SelectQueryNode,
  FilterExpressionNode,
  JoinNode,
  SortNode,
  PaginationNode,
} from '@morphdb/ast';

/**
 * Compiled SQL statement output containing parameterized query string and extracted values.
 *
 * @public
 */
export interface CompiledSQLStatement {
  readonly sql: string;
  readonly params: ReadonlyArray<unknown>;
}

/**
 * PostgreSQL Dialect Visitor Compiler.
 * Translates abstract AST nodes into parameterized SQL statements.
 *
 * @public
 */
export class PostgresCompiler implements ASTVisitor<string> {
  private paramIndex = 1;
  public readonly params: unknown[] = [];

  public static compile(node: SelectQueryNode): CompiledSQLStatement {
    const compiler = new PostgresCompiler();
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
    const paramSlot = `$${this.paramIndex++}`;

    switch (node.operator) {
      case 'eq':
        return `"${node.field}" = ${paramSlot}`;
      case 'neq':
        return `"${node.field}" != ${paramSlot}`;
      case 'gt':
        return `"${node.field}" > ${paramSlot}`;
      case 'gte':
        return `"${node.field}" >= ${paramSlot}`;
      case 'lt':
        return `"${node.field}" < ${paramSlot}`;
      case 'lte':
        return `"${node.field}" <= ${paramSlot}`;
      case 'endsWith':
        return `"${node.field}" LIKE '%' || ${paramSlot}`;
      default:
        return `"${node.field}" = ${paramSlot}`;
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
