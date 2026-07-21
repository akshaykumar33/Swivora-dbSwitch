# MorphDB Repository Folder Structure

## Overview

**MorphDB** uses a scalable, modular monorepo directory layout designed for enterprise open-source project management. The layout separates core engine primitives, database adapters, developer applications, benchmarks, and tooling.

---

## Directory Tree

```
MorphDB Monorepo Root
├── .github/                  # CI/CD Workflows, Issue Templates, PR Checks
│   ├── workflows/            # GitHub Actions (CI, Integration Tests, Release)
│   └── ISSUE_TEMPLATE/       # Structured Bug & Feature Templates
├── apps/                     # Frontend & Documentation Applications
│   ├── docs/                 # Next.js + Fumadocs Documentation Site
│   └── playground/           # Interactive In-Browser Query AST Playground
├── packages/                 # Core Framework Packages (@morphdb/*)
│   ├── core/                 # Engine Orchestrator, Client, Lifecycle, DI
│   ├── schema/               # Universal Schema Intermediate Representation (IR)
│   ├── query-builder/        # Type-Safe Builder Fluent API
│   ├── ast/                  # Abstract Syntax Tree Nodes & Visitors
│   ├── migrations/           # Multi-Database Migration Engine
│   ├── adapter-sdk/          # Database Adapter Interface Contracts & Capability Matrix
│   ├── events/               # Event Emitter & Hook Dispatcher
│   ├── plugin-system/        # Plugin Manager & Extension API
│   ├── caching/              # Query Result & AST Plan Caching System
│   ├── search/               # Universal Full-Text Search Abstraction
│   ├── validation/           # Data Integrity & Schema Constraint Validation
│   ├── observability/        # OpenTelemetry & Performance Instrumentation
│   └── testing-utils/        # Testcontainers & Adapter Contract Test Harness
├── adapters/                 # Official Database Adapters
│   ├── postgres/             # PostgreSQL Adapter (@morphdb/adapter-postgres)
│   └── mongodb/              # MongoDB Adapter (@morphdb/adapter-mongodb)
├── examples/                 # Production Reference Applications
│   ├── express-postgres/     # Express.js backend using PostgreSQL adapter
│   └── nest-mongodb/         # NestJS backend using MongoDB adapter
├── benchmarks/               # Performance & Latency Benchmarks
│   ├── query-throughput/     # Query AST Compilation & Execution Benchmarks
│   └── memory-footprint/     # Memory allocation & heap profilers
├── scripts/                  # Repository Maintenance Scripts
│   ├── build-all.ts          # Topological build automation
│   └── release.ts            # Changeset release automation
├── tools/                    # Dev Tooling & Code Generators
│   └── eslint-config/        # Shared ESLint Rules
├── docs/                     # Architecture & Specification Documents
├── turbo.json                # Turborepo Task Pipeline Configuration
├── pnpm-workspace.yaml       # pnpm Workspace Package Definitions
├── package.json              # Monorepo Root Package Manifest
├── README.md                 # Project Landing Page
├── CONTRIBUTING.md           # Open-Source Contribution Guide
└── CODE_OF_CONDUCT.md        # Community Code of Conduct
```

---

## Workspace Package Mapping (`pnpm-workspace.yaml`)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'adapters/*'
  - 'examples/*'
  - 'benchmarks/*'
  - 'tools/*'
```

---

## Detailed Rationale & Architecture Analysis

### Why Decouple `packages/` from `adapters/`?
- **Core Isolation**: Packages inside `packages/` must remain independent of any physical database client driver (such as `pg`, `mongodb`, or `mysql2`). 
- **Adapter Modularization**: Placing adapters inside their own top-level directory (`adapters/`) ensures that database adapters are developed, tested, versioned, and published independently.

### Tradeoffs
- **Monorepo Link Management**: Managing 15+ internal package cross-references (`workspace:*`) requires strict dependency ordering. *Mitigation*: Managed by pnpm symlinks and Turborepo build graph.

### Alternatives
1. **Single Monolithic Package (`morphdb`)**: Combining core code and adapters into a single package. Rejected because it forces applications using PostgreSQL to install unused MongoDB native drivers and BSON dependencies.
2. **Multi-Repo Architecture**: Hosting every adapter in a separate GitHub repository. Rejected due to high overhead in synchronizing cross-package changes during core API refactoring.

### Future Scalability
New database adapters (e.g., `adapters/sqlite`, `adapters/redis`, `adapters/neo4j`) can be added under `adapters/` without touching `@morphdb/core` or `@morphdb/schema`.
