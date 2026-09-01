import type { Metadata } from 'next'
import Link from 'next/link'
import AcTonnageCalculator from '@/components/calculators/AcTonnageCalculator'
import PageHero from '@/components/PageHero'
import { recommendTonnage } from '@/lib/calc/ac'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/ac/tonnage-calculator'
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: 'Tonnage Calculator', path: PATH },
])

export const metadata: Metadata = {
  title: 'AC Tonnage Calculator 2026 — Room Size & BTU Guide (India)',
  description:
    'Find the right AC tonnage for your room size in sq ft, adjusted for sun exposure and top-floor heat gain. Room-size chart, BTU conversion, and step-by-step method — no fabricated stats.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

// ---------------------------------------------------------------------------
// Every number below comes straight out of recommendTonnage() — the same
// function the calculator above uses. Nothing here is estimated by hand or
// borrowed from a competitor's methodology.
const ROOM_SIZES = [80, 100, 120, 150, 180, 200, 250, 300, 400, 500]
const STANDARD_ROWS = ROOM_SIZES.map((area) => ({
  area,
  standard: recommendTonnage({ areaSqFt: area, sunExposure: 'medium', floor: 'other' }),
  worst: recommendTonnage({ areaSqFt: area, sunExposure: 'high', floor: 'top' }),
  best: recommendTonnage({ areaSqFt: area, sunExposure: 'low', floor: 'other' }),
}))

// Boundary sq-ft where the standard-conditions recommendation steps up —
// computed by scanning the real function, not hardcoded.
function findBoundary(fromTon: number, toTon: number): number {
  for (let a = 60; a <= 520; a++) {
    const r = recommendTonnage({ areaSqFt: a, sunExposure: 'medium', floor: 'other' })
    const prev = recommendTonnage({ areaSqFt: a - 1, sunExposure: 'medium', floor: 'other' })
    if (prev.recommendedTon === fromTon && r.recommendedTon === toTon) return a
  }
  return 0
}
const boundary1_5Ton = findBoundary(1.0, 1.5)
const boundary2Ton = findBoundary(1.5, 2.0)
// ---------------------------------------------------------------------------

const faqs = [
  {
    q: 'What size AC do I need for a 150 sq ft room?',
    a: `A 150 sq ft room typically needs a 1.5 ton AC under standard conditions (medium sun, not top floor) — our calculator returns ${STANDARD_ROWS.find((r) => r.area === 150)?.standard.recommendedTon} ton for exactly this size. If the room is heavily shaded, 1 ton can suffice; if it's on the top floor with strong afternoon sun, stick with 1.5 ton rather than downsizing.`,
  },
  {
    q: 'How much area does 1 ton AC cover?',
    a: `Under our standard assumptions (medium sun exposure, not top floor), 1 ton covers roughly up to ${boundary1_5Ton - 1} sq ft, with the recommendation stepping up to 1.5 ton beyond that. A shaded, ground/middle-floor room can sometimes stretch a bit further; a top-floor room with strong sun needs the upgrade sooner.`,
  },
  {
    q: 'Does floor level affect AC tonnage?',
    a: 'Yes. A top-floor room absorbs direct heat through the roof all day, so our calculator adds 10% to the cooling load for top-floor rooms compared with an identical room lower in the building.',
  },
  {
    q: 'Does window/sun exposure matter for AC sizing?',
    a: 'Yes. Rooms with strong direct sun (west-facing, large unshaded windows) need more cooling capacity than shaded rooms. Our calculator adds 10% for medium sun exposure and 20% for high/direct sun exposure.',
  },
  {
    q: 'Is a bigger AC always better?',
    a: 'No. An oversized AC short-cycles — it cools the room quickly and shuts off before properly dehumidifying, leaving the room feeling cool but clammy, and wears the compressor with frequent on/off cycling. An undersized AC runs continuously at full load, struggles to hit the set temperature on hot days, and uses more electricity than a right-sized unit. Correct sizing gives the best comfort and running cost.',
  },
  {
    q: 'What size AC do I need for a large room (300+ sq ft)?',
    a: `Our calculator caps its recommendation at 2 ton — the largest commonly available single-unit residential size — for rooms with a standard-conditions load at or beyond ${boundary2Ton} sq ft. For genuinely large or open-plan spaces (300–500 sq ft and up), two smaller AC units placed for even air distribution usually cool more evenly and give you backup capacity if one unit needs servicing, rather than relying on one oversized unit.`,
  },
  {
    q: 'How is AC tonnage related to BTU?',
    a: '1 ton of AC cooling capacity equals 12,000 BTU/hr (British Thermal Units per hour) — this is the international standard used to rate cooling capacity, regardless of brand.',
  },
  {
    q: 'How accurate is this AC tonnage calculator?',
    a: 'It uses a widely-used rule of thumb — roughly 1 ton per 140 sq ft — adjusted for sun exposure and floor level. It is a planning estimate, not a substitute for a professional heat-load (Manual J style) assessment, which also accounts for ceiling height, insulation quality, number of occupants, and local climate in detail.',
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
  name: 'AC Tonnage Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

const howToLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to calculate AC tonnage for a room',
  step: [
    { '@type': 'HowToStep', position: 1, text: 'Measure your room length and width in feet, and multiply to get the area in square feet.' },
    { '@type': 'HowToStep', position: 2, text: 'Divide the area by 140 to get the baseline tonnage.' },
    { '@type': 'HowToStep', position: 3, text: 'Add 10% for medium sun exposure or 20% for direct/high sun exposure.' },
    { '@type': 'HowToStep', position: 4, text: 'Add a further 10% if the room is on the top floor.' },
    { '@type': 'HowToStep', position: 5, text: 'Round up to the nearest standard AC size: 0.8, 1, 1.5 or 2 ton.' },
  ],
}

export default function AcTonnagePage() {
  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Tonnage Calculator', href: '/ac/tonnage-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1="AC Tonnage Calculator (Room Size & BTU Guide)"
        subtitle="Get the right AC size for your room. Enter the floor area and adjust for sun exposure and floor level — right-sizing avoids the two most common mistakes: an undersized AC that never keeps up, and an oversized one that short-cycles and cools unevenly."
        stats={[
          { icon: '📐', big: '1T / 140 sqft', small: 'Baseline ratio', tone: 'hub' },
          { icon: '☀️', big: '+10–20%', small: 'Sun exposure', tone: 'hub' },
          { icon: '🏠', big: '+10%', small: 'Top floor', tone: 'hub' },
          { icon: '❄️', big: '0.8–2 Ton', small: 'Standard sizes', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          Find your AC size
        </h2>
        <AcTonnageCalculator />
      </section>

      {/* Room-size chart — real computed values */}
      <section aria-labelledby="chart" className="mb-10 scroll-mt-20">
        <h2 id="chart" className="font-display mb-2 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          AC tonnage by room size — complete chart
        </h2>
        <p className="mb-4 text-ash/70 dark:text-gazette-cream/60">
          &ldquo;Standard&rdquo; assumes medium sun exposure and a non-top-floor
          room. &ldquo;Best case&rdquo; and &ldquo;worst case&rdquo; show how much a shaded room
          or a top-floor, direct-sun room can shift the recommendation.
        </p>
        <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
              <tr>
                <th className="px-4 py-2 font-semibold">Room size</th>
                <th className="px-4 py-2 text-right font-semibold">Best case</th>
                <th className="px-4 py-2 text-right font-semibold">Standard</th>
                <th className="px-4 py-2 text-right font-semibold">Worst case</th>
                <th className="px-4 py-2 text-right font-semibold">BTU/hr (standard)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline dark:divide-white/10">
              {STANDARD_ROWS.map((r) => (
                <tr key={r.area}>
                  <td className="px-4 py-2 font-medium">{r.area} sq ft</td>
                  <td className="px-4 py-2 text-right tabular-nums text-spark-teal">
                    {r.best.recommendedTon}T
                  </td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-ac">
                    {r.standard.recommendedTon}T
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-caution-amber">
                    {r.worst.recommendedTon}T
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {r.standard.coolingBtu.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
          Beyond {boundary2Ton} sq ft, our calculator caps its recommendation at 2
          ton — see &ldquo;Large rooms&rdquo; below for why splitting into two units is
          usually the better move past this point.
        </p>
      </section>

      {/* 1 ton coverage */}
      <section aria-labelledby="one-ton" className="mb-10 scroll-mt-20">
        <h2 id="one-ton" className="font-display mb-2 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          1 ton AC — how much area does it cover?
        </h2>
        <div className="rounded-xl border border-hub-ac/20 bg-hub-ac/5 p-5">
          <p className="text-ash/80 dark:text-gazette-cream/80">
            Under standard conditions, 1 ton covers rooms up to about{' '}
            <strong className="text-hub-ac">{boundary1_5Ton - 1} sq ft</strong>{' '}
            (roughly an 11×12 ft room). A shaded, lower-floor room can sometimes
            stretch a little further on 1 ton; a top-floor room with strong sun
            crosses into 1.5-ton territory sooner — as early as{' '}
            {(() => {
              for (let a = 60; a <= 200; a++) {
                if (
                  recommendTonnage({ areaSqFt: a, sunExposure: 'high', floor: 'top' })
                    .recommendedTon === 1.5 &&
                  recommendTonnage({ areaSqFt: a - 1, sunExposure: 'high', floor: 'top' })
                    .recommendedTon === 1.0
                )
                  return a
              }
              return boundary1_5Ton
            })()}{' '}
            sq ft.
          </p>
        </div>
      </section>

      {/* 1.5 ton breakout */}
      <section aria-labelledby="onefive-ton" className="mb-10 scroll-mt-20">
        <h2 id="onefive-ton" className="font-display mb-2 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          1.5 ton AC — room size in feet
        </h2>
        <p className="mb-4 text-ash/70 dark:text-gazette-cream/60">
          1.5 ton is India&apos;s most common domestic AC size. Under standard
          conditions it covers roughly {boundary1_5Ton}–{boundary2Ton - 1} sq ft.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
              Coverage range (standard conditions)
            </p>
            <p className="font-display mt-1 text-2xl font-bold text-hub-ac">
              {boundary1_5Ton}–{boundary2Ton - 1} sq ft
            </p>
            <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
              e.g. a 12×15 ft (180 sq ft) bedroom or small living room
            </p>
          </div>
          <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
              1.5 ton = 12,000 × 1.5
            </p>
            <p className="font-display mt-1 text-2xl font-bold text-hub-ac">18,000 BTU/hr</p>
            <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
              the standard worldwide unit for cooling capacity
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 rounded-xl bg-mist p-5 sm:grid-cols-2 dark:bg-slate-800/60">
          <p className="text-sm font-semibold text-ink-navy dark:text-gazette-cream sm:col-span-2">
            When to choose 1.5 ton over 1 ton
          </p>
          {[
            `Room size ${boundary1_5Ton}+ sq ft — 1 ton will undersize it`,
            'Top-floor bedroom — roof heat gain pushes past 1 ton sooner',
            'West-facing or unshaded windows — afternoon sun adds real load',
            'Poor insulation or older construction — 1.5T compensates',
          ].map((t) => (
            <div key={t} className="flex items-start gap-2 text-sm text-ash/80 dark:text-gazette-cream/70">
              <span className="mt-0.5 text-hub-ac" aria-hidden>✓</span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Large rooms */}
      <section aria-labelledby="large-rooms" className="mb-10 scroll-mt-20">
        <h2 id="large-rooms" className="font-display mb-2 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          Large rooms &amp; halls (300+ sq ft)
        </h2>
        <p className="mb-4 text-ash/70 dark:text-gazette-cream/60">
          Our calculator caps its single-unit recommendation at 2 ton. For
          genuinely large or open-plan rooms, a single large AC isn&apos;t always
          the best answer — two smaller units are a well-established
          alternative.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Air distribution', body: 'Large or L-shaped rooms often have dead zones a single AC can’t reach evenly. Two units placed on opposite walls cool the whole space more consistently.' },
            { title: 'Redundancy', body: 'If your one large AC needs servicing, you lose all cooling. With two units, you keep partial cooling while one is repaired.' },
            { title: 'Running cost', body: 'Two inverter units running at partial load are often more efficient than one large unit running flat out, especially in mild weather.' },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
              <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">{c.title}</p>
              <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step by step */}
      <section aria-labelledby="how" className="mb-10 scroll-mt-20">
        <h2 id="how" className="font-display mb-4 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          How to calculate AC tonnage — step by step
        </h2>
        <ol className="space-y-3">
          {[
            'Measure your room length and width in feet, and multiply to get the area. Example: 12 ft × 15 ft = 180 sq ft.',
            'Divide the area by 140 to get the baseline tonnage. 180 ÷ 140 = 1.29 ton.',
            'Add 10% for medium sun exposure, or 20% for strong/direct sun. Medium sun: 1.29 × 1.1 = 1.41 ton.',
            'Add a further 10% if the room is on the top floor. Top floor: 1.41 × 1.1 = 1.55 ton.',
            'Round up to the nearest standard size — 0.8, 1, 1.5 or 2 ton. 1.55 rounds up to 2 ton.',
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-ac font-display text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-ash/80 dark:text-gazette-cream/70">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* BTU conversion */}
      <section aria-labelledby="btu" className="mb-10 scroll-mt-20">
        <h2 id="btu" className="font-display mb-4 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          AC ton to BTU conversion
        </h2>
        <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
          <p className="text-center text-sm text-ash/60 dark:text-gazette-cream/50">
            The universal formula
          </p>
          <p className="font-display my-2 text-center text-2xl font-bold text-hub-ac">
            1 Ton = 12,000 BTU/hr
          </p>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-mist p-3 dark:bg-slate-800">
              <p className="font-semibold text-ink-navy dark:text-gazette-cream">Ton → BTU</p>
              <p className="mt-1 text-ash/70 dark:text-gazette-cream/60">Multiply tonnage by 12,000</p>
              <p className="mt-1 font-mono text-xs">1.5 Ton × 12,000 = 18,000 BTU</p>
              <p className="font-mono text-xs">2.0 Ton × 12,000 = 24,000 BTU</p>
            </div>
            <div className="rounded-lg bg-mist p-3 dark:bg-slate-800">
              <p className="font-semibold text-ink-navy dark:text-gazette-cream">BTU → Ton</p>
              <p className="mt-1 text-ash/70 dark:text-gazette-cream/60">Divide BTU by 12,000</p>
              <p className="mt-1 font-mono text-xs">18,000 ÷ 12,000 = 1.5 Ton</p>
              <p className="font-mono text-xs">24,000 ÷ 12,000 = 2.0 Ton</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section aria-labelledby="mistakes" className="mb-10 scroll-mt-20">
        <h2 id="mistakes" className="font-display mb-4 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          Undersized vs. oversized vs. correctly sized
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5">
            <p className="font-display font-bold text-caution-amber">Undersized AC</p>
            <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">
              Runs continuously at full load, never quite reaches the set
              temperature on hot days, and wears the compressor faster.
            </p>
          </div>
          <div className="rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5">
            <p className="font-display font-bold text-caution-amber">Oversized AC</p>
            <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">
              Cools the room quickly then shuts off (short-cycling) before
              properly dehumidifying — the room feels cool but clammy.
            </p>
          </div>
          <div className="rounded-xl border border-spark-teal/25 bg-spark-teal/5 p-5">
            <p className="font-display font-bold text-spark-teal">Correctly sized AC</p>
            <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">
              Runs steady cycles, maintains temperature and humidity, and
              gives the lowest running cost for the room.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-sell */}
      <section aria-labelledby="related" className="mb-10 scroll-mt-20">
        <h2 id="related" className="font-display mb-4 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
          Once you know your tonnage
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>💡</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See the exact monthly cost for your recommended tonnage and DISCOM.
            </p>
          </Link>
          <Link
            href="/ac/comparisons/3-star-vs-5-star-savings-guide"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⭐</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              3★ vs 5★ savings
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Is the 5-star premium worth it for your usage pattern?
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Electricity bill calculators
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See your full bill, not just what the AC adds.
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

      <section aria-labelledby="faq" className="mb-10 scroll-mt-20">
        <h2 id="faq" className="font-display mb-4 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
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

      <footer className="rounded-lg bg-mist p-4 text-sm text-ash/60 dark:bg-slate-800 dark:text-gazette-cream/50">
        <p>
          Methodology: this calculator uses a widely-used sizing rule of
          thumb — roughly 1 ton of cooling per 140 sq ft — adjusted for sun
          exposure and floor level. It is a planning estimate, not a
          substitute for a professional room-by-room heat-load assessment.
        </p>
      </footer>

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
