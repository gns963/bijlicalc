import Link from 'next/link'
import discomsJson from '@/data/discoms.json'
import PageHero from '@/components/PageHero'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import AcBillCalculator from './AcBillCalculator'

const SITE = 'https://desimetrics.com'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

export default function AcBrandPage({
  brandName,
  slug,
}: {
  brandName: string
  slug: string
}) {
  const example = calculateAcCost({
    discomCode: 'TNEB',
    tonnage: 1.5,
    starRating: 3,
    dailyHours: 8,
  })

  const faqs = [
    {
      q: `Does this calculator work for any ${brandName} AC model?`,
      a: `Yes — the calculation is based on tonnage, BEE star rating and daily usage hours, which apply to any AC regardless of brand. Enter your specific ${brandName} model's tonnage and star rating (both printed on the unit and its BEE label) for an accurate estimate.`,
    },
    {
      q: `How accurate is this for a ${brandName} AC specifically?`,
      a: `The underlying ISEER efficiency standard is set by the Bureau of Energy Efficiency (BEE) and applies uniformly across all brands sold in India — a 3-star AC from any manufacturer must meet the same minimum ISEER band. So this estimate is equally accurate for ${brandName} as for any other BEE-labelled brand, within the usual planning-estimate caveats (room insulation, set temperature, usage pattern).`,
    },
    {
      q: `Where do I find my ${brandName} AC's star rating?`,
      a: `Check the yellow BEE star label on the indoor or outdoor unit, or the spec sheet/box it came in — it states the star rating and ISEER value directly.`,
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
    name: `${brandName} AC Bill Calculator`,
    url: `${SITE}/ac/brands/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    areaServed: 'India',
  }

  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Brands', href: '/ac/brands' },
          { label: brandName, href: `/ac/brands/${slug}` },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1={`${brandName} AC Bill Calculator`}
        subtitle={
          <>
            Estimate what your {brandName} air conditioner costs to run, using
            its tonnage and BEE star rating — priced at{' '}
            <strong>your state&apos;s real top electricity slab</strong>. The
            same real ISEER-based method we use for every brand.
          </>
        }
        stats={[
          { icon: '⭐', big: '3–5 ★', small: 'Star ratings', tone: 'hub' },
          { icon: '📊', big: 'ISEER', small: 'BEE efficiency basis', tone: 'hub' },
          { icon: '📈', big: 'Top slab', small: 'Pricing method', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
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
          A <strong>1.5 ton 3-star {brandName}</strong> AC running 8
          hours/day in Tamil Nadu uses about{' '}
          <strong>{example.dailyUnits} units/day</strong> and costs roughly{' '}
          <strong>{formatINR(example.monthlyCost)}/month</strong> (
          {formatINR(example.annualCost)}/year) at{' '}
          {formatINR(example.effectiveRatePerUnit)}/unit.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your {brandName} AC&apos;s cost
        </h2>
        <AcBillCalculator discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>Efficiency (ISEER).</strong> Your {brandName} AC&apos;s
            star rating maps to a BEE ISEER value — the same standard applies
            to every brand sold in India, so a 5-star {brandName} unit and a
            5-star unit from any other brand meet the same minimum
            efficiency. We convert tonnage to cooling power, divide by ISEER
            for electrical input, and apply a ~70% compressor duty factor.
          </p>
          <p>
            <strong>Priced at your top slab.</strong> Since an AC adds to
            your existing consumption, its units fall in your highest tariff
            slab — we use that marginal rate (plus fuel cost adjustment and
            electricity duty) for a realistic estimate.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/ac/tonnage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC tonnage calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Not sure this is the right size {brandName} AC for your room?
            </p>
          </Link>
          <Link
            href="/ac/comparison-tool"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⚖️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC comparison tool
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Compare two configurations side by side.
            </p>
          </Link>
          <Link
            href="/ac/brands"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🏷️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              All AC brands
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See every brand this calculator covers.
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
