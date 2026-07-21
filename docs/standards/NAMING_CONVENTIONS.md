# MorphDB Naming Conventions & Identifiers Standard

## Overview

Consistent naming conventions across packages, AST nodes, database dialect mappers, and public APIs are essential for maintainability in a monorepo ecosystem.

---

## Naming Taxonomy Matrix

| Entity Category | Rule / Format | Example |
| :--- | :--- | :--- |
| **NPM Packages** | `@morphdb/<package-name>` (kebab-case) | `@morphdb/query-builder`, `@morphdb/adapter-postgres` |
| **Source Files** | `kebab-case.ts` | `query-builder.ts`, `ast-visitor.ts` |
| **Classes / Interfaces** | `PascalCase` | `MorphDBClient`, `PostgresCompiler`, `DatabaseAdapter` |
| **AST Node Classes** | `<Concept>Node` (PascalCase) | `SelectQueryNode`, `FilterExpressionNode`, `JoinNode` |
| **AST Node Kinds** | `SNAKE_CASE_UPPER` | `SELECT_QUERY`, `FILTER_EXPRESSION` |
| **Capability Flags** | `UPPER_SNAKE_CASE` | `ACID_TRANSACTIONS`, `JSON_PATH_QUERIES` |
| **Events** | `<namespace>:<event-name>` (lowercase) | `query:before-execute`, `schema:register` |
| **Public API Methods** | `camelCase` | `defineSchema()`, `where()`, `executeTransaction()` |
| **Error Classes** | `<Concept>Error` (PascalCase) | `SchemaValidationError`, `CapabilityMismatchError` |

---

## Detailed Rationale & Architecture Analysis

### Why Strict Kebab-Case File & Package Naming?
- **Cross-OS Compatibility**: File paths in Git repositories operate across case-sensitive file systems (Linux) and case-insensitive file systems (macOS, Windows). Kebab-case avoids casing conflict bugs.

### Tradeoffs
- Requires mapping between `kebab-case.ts` file names and exported `PascalCase` class names.

---

## Best Practices & Common Mistakes

### Best Practices
- **Prefix Adapters with `adapter-`**: Package names for database drivers must strictly follow `@morphdb/adapter-<name>` (`@morphdb/adapter-postgres`, `@morphdb/adapter-mongodb`).
- **Suffix AST Nodes with `Node`**: All compiler AST abstractions must end in `Node` (`SelectQueryNode`) to differentiate AST structures from runtime domain model objects.

### Common Mistakes
- **Using `I` Prefix for Interfaces**: Avoid Java-style interface prefixes like `IAdapter` or `IClient`. Use clean descriptive names like `DatabaseAdapter` or `QueryCompiler`.
