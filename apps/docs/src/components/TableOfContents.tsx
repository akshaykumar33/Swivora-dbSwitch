import React from 'react';
import { AlignLeft } from 'lucide-react';

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TOCHeading[] }) {
  if (!headings || headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-56 shrink-0 p-4 font-sans text-xs">
      <div className="sticky top-20 space-y-3">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
          <AlignLeft className="h-4 w-4 text-cyber-emerald" />
          <span>On This Page</span>
        </div>

        <ul className="space-y-1.5 border-l border-card-border pl-3 text-slate-400">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${heading.id}`}
                className="block hover:text-cyber-emerald transition-colors line-clamp-1"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
