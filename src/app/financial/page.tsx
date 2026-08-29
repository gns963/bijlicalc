import type { Metadata } from 'next'
import Link from 'next/link'

const SITE = 'https://bijlicalc.com'

export const metadata: Metadata = {
  title: 'Financial Calculators — GST, SIP, Income Tax & Gratuity (India)',
  description:
    'Free Indian personal-finance calculators: GST calculator, SIP returns, new vs old income tax regime for FY 2026-27, and gratuity — accurate, fast and mobile-friendly.',
  alternates: { canonical: `${SITE}/financial` },
  openGraph: { url: `${SITE}/financial`, type: 'website' },
}

const cards = [
  {
    href: '/financial/gst-calculator',
    emoji: '🧾',
    title: 'GST Calculator',
    body: 'Add or remove GST for any slab, with CGST/SGST split.',
    cta: 'Open →',
  },
  {
    href: '/financial/sip-calculator',
    emoji: '📈',
    title: 'SIP Calculator',
    body: 'Project mutual fund SIP maturity value and gains, with a growth chart.',
    cta: 'Open →',
  },
  {
    href: '/financial/new-vs-old-tax-regime-calculator',
    emoji: '🏦',
    title: 'New vs Old Tax Regime',
    body: 'Compare income tax under both regimes for FY 2026-27 and see which wins.',
    cta: 'Open →',
  },
  {
    href: '/financial/gratuity-calculator',
    emoji: '💼',
    title: 'Gratuity Calculator',
    body: 'Compute gratuity from salary and service years using the 15/26 formula.',
    cta: 'Open →',
  },
]

export default function FinancialHubPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            Financial
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Financial Calculators
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Fast, accurate personal-finance tools for India — GST, mutual fund
          SIPs, income tax regime comparison and gratuity. Free and updated for
          the current financial year.
        </p>
      </header>

      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">
              {c.body}
            </p>
            <span className="mt-3 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
              {c.cta}
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="why" className="mb-10">
        <h2 id="why" className="mb-4 text-2xl font-semibold">
          One platform for bills and money
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          bijlicalc started with electricity bills and now covers the everyday
          numbers Indian households search for most — from what you owe in GST to
          how much a SIP could grow, which tax regime saves you more, and the
          gratuity you&apos;ve earned. Same clean, no-login tools, all in one
          place.
        </p>
      </section>
    </main>
  )
}
