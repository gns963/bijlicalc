import type { Metadata } from 'next'
import Link from 'next/link'
import AffiliateProductCard from '@/components/AffiliateProductCard'
import StarComparisonTool from '@/components/calculators/StarComparisonTool'
import { AC_PRODUCTS } from '@/data/ac-products'
import discomsJson from '@/data/discoms.json'
import { acDailyUnits, marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'
const PATH = '/ac/comparisons/3-star-vs-5-star-savings-guide'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

// Server-rendered example: 1.5 ton, 8 h/day, TNEB.
const rate = marginalRatePerUnit('TNEB')
const saving = Math.round(
  (acDailyUnits(1.5, 3, 8) - acDailyUnits(1.5, 5, 8)) * 365 * rate,
)

const three = AC_PRODUCTS.find((p) => p.starRating === 3 && p.tonnage === 1.5)!
const five = AC_PRODUCTS.find((p) => p.starRating === 5 && p.tonnage === 1.5)!

export const metadata: Metadata = {
  title: '3 Star vs 5 Star AC — Savings Guide 2026 (Is 5 Star Worth It?)',
  description:
    'Interactive 3-star vs 5-star AC comparison. See the exact annual electricity savings of a 5-star inverter AC by usage hours and your DISCOM tariff, and whether the higher price pays back.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'article' },
}

const faqs = [
  {
    q: 'Is a 5-star AC worth the extra money?',
    a: 'Usually yes if you run the AC 6+ hours a day. A 5-star inverter AC uses roughly 20–25% less electricity than a 3-star, and the price difference typically pays back within 3–4 cooling seasons.',
  },
  {
    q: 'How much does a 5-star AC save per year?',
    a: `For a 1.5 ton unit running 8 hours a day in Tamil Nadu, a 5-star saves about ${formatINR(saving)} a year versus a 3-star. Savings rise with usage hours and higher electricity tariffs.`,
  },
  {
    q: 'Does the star rating change between years?',
    a: 'Yes. BEE revises the ISEER thresholds periodically, so a model rated 5-star a few years ago may be rated lower today. Always check the current BEE label.',
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

export default function StarComparisonPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/ac" className="hover:text-indigo-600">
              AC
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            3 Star vs 5 Star
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          3 Star vs 5 Star AC: Savings Guide
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          A 5-star AC costs more upfront but uses less electricity. Use the
          slider below to see the exact annual difference for your usage and{' '}
          <strong>your DISCOM&apos;s tariff</strong>. For a 1.5 ton unit at 8
          hours/day in Tamil Nadu, a 5-star saves about{' '}
          <strong>{formatINR(saving)}/year</strong>.
        </p>
      </header>

      <section aria-labelledby="tool" className="mb-10">
        <h2 id="tool" className="mb-4 text-2xl font-semibold">
          Compare by usage &amp; DISCOM
        </h2>
        <StarComparisonTool discoms={liveDiscoms} />
      </section>

      {/* Contextual affiliate: the two units being compared */}
      <section aria-labelledby="the-two" className="mb-10">
        <h2 id="the-two" className="mb-4 text-2xl font-semibold">
          The two units, side by side
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <AffiliateProductCard product={three} highlight="Lower upfront price" />
          <AffiliateProductCard product={five} highlight="Lower running cost" />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Sample models with indicative pricing — see our{' '}
          <Link href="/affiliate-disclosure" className="underline">
            affiliate disclosure
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="verdict" className="mb-10">
        <h2 id="verdict" className="mb-4 text-2xl font-semibold">
          So, is 5-star worth it?
        </h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
          <p>
            The more hours you run the AC and the higher your electricity tariff,
            the faster a 5-star pays back its price premium. Light users (2–3
            hours a day) may find a 3-star inverter is fine; heavy users in
            high-tariff states almost always come out ahead with a 5-star.
          </p>
          <p>
            Use the slider above with your real usage and DISCOM to see your own
            break-even.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="mb-4 text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {faqs.map((f, i) => (
            <details key={i} className="group py-3">
              <summary className="cursor-pointer list-none font-medium text-slate-800 marker:hidden dark:text-slate-100">
                {f.q}
              </summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  )
}
