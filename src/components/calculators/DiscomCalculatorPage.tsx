import Link from 'next/link'
import SolarCrossSell from '@/components/SolarCrossSell'
import Calculator from '@/components/calculators/ElectricityCalculator'
import type { DiscomPageConfig } from '@/data/calculator-pages'
import type { FixedCharge } from '@/data/tariffs/_schema'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { cycleLabel, formatINR, formatIsoDate } from '@/lib/format'

const SITE = 'https://bijlicalc.com'

function fixedChargeLabel(fc: FixedCharge): string {
  switch (fc.basis) {
    case 'perPhase':
      return `₹${fc.singlePhase} / ₹${fc.threePhase} (single / three-phase)`
    case 'perLoad':
      return `₹${fc.perKW}/kW of sanctioned load`
    case 'flat':
      return `₹${fc.flat}`
  }
}

export default function DiscomCalculatorPage({
  config,
}: {
  config: DiscomPageConfig
}) {
  const tariff = getTariff(config.discomCode)
  const residential =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  const path = `/electricity/${config.slug}`

  const example = computeBill(tariff, {
    connectionType: residential.connectionType,
    unitsConsumed: config.exampleUnits,
    phase: 'single',
    sanctionedLoad: residential.fixedCharge.basis === 'perLoad' ? 3 : undefined,
    eligibility: config.exampleEligible
      ? tariff.subsidySchemes[0]?.eligibility
      : undefined,
  })

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Electricity',
        item: `${SITE}/electricity`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.breadcrumbLabel,
        item: `${SITE}${path}`,
      },
    ],
  }
  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.breadcrumbLabel,
    url: `${SITE}${path}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    about: tariff.discomName,
    areaServed: tariff.state,
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/electricity" className="hover:text-indigo-600">
              Electricity
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            {config.breadcrumbLabel}
          </li>
        </ol>
      </nav>

      {/* H1 + intro */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {config.h1}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          {config.intro}
        </p>
      </header>

      {/* Server-rendered worked example */}
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40"
      >
        <h2
          id="worked-example"
          className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300"
        >
          Worked example
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          A <strong>{config.exampleUnits}-unit</strong>{' '}
          {cycleLabel(tariff.billingCycle)} {tariff.state} residential bill
          (single-phase) works out to{' '}
          <strong>{formatINR(example.total)}</strong>
          {example.monthlyEquivalent && (
            <>
              {' '}
              — about{' '}
              <strong>{formatINR(example.monthlyEquivalent.total)}</strong> per
              month
            </>
          )}
          . That is {formatINR(example.energyChargeGross)} energy charge
          {example.subsidy.subsidyAmount > 0 && (
            <> − {formatINR(example.subsidy.subsidyAmount)} subsidy</>
          )}
          {example.fuelCostAdjustment.amount > 0 && (
            <> + {formatINR(example.fuelCostAdjustment.amount)} FCA</>
          )}{' '}
          + {formatINR(example.fixedCharge.amount)} fixed charge
          {example.electricityDuty.amount > 0 && (
            <> + {formatINR(example.electricityDuty.amount)} duty</>
          )}
          .
        </p>
      </section>

      {/* Interactive calculator */}
      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Calculate your bill
        </h2>
        <Calculator tariff={tariff} defaultUnits={config.exampleUnits} />
      </section>

      {/* Cross-sell to the solar ROI calculator */}
      <SolarCrossSell state={tariff.state} />

      {/* Live tariff slab table */}
      <section aria-labelledby="tariff-table" className="mb-10">
        <h2 id="tariff-table" className="mb-4 text-2xl font-semibold">
          {tariff.state} residential tariff slabs
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-2 font-semibold">Slab (units)</th>
                <th className="px-4 py-2 text-right font-semibold">
                  Rate (₹/unit)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {residential.slabs.map((s, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    {s.minUnits}–{s.maxUnits ?? 'above'}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ₹{s.ratePerUnit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <td className="px-4 py-2">Fixed charge</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {fixedChargeLabel(residential.fixedCharge)}
                </td>
              </tr>
              {tariff.fuelCostAdjustment > 0 && (
                <tr>
                  <td className="px-4 py-2">Fuel cost adjustment</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ₹{tariff.fuelCostAdjustment}/unit
                  </td>
                </tr>
              )}
              {tariff.electricityDutyPercent > 0 && (
                <tr>
                  <td className="px-4 py-2">Electricity duty</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {tariff.electricityDutyPercent}%
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </section>

      {/* State-specific explainer */}
      <section aria-labelledby="how-calculated" className="mb-10">
        <h2 id="how-calculated" className="mb-4 text-2xl font-semibold">
          How the {config.discomCode} bill is calculated
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300">
          {config.explainer.map((block, i) => (
            <div key={i}>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {block.title}
              </h3>
              <p className="mt-1">{block.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="mb-4 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {config.faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-slate-800 marker:hidden dark:text-slate-100">
                {f.q}
              </summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Verification metadata from JSON */}
      <footer className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <p>
          Tariff last verified: {formatIsoDate(tariff.lastVerified)} · Effective
          from {formatIsoDate(tariff.effectiveFrom)}
        </p>
        <p className="mt-1">
          Source:{' '}
          <a
            href={tariff.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline hover:text-indigo-500"
          >
            {tariff.discomName} tariff order
          </a>
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          {tariff.verifiedBy}
        </p>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
    </main>
  )
}
