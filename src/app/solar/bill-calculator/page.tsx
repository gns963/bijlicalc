import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { CALCULATOR_PAGES } from '@/data/calculator-pages'
import { getTariff } from '@/lib/calc/electricity'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/solar/bill-calculator'

const rows = CALCULATOR_PAGES.map((p) => {
  const tariff = getTariff(p.discomCode)
  return { slug: p.discomCode.toLowerCase(), discomCode: p.discomCode, state: tariff.state }
}).sort((a, b) => a.state.localeCompare(b.state))

export const metadata: Metadata = {
  title: 'Solar Bill Calculator by State (India) 2026 | DesiMetrics',
  description:
    'Estimate rooftop solar payback and savings for every Indian state and union territory, using each DISCOM\'s real tariff and the PM Surya Ghar subsidy.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Solar', path: '/solar' },
  { name: 'Bill Calculator', path: PATH },
])
const itemList = itemListLd(
  rows.map((r) => ({ name: `${r.state} Solar Bill Calculator`, path: `/solar/bill-calculator/${r.slug}` })),
)

const faqs = [
  {
    q: 'Why does solar payback differ by state?',
    a: 'Payback depends on how much your saved units are worth, which is set by your DISCOM\'s own tariff — states with higher electricity rates typically see faster solar payback for the same system size.',
  },
  {
    q: 'Is the PM Surya Ghar subsidy the same in every state?',
    a: 'The central subsidy formula (₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000) is the same nationwide. Some states also offer additional state-level subsidies on top, which aren\'t modelled here.',
  },
  {
    q: 'My state isn\'t listed — what do I do?',
    a: 'All 36 Indian states and union territories are covered. If a specific one seems missing, use our general Solar ROI calculator and select your DISCOM directly.',
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

export default function SolarBillCalculatorIndexPage() {
  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'Bill Calculator', href: '/solar/bill-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Solar hub
          </>
        }
        h1="Solar Bill Calculator by State"
        subtitle="Rooftop solar payback and savings for every Indian state and union territory, priced against each DISCOM's real tariff."
        stats={[
          { icon: '🗺️', big: `${rows.length}`, small: 'States & UTs', tone: 'hub' },
          { icon: '💸', big: '₹78,000', small: 'Max subsidy', tone: 'hub' },
          { icon: '📊', big: 'Real tariff', small: 'Priced per state', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="states" className="mb-10">
        <h2 id="states" className="font-display mb-4 text-2xl font-semibold">
          All states
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/solar/bill-calculator/${r.slug}`}
                className="block rounded-xl border border-hub-solar/20 bg-hub-solar/5 p-4 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-hub-solar/20 dark:bg-hub-solar/10"
              >
                <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                  {r.state}
                </span>
                <span className="mt-1 block text-xs text-hub-solar">
                  {r.discomCode} · Open →
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
