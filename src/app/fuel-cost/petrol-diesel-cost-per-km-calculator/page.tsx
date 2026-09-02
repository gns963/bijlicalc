import type { Metadata } from 'next'
import Link from 'next/link'
import VehicleFuelCostCalculator from '@/components/calculators/VehicleFuelCostCalculator'
import { FuelGaugeIcon } from '@/components/HubMotifIcon'
import PageHero from '@/components/PageHero'
import { vehicleCostPerKm } from '@/lib/calc/fuel'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/fuel-cost/petrol-diesel-cost-per-km-calculator'

const example = vehicleCostPerKm({ fuelPricePerLitre: 100, mileageKmPerLitre: 18, monthlyKm: 1000 })

export const metadata: Metadata = {
  title: 'Petrol/Diesel Cost Per KM Calculator 2026 — Vehicle Running Cost',
  description:
    'Calculate your vehicle\'s real fuel cost per km, per month and per year from today\'s fuel price and your mileage — for petrol, diesel or CNG.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Petrol/Diesel Cost Per KM Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Fuel Cost', path: '/fuel-cost' },
  { name: 'Petrol/Diesel Cost Per KM', path: PATH },
])

const faqs = [
  {
    q: 'How is cost per km calculated?',
    a: 'Cost per km = fuel price per litre ÷ vehicle mileage (km per litre). For example, ₹100/litre fuel with 20 km/litre mileage costs ₹5 per km.',
  },
  {
    q: 'Where do I find my vehicle\'s real mileage?',
    a: 'The manufacturer\'s ARAI-certified figure is optimistic — real-world mileage is usually 10–20% lower depending on traffic, AC use and driving style. Track your actual fuel fill-ups against odometer readings for the most accurate figure.',
  },
  {
    q: 'Does this work for CNG or electric vehicles?',
    a: 'For CNG, enter the price per kg and your mileage in km/kg — the same division works. This calculator isn\'t suited to EVs, where cost depends on electricity tariff and charging efficiency rather than a fuel price per litre — see our EV charging cost calculator instead.',
  },
  {
    q: 'Why does fuel price vary by city?',
    a: 'The retail price is base fuel cost plus central excise duty, dealer commission, and state VAT — and state VAT rates differ significantly, which is why the same fuel can cost noticeably more in one state than a neighbouring one. Prices are revised daily based on international crude rates and the exchange rate, per PPAC/Ministry of Petroleum & Natural Gas methodology.',
  },
  {
    q: 'Why doesn\'t DesiMetrics show a live fuel price?',
    a: 'Prices are revised daily by city and change with crude oil movements and state tax changes — showing a number that\'s already stale by the next morning would be less accurate than asking for today\'s real price at your pump, so we ask for your own current number.',
  },
  {
    q: 'How much does driving 100km actually cost?',
    a: 'Multiply your cost-per-km figure by 100 — see the quick-reference table above for common distances at your entered price and mileage.',
  },
  {
    q: 'Does AC use affect my real-world mileage?',
    a: 'Yes, noticeably in city driving — running the AC adds engine load, which is a meaningful part of why real-world mileage often comes in below the certified figure, especially in stop-start traffic.',
  },
  {
    q: 'Is diesel always cheaper to run than petrol?',
    a: 'Per-litre, diesel is often priced lower than petrol, and diesel engines often deliver better mileage too — but the total cost comparison also depends on the vehicle\'s price difference and how many km/year you drive, which this calculator alone doesn\'t capture.',
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

export default function VehicleFuelCostPage() {
  return (
    <>
      <PageHero
        hub="fuel"
        breadcrumb={[
          { label: 'Fuel Cost', href: '/fuel-cost' },
          { label: 'Petrol/Diesel Cost Per KM', href: '/fuel-cost/petrol-diesel-cost-per-km-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⛽</span> Fuel Cost hub
          </>
        }
        h1={
          <span className="flex items-center gap-2">
            <FuelGaugeIcon className="h-7 w-7 text-hub-fuel" />
            Petrol/Diesel Cost Per KM Calculator
          </span>
        }
        subtitle={
          <>
            Find your vehicle&apos;s real running cost from today&apos;s fuel
            price and your actual mileage — per km, per month and per year.
          </>
        }
        stats={[
          { icon: '₹', big: '₹/km', small: 'Cost basis', tone: 'hub' },
          { icon: '⛽', big: 'Any fuel', small: 'Petrol, diesel, CNG', tone: 'hub' },
          { icon: '📏', big: 'Real mileage', small: 'Your own figure', tone: 'hub' },
          { icon: '🔓', big: 'Instant', small: 'No login', tone: 'hub' },
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
          At <strong>₹100/litre</strong> and <strong>18 km/litre</strong>{' '}
          mileage, each km costs about <strong>{formatINR(example.costPerKm)}</strong>{' '}
          — roughly {formatINR(example.monthlyCost)}/month for 1,000 km driven.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your running cost
        </h2>
        <VehicleFuelCostCalculator />
      </section>

      <section aria-labelledby="quick-reference" className="mb-10">
        <h2 id="quick-reference" className="font-display mb-2 text-2xl font-semibold">
          Quick reference
        </h2>
        <p className="mb-4 text-sm text-ash/60 dark:text-gazette-cream/50">
          At the worked example&apos;s ₹{100}/litre and 18 km/litre — swap in
          your own numbers in the calculator above for your real figures.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="mb-2 text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
              ₹ buys how many litres
            </p>
            <dl className="space-y-1.5 text-sm">
              {[100, 500, 1000].map((amt) => (
                <div key={amt} className="flex justify-between">
                  <dt className="text-ash/70 dark:text-gazette-cream/60">₹{amt}</dt>
                  <dd className="font-semibold tabular-nums text-ink-navy dark:text-gazette-cream">
                    {(amt / 100).toFixed(2)} L
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="mb-2 text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
              What common trips cost
            </p>
            <dl className="space-y-1.5 text-sm">
              {[50, 100, 500].map((km) => (
                <div key={km} className="flex justify-between">
                  <dt className="text-ash/70 dark:text-gazette-cream/60">{km} km</dt>
                  <dd className="font-semibold tabular-nums text-ink-navy dark:text-gazette-cream">
                    {formatINR(km * example.costPerKm)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="price-variation" className="mb-10">
        <h2 id="price-variation" className="font-display mb-2 text-2xl font-semibold">
          Why fuel prices vary by city
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          The pump price is built from the base fuel cost, central excise
          duty, dealer commission, and state VAT — and state VAT rates
          differ significantly, which is the main reason the same fuel costs
          noticeably more in some states than others. Prices are revised
          daily, typically at 6 AM, tracking international crude movements
          and the exchange rate — see PPAC (Petroleum Planning &amp;
          Analysis Cell) and the Ministry of Petroleum &amp; Natural Gas for
          the official pricing methodology. This is exactly why we ask for
          your own real, current price rather than showing a number that
          would already be stale.
        </p>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/fuel-cost/generator-fuel-consumption-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-fuel/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🛠️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Generator fuel cost
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              What a power cut actually costs you in diesel.
            </p>
          </Link>
          <Link
            href="/appliances/inverter-sizing-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Inverter sizing
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              An electric alternative to a fuel generator for outages.
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
