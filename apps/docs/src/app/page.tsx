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
  Activity,
} from 'lucide-react';
import { CodeComparisonTabs } from '../components/CodeComparisonTabs';
import { LivePlayground } from '../components/LivePlayground';
import { CapabilityInspector } from '../components/CapabilityInspector';

export default function LandingPage() {
  return (
    <div className="space-y-28 pb-24 bg-ambient-glow">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-cyber-emerald/15 via-cyber-cyan/15 to-cyber-violet/15 px-4 py-1.5 text-xs font-semibold text-cyber-emerald border border-cyber-emerald/30 shadow-inner">
              <Sparkles className="h-4 w-4 text-cyber-emerald animate-spin" />
              <span>Universal Data Abstraction Layer (UDAL) for TypeScript</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] font-outfit">
              Write Once. <br />
              <span className="text-gradient-emerald-cyan">Connect Everywhere.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto max-w-3xl text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              MorphDB translates schemas, queries, and transactions across <strong className="text-white">PostgreSQL</strong>, <strong className="text-white">MongoDB</strong>, <strong className="text-white">MySQL</strong>, and <strong className="text-white">SQLite</strong> while keeping your application domain logic 100% decoupled from physical database drivers.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/docs/getting-started"
                className="flex items-center space-x-2.5 rounded-xl bg-gradient-to-r from-cyber-emerald via-cyber-cyan to-blue-500 px-7 py-4 text-sm font-bold text-background shadow-xl shadow-cyber-emerald/25 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/docs/schema"
                className="flex items-center space-x-2.5 rounded-xl bg-card/90 px-7 py-4 text-sm font-semibold text-slate-200 border border-card-border hover:border-cyber-emerald/50 hover:text-white transition-all glass-card-sexy"
              >
                <Database className="h-4 w-4 text-cyber-emerald" />
                <span>Explore Universal Schema IR</span>
              </Link>
            </div>
          </div>

          {/* Interactive Code Comparison Section */}
          <div className="mt-16 mx-auto max-w-5xl">
            <CodeComparisonTabs />
          </div>
        </div>
      </section>

      {/* Live Interactive AST Playground Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 rounded-full bg-cyber-cyan/10 px-3 py-1 text-xs font-semibold text-cyber-cyan border border-cyber-cyan/30">
            <Activity className="h-3.5 w-3.5" />
            <span>Interactive Live Engine Demo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit">
            Real-Time AST Compilation Playground
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Edit parameters dynamically and observe how MorphDB lowers query ASTs into target SQL and BSON aggregation pipelines.
          </p>
        </div>

        <LivePlayground />
      </section>

      {/* Feature Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit">
            Enterprise Architecture Standards
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Architected following Clean Architecture, AST Compiler lowering passes, and strict SOLID engineering principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Layers className="h-6 w-6 text-cyber-emerald" />}
            title="Universal Schema IR"
            description="Declare polyglot entity schemas once. Automatically generates PostgreSQL SQL DDL, MySQL DDL, and MongoDB BSON document validation schemas."
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

      {/* Dynamic Capability Inspector Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CapabilityInspector />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card/70 p-7 glass-card-sexy space-y-4">
      <div className="p-3 rounded-xl bg-background/90 w-fit border border-card-border shadow-inner">{icon}</div>
      <h3 className="text-lg font-bold text-white font-outfit">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
