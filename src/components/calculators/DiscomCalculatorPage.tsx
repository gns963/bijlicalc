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
import { enDiscomPageTexts, type DiscomPageTexts } from '@/data/discom-page-texts'
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
  texts = enDiscomPageTexts,
}: {
  config: DiscomPageConfig
  texts?: DiscomPageTexts
}) {
  const t = texts
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
    { id: 'calculator', label: t.toc.calculator },
    { id: 'budget-tool', label: t.toc.budgetTool },
    { id: 'how-to-use', label: t.toc.howToUse },
    { id: 'billing-cycle', label: t.toc.billingCycle },
    { id: 'tariff-table', label: t.toc.tariffTable(tariff.state) },
    { id: 'worked-examples', label: t.toc.workedExamples },
    ...(config.billTraps ? [{ id: 'bill-traps', label: t.toc.billTraps }] : []),
    { id: 'how-calculated', label: t.toc.howCalculated },
    { id: 'bill-audit', label: t.toc.billAudit },
    { id: 'whats-included', label: t.toc.whatsIncluded },
    { id: 'meter-reading', label: t.toc.meterReading },
    { id: 'solar', label: t.toc.solar },
    { id: 'appliance-upgrades', label: t.toc.applianceUpgrades },
    ...(neighbors.length
      ? [{ id: 'comparison', label: t.toc.comparison(tariff.discomCode) }]
      : []),
    { id: 'tips', label: t.toc.tips },
    { id: 'net-metering', label: t.toc.netMetering },
    ...(config.aboutDiscom ? [{ id: 'about', label: t.toc.about(tariff.discomCode) }] : []),
    ...(config.coverageQA ? [{ id: 'coverage', label: t.toc.coverage }] : []),
    ...(config.howToPay ? [{ id: 'how-to-pay', label: t.toc.howToPay }] : []),
    { id: 'faq', label: t.toc.faq },
    { id: 'related', label: t.toc.related },
  ]

  const howToSteps = [
    t.howToSteps.selectState,
    ...(residential.fixedCharge.basis === 'perLoad' ? [t.howToSteps.sanctionedLoad] : []),
    t.howToSteps.enterUnits,
    t.howToSteps.choosePhase,
    t.howToSteps.reviewResult,
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
    creator: { '@type': 'Organization', name: 'DesiMetrics', url: SITE },
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
                  {t.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/electricity" className="hover:text-brass">
                  {t.breadcrumbElectricity}
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
                {t.heroSubhead(tariff.state)}
              </p>

              <p className="mt-4 max-w-xl text-lg text-white/70">
                {config.intro}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#calculator"
                  className="flex items-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
                >
                  <span aria-hidden>⚡</span> {t.heroCta(tariff.discomCode)}
                </a>
                <Link
                  href="/electricity"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
                >
                  {t.heroAllStates}
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
                  <span aria-hidden>⚡</span> {t.heroWorkedExampleLabel}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  {t.heroWorkedExampleLead(config.exampleUnits, cycleLabel(tariff.billingCycle))}
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
            {t.calculateYourBill}
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
            <span aria-hidden>⚡</span> {t.workedExampleHeading}
          </h2>
          <p className="mt-3 text-lg text-ash/90">
            A <strong>{config.exampleUnits}-unit</strong>{' '}
            {cycleLabel(tariff.billingCycle)} {tariff.state} residential bill
            (single-phase) works out to{' '}
            <WorkedExampleTotal amount={example.total} />
            {example.monthlyEquivalent && (
              <>
                {' '}
                — {t.workedExampleAboutPerMonth}{' '}
                <strong>{formatINR(example.monthlyEquivalent.total)}</strong>{' '}
                per month
              </>
            )}
            . {t.workedExampleThatIs} {formatINR(example.energyChargeGross)} {t.energyLabel}
            {example.subsidy.subsidyAmount > 0 && (
              <> − {formatINR(example.subsidy.subsidyAmount)} {t.subsidyLabel}</>
            )}
            {example.fuelCostAdjustment.amount > 0 && (
              <> + {formatINR(example.fuelCostAdjustment.amount)} {t.fcaLabel}</>
            )}{' '}
            + {formatINR(example.fixedCharge.amount)} {t.fixedChargeLabel}
            {example.electricityDuty.amount > 0 && (
              <> + {formatINR(example.electricityDuty.amount)} {t.dutyLabel}</>
            )}
            .
          </p>
          <a
            href="#worked-examples"
            className="mt-3 inline-block text-sm font-semibold text-brass hover:underline"
          >
            {t.seeFullBreakdown}
          </a>
        </section>

        {/* Reverse calculator: budget -> units */}
        <section aria-labelledby="budget-tool" className="mb-10 scroll-mt-20">
          <h2
            id="budget-tool"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {t.budgetToolHeading}
          </h2>
          <p className="mb-4 text-ash/70">
            {t.budgetToolBody}
          </p>
          <BudgetToUnitsCalculator tariff={tariff} />
        </section>

        {/* How to use */}
        <section aria-labelledby="how-to-use" className="mb-10 scroll-mt-20">
          <h2
            id="how-to-use"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {t.howToUseHeading}
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
              ? t.monthlyBillingCycle
              : t.cycleRule(cycleLabel(tariff.billingCycle))}
          </h2>
          <p className="text-ash/80">
            {t.billingCycleBody(tariff.discomCode, cycleLabel(tariff.billingCycle))}
            {tariff.billingCycle !== 'monthly' &&
              t.billingCycleLongBody(
                tariff.billingCycle === 'bimonthly' ? '~60-day' : '~90-day',
                tariff.billingCycle === 'bimonthly' ? '2' : '3',
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
            {t.tariffTableHeading(tariff.state)}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">{t.slabUnits}</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    {t.rateUnit}
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
                  <td className="px-4 py-2">{t.fixedChargeLabel}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {fixedChargeLabel(residential.fixedCharge)}
                  </td>
                </tr>
                {tariff.fuelCostAdjustment > 0 && (
                  <tr>
                    <td className="px-4 py-2">{t.fuelCostAdjustmentLabel}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      ₹{tariff.fuelCostAdjustment}/unit
                    </td>
                  </tr>
                )}
                {tariff.electricityDutyPercent > 0 && (
                  <tr>
                    <td className="px-4 py-2">{t.electricityDutyLabel}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {tariff.electricityDutyPercent}%
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
          <p className="mt-2 text-xs text-ash/50">
            {t.effectiveFromVerified(formatIsoDate(tariff.effectiveFrom), formatIsoDate(tariff.lastVerified))}{' '}
            <a
              href={tariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline"
            >
              {t.sourceOrder}
            </a>
          </p>
        </section>

        {/* Two worked examples */}
        <section aria-labelledby="worked-examples" className="mb-10 scroll-mt-20">
          <h2
            id="worked-examples"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {t.twoWorkedExamples}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                {t.lowerUsage}
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-brass">
                {formatINR(example.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60">
                {config.exampleUnits} {t.unitsLabel} · {formatINR(example.energyChargeGross)}{' '}
                {t.energyLabel}
                {example.subsidy.subsidyAmount > 0 &&
                  ` − ${formatINR(example.subsidy.subsidyAmount)} ${t.subsidyLabel}`}{' '}
                + {formatINR(example.fixedCharge.amount)} {t.fixedLabel}
                {example.fuelCostAdjustment.amount > 0 &&
                  ` + ${formatINR(example.fuelCostAdjustment.amount)} ${t.fcaLabel}`}
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-paper p-5">
              <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase">
                {t.higherUsage}
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-brass">
                {formatINR(example2.total)}
              </p>
              <p className="mt-1 text-sm text-ash/60">
                {secondExampleUnits} {t.unitsLabel} · {formatINR(example2.energyChargeGross)}{' '}
                {t.energyLabel}
                {example2.subsidy.subsidyAmount > 0 &&
                  ` − ${formatINR(example2.subsidy.subsidyAmount)} ${t.subsidyLabel}`}{' '}
                + {formatINR(example2.fixedCharge.amount)} {t.fixedLabel}
                {example2.fuelCostAdjustment.amount > 0 &&
                  ` + ${formatINR(example2.fuelCostAdjustment.amount)} ${t.fcaLabel}`}
                {example2.electricityDuty.amount > 0 &&
                  ` + ${formatINR(example2.electricityDuty.amount)} ${t.dutyLabel}`}
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
              {t.commonBillTraps(tariff.discomCode)}
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
            {t.howBillCalculated(config.discomCode)}
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
            {t.billAuditHeading}
          </h2>
          <p className="mb-4 text-ash/70">
            {t.billAuditBody(config.exampleUnits)}
          </p>
          <BillComponentAudit bill={example} />
        </section>

        {/* What's included — quick reference table */}
        <section aria-labelledby="whats-included" className="mb-10 scroll-mt-20">
          <h2
            id="whats-included"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {t.whatsIncludedHeading}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">{t.componentLabel}</th>
                  <th className="px-4 py-2 font-semibold">{t.whatItIsLabel}</th>
                  <th className="px-4 py-2 text-right font-semibold">
                    {t.typicalRangeLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">{t.energyChargeRow.label}</td>
                  <td className="px-4 py-2 text-ash/70">
                    {t.energyChargeRow.desc}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ₹{residential.slabs[0].ratePerUnit.toFixed(2)}–₹
                    {topRate.toFixed(2)}/unit
                  </td>
                </tr>
                {tariff.fuelCostAdjustment > 0 && (
                  <tr>
                    <td className="px-4 py-2 font-medium">
                      {t.fuelCostAdjustmentRow.label}
                    </td>
                    <td className="px-4 py-2 text-ash/70">
                      {t.fuelCostAdjustmentRow.desc}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      ₹{tariff.fuelCostAdjustment}/unit
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="px-4 py-2 font-medium">{t.fixedChargeRow.label}</td>
                  <td className="px-4 py-2 text-ash/70">
                    {t.fixedChargeRow.desc}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {fixedChargeLabel(residential.fixedCharge)}
                  </td>
                </tr>
                {tariff.electricityDutyPercent > 0 && (
                  <tr>
                    <td className="px-4 py-2 font-medium">{t.electricityDutyRow.label}</td>
                    <td className="px-4 py-2 text-ash/70">
                      {t.electricityDutyRow.desc}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {tariff.electricityDutyPercent}%
                    </td>
                  </tr>
                )}
                {freeUnitsScheme && (
                  <tr>
                    <td className="px-4 py-2 font-medium">{t.subsidyRow.label}</td>
                    <td className="px-4 py-2 text-ash/70">
                      {freeUnitsScheme.schemeName}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {t.freeUnits(freeUnitsScheme.discountValue)}
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
            {t.meterReadingHeading}
          </h2>
          <p className="text-ash/80">
            {t.meterReadingBody}
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
            {t.applianceUpgradesHeading}
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
              {t.comparisonHeading(tariff.discomCode)}
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
            {t.tipsHeading(tariff.discomCode)}
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-ash/80">
            {freeUnitsScheme && (
              <li>
                {t.tipSubsidy(freeUnitsScheme.schemeName, freeUnitsScheme.discountValue)}
              </li>
            )}
            <li>
              {t.tipSlabThreshold(topRate.toFixed(2))}
            </li>
            {tariff.fuelCostAdjustment > 0 && (
              <li>
                {t.tipFca(tariff.fuelCostAdjustment)}
              </li>
            )}
            <li>
              {t.tipSolar}
            </li>
          </ul>
        </section>

        {/* Net metering explainer */}
        <section aria-labelledby="net-metering" className="mb-10 scroll-mt-20">
          <h2
            id="net-metering"
            className="mb-4 font-display text-2xl font-bold text-ink-navy"
          >
            {t.netMeteringHeading}
          </h2>
          <p className="text-ash/80">
            {t.netMeteringBody}{' '}
            <Link href="/solar/roi-calculator" className="text-brass underline">
              {t.estimateSolarPayback}
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
              {t.aboutHeading(tariff.discomCode)}
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
              {t.howToPayHeading}
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
                    {t.officialPortal}
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
                    {t.helpline}
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
            {t.faqHeading}
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
            {t.relatedHeading}
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
                label: t.relatedAllStates.label,
                sub: t.relatedAllStates.sub,
              },
              {
                href: '/solar/roi-calculator',
                icon: '☀️',
                chip: 'bg-hub-solar/15',
                accent: 'text-hub-solar',
                border: 'hover:border-hub-solar/50',
                label: t.relatedSolarRoi.label,
                sub: t.relatedSolarRoi.sub,
              },
              {
                href: '/ac/bill-calculator',
                icon: '❄️',
                chip: 'bg-hub-ac/15',
                accent: 'text-hub-ac',
                border: 'hover:border-hub-ac/50',
                label: t.relatedAcCost.label,
                sub: t.relatedAcCost.sub,
              },
              {
                href: '/financial',
                icon: '🧮',
                chip: 'bg-hub-financial/15',
                accent: 'text-hub-financial',
                border: 'hover:border-hub-financial/50',
                label: t.relatedFinancial.label,
                sub: t.relatedFinancial.sub,
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
              <span aria-hidden>⦿</span> {t.footerVerified(formatIsoDate(tariff.lastVerified))}
            </span>
            <span className="text-xs text-ash/50">
              {t.footerEffectiveFrom(formatIsoDate(tariff.effectiveFrom))}
            </span>
          </div>
          <p className="mt-3 text-sm text-ash/70">
            {t.footerSource}{' '}
            <a
              href={tariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass underline"
            >
              {t.footerTariffOrder(tariff.discomName)}
            </a>
          </p>
          <p className="mt-1 text-xs text-ash/50">{tariff.verifiedBy}</p>
          <p className="mt-3 border-t border-hairline pt-3 text-xs text-ash/50">
            {t.footerEstimatesOnly}{' '}
            <Link href="/methodology" className="text-brass underline">
              {t.footerMethodology}
            </Link>{' '}
            ·{' '}
            <Link href="/data-sources" className="text-brass underline">
              {t.footerDataSources}
            </Link>{' '}
            ·{' '}
            <Link href="/disclaimer" className="text-brass underline">
              {t.footerDisclaimer}
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
