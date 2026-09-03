import type { Metadata } from 'next'
import Link from 'next/link'
import AffiliateProductCard from '@/components/AffiliateProductCard'
import PageHero from '@/components/PageHero'
import StarComparisonTool from '@/components/calculators/StarComparisonTool'
import { AC_PRODUCTS } from '@/data/ac-products'
import discomsJson from '@/data/discoms.json'
import { ISEER_BY_STAR, acDailyUnits, marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
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
const priceDiff = five.price - three.price

// Payback by usage pattern — 1.5T, TNEB, computed live for a spread of daily
// hours so the "does usage intensity matter" question has a real answer.
const USAGE_SCENARIOS = [4, 6, 8, 10, 12].map((hours) => {
  const annualSaving = Math.round(
    (acDailyUnits(1.5, 3, hours) - acDailyUnits(1.5, 5, hours)) * 365 * rate,
  )
  return {
    hours,
    annualSaving,
    paybackYears: annualSaving > 0 ? priceDiff / annualSaving : null,
  }
})

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
  {
    q: 'What does the BEE star rating actually measure?',
    a: `It's based on ISEER (Indian Seasonal Energy Efficiency Ratio) — the ratio of total cooling delivered over a season to total electrical energy consumed. BEE sets the ISEER band for each star level: a 3-star unit sits around ISEER ${ISEER_BY_STAR[3]}, a 5-star around ISEER ${ISEER_BY_STAR[5]}. Higher ISEER means more cooling per unit of electricity.`,
  },
  {
    q: 'Is "inverter" the same thing as "5-star"?',
    a: 'No — inverter refers to the compressor technology (variable-speed rather than on/off fixed-speed), while star rating is purely about measured ISEER efficiency. In practice almost every 5-star split AC sold today happens to be an inverter model, because inverter compressors are what make that efficiency band achievable, but the two labels measure different things.',
  },
  {
    q: 'Does a 5-star AC cool the room faster than a 3-star one?',
    a: 'Not necessarily — cooling speed depends mainly on tonnage matching the room size, not star rating. A correctly-sized 3-star and 5-star unit of the same tonnage cool at a similar rate; the 5-star just does it using less electricity.',
  },
  {
    q: 'Does usage pattern change whether 5-star is worth it?',
    a: `Yes, significantly — see the usage-based payback table above. At light usage (4h/day) the payback stretches well past a typical ownership horizon; at heavy usage (12h/day) it can be under 2 years.`,
  },
  {
    q: 'Should I compare star rating separately from tonnage?',
    a: "No — always compare star rating at the same tonnage. A smaller 5-star unit and a bigger 3-star unit can end up costing similarly to run despite the star-rating gap, because tonnage has its own large effect on consumption. Use our AC comparison tool if you want to vary both independently.",
  },
  {
    q: 'Is a 5-star AC worth it in a low-tariff state?',
    a: "The percentage electricity savings stay the same regardless of tariff, but the ₹ savings — and therefore the payback period — shrink in a low-tariff state. Use the slider above with your own DISCOM to see your real break-even rather than assuming the Tamil Nadu example applies to you.",
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
const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '3 Star vs 5 Star AC Savings Comparison Tool',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: '3 Star vs 5 Star', path: PATH },
])

export default function StarComparisonPage() {
  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: '3 Star vs 5 Star', href: '/ac/comparisons/3-star-vs-5-star-savings-guide' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1="3 Star vs 5 Star AC: Savings Guide"
        subtitle={
          <>
            A 5-star AC costs more upfront but uses less electricity. Use the
            slider below to see the exact annual difference for your usage and{' '}
            <strong>your DISCOM&apos;s tariff</strong>. For a 1.5 ton unit at 8
            hours/day in Tamil Nadu, a 5-star saves about{' '}
            <strong>{formatINR(saving)}/year</strong>.
          </>
        }
        stats={[
          { icon: '⚡', big: '~20–25%', small: 'Less electricity', tone: 'spark-teal' },
          { icon: '📆', big: '3–4 seasons', small: 'Typical payback', tone: 'hub' },
          { icon: '💰', big: formatINR(saving), small: 'TNEB, 1.5T, 8h/day', tone: 'hub' },
          { icon: '📊', big: 'Any DISCOM', small: 'Priced on yours', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="tool" className="mb-10">
        <h2 id="tool" className="font-display mb-4 text-2xl font-semibold">
          Compare by usage &amp; DISCOM
        </h2>
        <StarComparisonTool discoms={liveDiscoms} />
      </section>

      {/* Contextual affiliate: the two units being compared */}
      <section aria-labelledby="the-two" className="mb-10">
        <h2 id="the-two" className="font-display mb-4 text-2xl font-semibold">
          The two units, side by side
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <AffiliateProductCard product={three} highlight="Lower upfront price" />
          <AffiliateProductCard product={five} highlight="Lower running cost" />
        </div>
        <p className="mt-2 text-xs text-ash/40">
          Sample models with indicative pricing — see our{' '}
          <Link href="/affiliate-disclosure" className="underline">
            affiliate disclosure
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="criteria" className="mb-10">
        <h2 id="criteria" className="font-display mb-4 text-2xl font-semibold">
          How BEE actually decides the star rating
        </h2>
        <p className="mb-4 text-ash/80">
          The Bureau of Energy Efficiency (BEE) tests each AC model and rates
          it by ISEER (Indian Seasonal Energy Efficiency Ratio) — a
          season-long ratio of total cooling output to total electrical
          input, not a snapshot single-load test. A higher ISEER means the
          same room gets cooled using less electricity over a full season:
        </p>
        <div className="grid grid-cols-5 gap-2 text-center">
          {Object.entries(ISEER_BY_STAR)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([star, iseer]) => (
              <div
                key={star}
                className="rounded-lg border border-hairline bg-mist px-2 py-2"
              >
                <p className="font-display text-sm font-bold text-hub-ac">{star}★</p>
                <p className="text-xs text-ash/60">
                  ISEER {iseer}
                </p>
              </div>
            ))}
        </div>
        <p className="mt-3 text-xs text-ash/50">
          BEE revises these thresholds periodically — the bands above are
          what our calculator engine currently uses. Always check the year
          printed on a specific model&apos;s BEE label.
        </p>
      </section>

      <section aria-labelledby="usage-payback" className="mb-10">
        <h2 id="usage-payback" className="font-display mb-2 text-2xl font-semibold">
          Does the price premium pay back? By usage pattern
        </h2>
        <p className="mb-4 text-sm text-ash/60">
          Same 1.5 ton unit, same {formatINR(priceDiff)} indicative price gap
          between the two models above, priced in Tamil Nadu — payback shrinks
          fast as daily hours rise:
        </p>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline bg-mist text-ink-navy">
              <tr>
                <th className="px-4 py-2 font-semibold">Daily usage</th>
                <th className="px-4 py-2 text-right font-semibold">Annual saving</th>
                <th className="px-4 py-2 text-right font-semibold">Payback period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {USAGE_SCENARIOS.map((s) => (
                <tr key={s.hours}>
                  <td className="px-4 py-2 font-medium">{s.hours} h/day</td>
                  <td className="px-4 py-2 text-right tabular-nums text-spark-teal">
                    {formatINR(s.annualSaving)}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-ac">
                    {s.paybackYears ? `${s.paybackYears.toFixed(1)} yrs` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ash/50">
          A typical AC lasts 10-15 years, so any payback under 4-5 years
          leaves years of genuinely free savings afterward.
        </p>
      </section>

      <section aria-labelledby="verdict" className="mb-10">
        <h2 id="verdict" className="font-display mb-4 text-2xl font-semibold">
          So, is 5-star worth it?
        </h2>
        <div className="space-y-3 text-ash/80">
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

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>💡</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Get the full monthly and yearly cost for a specific AC.
            </p>
          </Link>
          <Link
            href="/ac/tonnage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC tonnage calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Make sure you&apos;re comparing the right size AC for your room.
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Electricity bill calculators
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Check your DISCOM&apos;s actual tariff slabs.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Offset it with solar
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See the payback on a rooftop system sized for AC-heavy usage.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
