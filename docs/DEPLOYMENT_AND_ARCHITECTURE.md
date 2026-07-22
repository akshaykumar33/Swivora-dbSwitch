# MorphDB Ecosystem Implementation & Deployment Guide

> **Tagline**: Write Once. Connect Everywhere.
> **Scope**: Architecture, Polyglot Adapters, Documentation Site UX, Monorepo NPM Publishing, and Custom Domain Deployment.

---

## 1. Executive Summary & Monorepo Overview

MorphDB is an open-source Universal Data Abstraction Layer (UDAL) for TypeScript that decouples application business logic from physical database engines. A single entity schema definition and fluent query AST lower seamlessly into:
- **PostgreSQL SQL** (with double-quoted identifiers and `$1, $2` parameterized bindings)
- **MongoDB BSON Aggregation Pipelines** (with `$match`, `$lookup`, `$sort`, `$limit`, and `$project` stages)
- **MySQL SQL** (with backtick `` `table` `` identifiers and positional `?` bindings)
- **SQLite SQL** (with double-quoted identifiers and positional `?` bindings)

---

## 2. Core Architecture & SOLID Design Patterns

### AST Compilation Pipeline
```
┌─────────────────────────┐
│ @morphdb/schema         │ ---> Canonical Entity Schema Definition
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ @morphdb/query-builder  │ ---> Immutable AST Query Nodes (SelectQueryNode, FilterExpressionNode)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ ASTVisitor Compilers    │ ---> Lowering Passes:
│ - PostgresCompiler      │      - PostgreSQL SQL
│ - MongoCompiler         │      - MongoDB Aggregation Pipeline
│ - MySQLCompiler         │      - MySQL SQL
│ - SQLiteCompiler        │      - SQLite SQL
└─────────────────────────┘
```

### Key Design Patterns Implemented
1. **Visitor Pattern**: Implemented across database compilers (`PostgresCompiler`, `MongoCompiler`, `MySQLCompiler`, `SQLiteCompiler`) to traverse AST nodes without mutating core AST classes.
2. **Capability Matrix Pattern (`CapabilitiesSet`)**: Runtime reflection advertising supported engine capabilities (`ACID_TRANSACTIONS`, `RELATIONAL_JOINS`, `SAVEPOINTS`, `RETURNING_CLAUSE`, `JSON_PATH_SEARCH`).
3. **Repository Pattern (`MorphDBClient`)**: High-level CRUD operations maintaining transactional unit-of-work state.

---

## 3. Next.js Documentation Application (`apps/docs`)

Built using Next.js 14 App Router, Tailwind CSS cyber dark slate theme, Framer Motion, and Lucide Icons.

### Key Interactive Features
- **VS Code Token Syntax Highlighter ([`CodeBlock.tsx`](file:///d:/pro/Swivora-dbSwitch/apps/docs/src/components/CodeBlock.tsx))**:
  - Full syntax token highlighting for TypeScript, SQL, JSON, and Bash.
  - Mac window controls (red/yellow/green dots), line numbers, and copy-to-clipboard functionality.
- **Real-Time AST Compiler Playground ([`LivePlayground.tsx`](file:///d:/pro/Swivora-dbSwitch/apps/docs/src/components/LivePlayground.tsx))**:
  - In-browser interactive query compiler allowing users to edit parameters and watch SQL and BSON updates live.
- **Dynamic Capability Inspector ([`CapabilityInspector.tsx`](file:///d:/pro/Swivora-dbSwitch/apps/docs/src/components/CapabilityInspector.tsx))**:
  - Interactive engine selector displaying runtime capability flags across PostgreSQL, MongoDB, MySQL, SQLite, Redis, and Neo4j.

---

## 4. Automated Changeset Release & NPM Publishing

Monorepo versioning and publication are managed via **`@changesets/cli`**.

### Publishing Commands
```bash
# 1. Create a changeset release log
pnpm changeset

# 2. Bump package versions to 1.1.0 & update CHANGELOG.md files
pnpm version-packages

# 3. Compile ESM/CJS/DTS bundles and publish to NPM
pnpm release
```

---

## 5. Deployment & GoDaddy Custom Domain Setup

### Option A: Vercel Global Edge (Recommended for Next.js)

#### GitHub Action Secrets Setup:
- `VERCEL_TOKEN`: Generated from Vercel Account -> Tokens.
- `VERCEL_ORG_ID`: Found in Vercel Account Settings.
- `VERCEL_PROJECT_ID`: Found in Vercel Project Settings.

#### GoDaddy DNS Records:
- **For Subdomain** (`docs.swivoradb.dev`):
  - Type: `CNAME` | Name: `docs` | Value: `cname.vercel-dns.com` | TTL: `600s`
- **For Root Domain** (`swivora.io`):
  - Type: `A` | Name: `@` | Value: `76.76.21.21` | TTL: `600s`

---

### Option B: AWS Lambda & CloudFront (Serverless Framework)

Configured via [`apps/docs/serverless.yml`](file:///d:/pro/Swivora-dbSwitch/apps/docs/serverless.yml):

```yaml
service: morphdb-docs-app
provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
```

#### GoDaddy DNS Records for AWS:
- Type: `CNAME` | Name: `docs` | Value: `<your-cloudfront-id>.cloudfront.net`
