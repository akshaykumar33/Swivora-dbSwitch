import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'MorphDB - Universal Data Abstraction Layer (UDAL)',
  description:
    'Write Once. Connect Everywhere. MorphDB translates schemas, queries, and transactions across PostgreSQL, MongoDB, and polyglot engines.',
  keywords: ['MorphDB', 'UDAL', 'ORM', 'PostgreSQL', 'MongoDB', 'TypeScript', 'AST Compiler'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-background text-slate-100 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
