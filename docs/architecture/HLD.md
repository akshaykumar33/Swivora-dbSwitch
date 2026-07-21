# MorphDB High-Level Design (HLD)

## Overview

The High-Level Design of **MorphDB** establishes a modular monorepo framework built upon **Hexagonal Architecture (Ports and Adapters)**, **Clean Architecture**, and **Compiler Design Principles**. 

MorphDB isolates application domain code from physical database storage mechanisms through an Abstract Syntax Tree (AST) query translation pipeline, a dynamic schema Intermediate Representation (IR), and a dynamic Capability Detection engine.

---

## High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Application Layer"
        App[Application Code / Services]
        Repo[Repository Pattern Abstraction]
    end

    subgraph "MorphDB Core Framework"
        Client[MorphDB Client Orchestrator]
        DI[Dependency Injection Container]
        PluginSys[Plugin System & Hook Bus]
        Cache[Query & AST Plan Cache]
        Obs[Observability & Telemetry Engine]
    end

    subgraph "Compilation Engine"
        SchemaIR[Universal Schema IR]
        QB[Type-Safe Query Builder]
        AST[Universal Query AST]
        CompilerPass[Compiler Optimization Passes]
        CapEngine[Capability Detection Engine]
    end

    subgraph "Adapter Ports & SDK"
        AdapterSDK[Adapter SDK Contract Interface]
    end

    subgraph "Concrete Database Adapters"
        PGAdapter[PostgreSQL Adapter]
        MongoAdapter[MongoDB Adapter]
        FutureAdapters[MySQL / Redis / Neo4j / ClickHouse]
    end

    subgraph "Physical Storage Layer"
        PGDB[(PostgreSQL Storage Engine)]
        MongoDB[(MongoDB Storage Engine)]
    end

    App --> Repo
    Repo --> Client
    Client --> DI
    Client --> PluginSys
    Client --> QB
    QB --> AST
    AST --> CompilerPass
    CompilerPass --> CapEngine
    CapEngine --> AdapterSDK
    AdapterSDK --> PGAdapter
    AdapterSDK --> MongoAdapter
    AdapterSDK --> FutureAdapters
    PGAdapter --> PGDB
    MongoAdapter --> MongoDB
    Client --> Cache
    Client --> Obs
```

---

## Core System Modules

### 1. Engine Client & Core Lifecycle (`@morphdb/core`)
The orchestrator managing database connection pools, plugin lifecycle hooks (`beforeQuery`, `afterQuery`, `onSchemaRegister`), context management (tenancy, tracing), and event dispatching.

### 2. Universal Schema IR (`@morphdb/schema`)
Provides declarative API primitives (`defineSchema`, `field`) to construct an in-memory Intermediate Representation (IR) of entity schemas. Converts schema definitions into dialect-specific DDL (SQL `CREATE TABLE`) or Document Validation schemas (MongoDB `$jsonSchema`).

### 3. Query Compilation Pipeline (`@morphdb/query-builder`, `@morphdb/ast`)
- **Query Builder**: Exposes fluent, type-safe API for constructing CRUD, aggregation, and filtering queries.
- **AST Compiler**: Transforms builder chains into immutable AST nodes (`SelectQueryNode`, `FilterNode`, `JoinNode`).
- **Optimization Passes**: Runs AST transformations (predicate pushdown, index hint injection, query normalization).

### 4. Adapter SDK & Capability Matrix (`@morphdb/adapter-sdk`)
Defines the `DatabaseAdapter` interface contract that all physical adapters must satisfy. It incorporates the **Capability Matrix**, which allows adapters to declare supported features (`TRANSACTIONS_TWO_PHASE`, `JSON_PATH_QUERY`, `FULL_TEXT_SEARCH`, `FOREIGN_KEY_CASCADE`).

### 5. Plugin & Event Engine (`@morphdb/events`, `@morphdb/plugin-system`)
Allows third-party extensions to hook into query processing, schema validation, telemetry collection, or caching strategies without modifying core source code.

---

## Detailed Rationale & Architecture Analysis

### Why Hexagonal Architecture & Compiler AST?
- **Hexagonal Isolation**: Decouples application logic from database drivers (`pg`, `mongodb`), allowing developers to mock database interfaces for unit testing without spinning up actual engines.
- **AST Intermediate Representation**: Decouples query expression from target syntax. Adding support for a new database (e.g., SQLite or Cassandra) requires writing a new compiler pass for `@morphdb/adapter-sdk` without altering `@morphdb/query-builder`.

### Tradeoffs
- **Indirection Latency**: Navigating through Client -> QB -> AST -> Compiler -> Driver incurs a slight microsecond abstraction tax compared to executing raw SQL strings. *Mitigation*: Cached AST compilation and zero-allocation AST node builders.
- **Schema Generalization**: Representing complex engine-specific primitives (e.g., PostgreSQL `tsvector` or MongoDB geospatial `2dsphere` indexes) requires abstracted IR types.

### Alternatives
1. **Direct Driver Wrappers (e.g., TypeORM Driver Pattern)**: Relies on string builder classes per driver. Rejected because string generation lacks validation optimization passes and leads to fragile regex string transformations.
2. **Binary Process Engine (e.g., Prisma Engine)**: Compiles query logic into a binary executable. Rejected due to IPC transport costs and incompatibility with cloud serverless / edge runtime limits (Cloudflare Workers, Vercel Edge).

### Future Scalability
- **Distributed Query Planning**: The AST engine can be extended to perform federated joins across heterogeneous databases (e.g., joining PostgreSQL `users` with MongoDB `activity_logs`).
- **Edge Deployment**: Designed as a pure TypeScript non-native monorepo to run natively in Node.js, Deno, and Bun runtimes.

---

## Subsystem Interaction Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant App as Domain Service
    participant Client as MorphDB Client
    participant QB as Query Builder
    participant AST as AST Pipeline
    participant Cap as Capability Engine
    participant Adapter as Postgres/Mongo Adapter
    participant DB as Target Database Engine

    App->>Client: query(UserSchema).where('status', 'eq', 'ACTIVE').execute()
    Client->>QB: Build query context
    QB->>AST: Construct Immutable QueryAST
    AST->>AST: Run AST Optimization Pass
    Client->>Cap: Validate Query AST against Adapter Capability Matrix
    Cap-->>Client: Capability Approved
    Client->>Adapter: compileAndExecute(QueryAST)
    Adapter->>Adapter: Translate QueryAST to Dialect Execution Plan
    Adapter->>DB: Send native query string / pipeline
    DB-->>Adapter: Return native payload / records
    Adapter->>Adapter: Hydrate to Typed Domain Entities
    Adapter-->>Client: Return Entity Result Set
    Client-->>App: Return Domain Result Array
```

---

## Best Practices & Common Mistakes

### Best Practices
- **Use Dependency Injection**: Pass the `MorphDBClient` instance down via dependency containers rather than importing global instances.
- **Maintain Modular Adapter Imports**: Import only the required adapters (`@morphdb/adapter-postgres`) to ensure tree-shaking removes unused database dependencies from bundle size.

### Common Mistakes
- **Direct Adapter Instantiation in Domain Code**: Instantiate database adapters at the application bootstrap layer only, never inside domain controllers or HTTP handlers.
