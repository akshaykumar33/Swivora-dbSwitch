import React from 'react';
import { Sidebar } from '../../components/Sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 min-w-0">{children}</div>
    </div>
  );
}
