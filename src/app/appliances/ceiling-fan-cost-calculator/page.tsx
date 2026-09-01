import type { Metadata } from 'next'
import Link from 'next/link'
import CeilingFanCalculator from '@/components/calculators/CeilingFanCalculator'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { simpleApplianceCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/appliances/ceiling-fan-cost-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = simpleApplianceCost({ discomCode: 'TNEB', wattage: 75, hoursPerDay: 10 })

export const metadata: Metadata = {
  title: 'Ceiling Fan Electricity Cost Calculator 2026 — Monthly & Yearly',
  description:
    'Calculate your ceiling fan\'s electricity cost by wattage and daily hours, priced at your DISCOM\'s real tariff. Compare standard, BEE 5-star and BLDC fans.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ceiling Fan Electricity Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Ceiling Fan Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How much electricity does a ceiling fan use?',
    a: 'A standard Indian ceiling fan draws around 75W. A BEE 5-star rated fan typically uses about 50W, and a BLDC (brushless DC) "super-efficient" fan uses as little as 28–35W for similar airflow — roughly 60% less than a standard fan.',
  },
  {
    q: 'Is a BLDC fan worth the extra cost?',
    a: 'Usually yes if you run fans for many hours a day across a household with several fans — the wattage difference compounds. Use the calculator above with your actual daily hours to see the annual saving versus a standard fan.',
  },
  {
    q: 'Why is the fan priced at my top tariff slab?',
    a: 'Indian electricity tariffs are telescopic — usage is billed in progressively pricier slabs. Any appliance you add sits on top of your existing consumption, so its units land on your highest slab, not a blended average rate.',
  },
  {
    q: 'How can I find my fan\'s exact wattage?',
    a: 'Check the sticker on the fan\'s motor housing or the box it came in — Indian fans are required to display rated wattage as part of the BEE star-labelling programme for regulated categories.',
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

export default function CeilingFanCostPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Ceiling Fan Cost Calculator', href: '/appliances/ceiling-fan-cost-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Ceiling Fan Electricity Cost Calculator"
        subtitle={
          <>
            Find out what your ceiling fan costs to run. Pick a fan type or enter
            its exact wattage, set daily hours, and we price the units at your{' '}
            <strong>DISCOM&apos;s top electricity slab</strong>.
          </>
        }
        stats={[
          { icon: '🌀', big: '28–75W', small: 'Typical range', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '⚡', big: '~60%', small: 'BLDC vs standard', tone: 'spark-teal' },
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
          A <strong>standard 75W fan</strong> running 10 hours/day in Tamil Nadu
          uses about <strong>{example.dailyUnits} units/day</strong> and costs
          roughly <strong>{formatINR(example.monthlyCost)}/month</strong> (
          {formatINR(example.annualCost)}/year) at {formatINR(example.effectiveRatePerUnit)}
          /unit.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your fan&apos;s cost
        </h2>
        <CeilingFanCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>Units = wattage × hours ÷ 1000.</strong> A fan&apos;s daily
            energy use in kWh is its wattage multiplied by daily running hours,
            divided by 1000 to convert watts to kilowatts.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> Since a fan adds to your
            existing consumption, its units fall in your highest tariff slab —
            we use that marginal rate (plus fuel cost adjustment and
            electricity duty) for a realistic cost.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/appliances/fridge-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>❄️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Fridge cost calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              From the annual kWh figure on your fridge&apos;s BEE label.
            </p>
          </Link>
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🌬️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              The biggest line item on most summer electricity bills.
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
