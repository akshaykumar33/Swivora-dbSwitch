import React from 'react';
import Link from 'next/link';
import { Database, Github, Search, BookOpen, Layers, Zap, Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Operational Status */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyber-emerald via-cyber-cyan to-cyber-violet p-0.5 shadow-lg shadow-cyber-emerald/20 group-hover:scale-105 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                <Database className="h-5 w-5 text-cyber-emerald group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-outfit">
              Morph<span className="text-gradient-emerald-cyan">DB</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center space-x-1.5 rounded-full bg-cyber-emerald/10 px-3 py-1 text-[11px] font-semibold text-cyber-emerald border border-cyber-emerald/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
            </span>
            <span>UDAL v1.0.0</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold tracking-wide text-slate-300">
          <Link href="/docs/getting-started" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5 py-1">
            <BookOpen className="h-4 w-4 text-cyber-emerald" />
            <span>Docs</span>
          </Link>
          <Link href="/docs/schema" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5 py-1">
            <Layers className="h-4 w-4 text-cyber-cyan" />
            <span>Schema IR</span>
          </Link>
          <Link href="/docs/adapters/postgres" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5 py-1">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Adapters</span>
          </Link>
          <Link href="/docs/architecture" className="hover:text-cyber-emerald transition-colors flex items-center space-x-1.5 py-1">
            <Terminal className="h-4 w-4 text-cyber-violet" />
            <span>Architecture</span>
          </Link>
        </nav>

        {/* Search Launcher & GitHub CTA */}
        <div className="flex items-center space-x-3">
          <button className="hidden sm:flex items-center space-x-3 h-9 w-60 rounded-xl bg-card/90 px-3 text-xs text-slate-400 border border-card-border hover:border-cyber-emerald/40 hover:text-white transition-all shadow-inner">
            <Search className="h-4 w-4 text-cyber-emerald" />
            <span className="flex-1 text-left">Quick Search...</span>
            <kbd className="rounded bg-background px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-card-border">⌘K</kbd>
          </button>

          <a
            href="https://github.com/akshaykumar33/Swivora-dbSwitch"
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-slate-300 hover:text-white border border-card-border hover:border-cyber-emerald/40 transition-colors glass-card-sexy"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
