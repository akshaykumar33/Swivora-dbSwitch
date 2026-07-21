import { FieldBuilder } from './field-builder.js';
import { EntitySchema } from './schema-ir.js';

/**
 * Extracts TypeScript compile-time type from a FieldBuilder.
 *
 * @public
 */
export type InferFieldType<T> = T extends FieldBuilder<infer U> ? U : never;

/**
 * Infer TypeScript entity interface directly from a defineSchema definition.
 *
 * @public
 */
export type InferEntity<TSchema> = TSchema extends EntitySchema<infer TShape>
  ? {
      [K in keyof TShape]: InferFieldType<TShape[K]>;
    }
  : never;
