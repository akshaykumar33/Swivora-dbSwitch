import { describe, it, expect } from 'vitest';
import { defineSchema, field, InferEntity } from '../src/index.js';

describe('@morphdb/schema Builder & Inferencer', () => {
  it('should define canonical schema IR', () => {
    const UserSchema = defineSchema('users', {
      id: field.uuid().primaryKey(),
      email: field.string().unique(),
      age: field.int().optional(),
      createdAt: field.dateTime().defaultToNow(),
    });

    expect(UserSchema.entityName).toBe('users');
    expect(UserSchema.fields.has('id')).toBe(true);
    expect(UserSchema.fields.get('id')?.metadata.isPrimaryKey).toBe(true);
    expect(UserSchema.fields.get('email')?.metadata.isUnique).toBe(true);
    expect(UserSchema.fields.get('age')?.metadata.isNullable).toBe(true);
  });

  it('should infer TypeScript compile-time shapes correctly', () => {
    const ProductSchema = defineSchema('products', {
      id: field.uuid().primaryKey(),
      title: field.string(),
      price: field.int(),
      inStock: field.boolean().default(true),
    });

    type Product = InferEntity<typeof ProductSchema>;

    // Type assertions check compile-time validity
    const mockProduct: Product = {
      id: '123-abc',
      title: 'Database Book',
      price: 4999,
      inStock: true,
    };

    expect(mockProduct.title).toBe('Database Book');
  });
});
