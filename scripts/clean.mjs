#!/usr/bin/env node

/**
 * @fileoverview Cross-platform monorepo cleanup script.
 *
 * Recursively walks the repository and removes build artifacts,
 * caches, and dependency directories. Skips `.git` to avoid
 * corrupting the repository.
 *
 * Usage:
 *   node scripts/clean.mjs
 *   pnpm clean
 */

import { readdir, rm, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';

/** Directory names to delete when encountered. */
const TARGETS = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'dist',
]);

/** Directories to never descend into. */
const SKIP = new Set(['.git']);

let removed = 0;

/**
 * Recursively walk `dir`, removing any child directory whose
 * basename is in `TARGETS`. Once a target is found it is deleted
 * entirely (no further descent into it).
 */
async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // permission / symlink errors – skip silently
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const name = entry.name;
    const full = join(dir, name);

    if (SKIP.has(name)) continue;

    if (TARGETS.has(name)) {
      console.log(`  ✕  ${full}`);
      await rm(full, { recursive: true, force: true });
      removed++;
      continue;
    }

    // Recurse into non-target directories
    await walk(full);
  }
}

const root = process.cwd();
console.log(`\n🧹 MorphDB Monorepo Clean\n`);
console.log(`Root: ${root}`);
console.log(`Targets: ${[...TARGETS].join(', ')}\n`);

await walk(root);

console.log(`\n✓ Removed ${removed} ${removed === 1 ? 'directory' : 'directories'}.\n`);
