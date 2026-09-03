import Link from 'next/link'
import ApplianceUpgradeCards from '@/components/calculators/ApplianceUpgradeCards'
import BillComponentAudit from '@/components/calculators/BillComponentAudit'
import Calculator from '@/components/calculators/ElectricityCalculator'
import BudgetToUnitsCalculator from '@/components/calculators/BudgetToUnitsCalculator'
import DiscomComparisonTable from '@/components/calculators/DiscomComparisonTable'
import TariffSidebar from '@/components/calculators/TariffSidebar'
import WorkedExampleTotal from '@/components/calculators/WorkedExampleTotal'
import SolarCrossSell from '@/components/SolarCrossSell'
import TableOfContents from '@/components/TableOfContents'
import ThresholdCallout from '@/components/ThresholdCallout'
import { CALCULATOR_PAGES, type DiscomPageConfig } from '@/data/calculator-pages'
import type { FixedCharge } from '@/data/tariffs/_schema'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { cycleLabel, formatINR, formatIsoDate } from '@/lib/format'

const SITE = 'https://desimetrics.com'

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

  const topRate = residential.slabs[residential.slabs.length - 1].ratePerUnit
  const fcaIncluded = tariff.fuelCostAdjustment > 0
  const freeUnitsScheme = tariff.subsidySchemes.find(
    (s) => s.discountType === 'free',
  )

  // Two server-rendered worked examples: a low-usage case and a higher-usage
  // case that crosses into a higher slab — both extractable without JS.
  const example = computeBill(tariff, {
    connectionType: residential.connectionType,
    unitsConsumed: config.exampleUnits,
    phase: 'single',
    sanctionedLoad: residential.fixedCharge.basis === 'perLoad' ? 3 : undefined,
    eligibility: config.exampleEligible
      ? tariff.subsidySchemes[0]?.eligibility
      : undefined,
  })
  const secondExampleUnits = Math.round(config.exampleUnits * 2.4)
  const example2 = computeBill(tariff, {
    connectionType: residential.connectionType,
    unitsConsumed: secondExampleUnits,
    phase: 'single',
    sanctionedLoad: residential.fixedCharge.basis === 'perLoad' ? 3 : undefined,
    eligibility: config.exampleEligible
      ? tariff.subsidySchemes[0]?.eligibility
      : undefined,
  })

  // Real cost breakdown of the hero's worked example, as a proportional bar
  // — fills the card with the same numbers already in the caption below it,
  // instead of leaving empty space around the digit roll.
  const breakdownParts = [
    {
      label: 'Energy',
      amount: example.energyChargeGross - example.subsidy.subsidyAmount,
      barClass: 'bg-brass',
    },
    {
      label: 'Fixed charge',
      amount: example.fixedCharge.amount,
      barClass: 'bg-hub-ac',
    },
    {
      label: 'FCA',
      amount: example.fuelCostAdjustment.amount,
      barClass: 'bg-caution-amber',
    },
    {
      label: 'Duty',
      amount: example.electricityDuty.amount,
      barClass: 'bg-spark-teal',
    },
  ].filter((p) => p.amount > 0)
  const breakdownTotal = breakdownParts.reduce((sum, p) => sum + p.amount, 0)
  const breakdownSegments = breakdownParts.map((p) => ({
    ...p,
    pct: breakdownTotal > 0 ? (p.amount / breakdownTotal) * 100 : 0,
  }))

  const neighbors = (config.neighboringDiscoms ?? [])
    .map((code) => CALCULATOR_PAGES.find((p) => p.discomCode === code))
    .filter((p): p is DiscomPageConfig => Boolean(p))

  const tocItems = [
    { id: 'calculator', label: 'Calculate your bill' },
    { id: 'budget-tool', label: 'Budget → units calculator' },
    { id: 'how-to-use', label: 'How to use this calculator' },
    { id: 'billing-cycle', label: 'Billing cycle explained' },
    { id: 'tariff-table', label: `${tariff.state} tariff slabs` },
    { id: 'worked-examples', label: 'Worked examples' },
    ...(config.billTraps ? [{ id: 'bill-traps', label: 'Common bill traps' }] : []),
    { id: 'how-calculated', label: 'How the bill is calculated' },
    { id: 'bill-audit', label: 'Your bill, component by component' },
    { id: 'whats-included', label: "What's included in your bill" },
    { id: 'meter-reading', label: 'How to read your meter' },
    { id: 'solar', label: 'Solar savings' },
    { id: 'appliance-upgrades', label: 'Tools that cut your bill' },
    ...(neighbors.length
      ? [{ id: 'comparison', label: `${tariff.discomCode} vs neighbouring DISCOMs` }]
      : []),
    { id: 'tips', label: 'Tips to reduce your bill' },
    { id: 'net-metering', label: 'Net metering explained' },
    ...(config.aboutDiscom ? [{ id: 'about', label: `About ${tariff.discomCode}` }] : []),
    ...(config.coverageQA ? [{ id: 'coverage', label: 'Coverage area' }] : []),
    ...(config.howToPay ? [{ id: 'how-to-pay', label: 'Check & pay your bill' }] : []),
    { id: 'faq', label: 'Frequently asked questions' },
    { id: 'related', label: 'Related calculators' },
  ]

  const howToSteps = [
    'Select your state — it\'s pre-selected for this page',
    ...(residential.fixedCharge.basis === 'perLoad'
      ? ['Enter your sanctioned load in kW, shown on your bill or meter agreement']
      : []),
    'Enter the units consumed shown on your bill, or your meter readings',
    'Choose your connection phase (single or three) if applicable',
    'Review the itemised slab-by-slab result below the calculator',
  ]

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
  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${tariff.discomName} residential tariff slabs`,
    description: `Telescopic domestic electricity tariff slabs for ${tariff.state}, effective ${tariff.effectiveFrom}.`,
    url: `${SITE}${path}#tariff-table`,
    dateModified: tariff.lastVerified,
    license: tariff.sourceUrl,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'text/html', contentUrl: tariff.sourceUrl },
    ],
  }
  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${tariff.discomCode} bill calculator`,
    step: howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
  }

  return (
    <>
      {/* Hero — full-bleed dark band, split left/right like our own homepage
          hero (not a centered single-column stack). Right side carries our
          own signature — the rolling-digit worked example — instead of a
          generic stat card, so this reads as DesiMetrics, not a template. */}
      <section className="relative overflow-hidden py-14 hero-gradient sm:py-16">
        <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/50">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-brass">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/electricity" className="hover:text-brass">
                  Electricity
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-white/80">
                {config.breadcrumbLabel}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Left: pitch + CTAs */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/30 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden />
                {tariff.state} · {tariff.discomCode} · {cycleLabel(tariff.billingCycle)} slab logic
              </span>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {config.h1}
              </h1>
              <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-brass sm:text-2xl">
                Estimate your {tariff.state} electricity bill
              </p>

              <p className="mt-4 max-w-xl text-lg text-white/70">
                {config.intro}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#calculator"
                  className="flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
                >
                  <span aria-hidden>⚡</span> Calculate My {tariff.discomCode} Bill
                </a>
                <Link
                  href="/electricity"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
                >
                  All state calculators →
                </Link>
              </div>
            </div>

            {/* Right: our own signature — the live worked-example, not a
                static stat card copied from a competitor layout. Stat strip
                sits directly under it, in the same column, instead of
                spanning full width with empty space above and below. */}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                  <span aria-hidden>⚡</span> Worked example
                </p>
                <p className="mt-2 text-sm text-white/70">
                  A {config.exampleUnits}-unit {cycleLabel(tariff.billingCycle)} bill
                  works out to
                </p>
                <div className="mt-1">
                  <WorkedExampleTotal amount={example.total} />
                </div>

                <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/10">
                  {breakdownSegments.map((seg) => (
                    <div
                      key={seg.label}
                      className={`h-full ${seg.barClass}`}
                      style={{ width: `${seg.pct}%` }}
                    />
                  ))}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  {breakdownSegments.map((seg) => (
                    <div key={seg.label} className="flex items-center justify-between gap-2">
                      <dt className="flex items-center gap-1.5 text-white/50">
                        <span className={`h-2 w-2 rounded-full ${seg.barClass}`} aria-hidden />
                        {seg.label}
                      </dt>
                      <dd className="font-medium text-white/80">{formatINR(seg.amount)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Stat strip — one color per stat; seal-red stays reserved
                  for the Verified chip only. */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['⚡', `₹${topRate.toFixed(2)}`, 'Top slab rate', 'brass'],
                  ['📅', cycleLabel(tariff.billingCycle), 'Billing', 'hub-ac'],
                  ['⛽', fcaIncluded ? `₹${tariff.fuelCostAdjustment}` : 'None', 'FCA / unit', 'caution-amber'],
                  freeUnitsScheme
                    ? ['🎁', `${freeUnitsScheme.discountValue}u`, 'Free subsidy', 'spark-teal']
                    : ['✓', formatIsoDate(tariff.lastVerified), 'Verified', 'seal-red'],
                ].map(([icon, big, small, tone]) => (
                  <div
                    key={small as string}
                    className="rounded-xl border border-white/15 bg-white/[0.07] px-3 py-3 text-center backdrop-blur-md"
                  >
                    <span className="text-lg" aria-hidden>
                      {icon}
                    </span>
                    <p
                      className={`mt-1 font-display text-lg font-bold tabular-nums ${
                        tone === 'brass'
                          ? 'text-brass'
                          : tone === 'hub-ac'
                            ? 'text-hub-ac'
                            : tone === 'caution-amber'
                              ? 'text-caution-amber'
                              : tone === 'spark-teal'
                                ? 'text-spark-teal'
                                : 'text-seal-red'
                      }`}
                    >
                      {big}
                    </p>
                    <p className="text-[11px] tracking-wide text-white/50 uppercase">
                      {small}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Interactive calculator + sidebar — the very first thing after the
            hero, so the tool is never more than one scroll away. */}
        <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
          <h2
            id="calculator"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Calculate your bill
          </h2>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Calculator tariff={tariff} defaultUnits={config.exampleUnits} />
            <TariffSidebar tariff={tariff} />
          </div>
        </section>

      <div className="mx-auto max-w-4xl">
        <TableOfContents items={tocItems} />

        {/* Server-rendered worked example (primary) — a citable pull-quote,
            not a warning box: paper bg, brass left-border accent only. */}
        <section
          aria-labelledby="worked-example"
          className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5"
        >
          <h2
            id="worked-example"
            className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-brass uppercase"
          >
            <span aria-hidden>⚡</span> Worked example
          </h2>
          <p className="mt-3 text-lg text-ash/90">
            A <strong>{config.exampleUnits}-unit</strong>{' '}
            {cycleLabel(tariff.billingCycle)} {tariff.state} residential bill
            (single-phase) works out to{' '}
            <WorkedExampleTotal amount={example.total} />
            {example.monthlyEquivalent && (
              <>
                {' '}
                — about{' '}
                <strong>{formatINR(example.monthlyEquivalent.total)}</strong>{' '}
                per month
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
          <a
            href="#worked-examples"
            className="mt-3 inline-block text-sm font-semibold text-brass hover:underline"
          >
            See the full breakdown ↓
          </a>
        </section>

        {/* Reverse calculator: budget -> units */}
        <section aria-labelledby="budget-tool" className="mb-10 scroll-mt-20">
          <h2
            id="budget-tool"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Have a fixed budget? Work backwards
          </h2>
          <p className="mb-4 text-ash/70">
            Enter what you want to spend, and we&apos;ll tell you the maximum
            units that stays within it — the exact inverse of the calculator
            above.
          </p>
          <BudgetToUnitsCalculator tariff={tariff} />
        </section>

        {/* How to use */}
        <section aria-labelledby="how-to-use" className="mb-10 scroll-mt-20">
          <h2
            id="how-to-use"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            How to use this calculator
          </h2>
          <ol className="space-y-2">
            {howToSteps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass font-display text-xs font-bold text-ink-navy">
                  {i + 1}
                </span>
                <span className="text-ash/80">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Billing-cycle explainer */}
        <section aria-labelledby="billing-cycle" className="mb-10 scroll-mt-20">
          <h2
            id="billing-cycle"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {tariff.billingCycle === 'monthly'
              ? 'Your monthly billing cycle'
              : `The ${cycleLabel(tariff.billingCycle)} rule`}
          </h2>
          <p className="text-ash/80">
            {tariff.discomCode} bills {cycleLabel(tariff.billingCycle)}.
            {tariff.billingCycle !== 'monthly' && (
              <>
                {' '}
                The units you enter represent your full{' '}
                {tariff.billingCycle === 'bimonthly' ? '~60-day' : '~90-day'}{' '}
                billing period — not a single month. To compare against a
                monthly figure, we divide the total by{' '}
                {tariff.billingCycle === 'bimonthly' ? '2' : '3'}, shown as the
                monthly-equivalent on your result.
              </>
            )}
          </p>
          {config.thresholdCallout && (
            <div className="mt-4">
              <ThresholdCallout {...config.thresholdCallout} />
            </div>
          )}
        </section>

        {/* Full tariff table */}
        <section aria-labelledby="tariff-table" className="mb-10 scroll-mt-20">
          <h2
            id="tariff-table"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {tariff.state} residential tariff slabs
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Slab (units)</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Rate (₹/unit)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
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
              <tfoot className="bg-mist text-ash/70">
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
          <p className="mt-2 text-xs text-ash/50">
            Effective from {formatIsoDate(tariff.effectiveFrom)} · Verified{' '}
            {formatIsoDate(tariff.lastVerified)} ·{' '}
            <a
              href={tariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline"
            >
              source order
            </a>
          </p>
        </section>

        {/* Two worked examples */}
        <section aria-labelledby="worked-examples" className="mb-10 scroll-mt-20">
          <h2
            id="worked-examples"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Two worked examples
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                Lower usage
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-brass">
                {formatINR(example.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60">
                {config.exampleUnits} units · {formatINR(example.energyChargeGross)}{' '}
                energy
                {example.subsidy.subsidyAmount > 0 &&
                  ` − ${formatINR(example.subsidy.subsidyAmount)} subsidy`}{' '}
                + {formatINR(example.fixedCharge.amount)} fixed
                {example.fuelCostAdjustment.amount > 0 &&
                  ` + ${formatINR(example.fuelCostAdjustment.amount)} FCA`}
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                Higher usage
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-brass">
                {formatINR(example2.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60">
                {secondExampleUnits} units · {formatINR(example2.energyChargeGross)}{' '}
                energy
                {example2.subsidy.subsidyAmount > 0 &&
                  ` − ${formatINR(example2.subsidy.subsidyAmount)} subsidy`}{' '}
                + {formatINR(example2.fixedCharge.amount)} fixed
                {example2.fuelCostAdjustment.amount > 0 &&
                  ` + ${formatINR(example2.fuelCostAdjustment.amount)} FCA`}
                {example2.electricityDuty.amount > 0 &&
                  ` + ${formatINR(example2.electricityDuty.amount)} duty`}
              </p>
            </div>
          </div>
        </section>

        {/* Common bill traps — only where authored. Caution-amber signals a
            warning worth knowing about, without the alarm of red. */}
        {config.billTraps && (
          <section aria-labelledby="bill-traps" className="mb-10 scroll-mt-20">
            <h2
              id="bill-traps"
              className="mb-4 font-display text-2xl font-bold text-ink-navy"
            >
              Common {tariff.discomCode} bill traps
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {config.billTraps.map((trap, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-hairline border-l-4 border-l-caution-amber bg-paper p-5"
                >
                  <h3 className="font-semibold text-ink-navy">
                    {trap.title}
                  </h3>
                  <p className="mt-1 text-sm text-ash/70">
                    {trap.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* State-specific explainer */}
        <section aria-labelledby="how-calculated" className="mb-10 scroll-mt-20">
          <h2
            id="how-calculated"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            How the {config.discomCode} bill is calculated
          </h2>
          <div className="space-y-4 text-ash/80">
            {config.explainer.map((block, i) => (
              <div key={i}>
                <h3 className="font-semibold text-ash">
                  {block.title}
                </h3>
                <p className="mt-1">{block.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Component-by-component audit */}
        <section aria-labelledby="bill-audit" className="mb-10 scroll-mt-20">
          <h2
            id="bill-audit"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Your bill, component by component
          </h2>
          <p className="mb-4 text-ash/70">
            Based on the {config.exampleUnits}-unit example above. Expand each
            line for what it means and whether you can influence it.
          </p>
          <BillComponentAudit bill={example} />
        </section>

        {/* What's included — quick reference table */}
        <section aria-labelledby="whats-included" className="mb-10 scroll-mt-20">
          <h2
            id="whats-included"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            What&apos;s included in your bill
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Component</th>
                  <th className="px-4 py-2 font-semibold">What it is</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    Typical range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">Energy charge</td>
                  <td className="px-4 py-2 text-ash/70">
                    Units × slab rate, telescopic
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ₹{residential.slabs[0].ratePerUnit.toFixed(2)}–₹
                    {topRate.toFixed(2)}/unit
                  </td>
                </tr>
                {tariff.fuelCostAdjustment > 0 && (
                  <tr>
                    <td className="px-4 py-2 font-medium">
                      Fuel cost adjustment
                    </td>
                    <td className="px-4 py-2 text-ash/70">
                      Pass-through fuel surcharge
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      ₹{tariff.fuelCostAdjustment}/unit
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="px-4 py-2 font-medium">Fixed charge</td>
                  <td className="px-4 py-2 text-ash/70">
                    Flat, independent of usage
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {fixedChargeLabel(residential.fixedCharge)}
                  </td>
                </tr>
                {tariff.electricityDutyPercent > 0 && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Electricity duty</td>
                    <td className="px-4 py-2 text-ash/70">
                      State government levy
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {tariff.electricityDutyPercent}%
                    </td>
                  </tr>
                )}
                {freeUnitsScheme && (
                  <tr>
                    <td className="px-4 py-2 font-medium">Subsidy</td>
                    <td className="px-4 py-2 text-ash/70">
                      {freeUnitsScheme.schemeName}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {freeUnitsScheme.discountValue} free units
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Meter reading guide */}
        <section aria-labelledby="meter-reading" className="mb-10 scroll-mt-20">
          <h2
            id="meter-reading"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            How to read your meter
          </h2>
          <p className="text-ash/80">
            Digital meters show a running total in kWh (&quot;units&quot;) on
            an LCD display — write down the number before the decimal point.
            To find your consumption for a billing period, subtract your
            previous reading from your current reading; that is exactly what
            the &quot;Meter reading&quot; mode in the calculator above does
            for you. Analog meters use a set of dial gauges read left to
            right — note the number the pointer has just passed on each dial.
          </p>
        </section>

        {/* Solar cross-sell */}
        <div id="solar" className="scroll-mt-20">
          <SolarCrossSell state={tariff.state} discomCode={tariff.discomCode} />
        </div>

        {/* Appliance upgrade cross-sell */}
        <section
          aria-labelledby="appliance-upgrades"
          className="mb-10 mt-10 scroll-mt-20"
        >
          <h2
            id="appliance-upgrades"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Tools that cut your bill
          </h2>
          <ApplianceUpgradeCards discomCode={tariff.discomCode} state={tariff.state} />
        </section>

        {/* Neighbouring DISCOM comparison — only where authored */}
        {neighbors.length > 0 && (
          <section aria-labelledby="comparison" className="mb-10 scroll-mt-20">
            <h2
              id="comparison"
              className="mb-4 font-display text-2xl font-bold text-ink-navy"
            >
              How does {tariff.discomCode} compare?
            </h2>
            <DiscomComparisonTable
              currentDiscomCode={tariff.discomCode}
              compareDiscomCodes={neighbors.map((n) => n.discomCode)}
              discomHrefs={Object.fromEntries([
                [tariff.discomCode, path],
                ...neighbors.map((n) => [n.discomCode, `/electricity/${n.slug}`]),
              ])}
            />
            <p className="mt-3 text-sm text-ash/70">
              {tariff.discomCode}&apos;s top domestic slab rate is ₹
              {topRate.toFixed(2)}/unit
              {neighbors
                .map((n) => {
                  const nt = getTariff(n.discomCode)
                  const nRes =
                    nt.connectionTypes.find(
                      (c) => c.connectionType === 'residential',
                    ) ?? nt.connectionTypes[0]
                  const nRate = nRes.slabs[nRes.slabs.length - 1].ratePerUnit
                  const cheaper = nRate < topRate
                  return ` — ${cheaper ? 'cheaper' : 'more expensive'} than ${n.discomCode} (₹${nRate.toFixed(2)}/unit)`
                })
                .join(',')}
              . Billing cycles also differ:{' '}
              {tariff.discomCode} bills {cycleLabel(tariff.billingCycle)}, while{' '}
              {neighbors
                .map((n) => `${n.discomCode} bills ${cycleLabel(getTariff(n.discomCode).billingCycle)}`)
                .join(', ')}
              .
            </p>
          </section>
        )}

        {/* Tips to reduce bill */}
        <section aria-labelledby="tips" className="mb-10 scroll-mt-20">
          <h2
            id="tips"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Tips to reduce your {tariff.discomCode} bill
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-ash/80">
            {freeUnitsScheme && (
              <li>
                Confirm your eligibility for {freeUnitsScheme.schemeName} is
                correctly marked on your account — it&apos;s worth{' '}
                {freeUnitsScheme.discountValue} free units every cycle.
              </li>
            )}
            <li>
              Where practical, keep usage below your next slab threshold — the
              marginal units above ₹{topRate.toFixed(2)}/unit cost the most.
            </li>
            {tariff.fuelCostAdjustment > 0 && (
              <li>
                The ₹{tariff.fuelCostAdjustment}/unit fuel cost adjustment
                applies to every unit you use, so reducing overall consumption
                reduces this line too — unlike the fixed charge.
              </li>
            )}
            <li>
              For high-usage households, rooftop solar can offset your most
              expensive top-slab units — see the solar section above.
            </li>
          </ul>
        </section>

        {/* Net metering explainer */}
        <section aria-labelledby="net-metering" className="mb-10 scroll-mt-20">
          <h2
            id="net-metering"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Net metering explained
          </h2>
          <p className="text-ash/80">
            Net metering lets a rooftop solar system export surplus power back
            to the grid through your existing meter, which runs in reverse.
            At billing time, your DISCOM credits the exported units against
            what you drew from the grid — you&apos;re billed only for the net
            difference. Combined with telescopic slabs, this typically offsets
            your most expensive units first.{' '}
            <Link href="/solar/roi-calculator" className="text-brass underline">
              Estimate your solar payback →
            </Link>
          </p>
        </section>

        {/* About the DISCOM — only where authored */}
        {config.aboutDiscom && (
          <section aria-labelledby="about" className="mb-10 scroll-mt-20">
            <h2
              id="about"
              className="mb-4 font-display text-2xl font-bold text-ink-navy"
            >
              About {tariff.discomCode}
            </h2>
            <div className="space-y-3 text-ash/80">
              {config.aboutDiscom.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* Coverage Q&A — only where authored */}
        {config.coverageQA && (
          <section aria-labelledby="coverage" className="mb-10 scroll-mt-20">
            <h2
              id="coverage"
              className="mb-2 font-display text-2xl font-bold text-ink-navy"
            >
              {config.coverageQA.q}
            </h2>
            <p className="text-ash/80">
              {config.coverageQA.a}
            </p>
          </section>
        )}

        {/* How to pay — only where authored */}
        {config.howToPay && (
          <section aria-labelledby="how-to-pay" className="mb-10 scroll-mt-20">
            <h2
              id="how-to-pay"
              className="mb-4 font-display text-2xl font-bold text-ink-navy"
            >
              How to check and pay your bill
            </h2>
            <ol className="space-y-2">
              {config.howToPay.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass font-display text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-ash/80">{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={config.howToPay.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-brass/20 bg-brass/5 p-4 transition hover:border-brass/50 hover:shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brass/15 text-xl" aria-hidden>
                  🌐
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold tracking-wide text-brass uppercase">
                    Official portal
                  </p>
                  <p className="truncate font-semibold text-ink-navy">
                    {config.howToPay.portalLabel}
                  </p>
                </div>
                <span className="shrink-0 text-brass opacity-0 transition group-hover:opacity-100" aria-hidden>
                  →
                </span>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-spark-teal/20 bg-spark-teal/5 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-spark-teal/15 text-xl" aria-hidden>
                  📞
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-spark-teal uppercase">
                    Helpline
                  </p>
                  <p className="font-semibold text-ink-navy">
                    {config.howToPay.helpline}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section aria-labelledby="faq" className="mb-10 scroll-mt-20">
          <h2
            id="faq"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Frequently asked questions
          </h2>
          <div className="divide-y divide-hairline">
            {config.faqs.map((f, i) => (
              <details key={i} className="group py-3">
                <summary className="cursor-pointer list-none font-medium text-ash marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-ash/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related calculators — interlinking */}
        <section aria-labelledby="related" className="mb-10 scroll-mt-20">
          <h2
            id="related"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            Related calculators
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ...neighbors.map((n) => ({
                href: `/electricity/${n.slug}`,
                icon: '⚡',
                chip: 'bg-hub-electricity/15',
                accent: 'text-hub-electricity',
                border: 'hover:border-hub-electricity/50',
                label: getTariff(n.discomCode).state,
                sub: `${n.discomCode} bill calculator`,
              })),
              {
                href: '/electricity',
                icon: '🗺️',
                chip: 'bg-hub-electricity/15',
                accent: 'text-hub-electricity',
                border: 'hover:border-hub-electricity/50',
                label: 'All states & UTs',
                sub: 'Every DISCOM calculator',
              },
              {
                href: '/solar/roi-calculator',
                icon: '☀️',
                chip: 'bg-hub-solar/15',
                accent: 'text-hub-solar',
                border: 'hover:border-hub-solar/50',
                label: 'Solar ROI',
                sub: 'Payback on this tariff',
              },
              {
                href: '/ac/bill-calculator',
                icon: '❄️',
                chip: 'bg-hub-ac/15',
                accent: 'text-hub-ac',
                border: 'hover:border-hub-ac/50',
                label: 'AC running cost',
                sub: 'Priced at your top slab',
              },
              {
                href: '/financial',
                icon: '🧮',
                chip: 'bg-hub-financial/15',
                accent: 'text-hub-financial',
                border: 'hover:border-hub-financial/50',
                label: 'Financial calculators',
                sub: 'GST, SIP, gratuity, tax',
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group flex items-center gap-3 rounded-xl border border-hairline bg-paper p-4 transition hover:shadow-sm ${l.border}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${l.chip}`}
                  aria-hidden
                >
                  {l.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-navy">
                    {l.label}
                  </p>
                  <p className="truncate text-xs text-ash/50">
                    {l.sub}
                  </p>
                </div>
                <span
                  className={`shrink-0 opacity-0 transition group-hover:opacity-100 ${l.accent}`}
                  aria-hidden
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Verification metadata + disclaimer */}
        <footer className="rounded-xl border border-hairline bg-paper p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-seal-red/30 bg-seal-red/5 px-2.5 py-1 text-xs font-semibold text-seal-red">
              <span aria-hidden>⦿</span> Verified {formatIsoDate(tariff.lastVerified)}
            </span>
            <span className="text-xs text-ash/50">
              Effective from {formatIsoDate(tariff.effectiveFrom)}
            </span>
          </div>
          <p className="mt-3 text-sm text-ash/70">
            Source:{' '}
            <a
              href={tariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline"
            >
              {tariff.discomName} tariff order
            </a>
          </p>
          <p className="mt-1 text-xs text-ash/50">{tariff.verifiedBy}</p>
          <p className="mt-3 border-t border-hairline pt-3 text-xs text-ash/50">
            Estimates only.{' '}
            <Link href="/methodology" className="text-brass underline">
              How we source &amp; verify data
            </Link>{' '}
            ·{' '}
            <Link href="/data-sources" className="text-brass underline">
              Data sources
            </Link>{' '}
            ·{' '}
            <Link href="/disclaimer" className="text-brass underline">
              Disclaimer
            </Link>
          </p>
        </footer>
      </div>

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      </main>
    </>
  )
}
