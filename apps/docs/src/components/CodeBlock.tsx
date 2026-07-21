'use client';

import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="w-full rounded-2xl border border-card-border bg-[#0b0e17] shadow-2xl overflow-hidden glass-card-sexy my-4">
      {/* Code Block Window Bar */}
      <div className="flex items-center justify-between border-b border-card-border bg-[#080a12] px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
          </div>
          {title ? (
            <span className="text-xs font-mono font-medium text-slate-300 pl-2 flex items-center space-x-1.5">
              <Code2 className="h-3.5 w-3.5 text-cyber-emerald" />
              <span>{title}</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold pl-2">
              {language}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-card/60 px-2.5 py-1 rounded-lg border border-card-border"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-cyber-emerald" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Content Container */}
      <div className="px-4 py-3 overflow-x-auto text-xs font-mono leading-relaxed bg-[#05070d] relative">
        <div className="flex min-w-full w-max">
          {showLineNumbers && (
            <div className="sticky left-0 bg-[#05070d] z-10 select-none text-slate-600 text-right pr-4 border-r border-card-border/60 space-y-1 shrink-0">
              {lines.map((_, i) => (
                <div key={`line-num-${i}`}>{i + 1}</div>
              ))}
            </div>
          )}

          <div className={`${showLineNumbers ? 'pl-4' : ''} flex-1 space-y-1`}>
            {lines.map((line, idx) => (
              <div key={`line-code-${idx}`} className="whitespace-pre min-h-[1.25rem]">
                {line.length === 0 ? '\u00A0' : highlightLine(line)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Token syntax highlighter for TypeScript, SQL, JSON, and Bash.
 */
function highlightLine(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('--') || line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  const strings = /('[^']*'|"[^"]*"|`[^`]*`)/g;

  // Split string tokens
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;

  const stringMatches = Array.from(line.matchAll(strings));
  if (stringMatches.length > 0) {
    for (const match of stringMatches) {
      const idx = match.index!;
      if (idx > lastIdx) {
        parts.push(<React.Fragment key={`seg-${lastIdx}`}>{highlightCodeSegment(line.substring(lastIdx, idx), idx)}</React.Fragment>);
      }
      parts.push(
        <span key={`str-${idx}`} className="text-emerald-300 font-semibold">
          {match[0]}
        </span>
      );
      lastIdx = idx + match[0].length;
    }
    if (lastIdx < line.length) {
      parts.push(<React.Fragment key={`seg-${lastIdx}`}>{highlightCodeSegment(line.substring(lastIdx), lastIdx)}</React.Fragment>);
    }
    return <>{parts}</>;
  }

  return highlightCodeSegment(line, 0);
}

function highlightCodeSegment(segment: string, keyOffset: number): React.ReactNode {
  const tokens = segment.split(/(\s+|[(),.:;={}[\]])/);
  return (
    <>
      {tokens.map((tok, i) => {
        const k = `tok-${keyOffset}-${i}`;
        if (/^(import|export|from|const|let|var|type|interface|class|extends|public|readonly|async|await|SELECT|FROM|WHERE|JOIN|INNER|LEFT|ORDER|BY|LIMIT|OFFSET|AND|OR|DESC|ASC)$/.test(tok)) {
          return <span key={k} className="text-purple-400 font-bold">{tok}</span>;
        }
        if (/^(SchemaIR|InferEntity|QueryBuilder|SelectQueryNode|FilterExpressionNode|DatabaseAdapter|MorphDBClient|UserSchema|ProductSchema|User|Product)$/.test(tok)) {
          return <span key={k} className="text-amber-300 font-semibold">{tok}</span>;
        }
        if (/^(defineSchema|field|uuid|primaryKey|string|unique|default|defaultToNow|int|dateTime|boolean|query|where|orderBy|limit|execute|accept|compile)$/.test(tok)) {
          return <span key={k} className="text-cyan-400 font-medium">{tok}</span>;
        }
        if (/^\d+$/.test(tok) || /^(true|false|null|undefined)$/.test(tok)) {
          return <span key={k} className="text-orange-400">{tok}</span>;
        }
        if (/^[\$\:]/.test(tok)) {
          return <span key={k} className="text-blue-400">{tok}</span>;
        }
        return <React.Fragment key={k}>{tok}</React.Fragment>;
      })}
    </>
  );
}
