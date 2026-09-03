import type { Metadata } from 'next'
import Link from 'next/link'
import FridgeCostCalculator from '@/components/calculators/FridgeCostCalculator'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { fridgeCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/fridge-cost-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = fridgeCost({ discomCode: 'TNEB', annualUnitsFromLabel: 200 })

export const metadata: Metadata = {
  title: 'Fridge Electricity Cost Calculator 2026 — From Your BEE Label',
  description:
    'Calculate your refrigerator\'s electricity cost from the annual energy consumption figure printed on its BEE star label, priced at your DISCOM\'s real tariff.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fridge Electricity Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Fridge Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Where do I find my fridge\'s annual energy consumption?',
    a: 'Every fridge sold in India carries a mandatory BEE star-rating label — a yellow sticker on the door or side panel — which states "Annual Energy Consumption" directly in units (kWh) per year. That is the exact figure this calculator needs.',
  },
  {
    q: 'Why does this calculator use the label figure instead of wattage?',
    a: 'A fridge compressor cycles on and off rather than running continuously, and the cycle rate depends on ambient temperature, door-opening frequency and insulation — all things a simple wattage × hours formula can\'t capture reliably. The BEE label figure is measured under standard test conditions and is the most accurate real number available for your specific model.',
  },
  {
    q: 'What if I don\'t have the label anymore?',
    a: 'Search the model number (usually on a sticker inside the fridge) plus "BEE star label" online — manufacturers publish the rating sheet. As a rough guide, a 200–250L 3-star fridge commonly falls in the 150–250 kWh/year range, with 5-star models lower.',
  },
  {
    q: 'Is my actual cost likely to be higher or lower than this estimate?',
    a: 'The BEE figure is measured under controlled lab conditions. A hotter kitchen, frequent door-opening, or an older/less-sealed fridge will typically push real consumption above the label figure; a newer, well-maintained unit in a cool room may run slightly below it.',
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

export default function FridgeCostPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Fridge Cost Calculator', href: '/appliances/fridge-cost-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Fridge Electricity Cost Calculator"
        subtitle={
          <>
            Find your refrigerator&apos;s real running cost using the{' '}
            <strong>annual energy consumption figure on its BEE star label</strong>{' '}
            — a model-specific real number, not a guessed wattage.
          </>
        }
        stats={[
          { icon: '🏷️', big: 'BEE label', small: 'Input source', tone: 'hub' },
          { icon: '❄️', big: '80–500', small: 'Typical units/yr', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
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
          A fridge rated at <strong>200 units/year</strong> on its BEE label
          costs about <strong>{formatINR(example.monthlyCost)}/month</strong> (
          {formatINR(example.annualCost)}/year) to run in Tamil Nadu, at{' '}
          {formatINR(example.effectiveRatePerUnit)}/unit.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your fridge&apos;s cost
        </h2>
        <FridgeCostCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80">
          <p>
            <strong>Straight from the label.</strong> Monthly units = annual
            label figure ÷ 12. We don&apos;t model compressor duty cycles or
            guess a wattage — the BEE label&apos;s annual kWh figure is already
            a tested, model-specific number.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> A fridge runs continuously
            on top of your other usage, so its units fall in your highest
            tariff slab — we use that marginal rate (plus fuel cost adjustment
            and electricity duty).
          </p>
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
              Standard vs BEE 5-star vs BLDC running cost.
            </p>
          </Link>
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🌬️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              The biggest line item on most summer electricity bills.
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
