import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Coming soon — bijlicalc',
  description: 'This calculator is under construction and launching soon.',
  alternates: { canonical: 'https://bijlicalc.com/coming-soon' },
  robots: { index: false },
}

export default function ComingSoonPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-5xl">🚧</p>
      <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
        Coming soon
      </h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
        We&apos;re still verifying tariff data for this calculator. Tamil Nadu
        (TNEB) is live today — more states and the solar &amp; AC tools are on
        the way.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/electricity/tneb-bill-calculator"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try the TNEB calculator
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-200"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
