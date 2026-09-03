import type { Metadata } from 'next'
import Link from 'next/link'
import GenericApplianceCostCalculator from '@/components/calculators/GenericApplianceCostCalculator'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { simpleApplianceCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/electricity/appliance-cost-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = simpleApplianceCost({ discomCode: 'TNEB', wattage: 100, hoursPerDay: 4 })

// Reference figures only — informational, not used as calculator inputs.
// Typical published wattage ranges for common Indian household appliances.
const REFERENCE_APPLIANCES = [
  ['LED bulb', '5–15 W'],
  ['Laptop', '40–65 W'],
  ['LED TV (42")', '60–120 W'],
  ['Washing machine', '350–700 W'],
  ['Microwave oven', '900–1500 W'],
  ['Electric iron', '1000–1600 W'],
  ['Water heater (geyser)', '1500–3000 W'],
  ['Mixer/grinder', '300–750 W'],
]

export const metadata: Metadata = {
  title: 'Appliance Electricity Cost Calculator 2026 — Any Appliance (India)',
  description:
    'Calculate the running cost of any home appliance from its wattage and daily usage hours, priced at your DISCOM\'s real tariff.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Appliance Electricity Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Electricity', path: '/electricity' },
  { name: 'Appliance Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How do I find my appliance\'s wattage?',
    a: 'It\'s printed on a rating plate or sticker on the appliance itself, or in the box/manual — usually labelled "Power" or "Rated Wattage" in W.',
  },
  {
    q: 'Does this work for appliances we already have a dedicated calculator for, like AC or fridge?',
    a: 'It can, but our dedicated AC, ceiling fan and fridge calculators use more accurate methodology — ISEER for AC, and the BEE label figure for fridges — so use those where available. This generic tool is for everything else.',
  },
  {
    q: 'Why is the appliance priced at my top tariff slab?',
    a: 'Indian electricity tariffs are telescopic — any appliance you add sits on top of your existing consumption, so its units land on your highest slab, not a blended average rate.',
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

export default function GenericApplianceCostPage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Electricity', href: '/electricity' },
          { label: 'Appliance Cost Calculator', href: '/electricity/appliance-cost-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⚡</span> Electricity hub
          </>
        }
        h1="Appliance Electricity Cost Calculator"
        subtitle={
          <>
            Any appliance not covered by our dedicated tools — enter its
            wattage and daily hours, priced at{' '}
            <strong>your DISCOM&apos;s real tariff</strong>.
          </>
        }
        stats={[
          { icon: '🔌', big: 'Any', small: 'Wattage', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '⚡', big: 'Instant', small: 'No login', tone: 'hub' },
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
          A <strong>100W appliance</strong> running{' '}
          <strong>4 hours/day</strong> in Tamil Nadu uses about{' '}
          <strong>{example.dailyUnits} units/day</strong> and costs roughly{' '}
          <strong>{formatINR(example.monthlyCost)}/month</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your appliance&apos;s cost
        </h2>
        <GenericApplianceCostCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="reference" className="mb-10">
        <h2 id="reference" className="font-display mb-2 text-2xl font-semibold">
          Typical appliance wattage — reference only
        </h2>
        <p className="mb-4 text-ash/70">
          These are commonly published ranges to help you sanity-check a
          figure — always use the wattage printed on your specific
          appliance for an accurate calculation.
        </p>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline bg-mist text-ink-navy">
              <tr>
                <th className="px-4 py-2 font-semibold">Appliance</th>
                <th className="px-4 py-2 text-right font-semibold">Typical wattage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {REFERENCE_APPLIANCES.map(([name, watts]) => (
                <tr key={name}>
                  <td className="px-4 py-2 font-medium">{name}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{watts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/appliances/ceiling-fan-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🌀</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Ceiling fan cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Dedicated tool with fan-type presets.
            </p>
          </Link>
          <Link
            href="/appliances/fridge-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>❄️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Fridge cost calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              More accurate — uses your fridge&apos;s BEE label.
            </p>
          </Link>
          <Link
            href="/electricity/ev-charging-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              EV charging cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              A bigger load than most appliances — its own tool.
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
