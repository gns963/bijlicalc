import type { Metadata } from 'next'
import Link from 'next/link'
import { CALCULATOR_PAGES } from '@/data/calculator-pages'
import discomsJson from '@/data/discoms.json'
import { getTariff } from '@/lib/calc/electricity'

const SITE = 'https://bijlicalc.com'

export const metadata: Metadata = {
  title: 'Electricity Bill Calculators by State & DISCOM (India) | bijlicalc',
  description:
    'Free, accurate electricity bill calculators for Indian DISCOMs — real telescopic slab tariffs, subsidies and fuel cost adjustment. TNEB, MSEDCL, UPPCL, BESCOM, KSEB and WBSEDCL, with more states coming.',
  alternates: { canonical: `${SITE}/electricity` },
  openGraph: { url: `${SITE}/electricity`, type: 'website' },
}

const live = CALCULATOR_PAGES.map((p) => {
  const tariff = getTariff(p.discomCode)
  return {
    slug: p.slug,
    discomCode: p.discomCode,
    state: tariff.state,
    billingCycle: tariff.billingCycle,
  }
}).sort((a, b) => a.state.localeCompare(b.state))

const totalStatesUts = discomsJson.states.length

export default function ElectricityHubPage() {
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
            Electricity
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Electricity Bill Calculators by State
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Estimate your electricity bill using your DISCOM&apos;s real,
          source-cited tariff — telescopic slabs, fixed charge, fuel cost
          adjustment, electricity duty and subsidies. {live.length} DISCOMs are
          live now, out of {totalStatesUts} states and union territories we&apos;re
          building towards.
        </p>
      </header>

      <section aria-labelledby="live" className="mb-10">
        <h2 id="live" className="mb-4 text-2xl font-semibold">
          Available calculators
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {live.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/electricity/${d.slug}`}
                className="block rounded-xl border border-indigo-200 bg-indigo-50 p-4 transition hover:border-indigo-400 hover:shadow-sm dark:border-indigo-800 dark:bg-indigo-950/40"
              >
                <span className="font-semibold text-slate-900 dark:text-white">
                  {d.state}
                </span>
                <span className="mt-1 block text-xs text-indigo-700 dark:text-indigo-300">
                  {d.discomCode} · {d.billingCycle} billing · Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="more" className="mb-10">
        <h2 id="more" className="mb-2 text-2xl font-semibold">
          More states coming
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          We&apos;re adding DISCOMs by demand. Want yours next?{' '}
          <Link href="/contact" className="text-indigo-600 underline">
            Request a state
          </Link>{' '}
          and see our{' '}
          <Link href="/data-sources" className="text-indigo-600 underline">
            data sources
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
