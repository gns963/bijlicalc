import type { Metadata } from 'next'
import Link from 'next/link'
import AffiliateProductCard from '@/components/AffiliateProductCard'
import AcBillCalculator from '@/components/calculators/AcBillCalculator'
import { AC_PRODUCTS } from '@/data/ac-products'
import discomsJson from '@/data/discoms.json'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'
const PATH = '/ac/bill-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = calculateAcCost({
  discomCode: 'TNEB',
  tonnage: 1.5,
  starRating: 3,
  dailyHours: 8,
})

export const metadata: Metadata = {
  title: 'AC Running Cost Calculator 2026 — Monthly & Yearly Electricity Cost',
  description:
    'Calculate your air conditioner’s electricity cost by tonnage, star rating, daily hours and DISCOM. Uses ISEER efficiency and your state’s top-slab tariff for a realistic estimate.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AC Running Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

export default function AcBillCalculatorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brass">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/ac" className="hover:text-brass">
              AC
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            Running Cost Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          AC Running Cost Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Find out what your air conditioner actually costs to run. Enter its
          tonnage, star rating and daily hours, pick your DISCOM, and we price
          the units at your state&apos;s <strong>top electricity slab</strong> —
          because AC is extra load billed at your highest rate.
        </p>
      </header>

      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-spark-teal/10 bg-spark-teal/5 p-5 dark:border-spark-teal/20 dark:bg-spark-teal/15/40"
      >
        <h2
          id="worked-example"
          className="text-sm font-semibold uppercase tracking-wide text-spark-teal dark:text-spark-teal"
        >
          Worked example
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          A <strong>1.5 ton 3-star</strong> AC running 8 hours/day in Tamil Nadu
          uses about <strong>{example.dailyUnits} units/day</strong> and costs
          roughly <strong>{formatINR(example.monthlyCost)}/month</strong> (
          {formatINR(example.annualCost)}/year) at {formatINR(example.effectiveRatePerUnit)}
          /unit.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Calculate your AC cost
        </h2>
        <AcBillCalculator discoms={liveDiscoms} />
      </section>

      {/* Contextual affiliate placement: efficient models that cut this cost */}
      <section aria-labelledby="picks" className="mb-10">
        <h2 id="picks" className="mb-2 text-2xl font-semibold">
          Efficient models that cut this cost
        </h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          A higher star rating pays for itself in a few seasons. Sample picks
          (indicative pricing):
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {AC_PRODUCTS.map((p) => (
            <AffiliateProductCard
              key={p.id}
              product={p}
              highlight={p.starRating === 5 ? 'Most efficient' : undefined}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="mb-4 text-2xl font-semibold">
          How AC running cost is calculated
        </h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Efficiency (ISEER).</strong> A star rating maps to an ISEER
            value — the higher it is, the fewer units the same cooling needs. We
            convert tonnage to cooling power, divide by ISEER for electrical
            input, and apply a ~70% compressor duty factor.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> Since an AC adds to your
            existing consumption, its units fall in your highest tariff slab. We
            use that marginal rate (plus fuel cost adjustment and electricity
            duty) — so the estimate reflects what the AC really adds to your bill.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
    </main>
  )
}
