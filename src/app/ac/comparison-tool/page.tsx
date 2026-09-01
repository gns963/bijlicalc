import type { Metadata } from 'next'
import Link from 'next/link'
import AcComparisonTool from '@/components/calculators/AcComparisonTool'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/ac/comparison-tool'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const exampleA = calculateAcCost({ discomCode: 'TNEB', tonnage: 1, starRating: 5, dailyHours: 8 })
const exampleB = calculateAcCost({ discomCode: 'TNEB', tonnage: 1.5, starRating: 3, dailyHours: 8 })

// Common scenarios worth checking — each computed live via calculateAcCost(),
// same TNEB/8h basis as the worked example above.
const SCENARIOS = [
  {
    question: 'Is a smaller, higher-star AC cheaper to run than a bigger, lower-star one?',
    a: { label: '1T, 5★', cost: calculateAcCost({ discomCode: 'TNEB', tonnage: 1, starRating: 5, dailyHours: 8 }) },
    b: { label: '1.5T, 3★', cost: calculateAcCost({ discomCode: 'TNEB', tonnage: 1.5, starRating: 3, dailyHours: 8 }) },
  },
  {
    question: 'How much does star rating alone change cost, at the same size?',
    a: { label: '1.5T, 3★', cost: calculateAcCost({ discomCode: 'TNEB', tonnage: 1.5, starRating: 3, dailyHours: 8 }) },
    b: { label: '1.5T, 5★', cost: calculateAcCost({ discomCode: 'TNEB', tonnage: 1.5, starRating: 5, dailyHours: 8 }) },
  },
  {
    question: 'Does a much bigger, average-star AC ever lose to a small, top-star one?',
    a: { label: '2T, 3★', cost: calculateAcCost({ discomCode: 'TNEB', tonnage: 2, starRating: 3, dailyHours: 8 }) },
    b: { label: '1T, 5★', cost: calculateAcCost({ discomCode: 'TNEB', tonnage: 1, starRating: 5, dailyHours: 8 }) },
  },
]

export const metadata: Metadata = {
  title: 'AC Comparison Tool 2026 — Compare Any Two Configurations (India)',
  description:
    'Compare any two AC configurations side by side — different tonnage, star rating or both — on real running cost using your DISCOM\'s tariff.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AC Comparison Tool',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: 'Comparison Tool', path: PATH },
])

const faqs = [
  {
    q: 'How is this different from the 3★ vs 5★ savings guide?',
    a: 'That guide fixes the comparison to the same tonnage at 3-star vs 5-star. This tool lets both tonnage AND star rating vary independently on each side — useful for a genuinely different question, like "is a smaller 1-ton 5-star AC cheaper to run than a bigger 1.5-ton 3-star one?"',
  },
  {
    q: 'Should I compare ACs of different tonnage at all?',
    a: 'Only if both would actually be adequate for your room — check our AC tonnage calculator first so you\'re comparing two AC sizes that would both realistically cool your space, not picking an undersized option just because it looks cheaper to run.',
  },
  {
    q: 'Does this use my real electricity tariff?',
    a: 'Yes — pick your DISCOM and both options are priced at your state\'s real top-slab tariff.',
  },
  {
    q: 'How do I read the output correctly?',
    a: 'Each side shows monthly and annual cost for that exact configuration at your chosen DISCOM. The difference figure below the cards is Option A minus Option B — a positive number means Option A costs more, not less.',
  },
  {
    q: 'Can I compare the same AC across two different DISCOMs?',
    a: 'Not directly in this tool — it compares two configurations at one shared DISCOM. To see the same AC priced across multiple states, see the slab comparison on our AC running cost calculator.',
  },
  {
    q: 'What if both options are the same tonnage and star rating?',
    a: 'Then the cost will be identical on both sides — this tool is only useful when at least one variable (tonnage, star rating or hours) differs between Option A and Option B.',
  },
  {
    q: 'Does daily usage hours matter in the comparison?',
    a: 'Yes — you can set different daily hours for each option too. This is useful for comparing, say, a bedroom AC used 10 hours a night against a living-room AC used 4 hours in the evening.',
  },
  {
    q: 'Is a bigger inverter AC always cheaper to run than a smaller non-inverter one?',
    a: 'Not automatically — it depends on both the tonnage gap and the star-rating gap together. See "Does a much bigger, average-star AC ever lose to a small, top-star one?" above for a real computed example.',
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

export default function AcComparisonPage() {
  const diff = exampleA.annualCost - exampleB.annualCost

  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Comparison Tool', href: '/ac/comparison-tool' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1="AC Comparison Tool"
        subtitle="Compare any two AC configurations side by side — different tonnage, star rating, or both — on real running cost for your state."
        stats={[
          { icon: '⚖️', big: 'A vs B', small: 'Free configuration', tone: 'hub' },
          { icon: '📊', big: 'Real tariff', small: 'Priced on your DISCOM', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '⚡', big: 'Instant', small: 'No login', tone: 'hub' },
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
          At 8 hours/day in Tamil Nadu, a <strong>1-ton 5-star</strong> AC
          costs about <strong>{formatINR(exampleA.annualCost)}/year</strong>{' '}
          versus <strong>{formatINR(exampleB.annualCost)}/year</strong> for a{' '}
          <strong>1.5-ton 3-star</strong> unit —{' '}
          {diff > 0 ? 'the smaller, higher-star unit' : 'the larger unit'}{' '}
          saves about {formatINR(Math.abs(diff))}/year, assuming both would
          adequately cool the room.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Compare two configurations
        </h2>
        <AcComparisonTool discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="how-to-read" className="mb-10">
        <h2 id="how-to-read" className="font-display mb-4 text-2xl font-semibold">
          How to read the output
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            Each side shows the same figures the running-cost calculator
            gives for a single AC — monthly cost, annual cost, and daily
            units — computed independently for its own tonnage, star rating
            and hours. The difference line underneath is Option A minus
            Option B, so a positive number means A costs more per year.
          </p>
          <p>
            Only trust a comparison if both configurations would actually
            cool the room adequately — a smaller unit can look cheaper to
            run purely because it&apos;s undersized, not because it&apos;s
            more efficient. Check tonnage adequacy first.
          </p>
        </div>
      </section>

      <section aria-labelledby="scenarios" className="mb-10">
        <h2 id="scenarios" className="font-display mb-4 text-2xl font-semibold">
          Common comparisons worth checking
        </h2>
        <div className="space-y-4">
          {SCENARIOS.map((s) => {
            const diff = s.a.cost.annualCost - s.b.cost.annualCost
            return (
              <div
                key={s.question}
                className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900"
              >
                <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">
                  {s.question}
                </p>
                <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">
                  {s.a.label}: {formatINR(s.a.cost.annualCost)}/year vs {s.b.label}:{' '}
                  {formatINR(s.b.cost.annualCost)}/year (TNEB, 8h/day) —{' '}
                  {diff > 0 ? s.b.label : s.a.label} costs{' '}
                  {formatINR(Math.abs(diff))}/year less.
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/ac/tonnage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC tonnage calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Confirm both sizes would actually suit your room.
            </p>
          </Link>
          <Link
            href="/ac/comparisons/3-star-vs-5-star-savings-guide"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⭐</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              3★ vs 5★ savings guide
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Same tonnage, star rating only — with a detailed breakdown.
            </p>
          </Link>
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>💡</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Full detail for a single configuration.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Offset it with solar
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See the payback on a rooftop system sized for AC-heavy usage.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
