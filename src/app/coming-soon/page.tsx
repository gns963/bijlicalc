import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Coming soon — DesiMetrics',
  description: 'This calculator is under construction and launching soon.',
  alternates: { canonical: 'https://desimetrics.com/coming-soon' },
  robots: { index: false },
}

export default function ComingSoonPage() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden hero-gradient">
      <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
      <main className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <p className="text-5xl">🚧</p>
        <h1 className="font-display mt-4 text-3xl font-bold text-white">
          Coming soon
        </h1>
        <p className="mt-3 text-lg text-white/70">
          We&apos;re still verifying tariff data for this calculator. Tamil Nadu
          (TNEB) is live today — more states and the solar &amp; AC tools are on
          the way.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/electricity/tneb-bill-calculator"
            className="rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brass/90"
          >
            Try the TNEB calculator
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50"
          >
            Back to home
          </Link>
        </div>
      </main>
    </section>
  )
}
