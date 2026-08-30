import Link from 'next/link'
import type { ReactNode } from 'react'

/** Minimal shared shell for the trust/legal stub pages. */
export default function LegalPageShell({
  title,
  intro,
  children,
  stub = true,
}: {
  title: string
  intro: string
  children?: ReactNode
  /** When false, omits the "this is a stub" footer note (for finished pages). */
  stub?: boolean
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-brass">
          Home
        </Link>{' '}
        / <span className="text-slate-700 dark:text-slate-300">{title}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{intro}</p>
      <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
        {children}
      </div>
      <p className="mt-10 text-sm text-slate-400">
        Last updated: 29 August 2026
        {stub ? ' · This page is a stub and will be expanded before launch.' : ''}
      </p>
    </main>
  )
}
