import React from 'react';
import Link from 'next/link';
import {
  Database,
  ArrowRight,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CodeComparisonTabs } from '../components/CodeComparisonTabs';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-cyber-emerald/10 px-4 py-1.5 text-xs font-semibold text-cyber-emerald border border-cyber-emerald/30 shadow-inner">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Introducing MorphDB v1.0.0 Universal Data Abstraction Layer</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Write Once. <br />
              <span className="text-gradient">Connect Everywhere.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
              MorphDB is a Universal Data Abstraction Layer (UDAL) that translates schemas, queries, and transactions across PostgreSQL, MongoDB, and polyglot database engines while keeping domain business logic 100% decoupled.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/docs/getting-started"
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyber-emerald to-cyber-cyan px-6 py-3.5 text-sm font-bold text-background shadow-lg shadow-cyber-emerald/20 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/docs/schema"
                className="flex items-center space-x-2 rounded-xl bg-card px-6 py-3.5 text-sm font-semibold text-slate-200 border border-card-border hover:border-cyber-emerald/40 hover:text-white transition-all glass-card"
              >
                <Database className="h-4 w-4 text-cyber-emerald" />
                <span>Explore Schema IR</span>
              </Link>
            </div>
          </div>

          {/* Interactive Code Comparison Section */}
          <div className="mt-14 mx-auto max-w-4xl">
            <CodeComparisonTabs />
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Enterprise Architecture by Design
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Built upon Hexagonal Architecture, AST compiler passes, and strict SOLID principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-cyber-emerald" />}
            title="Universal Schema IR"
            description="Declare polyglot entity schemas once. Automatically generates PostgreSQL SQL DDL and MongoDB BSON document validation schemas."
          />
          <FeatureCard
            icon={<Cpu className="h-6 w-6 text-cyber-cyan" />}
            title="AST Compiler Pipeline"
            description="Fluent queries lower into immutable AST nodes. Dialect visitor compilers translate ASTs to parameterized SQL or Aggregation Pipelines."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-cyber-violet" />}
            title="Dynamic Capability Matrix"
            description="Advertises database capabilities at runtime. Asserts feature availability (joins, savepoints, ACID transactions) before execution."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-amber-400" />}
            title="Unit of Work & Identity Map"
            description="Tracks transactional entity states (clean, dirty, new) and ensures JavaScript object reference equality across operations."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-blue-400" />}
            title="Zero-Magic Type Safety"
            description="100% TypeScript generics with inferential static type extraction (InferEntity). Zero binary code generators or opaque IPC proxies."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-emerald-400" />}
            title="AsyncLocalStorage Context"
            description="Propagates multi-tenant IDs and transaction session handles implicitly across asynchronous call stacks."
          />
        </div>
      </section>

      {/* Polyglot Engine Matrix Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-card-border bg-card/60 p-8 glass-card">
          <div className="text-center space-y-3 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Polyglot Storage Engine Support</h3>
            <p className="text-xs text-slate-400">
              Adapters satisfied via generic Adapter SDK contracts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-card-border text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Database Engine</th>
                  <th className="py-3 px-4">Paradigm</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Key Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/50 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">PostgreSQL</td>
                  <td className="py-3.5 px-4">Relational (SQL)</td>
                  <td className="py-3.5 px-4"><StatusBadge text="Production Ready" color="emerald" /></td>
                  <td className="py-3.5 px-4">ACID, Joins, Savepoints, Returning Clause</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">MongoDB</td>
                  <td className="py-3.5 px-4">Document (BSON)</td>
                  <td className="py-3.5 px-4"><StatusBadge text="Production Ready" color="emerald" /></td>
                  <td className="py-3.5 px-4">Aggregation Pipeline, Nested Docs, Multi-Doc Tx</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">MySQL / SQLite</td>
                  <td className="py-3.5 px-4">Relational (SQL)</td>
                  <td className="py-3.5 px-4"><StatusBadge text="Phase 2 Roadmap" color="cyan" /></td>
                  <td className="py-3.5 px-4">Relational DDL, Parameterized Queries</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Redis</td>
                  <td className="py-3.5 px-4">Key-Value / Cache</td>
                  <td className="py-3.5 px-4"><StatusBadge text="Phase 2 Roadmap" color="cyan" /></td>
                  <td className="py-3.5 px-4">Secondary Index Mapping, LRU Plan Caching</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Neo4j</td>
                  <td className="py-3.5 px-4">Graph Engine</td>
                  <td className="py-3.5 px-4"><StatusBadge text="Phase 3 Roadmap" color="violet" /></td>
                  <td className="py-3.5 px-4">Cypher Path Lowering, Relationship Traversals</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card/60 p-6 glass-card space-y-3 transition-all">
      <div className="p-2.5 rounded-lg bg-background/80 w-fit border border-card-border">{icon}</div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StatusBadge({ text, color }: { text: string; color: 'emerald' | 'cyan' | 'violet' }) {
  const styles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    violet: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${styles[color]}`}>
      <CheckCircle2 className="h-3 w-3" />
      <span>{text}</span>
    </span>
  );
}
