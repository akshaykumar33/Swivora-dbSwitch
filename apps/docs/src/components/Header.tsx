import React from 'react';
import Link from 'next/link';
import { Database, Github, Search, BookOpen, Layers, Zap, Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyber-emerald to-cyber-cyan p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                <Database className="h-5 w-5 text-cyber-emerald" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Morph<span className="text-cyber-emerald">DB</span>
            </span>
          </Link>
          <span className="rounded-full bg-cyber-emerald/10 px-2.5 py-0.5 text-xs font-semibold text-cyber-emerald border border-cyber-emerald/20">
            v1.0.0 UDAL
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <Link href="/docs/getting-started" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5">
            <BookOpen className="h-4 w-4" />
            <span>Docs</span>
          </Link>
          <Link href="/docs/schema" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5">
            <Layers className="h-4 w-4" />
            <span>Schema IR</span>
          </Link>
          <Link href="/docs/adapters/postgres" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5">
            <Zap className="h-4 w-4" />
            <span>Adapters</span>
          </Link>
          <Link href="/docs/architecture" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5">
            <Terminal className="h-4 w-4" />
            <span>Architecture</span>
          </Link>
        </nav>

        {/* Right Action Icons & Search Launcher */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search docs (Ctrl+K)..."
              className="h-9 w-64 rounded-lg bg-card pl-9 pr-4 text-xs text-slate-200 border border-card-border focus:border-cyber-emerald focus:outline-none transition-all"
              readOnly
            />
          </div>

          <a
            href="https://github.com/akshaykumar33/Swivora-dbSwitch"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-slate-300 hover:text-white border border-card-border hover:border-cyber-emerald/40 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
