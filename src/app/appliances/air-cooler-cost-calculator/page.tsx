import type { Metadata } from 'next'
import Link from 'next/link'
import AirCoolerCalculator from '@/components/calculators/AirCoolerCalculator'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { simpleApplianceCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/air-cooler-cost-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = simpleApplianceCost({ discomCode: 'TNEB', wattage: 230, hoursPerDay: 8 })

export const metadata: Metadata = {
  title: 'Air Cooler Electricity Cost Calculator 2026 — Monthly & Yearly',
  description:
    'Calculate your air cooler\'s (desert, tower or personal) electricity cost by wattage and daily hours, priced at your DISCOM\'s real tariff.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Air Cooler Electricity Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Air Cooler Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How much electricity does an air cooler use?',
    a: 'A personal/small cooler typically draws around 150W, a tower cooler around 180W, and a larger desert or window cooler around 230W — mostly from the fan motor and water pump, which is why coolers use far less power than an AC of similar cooling area.',
  },
  {
    q: 'Is an air cooler cheaper to run than an AC?',
    a: 'Yes, significantly — a cooler\'s motor and pump draw a fraction of an AC compressor\'s power. The tradeoff is cooling method: a cooler works by evaporation and is most effective in hot, dry climates, while an AC actively removes heat and works well in humid conditions too.',
  },
  {
    q: 'Why is the cooler priced at my top tariff slab?',
    a: 'Indian electricity tariffs are telescopic — usage is billed in progressively pricier slabs. Any appliance you add sits on top of your existing consumption, so its units land on your highest slab, not a blended average rate.',
  },
  {
    q: 'How can I find my cooler\'s exact wattage?',
    a: 'Check the rating label on the back or base of the cooler, or the box it came in — it lists rated wattage (sometimes split as fan motor + pump).',
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

export default function AirCoolerCostPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Air Cooler Cost Calculator', href: '/appliances/air-cooler-cost-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Air Cooler Electricity Cost Calculator"
        subtitle={
          <>
            Find out what your air cooler costs to run. Pick a cooler type or
            enter its exact wattage, set daily hours, and we price the units
            at your <strong>DISCOM&apos;s top electricity slab</strong>.
          </>
        }
        stats={[
          { icon: '🌬️', big: '150–230W', small: 'Typical range', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '⚡', big: '~78%', small: 'Less power than AC*', tone: 'spark-teal' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5"
      >
        <h2
          id="worked-example"
          className="font-display text-sm font-semibold tracking-wide text-brass uppercase"
        >
          Worked example
        </h2>
        <p className="mt-2 text-ash/80">
          A <strong>230W desert cooler</strong> running 8 hours/day in Tamil
          Nadu uses about <strong>{example.dailyUnits} units/day</strong> and
          costs roughly <strong>{formatINR(example.monthlyCost)}/month</strong>{' '}
          ({formatINR(example.annualCost)}/year) at{' '}
          {formatINR(example.effectiveRatePerUnit)}/unit.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your cooler&apos;s cost
        </h2>
        <AirCoolerCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80">
          <p>
            <strong>Units = wattage × hours ÷ 1000.</strong> A cooler&apos;s
            daily energy use in kWh is its wattage multiplied by daily
            running hours, divided by 1000 to convert watts to kilowatts.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> Since a cooler adds to
            your existing consumption, its units fall in your highest
            tariff slab — we use that marginal rate (plus fuel cost
            adjustment and electricity duty) for a realistic cost.
          </p>
        </div>
        <p className="mt-3 text-xs text-ash/50">
          *The &ldquo;~78% less power&rdquo; stat is computed from this
          site&apos;s own engines: a 230W desert cooler running 8 hours/day
          uses about 78% fewer units than a 1.5-ton 3-star AC over the same
          8 hours. It compares electricity draw, not cooling effectiveness
          — a cooler works by evaporation and performs very differently
          from an AC depending on your climate&apos;s humidity.
        </p>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>❄️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Compare against an AC for the same room.
            </p>
          </Link>
          <Link
            href="/appliances/ceiling-fan-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🌀</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Ceiling fan cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              The cheapest way to move air in a room.
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>⚡</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Full bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See your complete monthly bill, not just this one appliance.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
