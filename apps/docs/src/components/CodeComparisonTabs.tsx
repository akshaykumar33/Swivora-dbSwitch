'use client';

import React, { useState } from 'react';
import { Code2, Check, Copy, Database, Sparkles } from 'lucide-react';

const SNIPPETS = {
  schema: `import { defineSchema, field } from '@morphdb/schema';

// Write Once: Declare canonical polyglot schema
export const UserSchema = defineSchema('users', {
  id: field.uuid().primaryKey(),
  email: field.string().unique(),
  name: field.string(),
  status: field.string().default('ACTIVE'),
  createdAt: field.dateTime().defaultToNow(),
});

// Infer TypeScript type shape automatically
export type User = InferEntity<typeof UserSchema>;`,

  postgres: `-- Lowering Pass Output: MorphDB PostgresCompiler
SELECT 
  "id", "email", "name", "status", "createdAt"
FROM 
  "users"
INNER JOIN 
  "orders" ON "users"."id" = "orders"."user_id"
WHERE 
  "email" LIKE '%' || $1
ORDER BY 
  "createdAt" DESC
LIMIT 10 OFFSET 0;`,

  mongodb: `// Lowering Pass Output: MorphDB MongoCompiler
db.users.aggregate([
  {
    $match: { email: { $regex: '@enterprise.com$', $options: 'i' } }
  },
  {
    $lookup: {
      from: 'orders',
      localField: '_id',
      foreignField: 'userId',
      as: 'orders'
    }
  },
  { $sort: { createdAt: -1 } },
  { $limit: 10 },
  { $project: { id: 1, email: 1, name: 1, status: 1, createdAt: 1 } }
]);`,
};

export function CodeComparisonTabs() {
  const [activeTab, setActiveTab] = useState<'schema' | 'postgres' | 'mongodb'>('schema');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-card-border bg-card/90 shadow-2xl overflow-hidden glass-card">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-card-border bg-background/60 px-4 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'schema'
                ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>1. Universal Schema IR</span>
          </button>

          <button
            onClick={() => setActiveTab('postgres')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'postgres'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>2. PostgreSQL SQL Compiler</span>
          </button>

          <button
            onClick={() => setActiveTab('mongodb')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'mongodb'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>3. MongoDB Aggregation Lowering</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-cyber-emerald" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Display Container */}
      <div className="p-4 bg-[#070a11] overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed text-emerald-400">
          <code>{SNIPPETS[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}
