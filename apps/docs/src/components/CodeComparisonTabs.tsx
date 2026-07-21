'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Database, Sparkles } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-3"
    >
      {/* Tab Selector Buttons */}
      <div className="flex flex-wrap items-center space-x-2 bg-card/80 p-2 rounded-xl border border-card-border w-fit glass-card-sexy">
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'schema'
              ? 'bg-gradient-to-r from-cyber-emerald to-cyber-cyan text-background shadow-lg shadow-cyber-emerald/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>1. Universal Schema IR</span>
        </button>

        <button
          onClick={() => setActiveTab('postgres')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'postgres'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>2. PostgreSQL SQL Compiler</span>
        </button>

        <button
          onClick={() => setActiveTab('mongodb')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'mongodb'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>3. MongoDB Aggregation Lowering</span>
        </button>
      </div>

      {/* CodeBlock Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <CodeBlock
            code={SNIPPETS[activeTab]}
            language={activeTab === 'postgres' ? 'sql' : 'typescript'}
            title={
              activeTab === 'schema'
                ? 'schema.ts — MorphDB Schema IR'
                : activeTab === 'postgres'
                ? 'query.sql — Lowered Parameterized SQL'
                : 'pipeline.js — Lowered Mongo Aggregation Pipeline'
            }
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
