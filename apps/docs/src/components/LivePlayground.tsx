'use client';

import React, { useState } from 'react';
import { Cpu, Database, Check, Copy, Sparkles, Layers } from 'lucide-react';

export function LivePlayground() {
  const [entityName, setEntityName] = useState('users');
  const [filterValue, setFilterValue] = useState('ACTIVE');
  const [limit, setLimit] = useState(10);
  const [dialect, setDialect] = useState<'postgres' | 'mongodb' | 'mysql' | 'sqlite'>('postgres');
  const [copied, setCopied] = useState(false);

  // Dynamic compiler output calculation
  const getCompiledOutput = () => {
    switch (dialect) {
      case 'postgres':
        return `-- Lowered via MorphDB PostgresCompiler\nSELECT "id", "email", "name", "status"\nFROM "${entityName}"\nWHERE "status" = $1 AND "isDeleted" = false\nORDER BY "createdAt" DESC\nLIMIT ${limit} OFFSET 0;\n\n-- Parameter Bindings:\n-- $1 = "${filterValue}"`;

      case 'mongodb':
        return `// Lowered via MorphDB MongoCompiler\ndb.${entityName}.aggregate([\n  { $match: { status: "${filterValue}", isDeleted: false } },\n  { $sort: { createdAt: -1 } },\n  { $limit: ${limit} },\n  { $project: { id: 1, email: 1, name: 1, status: 1 } }\n]);`;

      case 'mysql':
        return `-- Lowered via MorphDB MySQLCompiler\nSELECT \`id\`, \`email\`, \`name\`, \`status\`\nFROM \`${entityName}\`\nWHERE \`status\` = ? AND \`isDeleted\` = false\nORDER BY \`createdAt\` DESC\nLIMIT ${limit} OFFSET 0;\n\n-- Parameter Bindings:\n-- [1] = "${filterValue}"`;

      case 'sqlite':
        return `-- Lowered via MorphDB SQLiteCompiler\nSELECT "id", "email", "name", "status"\nFROM "${entityName}"\nWHERE "status" = ? AND "isDeleted" = 0\nORDER BY "createdAt" DESC\nLIMIT ${limit} OFFSET 0;\n\n-- Parameter Bindings:\n-- [1] = "${filterValue}"`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCompiledOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-card-border bg-card/90 shadow-2xl overflow-hidden glass-card-sexy">
      {/* Playground Window Controls Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-card-border bg-background/80 px-5 py-3.5">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 flex items-center space-x-1.5 pl-2">
            <Cpu className="h-3.5 w-3.5 text-cyber-emerald" />
            <span>MorphDB AST Live Compiler Engine</span>
          </span>
        </div>

        {/* Target Dialect Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">Target Dialect:</span>
          {(['postgres', 'mongodb', 'mysql', 'sqlite'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDialect(d)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                dialect === d
                  ? 'bg-cyber-emerald text-background font-bold shadow-md shadow-cyber-emerald/30'
                  : 'bg-background/60 text-slate-400 hover:text-white border border-card-border'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Code Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-card-border">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-background/40">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Layers className="h-4 w-4 text-cyber-cyan" />
              <span>Query Parameters</span>
            </h4>
            <span className="flex items-center space-x-1 text-[10px] text-cyber-emerald bg-cyber-emerald/10 px-2 py-0.5 rounded-full border border-cyber-emerald/30">
              <Sparkles className="h-3 w-3" />
              <span>Live Reactive</span>
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Entity / Collection Name:</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full h-9 rounded-lg bg-card px-3 text-white border border-card-border focus:border-cyber-emerald focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Filter Status Value:</label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full h-9 rounded-lg bg-card px-3 text-white border border-card-border focus:border-cyber-emerald focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1.5">
                <label className="font-medium">Pagination Limit:</label>
                <span className="font-mono text-cyber-emerald font-bold">{limit}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full accent-cyber-emerald cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-card-border text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>AST Transformation Pass:</span>
              <span className="text-emerald-400 font-mono font-semibold">ASTOptimizer (Pass 1)</span>
            </div>
            <div className="flex justify-between">
              <span>Compiler Latency:</span>
              <span className="text-cyan-400 font-mono font-semibold">&lt; 0.12 ms</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Display */}
        <div className="lg:col-span-7 p-6 bg-[#05070d] flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold text-slate-300 flex items-center space-x-1.5">
              <Database className="h-4 w-4 text-cyber-emerald" />
              <span className="capitalize">{dialect} Dialect Output</span>
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors bg-card/60 px-2.5 py-1 rounded-lg border border-card-border"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-cyber-emerald" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto p-4 rounded-xl bg-background/80 border border-card-border flex-1">
            <code>{getCompiledOutput()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
