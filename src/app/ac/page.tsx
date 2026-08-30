import type { Metadata } from 'next'
import Link from 'next/link'

const SITE = 'https://bijlicalc.com'

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
    cls: 'border-spark-teal/20 bg-spark-teal/5 hover:border-spark-teal/50 dark:border-spark-teal/20 dark:bg-spark-teal/15/30',
    ctaCls: 'text-spark-teal dark:text-spark-teal',
  },
  {
    href: '/ac/tonnage-calculator',
    emoji: '📐',
    title: 'AC Tonnage Calculator',
    body: 'What size AC your room needs, adjusted for sun exposure and floor level.',
    cta: 'Find AC size →',
    cls: 'border-brass/20 bg-brass/5 hover:border-brass/50 dark:border-brass/20 dark:bg-brass/15/30',
    ctaCls: 'text-brass dark:text-brass',
  },
  {
    href: '/ac/comparisons/3-star-vs-5-star-savings-guide',
    emoji: '⚖️',
    title: '3 Star vs 5 Star Savings',
    body: 'Interactive comparison of annual savings from a 5-star AC by usage and tariff.',
    cta: 'Compare now →',
    cls: 'border-spark-teal/20 bg-spark-teal/5 hover:border-spark-teal/50 dark:border-spark-teal/20 dark:bg-spark-teal/15/30',
    ctaCls: 'text-spark-teal dark:text-spark-teal',
  },
]

export default function AcHubPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brass">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">AC</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Air Conditioner Calculators
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Work out what an AC costs to run, what size you need, and whether a
          5-star model is worth it — all priced against{' '}
          <strong>your state&apos;s real electricity tariff</strong>.
        </p>
      </header>

      <section className="mb-10 grid gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`flex flex-col rounded-2xl border p-6 transition hover:shadow-sm ${c.cls}`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {c.title}
            </h2>
            <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">
              {c.body}
            </p>
            <span className={`mt-3 text-sm font-semibold ${c.ctaCls}`}>
              {c.cta}
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="why" className="mb-10">
        <h2 id="why" className="mb-4 text-2xl font-semibold">
          Why AC cost depends on more than the price tag
        </h2>
        <div className="space-y-3 text-slate-700 dark:text-slate-300">
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
    </main>
  )
}
