import { FieldBuilder } from './field-builder.js';

/**
 * Type-level mapping of entity field shapes.
 *
 * @public
 */
export type RawSchemaShape = Record<string, FieldBuilder<any>>;

/**
 * Universal Schema Intermediate Representation (IR) object.
 *
 * @public
 */
export interface SchemaIR<T = unknown> {
  readonly _type?: T;
  readonly entityName: string;
  readonly fields: ReadonlyMap<string, FieldBuilder<any>>;
}

/**
 * Internal concrete implementation of SchemaIR.
 *
 * @public
 */
export class EntitySchema<TShape extends RawSchemaShape> implements SchemaIR {
  public readonly entityName: string;
  public readonly fields: ReadonlyMap<string, FieldBuilder<any>>;

  constructor(entityName: string, shape: TShape) {
    this.entityName = entityName;
    const fieldMap = new Map<string, FieldBuilder<any>>();
    for (const [key, value] of Object.entries(shape)) {
      fieldMap.set(key, value);
    }
    this.fields = fieldMap;
    Object.freeze(this);
  }
}

/**
 * Declares a new polyglot entity schema in MorphDB.
 *
 * @param entityName - The database table or collection name.
 * @param shape - Object dictionary of primitive fields.
 * @returns Immutable SchemaIR definition object.
 *
 * @public
 */
export function defineSchema<TShape extends RawSchemaShape>(
  entityName: string,
  shape: TShape
): EntitySchema<TShape> {
  return new EntitySchema<TShape>(entityName, shape);
}
