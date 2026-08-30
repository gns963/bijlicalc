import type { Metadata } from 'next'
import Link from 'next/link'
import LeadGenForm from '@/components/LeadGenForm'
import SolarRoiCalculator from '@/components/calculators/SolarRoiCalculator'
import discomsJson from '@/data/discoms.json'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'
const PATH = '/solar/roi-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms
    .filter((d) => d.hasTariffFile)
    .map((d) => ({ code: d.code, state: s.state })),
)

// Server-rendered worked example (extractable pre-hydration).
const example = calculateSolarRoi({
  discomCode: 'TNEB',
  monthlyUnits: 300,
  systemSizeKw: 3,
})

export const metadata: Metadata = {
  title: 'Solar ROI Calculator 2026 — Rooftop Payback & PM Surya Ghar Savings',
  description:
    'Calculate rooftop solar payback period and savings using your DISCOM’s real tariff. Includes PM Surya Ghar subsidy (₹30k/₹60k/₹78k), net cost and 25-year savings.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solar ROI Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'Solar', item: `${SITE}/solar` },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'ROI Calculator',
      item: `${SITE}${PATH}`,
    },
  ],
}

export default function SolarRoiPage() {
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
            <Link href="/solar" className="hover:text-brass">
              Solar
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            ROI Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Solar ROI Calculator (Rooftop Payback & Savings)
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Find your rooftop solar payback period and lifetime savings. This
          calculator values the units solar offsets against your{' '}
          <strong>DISCOM&apos;s actual telescopic tariff</strong> and applies the{' '}
          <strong>PM Surya Ghar</strong> central subsidy.
        </p>
      </header>

      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-brass/10 bg-brass/5 p-5 dark:border-brass/20 dark:bg-brass/15/40"
      >
        <h2
          id="worked-example"
          className="text-sm font-semibold uppercase tracking-wide text-brass dark:text-brass"
        >
          Worked example
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          A <strong>3 kW</strong> rooftop system for a Tamil Nadu (TNEB) home
          using 300 units/month costs about{' '}
          <strong>{formatINR(example.systemCost)}</strong>, drops to{' '}
          <strong>{formatINR(example.netCost)}</strong> after the{' '}
          {formatINR(example.subsidy)} PM Surya Ghar subsidy, saves ~
          <strong>{formatINR(example.annualSavings)}</strong>/year, and pays back
          in about{' '}
          <strong>
            {example.paybackYears != null ? `${example.paybackYears} years` : 'N/A'}
          </strong>
          .
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Calculate your solar payback
        </h2>
        <SolarRoiCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="mb-4 text-2xl font-semibold">
          How solar payback is calculated
        </h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p>
            <strong>Savings on the expensive units first.</strong> Because Indian
            tariffs are telescopic, solar offsets your highest-priced slabs
            first. We compute your bill before and after solar using the real
            DISCOM tariff, so the savings reflect your actual marginal rate — not
            a flat average.
          </p>
          <p>
            <strong>PM Surya Ghar subsidy.</strong> The central subsidy is
            ₹30,000/kW for the first 2 kW plus ₹18,000 for the 3rd kW, capped at
            ₹78,000. Net cost is the system price minus this subsidy.
          </p>
          <p>
            <strong>Payback.</strong> Net cost ÷ annual savings gives the payback
            in years. Generation assumes ~4 units per kW per day; your actual
            output depends on location, roof orientation and shading.
          </p>
        </div>
      </section>

      <section aria-labelledby="leadgen" className="mb-6">
        <h2 id="leadgen" className="mb-4 text-2xl font-semibold">
          Ready for real quotes?
        </h2>
        <LeadGenForm source="solar-roi-calculator" />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
    </main>
  )
}
