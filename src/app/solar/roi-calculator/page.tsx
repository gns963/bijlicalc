import type { Metadata } from 'next'
import Link from 'next/link'
import LeadGenForm from '@/components/LeadGenForm'
import SplitHero from '@/components/SplitHero'
import SolarRoiCalculator from '@/components/calculators/SolarRoiCalculator'
import CostComparisonTable from '@/components/solar/CostComparisonTable'
import GridTypeComparison from '@/components/solar/GridTypeComparison'
import SolarAcTieIn from '@/components/solar/SolarAcTieIn'
import SolarFinancingSection from '@/components/solar/SolarFinancingSection'
import SolarImpactSection from '@/components/solar/SolarImpactSection'
import SolarMythsSection from '@/components/solar/SolarMythsSection'
import SolarTipsSection from '@/components/solar/SolarTipsSection'
import discomsJson from '@/data/discoms.json'
import { getTariff } from '@/lib/calc/electricity'
import { calculateSolarRoi, projectSolarCostComparison } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

const SITE = 'https://desimetrics.com'
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

const tneb = getTariff('TNEB')
const tnebResidential =
  tneb.connectionTypes.find((c) => c.connectionType === 'residential') ?? tneb.connectionTypes[0]
const tnebTopRate = tnebResidential.slabs[tnebResidential.slabs.length - 1].ratePerUnit

const costComparisonExample = projectSolarCostComparison({
  discomCode: 'TNEB',
  monthlyUnits: 300,
  systemSizeKw: 3,
  scenario: 'base',
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
const breadcrumbLdData = {
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
const datasetLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: '25-Year Solar vs Grid Cost Comparison (Base Scenario)',
  description:
    'Year-by-year cumulative grid cost, solar cost and savings for a 3kW rooftop system in Tamil Nadu at 300 units/month, assuming 6%/year tariff escalation.',
  creator: { '@type': 'Organization', name: 'DesiMetrics' },
  variableMeasured: [
    'Cumulative grid cost (INR)',
    'Cumulative solar cost (INR)',
    'Cumulative savings (INR)',
  ],
  distribution: [1, 10, 25]
    .map((y) => costComparisonExample.rows.find((r) => r.year === y))
    .filter((r): r is (typeof costComparisonExample.rows)[number] => Boolean(r))
    .map((r) => ({
      '@type': 'DataDownload',
      name: `Year ${r.year}`,
      description: `Cumulative grid cost ₹${r.cumulativeGridCost}, cumulative solar cost ₹${r.cumulativeSolarCost}, cumulative savings ₹${r.cumulativeSavings}`,
    })),
}

const faqs = [
  {
    q: 'How accurate is this solar payback estimate?',
    a: 'It prices offset units at your actual DISCOM tariff and applies the real PM Surya Ghar subsidy formula, so the ₹ figures are grounded in real rates. The generation assumption (~4 units/kW/day) is a conservative pan-India average — your real output depends on location, roof orientation, shading and panel quality, so treat this as a planning estimate, not a quote.',
  },
  {
    q: 'What generation assumption does this calculator use, and why?',
    a: 'Roughly 4 units per kW of installed capacity per day, averaged across a year. This is a commonly used conservative figure for Indian rooftop conditions — sunnier states or well-oriented, unshaded roofs typically generate more, so actual payback can be faster than shown here.',
  },
  {
    q: 'Does this account for panel degradation over 25 years?',
    a: 'No — the annual savings figure uses year-one generation held flat. Real panels degrade gradually (commonly cited at around 0.5% per year), which would modestly extend payback and reduce total lifetime savings versus the figure shown.',
  },
  {
    q: 'Do I need net metering for these savings to work?',
    a: 'Yes. Net metering is what lets your DISCOM credit you for solar units you export back to the grid, which is how the units-offset calculation in this tool actually gets realised on your bill. Your DISCOM/installer handles the net-metering application as part of installation.',
  },
  {
    q: 'What if I don’t get the full PM Surya Ghar subsidy?',
    a: 'The central subsidy follows a fixed formula (₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000) and is not means-tested, but processing time and any additional state-level subsidy vary. Check your exact eligibility and amount on our PM Surya Ghar subsidy calculator.',
  },
  {
    q: 'How is this calculator different from a flat-rate solar calculator?',
    a: 'Most solar calculators apply one national-average electricity rate to every user. This one prices the units your system offsets against your own DISCOM\'s actual telescopic slab tariff — the same rate structure your real bill uses — so the savings reflect your true marginal rate, not an approximation.',
  },
  {
    q: 'What is the eligibility criteria for the PM Surya Ghar subsidy?',
    a: 'You need to own the roof (or have the owner\'s consent), hold a valid residential electricity connection, not have previously availed a rooftop solar subsidy on that connection, and install Made-in-India (DCR) panels through an MNRE-empanelled vendor. See our PM Surya Ghar subsidy calculator for the full eligibility and amount breakdown.',
  },
  {
    q: 'Can I run my AC on solar power?',
    a: 'Yes — AC is usually the largest single load in an Indian home, and it runs mostly during daylight hours when solar generates the most, making it one of the best matches for rooftop solar. Size your system with your AC\'s actual usage in mind; see our AC running cost and panel size calculators.',
  },
  {
    q: 'Is solar worth it if my roof gets partial shade?',
    a: 'Partial shading meaningfully reduces output — even shading on one panel in a series string can drag down the whole string\'s generation, depending on the inverter setup. It\'s usually still worth exploring with an installer, who can recommend panel layout, micro-inverters or power optimizers to minimize the shading penalty, but expect lower generation than an unshaded roof of the same size.',
  },
  {
    q: 'How does electricity tariff escalation affect my solar payback period?',
    a: 'The payback period itself is based on today\'s tariff, but your total savings over the system\'s life grow faster if tariffs rise over time, since solar keeps offsetting units at whatever the current rate is while your net cost stays fixed. See the 25-year cost comparison below for how different tariff-growth scenarios affect cumulative savings.',
  },
]

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default async function SolarRoiPage({
  searchParams,
}: {
  searchParams: Promise<{ discom?: string }>
}) {
  const { discom } = await searchParams
  const requestedDiscom = discom?.toUpperCase()
  const defaultDiscomCode = liveDiscoms.some((d) => d.code === requestedDiscom)
    ? requestedDiscom
    : undefined

  return (
    <>
      <SplitHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'ROI Calculator', href: PATH },
        ]}
        badgeLabel="Real DISCOM tariff + PM Surya Ghar"
        h1="Solar ROI Calculator (Rooftop Payback & Savings)"
        subtitle="Find your rooftop solar payback period and lifetime savings. This calculator values the units solar offsets against your DISCOM's actual telescopic tariff and applies the PM Surya Ghar central subsidy."
        primaryCta={{ label: 'Calculate My Payback', href: '#calculator', emoji: '☀️' }}
        secondaryCta={{ label: 'Get 3 free quotes →', href: '#leadgen' }}
        statChips={[
          { icon: '💸', big: '₹78,000', small: 'Max subsidy', tone: 'hub' },
          { icon: '🔆', big: '~4u/kW/day', small: 'Generation assumption', tone: 'hub' },
          { icon: '📆', big: '25 yrs', small: 'System lifetime', tone: 'hub' },
          { icon: '📊', big: 'Real tariff', small: 'Priced on your DISCOM', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <span aria-hidden>☀️</span> Worked example
            </p>
            <p className="mt-2 text-sm text-white/70">
              A 3 kW system for a Tamil Nadu (TNEB) home using 300 units/month
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-white">
              {formatINR(example.netCost)}
              <span className="ml-1 text-sm font-normal text-white/50">net cost</span>
            </p>
            <p className="mt-2 text-xs text-white/50">
              Saves ~
              <span className="text-spark-teal">{formatINR(example.annualSavings)}</span>
              /year · pays back in{' '}
              {example.paybackYears != null ? `~${example.paybackYears} yrs` : 'N/A'}
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="why-solar" className="mb-10 scroll-mt-20">
        <h2 id="why-solar" className="font-display mb-2 text-2xl font-semibold">
          Why Rooftop Solar Makes Sense in India
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Indian electricity tariffs are telescopic — the more you consume,
          the higher the rate on your last units. In Tamil Nadu, for
          example, TNEB&apos;s top domestic slab rate is{' '}
          <strong>₹{tnebTopRate.toFixed(2)}/unit</strong>. Every unit solar
          offsets is a unit you stop paying that top rate for, which is why
          solar tends to pay back fastest for higher-consumption households.
          Combined with the PM Surya Ghar subsidy cutting a large chunk off
          the upfront cost, a well-sized rooftop system is one of the few
          home investments that pays for itself and then keeps paying.
        </p>
      </section>

      <section
        aria-labelledby="differentiator"
        className="mb-10 rounded-xl border border-brass/25 bg-brass/5 p-5"
      >
        <h2 id="differentiator" className="font-display mb-2 text-xl font-bold text-ink-navy dark:text-gazette-cream">
          Why This Calculator Is More Accurate
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Most online solar calculators price your savings at a single flat,
          national-average electricity rate. That&apos;s not how Indian
          electricity actually works — each DISCOM sets its own telescopic
          slab tariff, and the units your solar system offsets are your{' '}
          <em>most expensive</em> units, at the top of your slab. This
          calculator computes your real bill before and after solar using
          your own DISCOM&apos;s published tariff — the exact same engine
          that powers our 36 state electricity bill calculators — so the
          savings you see here are grounded in your actual rate structure,
          not a generic assumption.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your solar payback
        </h2>
        <SolarRoiCalculator discoms={liveDiscoms} defaultDiscomCode={defaultDiscomCode} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How solar payback is calculated
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
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
            ₹78,000. Net cost is the system price minus this subsidy — see the
            full breakdown and how-to-apply steps on our{' '}
            <Link href="/solar/subsidy-calculator" className="text-brass underline">
              subsidy calculator
            </Link>
            .
          </p>
          <p>
            <strong>Payback.</strong> Net cost ÷ annual savings gives the payback
            in years. Generation assumes ~4 units per kW per day; your actual
            output depends on location, roof orientation and shading.
          </p>
        </div>
      </section>

      <GridTypeComparison />

      <CostComparisonTable discomCode="TNEB" monthlyUnits={300} systemSizeKw={3} />

      <SolarMythsSection />

      <SolarTipsSection />

      <SolarFinancingSection />

      <SolarImpactSection annualGenerationKwh={example.annualGeneration} />

      <SolarAcTieIn />

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solar/subsidy-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>💸</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              PM Surya Ghar subsidy
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Full subsidy breakdown, eligibility and how to apply.
            </p>
          </Link>
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>❄️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See how much of your bill an AC adds — the load solar offsets first.
            </p>
          </Link>
          <Link
            href="/financial"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-financial/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🧮</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Financial calculators
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              GST, SIP, tax regime and gratuity — everyday money tools.
            </p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-hairline dark:divide-white/10">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-ash marker:hidden dark:text-gazette-cream">
                {f.q}
              </summary>
              <p className="mt-2 text-ash/70 dark:text-gazette-cream/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="leadgen" className="mb-6">
        <h2 id="leadgen" className="font-display mb-4 text-2xl font-semibold">
          Ready for real quotes?
        </h2>
        <LeadGenForm source="solar-roi-calculator" />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLdData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
      />
      </main>
    </>
  )
}
