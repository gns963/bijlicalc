import type { Metadata } from 'next'
import Link from 'next/link'
import CrossHubLinks from '@/components/CrossHubLinks'
import SplitHero from '@/components/SplitHero'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { breadcrumbLd, itemListLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'

const heroExample = calculateAcCost({
  discomCode: 'TNEB',
  tonnage: 1.5,
  starRating: 3,
  dailyHours: 8,
})

export const metadata: Metadata = {
  title: 'AC Calculators — Running Cost, Tonnage & Star Rating (India)',
  description:
    'Free air-conditioner tools for India: running-cost calculator using your DISCOM tariff, room-size tonnage calculator, and a 3-star vs 5-star savings comparison.',
  alternates: { canonical: `${SITE}/ac` },
  openGraph: { url: `${SITE}/ac`, type: 'website' },
}

const cards = [
  {
    href: '/ac/bill-calculator',
    emoji: '💡',
    title: 'AC Running Cost Calculator',
    body: 'Monthly and yearly electricity cost by tonnage, star rating, hours and DISCOM.',
    cta: 'Calculate cost →',
    cls: 'border-spark-teal/20 bg-spark-teal/5 hover:border-spark-teal/50',
    ctaCls: 'text-spark-teal',
  },
  {
    href: '/ac/tonnage-calculator',
    emoji: '📐',
    title: 'AC Tonnage Calculator',
    body: 'What size AC your room needs, adjusted for sun exposure and floor level.',
    cta: 'Find AC size →',
    cls: 'border-brass/20 bg-brass/5 hover:border-brass/50',
    ctaCls: 'text-brass',
  },
  {
    href: '/ac/comparisons/3-star-vs-5-star-savings-guide',
    emoji: '⚖️',
    title: '3 Star vs 5 Star Savings',
    body: 'Interactive comparison of annual savings from a 5-star AC by usage and tariff.',
    cta: 'Compare now →',
    cls: 'border-spark-teal/20 bg-spark-teal/5 hover:border-spark-teal/50',
    ctaCls: 'text-spark-teal',
  },
  {
    href: '/ac/comparison-tool',
    emoji: '🆚',
    title: 'AC Comparison Tool',
    body: 'Compare any two AC configurations side by side — tonnage, star rating, or both.',
    cta: 'Compare ACs →',
    cls: 'border-brass/20 bg-brass/5 hover:border-brass/50',
    ctaCls: 'text-brass',
  },
  {
    href: '/ac/power-consumption-calculator',
    emoji: '🔢',
    title: 'Power Consumption Calculator',
    body: "From your AC's nameplate rated current — no tonnage lookup needed.",
    cta: 'Calculate draw →',
    cls: 'border-spark-teal/20 bg-spark-teal/5 hover:border-spark-teal/50',
    ctaCls: 'text-spark-teal',
  },
  {
    href: '/ac/circuit-safety-calculator',
    emoji: '🛡️',
    title: 'Circuit Safety Calculator',
    body: 'General MCB rating and wire gauge guidance for an AC circuit.',
    cta: 'Get guidance →',
    cls: 'border-caution-amber/20 bg-caution-amber/5 hover:border-caution-amber/50',
    ctaCls: 'text-caution-amber',
  },
]

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
])
const itemList = itemListLd(cards.map((c) => ({ name: c.title, path: c.href })))

const faqs = [
  {
    q: 'Why does an AC cost so much more than other appliances?',
    a: 'Two reasons: the compressor draws continuous, relatively high power while it runs, and because it adds to your existing usage, its units land on your DISCOM\'s highest tariff slab — not a blended average rate.',
  },
  {
    q: 'What\'s the difference between the running cost calculator and the tonnage calculator?',
    a: 'The running cost calculator prices a specific AC you already have (or are considering) — tonnage, star rating and hours. The tonnage calculator answers a different question: what size AC does your room actually need, before you buy one.',
  },
  {
    q: 'Should I buy a 3-star or 5-star AC?',
    a: 'It depends on your daily usage hours and your DISCOM\'s tariff — use our 3-star vs 5-star savings guide to see the exact annual difference and payback period for your situation.',
  },
  {
    q: 'Do these calculators use my actual electricity tariff?',
    a: 'Yes — pick your DISCOM in each calculator and the units are priced at that state\'s real, source-cited tariff, not a national average.',
  },
  {
    q: 'What\'s the difference between ISEER and SEER?',
    a: 'ISEER is BEE\'s India-specific efficiency standard, tested against Indian climate and usage conditions. SEER is the equivalent US standard, tested differently — an ISEER-based estimate is the one that reflects real running cost in India.',
  },
  {
    q: 'Can I check if my AC circuit is wired safely?',
    a: 'Use our circuit safety calculator for general MCB and wire gauge planning guidance from your AC\'s rated current — it\'s a starting point for a conversation with a licensed electrician, not a substitute for one.',
  },
  {
    q: 'How do I compare AC running cost against solar savings?',
    a: 'AC is usually the biggest single driver of a summer bill, and it runs mostly during daylight — exactly when rooftop solar generates. See our solar ROI calculator to check whether panels sized around your AC usage would pay back.',
  },
  {
    q: 'Why does the same AC cost differently to run in two different states?',
    a: 'Because DISCOM tariffs differ — different top-slab rates, fuel cost adjustments and electricity duty. See the multi-state slab comparison on our running cost calculator for a real, computed example.',
  },
  {
    q: 'I don\'t know my AC\'s tonnage or star rating — can I still get an estimate?',
    a: 'Yes — use the power consumption calculator instead, which works from your AC\'s nameplate rated current (in Amps) rather than tonnage and star rating.',
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

export default function AcHubPage() {
  return (
    <>
      <SplitHero
        hub="ac"
        breadcrumb={[{ label: 'AC', href: '/ac' }]}
        badgeLabel="6 calculators · ISEER + real tariffs"
        h1="Air Conditioner Calculators"
        subtitle="Work out what an AC costs to run, what size you need, and whether a 5-star model is worth it — all priced against your state's real electricity tariff."
        primaryCta={{ label: 'Calculate My AC Cost', href: '#tools', emoji: '❄️' }}
        secondaryCta={{ label: 'Running cost calculator →', href: '/ac/bill-calculator' }}
        statChips={[
          { icon: '❄️', big: '6', small: 'Calculators', tone: 'hub' },
          { icon: '⚙️', big: 'ISEER', small: 'Efficiency basis', tone: 'hub' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
              <span aria-hidden>❄️</span> Worked example
            </p>
            <p className="mt-2 text-sm text-white/70">
              A 1.5 ton, 3-star AC running 8 hours/day in Tamil Nadu
            </p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-white">
              {formatINR(heroExample.monthlyCost)}
              <span className="ml-1 text-sm font-normal text-white/50">/month</span>
            </p>
            <p className="mt-2 text-xs text-white/50">
              {formatINR(heroExample.annualCost)}/year at{' '}
              {formatINR(heroExample.effectiveRatePerUnit)}/unit — priced at
              TNEB&apos;s real top slab, not a flat average.
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section id="tools" className="mb-10 grid scroll-mt-20 gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`flex flex-col rounded-2xl border p-6 transition hover:shadow-sm ${c.cls}`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="font-display mt-2 text-lg font-semibold text-ink-navy">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-ash/70">
              {c.body}
            </p>
            <span className={`mt-3 text-sm font-semibold ${c.ctaCls}`}>
              {c.cta}
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="why" className="mb-10">
        <h2 id="why" className="font-display mb-4 text-2xl font-semibold">
          Why AC cost depends on more than the price tag
        </h2>
        <div className="space-y-3 text-ash/80">
          <p>
            An air conditioner is often the single biggest line on a summer
            electricity bill. Two things drive the cost: how efficiently the unit
            converts power into cooling (its <strong>ISEER / star rating</strong>
            ), and the <strong>rate your DISCOM charges</strong> for those extra
            units — which, because AC is added on top of your base usage, is your
            highest tariff slab.
          </p>
          <p>
            Our calculators combine both, so you see a realistic running cost, the
            right size for your room, and the payback on a more efficient model.
          </p>
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

      <CrossHubLinks current="ac" />

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
