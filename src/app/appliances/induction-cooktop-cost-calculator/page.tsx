import type { Metadata } from 'next'
import Link from 'next/link'
import InductionCooktopCalculator from '@/components/calculators/InductionCooktopCalculator'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { simpleApplianceCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/induction-cooktop-cost-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = simpleApplianceCost({ discomCode: 'TNEB', wattage: 1600, hoursPerDay: 1 })

export const metadata: Metadata = {
  title: 'Induction Cooktop Electricity Cost Calculator 2026 — India',
  description:
    'Calculate your induction cooktop\'s electricity cost by wattage and daily cooking time, priced at your DISCOM\'s real tariff.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Induction Cooktop Electricity Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Induction Cooktop Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How much electricity does an induction cooktop use?',
    a: 'Most Indian induction cooktops are rated 1200-2000W, with 1600W being a common mid-range figure. Actual draw varies with the power setting you cook at, not just the maximum rated wattage.',
  },
  {
    q: 'Is induction cooking cheaper than LPG?',
    a: 'It depends on your electricity tariff and LPG price, and induction is generally more energy-efficient at transferring heat into the pan than an open LPG flame — but the ₹ comparison needs your own real numbers on both sides. Try our PNG vs LPG comparison for the gas side, and this calculator for the electric side.',
  },
  {
    q: 'Why is the cooktop priced at my top tariff slab?',
    a: 'Indian electricity tariffs are telescopic — usage is billed in progressively pricier slabs. Any appliance you add sits on top of your existing consumption, so its units land on your highest slab, not a blended average rate.',
  },
  {
    q: 'Does the power setting affect actual consumption?',
    a: 'Yes — the rated wattage is the maximum draw at the highest setting. Cooking at a lower power setting (e.g. for simmering) draws less than the rated figure, so this calculator\'s estimate is most accurate for cooking done mostly at higher settings.',
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

export default function InductionCooktopCostPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Induction Cooktop Cost Calculator', href: '/appliances/induction-cooktop-cost-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Induction Cooktop Electricity Cost Calculator"
        subtitle={
          <>
            Find out what your induction cooktop costs to run. Pick a power
            tier or enter its exact wattage, set daily cooking time, and we
            price the units at your <strong>DISCOM&apos;s top electricity slab</strong>.
          </>
        }
        stats={[
          { icon: '🍳', big: '1200–2000W', small: 'Typical range', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '⏱️', big: 'Mins, not hrs', small: 'Typical daily use', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5 dark:border-white/10 dark:border-l-brass dark:bg-slate-900"
      >
        <h2
          id="worked-example"
          className="font-display text-sm font-semibold tracking-wide text-brass uppercase"
        >
          Worked example
        </h2>
        <p className="mt-2 text-ash/80 dark:text-gazette-cream/90">
          A <strong>1600W induction cooktop</strong> used 1 hour/day in
          Tamil Nadu uses about <strong>{example.dailyUnits} units/day</strong>{' '}
          and costs roughly <strong>{formatINR(example.monthlyCost)}/month</strong>{' '}
          ({formatINR(example.annualCost)}/year) at{' '}
          {formatINR(example.effectiveRatePerUnit)}/unit.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your cooktop&apos;s cost
        </h2>
        <InductionCooktopCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>Units = wattage × hours ÷ 1000.</strong> The
            cooktop&apos;s daily energy use in kWh is its wattage multiplied
            by daily active cooking hours, divided by 1000 to convert watts
            to kilowatts. Unlike an always-on appliance, most households
            only run an induction cooktop for a fraction of an hour to a
            couple of hours a day.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> Since a cooktop adds
            to your existing consumption, its units fall in your highest
            tariff slab — we use that marginal rate (plus fuel cost
            adjustment and electricity duty) for a realistic cost.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/gas"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔥</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Gas bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Compare against PNG cooking cost.
            </p>
          </Link>
          <Link
            href="/fuel-cost/lpg-cylinder-usage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔥</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              LPG cylinder usage
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Compare against LPG cylinder cooking cost.
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⚡</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Full bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See your complete monthly bill, not just this one appliance.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
