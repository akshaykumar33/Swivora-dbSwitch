/**
 * Supported canonical data types in MorphDB Schema IR.
 *
 * @public
 */
export type PrimitiveDataType = 'uuid' | 'string' | 'integer' | 'datetime' | 'json' | 'boolean';

/**
 * Metadata definition for a schema field.
 *
 * @public
 */
export interface FieldMetadata<T> {
  readonly dataType: PrimitiveDataType;
  readonly isNullable: boolean;
  readonly isPrimaryKey: boolean;
  readonly isUnique: boolean;
  readonly defaultValue?: T | (() => T) | undefined;
}

/**
 * Immutable builder for schema fields.
 *
 * @public
 */
export class FieldBuilder<T> {
  public readonly metadata: FieldMetadata<T>;

  constructor(metadata: FieldMetadata<T>) {
    this.metadata = Object.freeze(metadata);
    Object.freeze(this);
  }

  public static create<T>(dataType: PrimitiveDataType): FieldBuilder<T> {
    return new FieldBuilder<T>({
      dataType,
      isNullable: false,
      isPrimaryKey: false,
      isUnique: false,
    });
  }

  public optional(): FieldBuilder<T | null> {
    return new FieldBuilder<T | null>({
      ...this.metadata,
      isNullable: true,
    });
  }

  public primaryKey(): FieldBuilder<T> {
    return new FieldBuilder<T>({
      ...this.metadata,
      isPrimaryKey: true,
    });
  }

  public unique(): FieldBuilder<T> {
    return new FieldBuilder<T>({
      ...this.metadata,
      isUnique: true,
    });
  }

  public defaultToNow(): FieldBuilder<T> {
    return new FieldBuilder<T>({
      ...this.metadata,
      defaultValue: (() => new Date()) as unknown as T,
    });
  }

  public default(val: T): FieldBuilder<T> {
    return new FieldBuilder<T>({
      ...this.metadata,
      defaultValue: val,
    });
  }
}

/**
 * Fluent field primitives entry point.
 *
 * @public
 */
export const field = {
  uuid: (): FieldBuilder<string> => FieldBuilder.create<string>('uuid'),
  string: (): FieldBuilder<string> => FieldBuilder.create<string>('string'),
  int: (): FieldBuilder<number> => FieldBuilder.create<number>('integer'),
  dateTime: (): FieldBuilder<Date> => FieldBuilder.create<Date>('datetime'),
  json: <T = Record<string, unknown>>(): FieldBuilder<T> => FieldBuilder.create<T>('json'),
  boolean: (): FieldBuilder<boolean> => FieldBuilder.create<boolean>('boolean'),
};
