import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import PageHero from '@/components/PageHero'
import { CALCULATOR_PAGES } from '@/data/calculator-pages'
import discomsJson from '@/data/discoms.json'
import { getTariff } from '@/lib/calc/electricity'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

export const metadata: Metadata = {
  title: 'Electricity Bill Calculators by State & DISCOM (India) | DesiMetrics',
  description:
    'Free, accurate electricity bill calculators for Indian DISCOMs — real telescopic slab tariffs, subsidies and fuel cost adjustment. TNEB, MSEDCL, UPPCL, BESCOM, KSEB and WBSEDCL, with more states coming.',
  alternates: { canonical: `${SITE}/electricity` },
  openGraph: { url: `${SITE}/electricity`, type: 'website' },
}

const live = CALCULATOR_PAGES.map((p) => {
  const tariff = getTariff(p.discomCode)
  return {
    slug: p.slug,
    discomCode: p.discomCode,
    state: tariff.state,
    billingCycle: tariff.billingCycle,
  }
}).sort((a, b) => a.state.localeCompare(b.state))

const totalStatesUts = discomsJson.states.length

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Electricity', path: '/electricity' },
])
const EXTRA_TOOLS = [
  {
    href: '/electricity/ev-charging-cost-calculator',
    emoji: '🔌',
    title: 'EV Charging Cost Calculator',
    body: 'What a full home charge costs, and your cost per km.',
  },
  {
    href: '/electricity/appliance-cost-calculator',
    emoji: '🔋',
    title: 'Appliance Cost Calculator',
    body: 'Any appliance, from its wattage and daily usage hours.',
  },
]
const itemList = itemListLd([
  ...live.map((d) => ({ name: `${d.state} Bill Calculator`, path: `/electricity/${d.slug}` })),
  ...EXTRA_TOOLS.map((t) => ({ name: t.title, path: t.href })),
])

const faqs = [
  {
    q: 'How many DISCOMs does DesiMetrics cover?',
    a: `${live.length} bill calculators across all ${totalStatesUts} Indian states and union territories, each using that DISCOM's actual published tariff order rather than a national average.`,
  },
  {
    q: 'Are the tariffs kept up to date?',
    a: 'Each tariff file is dated and source-cited against the relevant SERC order, with a "last verified" date shown on every calculator page.',
  },
  {
    q: 'Is DesiMetrics official or affiliated with any DISCOM?',
    a: 'No. DesiMetrics is an independent calculator, not run by or affiliated with any electricity board. Always confirm the final figure against your official bill.',
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

export default function ElectricityHubPage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[{ label: 'Electricity', href: '/electricity' }]}
        badgeLabel={
          <>
            <span aria-hidden>⚡</span> Electricity hub
          </>
        }
        h1="Electricity Bill Calculators by State"
        subtitle={
          <>
            Estimate your electricity bill using your DISCOM&apos;s real,
            source-cited tariff — telescopic slabs, fixed charge, fuel cost
            adjustment, electricity duty and subsidies. All {totalStatesUts}{' '}
            states and union territories are live.
          </>
        }
        stats={[
          { icon: '🗺️', big: `${live.length}/${totalStatesUts}`, small: 'States & UTs live', tone: 'hub' },
          { icon: '✓', big: 'SERC', small: 'Source-verified', tone: 'seal-red' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
          { icon: '📶', big: 'Telescopic', small: 'Slab logic', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="more-tools" className="mb-10">
        <h2 id="more-tools" className="font-display mb-4 text-2xl font-semibold">
          More electricity tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EXTRA_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-col rounded-2xl border border-hub-electricity/20 bg-hub-electricity/5 p-6 transition hover:border-hub-electricity/50 hover:shadow-sm"
            >
              <span className="text-2xl">{t.emoji}</span>
              <h3 className="font-display mt-2 text-lg font-semibold text-ink-navy">
                {t.title}
              </h3>
              <p className="mt-1 flex-1 text-sm text-ash/70">
                {t.body}
              </p>
              <span className="mt-3 text-sm font-semibold text-hub-electricity">
                Open calculator →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="live" className="mb-10">
        <h2 id="live" className="font-display mb-4 text-2xl font-semibold">
          All state bill calculators
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {live.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/electricity/${d.slug}`}
                className="block rounded-xl border border-brass/20 bg-brass/5 p-4 transition hover:border-brass/50 hover:shadow-sm"
              >
                <span className="font-semibold text-ink-navy">
                  {d.state}
                </span>
                <span className="mt-1 block text-xs text-brass">
                  {d.discomCode} · {d.billingCycle} billing · Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="more" className="mb-10">
        <h2 id="more" className="font-display mb-2 text-2xl font-semibold">
          Found an error, or represent a DISCOM?
        </h2>
        <p className="text-ash/80">
          Every tariff here is being progressively cross-checked against
          primary SERC orders.{' '}
          <Link href="/contact" className="text-brass underline">
            Flag a correction
          </Link>{' '}
          and see our{' '}
          <Link href="/data-sources" className="text-brass underline">
            data sources
          </Link>
          .
        </p>
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

      <CrossHubLinks current="electricity" />

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
