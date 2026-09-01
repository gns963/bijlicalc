import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { CALCULATOR_PAGES } from '@/data/calculator-pages'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { getTariff } from '@/lib/calc/electricity'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/electricity/unit-price'

const rows = CALCULATOR_PAGES.map((p) => {
  const tariff = getTariff(p.discomCode)
  return {
    slug: p.discomCode.toLowerCase(),
    discomCode: p.discomCode,
    state: tariff.state,
    rate: marginalRatePerUnit(p.discomCode),
  }
}).sort((a, b) => a.state.localeCompare(b.state))

export const metadata: Metadata = {
  title: '1 Unit Electricity Price by State (India) 2026 | bijlicalc',
  description:
    'What 1 unit of electricity costs in every Indian state and union territory — real, source-cited DISCOM tariffs, including fuel cost adjustment and duty.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Electricity', path: '/electricity' },
  { name: '1 Unit Price', path: PATH },
])
const itemList = itemListLd(
  rows.map((r) => ({ name: `${r.state} 1 Unit Price`, path: `/electricity/unit-price/${r.slug}` })),
)

const faqs = [
  {
    q: 'Why does the price of 1 unit vary so much between states?',
    a: 'Each state\'s electricity regulator (SERC) sets its own tariff independently based on the local DISCOM\'s cost of supply, cross-subsidy policy and generation mix — there is no single national electricity price in India.',
  },
  {
    q: 'Is this the price I actually pay per unit?',
    a: 'It\'s the marginal (top-slab) rate — what your next unit costs once you\'re in the highest slab. Because Indian tariffs are telescopic, your average cost across all units consumed is usually lower than this figure.',
  },
  {
    q: 'Does this include taxes and surcharges?',
    a: 'Yes — the figure shown includes fuel cost adjustment (FCA) and electricity duty where applicable, on top of the base slab rate, for a realistic per-unit cost.',
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

export default function UnitPriceIndexPage() {
  return (
    <>
      <PageHero
        hub="electricity"
        breadcrumb={[
          { label: 'Electricity', href: '/electricity' },
          { label: '1 Unit Price', href: '/electricity/unit-price' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>⚡</span> Electricity hub
          </>
        }
        h1="1 Unit Electricity Price by State"
        subtitle="The marginal (top-slab) price of one electricity unit in every Indian state and union territory — real, source-cited DISCOM tariffs, not a national average."
        stats={[
          { icon: '🗺️', big: `${rows.length}`, small: 'States & UTs', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Rate basis', tone: 'hub' },
          { icon: '➕', big: 'Incl. FCA & duty', small: "What's included", tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="rates" className="mb-10">
        <h2 id="rates" className="font-display mb-4 text-2xl font-semibold">
          All states
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/electricity/unit-price/${r.slug}`}
                className="flex items-center justify-between rounded-xl border border-hairline bg-paper p-4 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
              >
                <span>
                  <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                    {r.state}
                  </span>
                  <span className="mt-1 block text-xs text-ash/50 dark:text-gazette-cream/40">
                    {r.discomCode}
                  </span>
                </span>
                <span className="font-display text-lg font-bold tabular-nums text-hub-electricity">
                  ₹{r.rate.toFixed(2)}/unit
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
