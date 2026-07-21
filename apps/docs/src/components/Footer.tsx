import React from 'react';
import Link from 'next/link';
import { Database, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-cyber-emerald" />
              <span className="text-lg font-bold text-white">MorphDB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Universal Data Abstraction Layer. Write Once. Connect Everywhere.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Documentation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/docs/getting-started" className="hover:text-cyber-emerald">Getting Started</Link></li>
              <li><Link href="/docs/schema" className="hover:text-cyber-emerald">Universal Schema IR</Link></li>
              <li><Link href="/docs/query-builder" className="hover:text-cyber-emerald">Query Builder API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Adapters</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/docs/adapters/postgres" className="hover:text-cyber-emerald">PostgreSQL Adapter</Link></li>
              <li><Link href="/docs/adapters/mongodb" className="hover:text-cyber-emerald">MongoDB Adapter</Link></li>
              <li><Link href="/docs/capabilities" className="hover:text-cyber-emerald">Capability Matrix</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/docs/architecture" className="hover:text-cyber-emerald">High & Low Level Design</Link></li>
              <li><Link href="/docs/benchmarks" className="hover:text-cyber-emerald">Compiler Benchmarks</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-card-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MorphDB Open Source Project. Released under MIT License.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>by Founding Engineering Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
