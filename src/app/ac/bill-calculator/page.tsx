import type { Metadata } from 'next'
import Link from 'next/link'
import AffiliateProductCard from '@/components/AffiliateProductCard'
import AcBillCalculator from '@/components/calculators/AcBillCalculator'
import AcConsumptionReferenceTable from '@/components/ac/AcConsumptionReferenceTable'
import AcFormulaBlock from '@/components/ac/AcFormulaBlock'
import AcNeighborDiagnostic from '@/components/ac/AcNeighborDiagnostic'
import AcReductionTips from '@/components/ac/AcReductionTips'
import AcScenarioComparison from '@/components/ac/AcScenarioComparison'
import AcSlabComparisonTable from '@/components/ac/AcSlabComparisonTable'
import SplitHero from '@/components/SplitHero'
import { AC_PRODUCTS } from '@/data/ac-products'
import discomsJson from '@/data/discoms.json'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/ac/bill-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const COMPARISON_DISCOMS = [
  { code: 'TNEB', label: 'Tamil Nadu (TNEB)' },
  { code: 'BESCOM', label: 'Karnataka (BESCOM)' },
  { code: 'MSEDCL', label: 'Maharashtra (MSEDCL)' },
  { code: 'BRPL', label: 'Delhi (BRPL)' },
  { code: 'UPPCL', label: 'Uttar Pradesh (UPPCL)' },
]

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
const datasetLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'AC running cost by DISCOM tariff (India)',
  description:
    'Monthly and annual running cost for a fixed AC configuration, computed across multiple Indian DISCOM tariffs at their real top electricity slab.',
  variableMeasured: ['Monthly cost (INR)', 'Annual cost (INR)', 'Effective rate per unit (INR/kWh)'],
  creator: { '@type': 'Organization', name: 'DesiMetrics', url: SITE },
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: 'Running Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How accurate is this AC running cost estimate?',
    a: 'It uses your AC’s ISEER-based efficiency, a ~70% compressor duty factor, and your DISCOM’s real top-slab tariff — a close planning estimate, not a billing-grade figure. Actual usage varies with room insulation, set temperature, and outdoor weather.',
  },
  {
    q: 'Why is the AC priced at my top tariff slab, not the average rate?',
    a: 'Indian electricity tariffs are telescopic — you pay progressively higher rates as consumption rises. An AC adds to whatever you already use, so its units land on your highest slab, not a blended average. Pricing it any other way would understate the real cost.',
  },
  {
    q: 'Does star rating actually change the running cost?',
    a: 'Yes, directly — star rating maps to an ISEER value, and a higher ISEER means fewer electrical units for the same cooling output. See our 3-star vs 5-star savings guide for the exact annual difference.',
  },
  {
    q: 'Does this include my fixed charge or the rest of my bill?',
    a: 'No — this is the marginal cost the AC itself adds, priced at your top slab. For your full monthly bill including fixed charges, subsidies and duty, use your state’s electricity bill calculator.',
  },
  {
    q: 'How can I reduce my AC running cost?',
    a: 'The biggest levers are: raise the thermostat set point by 1-2°C (each degree saves a meaningful share of compressor runtime), get the unit serviced so the coils and filters aren’t restricting airflow, and if you’re buying new, choose a 5-star inverter model sized correctly for the room — see our tonnage calculator.',
  },
  {
    q: 'What’s the difference between SEER and ISEER?',
    a: 'SEER (Seasonal Energy Efficiency Ratio) is the US efficiency standard, tested against American climate and duty-cycle assumptions. ISEER is BEE’s Indian adaptation, tested against Indian climate zones and usage patterns — so an ISEER rating is the relevant figure for running cost in India, not an imported SEER number.',
  },
  {
    q: 'Why does the same AC cost more to run in one state than another?',
    a: 'Two states can have very different top-slab tariffs, fuel cost adjustments and electricity duty — see the slab comparison above. An identical AC can genuinely cost 30-50% more to run in a high-tariff state than a low-tariff one.',
  },
  {
    q: 'Is a 5-star fixed-speed AC better than a 3-star inverter AC?',
    a: 'Star rating is based on ISEER regardless of compressor technology, so a genuine 5-star rating beats a genuine 3-star rating either way. In practice, though, almost all 5-star models sold today are inverter units — a labelled 3-star inverter AC is uncommon, so this comparison is mostly theoretical.',
  },
  {
    q: 'What is the correct tonnage for my room size?',
    a: 'It depends on room area, sun exposure and floor level — use our AC tonnage calculator for an exact recommendation rather than guessing, since both an undersized and an oversized unit cost more to run than a correctly sized one.',
  },
  {
    q: 'How much does a 1.5 ton AC cost to run per month in 2026?',
    a: `For a 1.5 ton, 3-star unit at 8 hours/day, expect roughly ${formatINR(example.monthlyCost)}/month in a mid-tariff state like Tamil Nadu — see the slab comparison above for how this shifts across other states, or use the calculator for your exact DISCOM and hours.`,
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

export default function AcBillCalculatorPage() {
  return (
    <>
      <SplitHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Running Cost Calculator', href: PATH },
        ]}
        badgeLabel="ISEER + top-slab pricing"
        h1="AC Running Cost Calculator"
        subtitle="Find out what your air conditioner actually costs to run. Enter its tonnage, star rating and daily hours, pick your DISCOM, and we price the units at your state's top electricity slab — because AC is extra load billed at your highest rate."
        primaryCta={{ label: 'Calculate My AC Cost', href: '#calculator', emoji: '❄️' }}
        secondaryCta={{ label: 'All AC calculators →', href: '/ac' }}
        statChips={[
          { icon: '⭐', big: '3–5 ★', small: 'Star ratings', tone: 'hub' },
          { icon: '⚙️', big: 'ISEER', small: 'Efficiency basis', tone: 'hub' },
          { icon: '📊', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <span aria-hidden>⚡</span> Worked example
            </p>
            <p className="mt-2 text-sm text-white/70">
              A 1.5 ton 3-star AC running 8 hours/day in Tamil Nadu uses about{' '}
              {example.dailyUnits} units/day and costs
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-white">
              {formatINR(example.monthlyCost)}
              <span className="ml-1 text-sm font-normal text-white/50">/month</span>
            </p>
            <p className="mt-2 text-xs text-white/50">
              {formatINR(example.annualCost)}/year at{' '}
              {formatINR(example.effectiveRatePerUnit)}/unit
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your AC cost
        </h2>
        <AcBillCalculator discoms={liveDiscoms} />
      </section>

      {/* Contextual affiliate placement: efficient models that cut this cost */}
      <section aria-labelledby="picks" className="mb-10">
        <h2 id="picks" className="font-display mb-2 text-2xl font-semibold">
          Efficient models that cut this cost
        </h2>
        <p className="mb-4 text-sm text-ash/60">
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

      <section aria-labelledby="wrong" className="mb-10">
        <h2 id="wrong" className="font-display mb-4 text-2xl font-semibold">
          Why most AC bill calculators get this wrong
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl border border-hairline bg-paper p-5">
            <p className="font-display font-bold text-ink-navy">
              SEER vs ISEER
            </p>
            <p className="mt-1 text-sm text-ash/70">
              Some calculators quietly borrow US SEER-based efficiency
              assumptions instead of BEE&apos;s India-specific ISEER standard.
              The two are tested against different climate and duty-cycle
              conditions, so a SEER-based estimate doesn&apos;t reflect how
              an Indian-labelled AC actually performs here.
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-paper p-5">
            <p className="font-display font-bold text-ink-navy">
              Flat-rate vs top-slab billing
            </p>
            <p className="mt-1 text-sm text-ash/70">
              Many tools price every unit at one flat, national-average rate.
              Indian tariffs are telescopic — an AC adds to your existing
              usage, so its units land on your highest slab, which is almost
              always well above the average rate quoted.
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-paper p-5">
            <p className="font-display font-bold text-ink-navy">
              Keeping pace with BEE&apos;s ISEER rebalancing
            </p>
            <p className="mt-1 text-sm text-ash/70">
              BEE periodically revises the ISEER thresholds behind each star
              rating, so a fixed set of efficiency numbers can quietly go
              stale. We keep our ISEER table current with BEE&apos;s latest
              published bands rather than reusing figures from years ago —
              always check the current BEE label on a specific model, since
              exact threshold dates and revision details vary by product
              category and are set directly by BEE.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="formula" className="mb-10">
        <h2 id="formula" className="font-display mb-4 text-2xl font-semibold">
          The ISEER formula behind this calculator
        </h2>
        <AcFormulaBlock />
      </section>

      <section aria-labelledby="slabs" className="mb-10">
        <h2 id="slabs" className="font-display mb-2 text-2xl font-semibold">
          How slab-wise billing changes your AC cost
        </h2>
        <p className="mb-4 text-sm text-ash/60">
          The exact same <strong>1.5 ton, 3-star AC running 8 hours/day</strong>{' '}
          — priced at each state&apos;s real top-slab tariff, computed live by
          this calculator&apos;s own engine:
        </p>
        <AcSlabComparisonTable tonnage={1.5} starRating={3} dailyHours={8} discoms={COMPARISON_DISCOMS} />
      </section>

      <section aria-labelledby="neighbor" className="mb-10">
        <h2 id="neighbor" className="font-display mb-4 text-2xl font-semibold">
          Why your AC bill might be higher than your neighbor&apos;s
        </h2>
        <AcNeighborDiagnostic />
      </section>

      <section aria-labelledby="reference" className="mb-10">
        <h2 id="reference" className="font-display mb-2 text-2xl font-semibold">
          AC electricity consumption — quick reference table
        </h2>
        <AcConsumptionReferenceTable />
      </section>

      <section aria-labelledby="scenario" className="mb-10">
        <h2 id="scenario" className="font-display mb-4 text-2xl font-semibold">
          Real-world scenario: non-inverter 3★ vs inverter 5★
        </h2>
        <AcScenarioComparison />
      </section>

      <section aria-labelledby="tips" className="mb-10">
        <h2 id="tips" className="font-display mb-4 text-2xl font-semibold">
          Simple ways to cut your AC bill
        </h2>
        <AcReductionTips />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How AC running cost is calculated
        </h2>
        <div className="space-y-3 text-ash/80">
          <p>
            <strong>Efficiency (ISEER).</strong> A star rating maps to an ISEER
            value — the higher it is, the fewer units the same cooling needs.
            We convert tonnage to cooling power, divide by ISEER for
            electrical input, and apply a compressor duty factor — see the
            exact formula and constants above.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> Since an AC adds to your
            existing consumption, its units fall in your highest tariff slab. We
            use that marginal rate (plus fuel cost adjustment and electricity
            duty) — so the estimate reflects what the AC really adds to your bill.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/ac/tonnage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC tonnage calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Not sure this is even the right AC size for your room? Check first.
            </p>
          </Link>
          <Link
            href="/ac/comparisons/3-star-vs-5-star-savings-guide"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>⭐</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              3★ vs 5★ savings
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See exactly how much a higher star rating would cut this cost.
            </p>
          </Link>
          <Link
            href="/ac/circuit-safety-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🛡️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Circuit safety calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Buying new? Check the MCB and wiring it needs too.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Offset it with solar
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See the payback on a rooftop system sized for AC-heavy usage.
            </p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="font-display mb-4 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-hairline">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-ash marker:hidden">
                {f.q}
              </summary>
              <p className="mt-2 text-ash/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      </main>
    </>
  )
}
