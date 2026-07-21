'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Info } from 'lucide-react';

interface EngineCapabilities {
  name: string;
  paradigm: string;
  acid: boolean;
  joins: boolean;
  savepoints: boolean;
  returning: boolean;
  json: boolean;
  notes: string;
}

const ENGINES: EngineCapabilities[] = [
  {
    name: 'PostgreSQL',
    paradigm: 'Relational (SQL)',
    acid: true,
    joins: true,
    savepoints: true,
    returning: true,
    json: true,
    notes: 'Native full feature parity with AST Visitor passes.',
  },
  {
    name: 'MongoDB',
    paradigm: 'Document (BSON)',
    acid: true,
    joins: true,
    savepoints: false,
    returning: false,
    json: true,
    notes: 'Joins lowered via $lookup aggregation pipelines.',
  },
  {
    name: 'MySQL',
    paradigm: 'Relational (SQL)',
    acid: true,
    joins: true,
    savepoints: true,
    returning: false,
    json: true,
    notes: 'Backtick identifier escaping with positional ? parameters.',
  },
  {
    name: 'SQLite',
    paradigm: 'Relational (Embedded SQL)',
    acid: true,
    joins: true,
    savepoints: true,
    returning: true,
    json: true,
    notes: 'In-memory and file-backed embedded ACID transactions.',
  },
  {
    name: 'Redis',
    paradigm: 'Key-Value / Cache',
    acid: false,
    joins: false,
    savepoints: false,
    returning: false,
    json: true,
    notes: 'Phase 2 secondary index mapping & LRU AST plan cache.',
  },
  {
    name: 'Neo4j',
    paradigm: 'Graph Engine',
    acid: true,
    joins: true,
    savepoints: false,
    returning: true,
    json: false,
    notes: 'Phase 3 Cypher relationship traversal lowering.',
  },
];

export function CapabilityInspector() {
  const [selectedEngine, setSelectedEngine] = useState<string>('PostgreSQL');
  const engine = ENGINES.find((e) => e.name === selectedEngine) ?? ENGINES[0]!;

  return (
    <div className="w-full rounded-2xl border border-card-border bg-card/80 p-6 glass-card-sexy space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-cyber-emerald" />
            <span>Interactive Dynamic Capability Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            MorphDB inspects target database engine capabilities at runtime before executing queries.
          </p>
        </div>

        {/* Engine selector tabs */}
        <div className="flex flex-wrap gap-2">
          {ENGINES.map((e) => (
            <button
              key={e.name}
              onClick={() => setSelectedEngine(e.name)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedEngine === e.name
                  ? 'bg-gradient-to-r from-cyber-emerald to-cyber-cyan text-background font-bold shadow-md shadow-cyber-emerald/20'
                  : 'bg-background/80 text-slate-400 hover:text-white border border-card-border'
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Engine Capability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <CapabilityCard title="ACID Transactions" supported={engine.acid} />
        <CapabilityCard title="Relational Joins" supported={engine.joins} />
        <CapabilityCard title="Savepoints / Sub-Tx" supported={engine.savepoints} />
        <CapabilityCard title="RETURNING Clause" supported={engine.returning} />
        <CapabilityCard title="JSON Path Search" supported={engine.json} />
      </div>

      {/* Engine Notes */}
      <div className="flex items-center space-x-2 rounded-xl bg-background/60 p-4 border border-card-border text-xs text-slate-300">
        <Info className="h-4 w-4 text-cyber-cyan shrink-0" />
        <div>
          <span className="font-semibold text-white mr-1.5">{engine.name} ({engine.paradigm}):</span>
          <span className="text-slate-400">{engine.notes}</span>
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({ title, supported }: { title: string; supported: boolean }) {
  return (
    <div
      className={`rounded-xl p-4 border flex flex-col justify-between space-y-3 transition-all ${
        supported
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
          : 'bg-slate-900/40 border-slate-800 text-slate-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{title}</span>
        {supported ? (
          <CheckCircle2 className="h-4 w-4 text-cyber-emerald" />
        ) : (
          <XCircle className="h-4 w-4 text-slate-600" />
        )}
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider">
        {supported ? 'Supported' : 'Not Supported'}
      </span>
    </div>
  );
}
