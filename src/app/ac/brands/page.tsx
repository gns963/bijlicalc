import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { AC_BRANDS } from '@/data/ac-brands'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/ac/brands'

export const metadata: Metadata = {
  title: 'AC Bill Calculator by Brand — All Major AC Brands (India)',
  description:
    'Estimate your AC running cost for every major brand sold in India — Daikin, LG, Samsung, Voltas, Blue Star, Carrier and more — using the same real BEE ISEER-based method.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: 'Brands', path: PATH },
])
const itemList = itemListLd(
  AC_BRANDS.map((b) => ({ name: `${b.name} AC Bill Calculator`, path: `/ac/brands/${b.slug}` })),
)

const faqs = [
  {
    q: 'Does AC brand actually affect running cost?',
    a: 'Not directly — the Bureau of Energy Efficiency (BEE) sets the ISEER efficiency standard uniformly across all brands sold in India, so a 3-star AC from any manufacturer meets the same minimum efficiency band. Tonnage, star rating and usage hours drive cost, not the brand name itself.',
  },
  {
    q: 'Why does bijlicalc have a separate page per brand?',
    a: 'Each brand page uses the exact same real calculation engine, just with directly relevant copy so you can quickly get to a calculator for your specific AC without extra navigation.',
  },
  {
    q: 'Is my brand not listed here?',
    a: 'Use our general AC running cost calculator — it works for any brand or model since the calculation is based on tonnage, star rating and usage hours, not brand name.',
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

export default function AcBrandsIndexPage() {
  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Brands', href: '/ac/brands' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1="AC Bill Calculator by Brand"
        subtitle={
          <>
            Every brand uses the same real BEE ISEER-based calculation — star
            rating, not brand name, sets efficiency under Indian law. Pick your
            brand for a directly relevant estimate, or use our{' '}
            <Link href="/ac/bill-calculator" className="text-spark-teal underline">
              general AC running cost calculator
            </Link>{' '}
            for any AC.
          </>
        }
        stats={[
          { icon: '🏷️', big: String(AC_BRANDS.length), small: 'Brands', tone: 'hub' },
          { icon: '📊', big: 'ISEER', small: 'Same for every brand', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="brands" className="mb-10">
        <h2 id="brands" className="font-display mb-4 text-2xl font-semibold">
          Choose your brand
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {AC_BRANDS.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/ac/brands/${b.slug}`}
                className="block rounded-xl border border-hub-ac/20 bg-hub-ac/5 p-4 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-hub-ac/20 dark:bg-hub-ac/10"
              >
                <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                  {b.name}
                </span>
                <span className="mt-1 block text-xs text-hub-ac">
                  Calculate cost →
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
