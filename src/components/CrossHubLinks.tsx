import Link from 'next/link'

const HUBS = [
  {
    slug: 'electricity',
    emoji: '⚡',
    label: 'Electricity',
    desc: 'Bill calculators for all 36 states & UTs',
  },
  {
    slug: 'solar',
    emoji: '☀️',
    label: 'Solar',
    desc: 'Rooftop ROI & PM Surya Ghar subsidy',
  },
  {
    slug: 'ac',
    emoji: '❄️',
    label: 'AC',
    desc: 'Running cost, sizing & star-rating savings',
  },
  {
    slug: 'water',
    emoji: '💧',
    label: 'Water',
    desc: 'Municipal water bill, from your own rate',
  },
  {
    slug: 'gas',
    emoji: '🔥',
    label: 'Gas',
    desc: 'Piped gas (PNG) bill, from your own rate',
  },
  {
    slug: 'appliances',
    emoji: '🔌',
    label: 'Appliances',
    desc: 'Fan, fridge, UPS/inverter sizing & backup',
  },
  {
    slug: 'fuel-cost',
    emoji: '⛽',
    label: 'Fuel Cost',
    desc: 'Petrol/diesel, LPG & generator running cost',
  },
  {
    slug: 'financial',
    emoji: '🧮',
    label: 'Financial',
    desc: 'GST, SIP, tax regime & gratuity',
  },
] as const

export default function CrossHubLinks({ current }: { current: string }) {
  const others = HUBS.filter((h) => h.slug !== current)
  return (
    <section aria-labelledby="explore-more" className="mb-10">
      <h2 id="explore-more" className="font-display mb-4 text-2xl font-semibold">
        Explore other calculators
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {others.map((h) => (
          <Link
            key={h.slug}
            href={`/${h.slug}`}
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>
              {h.emoji}
            </span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              {h.label}
            </p>
            <p className="mt-1 text-xs text-ash/60">
              {h.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
