import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import { FuelGaugeIcon } from '@/components/HubMotifIcon'
import PageHero from '@/components/PageHero'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

export const metadata: Metadata = {
  title: 'Fuel Cost Calculators — Vehicle, LPG & Generator (India)',
  description:
    'Free fuel cost calculators for India: petrol/diesel cost per km, LPG cylinder usage and generator running cost — all from real prices and real equipment figures.',
  alternates: { canonical: `${SITE}/fuel-cost` },
  openGraph: { url: `${SITE}/fuel-cost`, type: 'website' },
}

const cards = [
  {
    href: '/fuel-cost/petrol-diesel-cost-per-km-calculator',
    emoji: '🚗',
    title: 'Petrol/Diesel Cost Per KM',
    body: 'Your vehicle\'s real running cost from fuel price and mileage.',
  },
  {
    href: '/fuel-cost/lpg-cylinder-usage-calculator',
    emoji: '🔥',
    title: 'LPG Cylinder Usage',
    body: 'How many days your cylinder lasts, and the daily/monthly cost.',
  },
  {
    href: '/fuel-cost/generator-fuel-consumption-calculator',
    emoji: '🛠️',
    title: 'Generator Fuel Consumption',
    body: 'What a power cut costs you, from your genset\'s own rated consumption.',
  },
  {
    href: '/electricity/ev-charging-cost-calculator',
    emoji: '🔌',
    title: 'EV Charging Cost',
    body: 'Priced at your real DISCOM tariff, plus a live EV vs petrol/diesel/CNG comparison.',
  },
]

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Fuel Cost', path: '/fuel-cost' },
])
const itemList = itemListLd(cards.map((c) => ({ name: c.title, path: c.href })))

const faqs = [
  {
    q: 'Do these calculators use live fuel prices?',
    a: 'No — fuel prices change daily and vary by state and city, so you enter today\'s local price yourself for an accurate result, rather than us showing a stale or averaged figure.',
  },
  {
    q: 'Why does the generator calculator ask for my genset\'s own consumption rate?',
    a: 'Fuel consumption varies too much by model, load and engine design for a generic estimate to be reliable — using your unit\'s own spec-sheet figure gives a far more accurate result.',
  },
  {
    q: 'Is this the same as the electricity bill calculators?',
    a: 'No — these tools cover the fuels you buy directly (petrol, diesel, LPG) rather than grid electricity. For your DISCOM electricity bill, see our electricity calculators.',
  },
  {
    q: 'Why do fuel prices vary so much by city?',
    a: 'The pump price is base fuel cost plus central excise duty, dealer commission, and state VAT — and state VAT rates differ significantly, which is the main reason for city-to-city variation. Prices are revised daily per PPAC/Ministry of Petroleum & Natural Gas methodology.',
  },
  {
    q: 'Is an EV cheaper to run than a petrol or diesel car?',
    a: 'Almost always yes on a ₹/km basis, since it\'s priced at your real DISCOM tariff rather than a fuel price — see our EV charging cost calculator for a genuine EV vs petrol vs diesel vs CNG comparison using your own numbers.',
  },
  {
    q: 'Is a generator more expensive to run than grid electricity?',
    a: 'Yes, substantially — a diesel generator typically costs somewhere in the ₹18-35 per unit range versus roughly ₹5-10 per unit for grid power in most states. See the generator calculator for a direct cost-per-unit comparison.',
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

export default function FuelCostHubPage() {
  return (
    <>
      <PageHero
        hub="fuel"
        breadcrumb={[{ label: 'Fuel Cost', href: '/fuel-cost' }]}
        badgeLabel={
          <>
            <span aria-hidden>⛽</span> Fuel cost hub
          </>
        }
        h1={
          <span className="flex items-center gap-2">
            <FuelGaugeIcon className="h-7 w-7 text-hub-fuel" />
            Fuel Cost Calculators
          </span>
        }
        subtitle="The everyday fuels you buy directly — vehicle petrol/diesel, LPG cylinders and generator diesel — priced from real inputs, not averaged national figures."
        stats={[
          { icon: '⛽', big: '4', small: 'Calculators', tone: 'hub' },
          { icon: '💰', big: 'Real prices', small: "You enter today's rate", tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
          { icon: '🇮🇳', big: 'India', small: 'Coverage', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex flex-col rounded-2xl border border-hub-fuel/20 bg-hub-fuel/5 p-6 transition hover:border-hub-fuel/50 hover:shadow-sm dark:border-hub-fuel/20 dark:bg-hub-fuel/10"
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="font-display mt-2 text-lg font-semibold text-ink-navy dark:text-gazette-cream">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-ash/70 dark:text-gazette-cream/70">
              {c.body}
            </p>
            <span className="mt-3 text-sm font-semibold text-hub-fuel">
              Open calculator →
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="why" className="mb-10">
        <h2 id="why" className="font-display mb-4 text-2xl font-semibold">
          Real inputs, not national averages
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Fuel prices vary by state, city and day, and your vehicle&apos;s or
          generator&apos;s real consumption depends on the specific unit. Rather
          than showing you an averaged figure that may be far from your
          reality, these calculators ask for your own price and equipment
          numbers — the same principle behind our electricity calculators
          using your actual DISCOM tariff instead of a national average.
        </p>
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

      <CrossHubLinks current="fuel-cost" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
    </>
  )
}
