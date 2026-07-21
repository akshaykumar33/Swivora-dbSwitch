import React from 'react';
import Link from 'next/link';

interface NavItem {
  title: string;
  href: string;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const NAVIGATION: NavGroup[] = [
  {
    category: 'Getting Started',
    items: [
      { title: 'Overview & Philosophy', href: '/docs/getting-started' },
      { title: 'Installation & Setup', href: '/docs/installation' },
      { title: 'Quick Start Tutorial', href: '/docs/quick-start' },
    ],
  },
  {
    category: 'Core Concepts',
    items: [
      { title: 'Universal Schema IR', href: '/docs/schema' },
      { title: 'Query AST & Compiler', href: '/docs/query-builder' },
      { title: 'Capability Matrix', href: '/docs/capabilities' },
      { title: 'Context & Identity Map', href: '/docs/context' },
    ],
  },
  {
    category: 'Database Adapters',
    items: [
      { title: 'PostgreSQL Adapter', href: '/docs/adapters/postgres' },
      { title: 'MongoDB Adapter', href: '/docs/adapters/mongodb' },
      { title: 'Adapter SDK Contracts', href: '/docs/adapters/sdk' },
    ],
  },
  {
    category: 'Architecture & Performance',
    items: [
      { title: 'High-Level Architecture (HLD)', href: '/docs/architecture' },
      { title: 'Low-Level Design (LLD)', href: '/docs/lld' },
      { title: 'Compiler Latency Benchmarks', href: '/docs/benchmarks' },
    ],
  },
];

export function Sidebar({ activeHref }: { activeHref?: string }) {
  return (
    <aside className="w-64 shrink-0 border-r border-card-border bg-background/50 p-4 font-sans text-xs">
      <div className="space-y-6 sticky top-20">
        {NAVIGATION.map((group) => (
          <div key={group.category} className="space-y-2">
            <h3 className="font-semibold uppercase tracking-wider text-slate-400">{group.category}</h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-3 py-1.5 font-medium transition-all ${
                        isActive
                          ? 'bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30'
                          : 'text-slate-300 hover:bg-card/50 hover:text-white'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
