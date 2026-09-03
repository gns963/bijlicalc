import type { Metadata } from 'next'
import Link from 'next/link'
import EvChargingCostCalculator from '@/components/calculators/EvChargingCostCalculator'
import EvVsFuelComparison from '@/components/calculators/EvVsFuelComparison'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { calculateEvChargingCost } from '@/lib/calc/ev'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/electricity/ev-charging-cost-calculator'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const example = calculateEvChargingCost({ discomCode: 'TNEB', batteryCapacityKwh: 30, fullRangeKm: 200 })

export const metadata: Metadata = {
  title: 'EV Charging Cost Calculator 2026 — Home Charging Cost (India)',
  description:
    'Calculate what a full home EV charge costs, and your cost per km, priced at your DISCOM\'s real tariff — from your battery capacity and range.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV Charging Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Electricity', path: '/electricity' },
  { name: 'EV Charging Cost Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Why is home EV charging priced at my top tariff slab?',
    a: 'Charging an EV at home adds substantially to your existing consumption, so — like an AC — its units fall in your highest, most expensive tariff slab rather than a blended average rate.',
  },
  {
    q: 'Why does the calculator assume 90% charging efficiency?',
    a: 'AC home charging loses some energy as heat during conversion inside the car\'s onboard charger. About 90% efficiency is a commonly cited figure for typical home (Level 1/2 AC) charging — DC fast charging has different loss characteristics.',
  },
  {
    q: 'How do I find my EV\'s battery capacity and range?',
    a: 'Both are published in your vehicle\'s spec sheet — battery capacity in kWh (usable capacity, not always the same as the marketed "gross" figure) and the certified or real-world range in km.',
  },
  {
    q: 'Is home charging cheaper than a public fast charger?',
    a: 'Usually yes — public DC fast chargers typically charge a per-unit rate well above residential tariffs, plus sometimes a service fee, whereas home charging uses your normal household tariff.',
  },
  {
    q: 'Is an EV actually cheaper to run than a petrol or diesel car?',
    a: 'Almost always yes on a per-km basis, sometimes by a wide margin — use the comparison tool below with your real local fuel prices and your specific vehicles\' mileage to see your own numbers rather than a generic claim.',
  },
  {
    q: 'Why does the comparison tool ask for my own petrol/diesel/CNG price and mileage?',
    a: 'Fuel prices vary by city and change daily, and vehicle mileage varies by model and driving conditions — using your own real numbers gives an honest comparison instead of a generic assumed figure that might not match your situation.',
  },
  {
    q: 'Does EV charging cost change with electricity tariff hikes the same way petrol prices change?',
    a: 'Yes — like any electricity use, EV charging cost moves with your DISCOM\'s tariff. Historically, electricity tariffs have changed less frequently and less sharply than daily-revised fuel prices, but there\'s no guarantee that continues indefinitely.',
  },
  {
    q: 'Does charging speed (slow vs fast home charging) change the cost?',
    a: 'Not meaningfully for the ₹ total — you\'re paying for the same units (kWh) delivered either way. Faster home charging (higher amperage) mainly affects how long it takes, not how much it costs, though very high loads could theoretically push some usage into a different tariff period if your DISCOM uses time-of-day rates.',
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

export default function EvChargingCostPage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Electricity', href: '/electricity' },
          { label: 'EV Charging Cost Calculator', href: '/electricity/ev-charging-cost-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⚡</span> Electricity hub
          </>
        }
        h1="EV Charging Cost Calculator"
        subtitle={
          <>
            Find what a full home charge costs, and your cost per km, priced at{' '}
            <strong>your DISCOM&apos;s real top-slab tariff</strong>.
          </>
        }
        stats={[
          { icon: '🔋', big: '90%', small: 'Charging efficiency', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '🚗', big: '₹/km', small: 'Also shown', tone: 'hub' },
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
          A <strong>30 kWh battery</strong> with a{' '}
          <strong>200 km</strong> full-charge range costs about{' '}
          <strong>{formatINR(example.costToFullCharge)}</strong> to fully
          charge in Tamil Nadu — roughly{' '}
          <strong>{formatINR(example.costPerKm ?? 0)}/km</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your charging cost
        </h2>
        <EvChargingCostCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="ev-vs-fuel" className="mb-10">
        <h2 id="ev-vs-fuel" className="font-display mb-2 text-2xl font-semibold">
          EV vs Petrol vs Diesel vs CNG — cost per km
        </h2>
        <p className="mb-4 text-sm text-ash/60">
          EV cost uses your real DISCOM tariff from above; enter your own
          fuel prices and mileage for a genuine like-for-like comparison.
        </p>
        <EvVsFuelComparison discomCode="TNEB" batteryCapacityKwh={30} fullRangeKm={200} />
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/electricity/appliance-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔋</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Appliance cost calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Any other appliance, from its wattage.
            </p>
          </Link>
          <Link
            href="/fuel-cost/petrol-diesel-cost-per-km-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🚗</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Petrol/diesel cost per km
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Compare against your old vehicle&apos;s running cost.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Solar ROI calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Offset EV charging with rooftop solar.
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
