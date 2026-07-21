# MorphDB Documentation Standards

## Overview

Documentation in **MorphDB** is treated with the same engineering rigor as production source code. The documentation ecosystem is powered by Next.js, Fumadocs, MDX, Shiki code highlighter, and Mermaid.js diagrams.

---

## Mandated Document Structure

Every architectural, specification, and user-facing guide inside `/docs` or `apps/docs` must follow this standardized template:

```markdown
# [Title of Document]

## Overview
Brief introduction explaining the module, concept, or feature.

## Concept & Architecture
In-depth technical explanation of underlying mechanisms.

## Diagram
Mermaid flowchart or sequence diagram visualizing structural relationships.

## Detailed Rationale & Architecture Analysis
- **Why**: Drivers and necessity.
- **Tradeoffs**: Performance, complexity, or developer ergonomics trade-offs.
- **Alternatives**: Other patterns evaluated and reasons for rejection.
- **Future Scalability**: How the design scales long term.

## Examples & Usage
TypeScript code blocks demonstrating basic and advanced usage.

## Best Practices & Common Mistakes
Bullet points outlining recommendations and anti-patterns.
```

---

## TSDoc Guidelines for Code Comments

All exported types, interfaces, classes, and methods across monorepo packages must be documented using TSDoc syntax:

```typescript
/**
 * Executes a type-safe query against the configured database adapter.
 *
 * @template T - The schema entity interface shape.
 * @param schema - The canonical schema definition produced by `defineSchema`.
 * @returns A fluent {@link QueryBuilder} instance configured for entity `T`.
 *
 * @throws {@link SchemaValidationError} If the schema definition is invalid.
 * 
 * @example
 * ```typescript
 * const users = await client.query(UserSchema)
 *   .where('age', 'gte', 18)
 *   .execute();
 * ```
 *
 * @public
 */
public query<T extends Record<string, unknown>>(schema: SchemaIR<T>): QueryBuilder<T>;
```

---

## Best Practices & Common Mistakes

### Best Practices
- **Use Runnable Code Snippets**: Ensure code examples import actual package primitives (`@morphdb/core`, `@morphdb/schema`) and pass type-checking.
- **Render Mermaid Diagrams natively**: Use ````mermaid``` fenced code blocks for clear architecture visualization.

### Common Mistakes
- **Outdated Code References**: Updating API signatures without updating corresponding TSDoc examples.
