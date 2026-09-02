import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import GasBillCalculator from '@/components/calculators/GasBillCalculator'
import { FlameIcon } from '@/components/HubMotifIcon'
import SplitHero from '@/components/SplitHero'
import { GAS_COMPANIES } from '@/data/gas-companies'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

export const metadata: Metadata = {
  title: 'Gas Bill Calculator (PNG, India) 2026 | DesiMetrics',
  description:
    'Estimate your piped natural gas (PNG) bill from your own consumption and provider\'s rate — honest calculator covering every major Indian city gas company.',
  alternates: { canonical: `${SITE}/gas` },
  openGraph: { url: `${SITE}/gas`, type: 'website' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Gas', path: '/gas' },
])
const itemList = itemListLd(
  GAS_COMPANIES.map((c) => ({ name: `${c.name} Gas Bill Calculator`, path: `/gas/${c.slug}` })),
)
const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gas Bill Calculator',
  url: `${SITE}/gas`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

const faqs = [
  {
    q: 'Why doesn\'t DesiMetrics show my exact gas provider\'s tariff?',
    a: 'City gas distribution (PNG) tariffs are set independently by each provider and change periodically — they aren\'t centrally published in a form we can verify and keep current. Rather than guess, we ask for your own rate from your bill, the same honest approach we use for generator fuel and net-metering rates.',
  },
  {
    q: 'What is SCM?',
    a: 'Standard cubic metre — the standard billing unit for piped natural gas (PNG) in India, used by all city gas distribution companies.',
  },
  {
    q: 'What if I use LPG cylinders, not piped gas?',
    a: 'Use our LPG cylinder usage calculator instead, which estimates how many days a cylinder lasts and its cost per day.',
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

export default function GasHubPage() {
  return (
    <>
      <SplitHero
        hub="gas"
        breadcrumb={[{ label: 'Gas', href: '/gas' }]}
        badgeLabel={`${GAS_COMPANIES.length} providers · Your real rate`}
        h1="Gas Bill Calculator"
        subtitle="Estimate your piped natural gas (PNG) bill from your own consumption and provider's rate. Gas tariffs vary too much by provider for us to guess — so this calculator uses your real numbers, honestly."
        primaryCta={{ label: 'Calculate My Gas Bill', href: '#calculator', emoji: '🔥' }}
        secondaryCta={{ label: 'Browse by provider →', href: '#providers' }}
        statChips={[
          { icon: '🔥', big: 'SCM', small: 'Consumption unit', tone: 'hub' },
          { icon: '✍️', big: 'Your rate', small: 'Honest input', tone: 'hub' },
          { icon: '🏢', big: `${GAS_COMPANIES.length}`, small: 'Providers listed', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-hub-gas">
              <FlameIcon className="h-6 w-6" />
              <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">
                Why we ask for your rate
              </p>
            </div>
            <p className="mt-3 text-sm text-white/80">
              City gas distribution (PNG) tariffs are set independently by
              each provider and change periodically — they aren&apos;t
              centrally published in a form we can verify and keep current.
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
          Calculate your gas bill
        </h2>
        <GasBillCalculator />
      </section>

      <section id="providers" aria-labelledby="providers" className="mb-10 scroll-mt-20">
        <h2 id="providers" className="font-display mb-4 text-2xl font-semibold">
          Browse by provider
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {GAS_COMPANIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/gas/${c.slug}`}
                className="block rounded-xl border border-hub-gas/20 bg-hub-gas/5 p-4 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-hub-gas/20 dark:bg-hub-gas/10"
              >
                <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                  {c.name}
                </span>
                <span className="mt-1 block text-xs text-hub-gas">
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

      <CrossHubLinks current="gas" />

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
