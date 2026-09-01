import type { Metadata } from 'next'
import Link from 'next/link'
import RoomCoolingTimeCalculator from '@/components/calculators/RoomCoolingTimeCalculator'
import PageHero from '@/components/PageHero'
import { estimateCoolingTime } from '@/lib/calc/cooling'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/appliances/room-cooling-time-calculator'

const example = estimateCoolingTime({ areaSqFt: 150, ceilingHeightFt: 9, dropTempC: 6, acTon: 1.5 })

export const metadata: Metadata = {
  title: 'Room Cooling Time Calculator 2026 — AC Pull-Down Time Estimate',
  description:
    'Estimate the theoretical minimum time your AC takes to cool a room\'s air by a given temperature drop, using real thermodynamic formulas — not a guessed multiplier.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Room Cooling Time Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Room Cooling Time Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Why does the real room take longer to cool than this estimate?',
    a: 'This calculator answers a narrower question: how fast could the AC remove the heat already in the room\'s air, if no new heat came in. In reality, walls, windows, the roof and anyone in the room keep adding heat while the AC runs, so actual pull-down always takes longer — often much longer on a hot day or in a poorly insulated room.',
  },
  {
    q: 'Why is this still a useful number?',
    a: 'It\'s a genuine physics-based floor, not a guess — useful for comparing scenarios (a bigger AC vs a smaller one, a bigger drop vs a smaller one) even though the absolute real-world time will be higher.',
  },
  {
    q: 'What assumptions does this use?',
    a: 'Standard air density (0.075 lb/ft³) and specific heat of air (0.24 BTU/lb·°F) — textbook physical constants — plus an assumed 9 ft ceiling height and a 75% sensible heat ratio (the share of an AC\'s capacity that goes to temperature cooling rather than dehumidification), typical for split ACs.',
  },
  {
    q: 'Is my AC undersized if the real room takes much longer than this?',
    a: 'Not necessarily — this gap is expected and doesn\'t by itself mean your AC is undersized. If cooling is consistently slow or the AC never quite reaches the set temperature on hot days, check our AC tonnage calculator to confirm the unit is sized correctly for the room.',
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

export default function RoomCoolingTimePage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Room Cooling Time Calculator', href: '/appliances/room-cooling-time-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Room Cooling Time Calculator"
        subtitle={
          <>
            A real physics-based estimate of how fast your AC could cool your
            room&apos;s air — explicitly a theoretical minimum, not a real-world
            prediction. We explain the gap rather than papering over it.
          </>
        }
        stats={[
          { icon: '🧮', big: 'Q=mcΔT', small: 'Physics formula', tone: 'hub' },
          { icon: '💧', big: '75%', small: 'Sensible heat ratio', tone: 'hub' },
          { icon: '📐', big: '9 ft', small: 'Assumed ceiling', tone: 'hub' },
          { icon: '⏱️', big: 'Min. only', small: 'Theoretical floor', tone: 'hub' },
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
          A <strong>150 sq ft room</strong> (9 ft ceiling) cooled by a{' '}
          <strong>1.5 ton AC</strong> would take about{' '}
          <strong>{example.minutesToCoolAirOnly} minutes</strong> to drop{' '}
          {example.dropTempC}°C — for the air alone, with no ongoing heat gain.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Estimate your cooling time
        </h2>
        <RoomCoolingTimeCalculator />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated — and its real limit
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>Heat to remove.</strong> Q (BTU) = room volume (ft³) ×
            0.075 (air density, lb/ft³) × 0.24 (specific heat of air,
            BTU/lb·°F) × temperature drop (°F) — the standard sensible-heat
            formula, using real physical constants.
          </p>
          <p>
            <strong>AC&apos;s effective cooling rate.</strong> We take the
            AC&apos;s rated BTU/hr (tonnage × 12,000) and apply a 75% sensible
            heat ratio, since some of an AC&apos;s capacity goes to removing
            humidity rather than lowering temperature.
          </p>
          <p>
            <strong>What this deliberately leaves out.</strong> Walls, windows,
            the roof, sunlight and people all add heat to a real room
            continuously — this calculator only accounts for the air that&apos;s
            already there. That&apos;s why it&apos;s labelled a theoretical
            minimum, not a promise of real-world performance.
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
              Not sure this is even the right AC size for your room? Check first.
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
              What this AC actually costs to run day to day.
            </p>
          </Link>
          <Link
            href="/appliances/water-tank-filling-time-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🚰</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Water tank fill time
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Another simple physics-based home-utility timer.
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
