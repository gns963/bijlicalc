import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import WaterBillCalculator from '@/components/calculators/WaterBillCalculator'
import { DropletIcon } from '@/components/HubMotifIcon'
import SplitHero from '@/components/SplitHero'
import { CALCULATOR_PAGES } from '@/data/calculator-pages'
import { getTariff } from '@/lib/calc/electricity'
import { slugify } from '@/lib/format'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

const states = CALCULATOR_PAGES.map((p) => getTariff(p.discomCode).state)
  .filter((state, i, arr) => arr.indexOf(state) === i)
  .sort((a, b) => a.localeCompare(b))
  .map((state) => ({ state, slug: slugify(state) }))

export const metadata: Metadata = {
  title: 'Water Bill Calculator (India) 2026 | DesiMetrics',
  description:
    'Estimate your municipal water bill from your own consumption and board\'s rate — honest calculator, no guessed tariffs, for every Indian state.',
  alternates: { canonical: `${SITE}/water` },
  openGraph: { url: `${SITE}/water`, type: 'website' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Water', path: '/water' },
])
const itemList = itemListLd(states.map((s) => ({ name: `${s.state} Water Bill Calculator`, path: `/water/${s.slug}` })))
const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Water Bill Calculator',
  url: `${SITE}/water`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

const faqs = [
  {
    q: 'Why doesn\'t DesiMetrics show my exact water board\'s tariff?',
    a: 'Unlike electricity DISCOMs, India\'s municipal water tariffs aren\'t centrally published in a form we can verify and keep current — billing basis varies by city (flat rate, metered, or tied to property tax). Rather than guess, we ask for your own rate from your bill, the same honest approach we use for generator fuel and net-metering rates.',
  },
  {
    q: 'What is a KL?',
    a: 'A kilolitre (KL) = 1,000 litres, the standard billing unit for metered water supply in India.',
  },
  {
    q: 'Is this different from the water tank filling time calculator?',
    a: 'Yes — that tool estimates how long a tank takes to fill from a pump\'s flow rate. This one estimates your monthly water bill cost from consumption and your board\'s rate.',
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

export default function WaterHubPage() {
  return (
    <>
      <SplitHero
        hub="water"
        breadcrumb={[{ label: 'Water', href: '/water' }]}
        badgeLabel={`${states.length} states · Your real rate`}
        h1="Water Bill Calculator"
        subtitle="Estimate your municipal water bill from your own consumption and your board's rate. Water tariffs vary too much by city for us to guess — so this calculator uses your real numbers, honestly."
        primaryCta={{ label: 'Calculate My Water Bill', href: '#calculator', emoji: '💧' }}
        secondaryCta={{ label: 'Browse by state →', href: '#states' }}
        statChips={[
          { icon: '💧', big: 'KL', small: 'Consumption unit', tone: 'hub' },
          { icon: '✍️', big: 'Your rate', small: 'Honest input', tone: 'hub' },
          { icon: '🗺️', big: `${states.length}`, small: 'States covered', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-hub-water">
              <DropletIcon className="h-6 w-6" />
              <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">
                Why we ask for your rate
              </p>
            </div>
            <p className="mt-3 text-sm text-white/80">
              Unlike electricity DISCOMs, India&apos;s municipal water
              tariffs aren&apos;t centrally published in a form we can verify
              and keep current — billing basis varies by city (flat rate,
              metered, or tied to property tax).
            </p>
            <p className="mt-2 text-sm text-white/70">
              Rather than guess a number and call it &ldquo;verified,&rdquo;
              we ask for your own rate from your bill — the same honest
              approach we use for generator fuel and net-metering rates.
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your water bill
        </h2>
        <WaterBillCalculator />
      </section>

      <section id="states" aria-labelledby="states" className="mb-10 scroll-mt-20">
        <h2 id="states" className="font-display mb-4 text-2xl font-semibold">
          Browse by state
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {states.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/water/${s.slug}`}
                className="block rounded-xl border border-hub-water/20 bg-hub-water/5 p-4 transition hover:border-hub-water/50 hover:shadow-sm dark:border-hub-water/20 dark:bg-hub-water/10"
              >
                <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                  {s.state}
                </span>
                <span className="mt-1 block text-xs text-hub-water">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
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

      <CrossHubLinks current="water" />

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      </main>
    </>
  )
}
