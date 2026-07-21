import React from 'react';
import { TableOfContents, TOCHeading } from '../../../components/TableOfContents';
import { CodeBlock } from '../../../components/CodeBlock';
import { BookOpen } from 'lucide-react';

interface Props {
  params: {
    slug?: string[];
  };
}

export default function DynamicDocsPage({ params }: Props) {
  const slugPath = params.slug?.join('/') ?? 'getting-started';

  const content = getDocContent(slugPath);

  return (
    <div className="flex gap-10">
      <article className="flex-1 min-w-0 space-y-8 font-sans">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <BookOpen className="h-3.5 w-3.5 text-cyber-emerald" />
          <span>Docs</span>
          <span>/</span>
          <span className="font-semibold text-white capitalize">{slugPath.replace('/', ' / ')}</span>
        </div>

        {/* Header Title & Summary */}
        <div className="space-y-3 border-b border-card-border pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-outfit">{content.title}</h1>
          <p className="text-sm text-slate-400 leading-relaxed">{content.summary}</p>
        </div>

        {/* Render Sections */}
        {content.sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2 font-outfit">
              <span className="text-cyber-emerald">#</span>
              <span>{sec.title}</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
              {sec.body}
            </div>

            {sec.code && (
              <CodeBlock code={sec.code} language={sec.language ?? 'typescript'} title={sec.title} />
            )}
          </section>
        ))}
      </article>

      <TableOfContents headings={content.headings} />
    </div>
  );
}

interface Section {
  id: string;
  title: string;
  body: React.ReactNode;
  code?: string;
  language?: string;
}

interface DocContent {
  title: string;
  summary: string;
  headings: TOCHeading[];
  sections: Section[];
}

function getDocContent(slug: string): DocContent {
  switch (slug) {
    case 'schema':
      return {
        title: 'Universal Schema Intermediate Representation (IR)',
        summary: 'Single-source-of-truth schema definitions mapping to both SQL DDL and MongoDB BSON document validation rules.',
        headings: [
          { id: 'overview', text: 'Overview', level: 2 },
          { id: 'field-primitives', text: 'Field Primitives', level: 2 },
          { id: 'type-inference', text: 'Static Type Inference', level: 2 },
        ],
        sections: [
          {
            id: 'overview',
            title: 'Overview',
            body: <p>MorphDB schemas decouple entity structures from database vendor primitives. A single <code>defineSchema</code> definition produces SQL DDL and MongoDB BSON validation schemas simultaneously.</p>,
            code: `import { defineSchema, field } from '@morphdb/schema';\n\nexport const ProductSchema = defineSchema('products', {\n  id: field.uuid().primaryKey(),\n  sku: field.string().unique(),\n  price: field.int(),\n  createdAt: field.dateTime().defaultToNow(),\n});`,
          },
          {
            id: 'field-primitives',
            title: 'Field Primitives',
            body: <p>Supported primitive builders include <code>field.uuid()</code>, <code>field.string()</code>, <code>field.int()</code>, <code>field.dateTime()</code>, <code>field.json()</code>, and <code>field.boolean()</code>.</p>,
          },
          {
            id: 'type-inference',
            title: 'Static Type Inference',
            body: <p>Extract TypeScript compile-time shapes automatically using <code>InferEntity&lt;typeof Schema&gt;</code> without running any code generation binaries.</p>,
            code: `import { InferEntity } from '@morphdb/schema';\n\nexport type Product = InferEntity<typeof ProductSchema>;`,
          },
        ],
      };

    case 'query-builder':
      return {
        title: 'Type-Safe Query Builder & AST Compiler',
        summary: 'Fluent, immutable query builder producing abstract syntax trees for target dialect translation.',
        headings: [
          { id: 'fluent-api', text: 'Fluent API', level: 2 },
          { id: 'ast-optimizer', text: 'AST Optimization Passes', level: 2 },
        ],
        sections: [
          {
            id: 'fluent-api',
            title: 'Fluent API',
            body: <p>Construct queries using method chaining (<code>select</code>, <code>where</code>, <code>join</code>, <code>orderBy</code>, <code>limit</code>). Every call returns a new frozen builder instance.</p>,
            code: `const qb = client.query(UserSchema)\n  .where('email', 'endsWith', '@enterprise.com')\n  .orderBy('createdAt', 'DESC')\n  .limit(20);`,
          },
          {
            id: 'ast-optimizer',
            title: 'AST Optimization Passes',
            body: <p>The <code>ASTOptimizer</code> injects safety bounds and pagination limits before passing nodes to visitor compilers.</p>,
          },
        ],
      };

    case 'adapters/postgres':
      return {
        title: 'PostgreSQL Database Adapter',
        summary: 'Official PostgreSQL adapter compiling AST nodes into parameterized SQL strings.',
        headings: [
          { id: 'overview', text: 'PostgreSQL Adapter Specs', level: 2 },
          { id: 'compiler', text: 'PostgresCompiler Visitor', level: 2 },
        ],
        sections: [
          {
            id: 'overview',
            title: 'PostgreSQL Adapter Specs',
            body: <p>Uses <code>pg.Pool</code> for connection pool management and handles SQL isolation levels (<code>BEGIN</code>, <code>COMMIT</code>, <code>SAVEPOINT</code>).</p>,
            code: `import { PostgresAdapter } from '@morphdb/adapter-postgres';\n\nconst adapter = new PostgresAdapter({\n  connectionString: process.env.DATABASE_URL,\n});`,
          },
          {
            id: 'compiler',
            title: 'PostgresCompiler Visitor',
            body: <p>Translates <code>SelectQueryNode</code> ASTs into parameterized SQL strings with parameter arrays to prevent SQL injection vulnerabilities.</p>,
          },
        ],
      };

    case 'adapters/mongodb':
      return {
        title: 'MongoDB Database Adapter',
        summary: 'Official MongoDB adapter lowering AST queries into aggregation pipeline stages.',
        headings: [
          { id: 'overview', text: 'MongoDB Adapter Specs', level: 2 },
          { id: 'compiler', text: 'MongoCompiler Visitor', level: 2 },
        ],
        sections: [
          {
            id: 'overview',
            title: 'MongoDB Adapter Specs',
            body: <p>Manages <code>MongoClient</code> connections and executes multi-document transactions using official MongoDB Client Sessions.</p>,
            code: `import { MongoAdapter } from '@morphdb/adapter-mongodb';\n\nconst adapter = new MongoAdapter('mongodb://localhost:27017', 'my_db');`,
          },
          {
            id: 'compiler',
            title: 'MongoCompiler Visitor',
            body: <p>Translates relational joins into <code>$lookup</code> aggregation pipeline stages and applies <code>$match</code>, <code>$sort</code>, and <code>$limit</code> bounds.</p>,
          },
        ],
      };

    default:
      return {
        title: 'Getting Started & Architecture Philosophy',
        summary: 'MorphDB is a Universal Data Abstraction Layer designed for high-performance, polyglot TypeScript applications.',
        headings: [
          { id: 'philosophy', text: 'Core Philosophy', level: 2 },
          { id: 'installation', text: 'Installation', level: 2 },
          { id: 'quick-example', text: 'Quick Example', level: 2 },
        ],
        sections: [
          {
            id: 'philosophy',
            title: 'Core Philosophy',
            body: <p>Modern applications should treat database storage engines as pluggable infrastructure components. MorphDB uses Hexagonal Architecture to isolate application business logic from physical database engines.</p>,
          },
          {
            id: 'installation',
            title: 'Installation',
            body: <p>Install the core orchestrator and target database adapters via pnpm or npm:</p>,
            code: `pnpm add @morphdb/core @morphdb/schema @morphdb/query-builder @morphdb/adapter-postgres`,
            language: 'bash',
          },
          {
            id: 'quick-example',
            title: 'Quick Example',
            body: <p>Initialize a client, attach an adapter, and execute queries cleanly across storage engines:</p>,
            code: `import { MorphDBClient } from '@morphdb/core';\nimport { PostgresAdapter } from '@morphdb/adapter-postgres';\n\nconst client = new MorphDBClient({\n  adapter: new PostgresAdapter({ connectionString: process.env.PG_URL })\n});\n\nawait client.connect();`,
          },
        ],
      };
  }
}
