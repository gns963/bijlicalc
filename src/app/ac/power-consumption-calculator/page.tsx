import type { Metadata } from 'next'
import Link from 'next/link'
import AcPowerConsumptionCalculator from '@/components/calculators/AcPowerConsumptionCalculator'
import PageHero from '@/components/PageHero'
import { calculateAcPowerConsumption } from '@/lib/calc/ac'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/ac/power-consumption-calculator'

const example = calculateAcPowerConsumption({ ratedCurrentAmps: 6, hoursPerDay: 8 })

export const metadata: Metadata = {
  title: 'AC Power Consumption Calculator 2026 — From Rated Current (Amps)',
  description:
    'Calculate your air conditioner\'s power draw and unit (kWh) consumption from its nameplate rated current in Amps, an alternative to the tonnage/star-rating method.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AC Power Consumption Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: 'Power Consumption Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Where do I find my AC\'s rated current?',
    a: 'It\'s printed on the nameplate of the outdoor (compressor) unit, usually labelled "Rated Current" or "Input Current" in Amps (A).',
  },
  {
    q: 'How is this different from the AC running cost calculator?',
    a: 'The running cost calculator works from tonnage and star rating (ISEER), which is useful when comparing AC models. This tool works from your specific unit\'s nameplate current, which is useful once you already own the AC and want a quick power-draw figure without looking up ISEER tables.',
  },
  {
    q: 'Why does the calculator assume a 0.85 power factor?',
    a: 'AC compressor motors typically run at a power factor around 0.85, meaning real (working) power is about 85% of the apparent power implied by voltage × current. This is a typical figure — your specific unit\'s nameplate power factor may differ slightly.',
  },
  {
    q: 'Does this give me a cost, not just units?',
    a: 'This tool shows units (kWh) consumed. For a ₹ cost estimate priced at your DISCOM\'s tariff, use the AC running cost calculator with the daily units figure from here.',
  },
  {
    q: 'What does the nameplate actually look like, and where exactly is it?',
    a: 'On a split AC it\'s a metal or sticker label on the side or back of the outdoor unit, listing model number, refrigerant type, voltage, and current draw — usually as "Rated Current" or "Running Current" in Amps. On a window AC it\'s on the side panel, visible from outside the sleeve.',
  },
  {
    q: 'Why is this useful for an old or unlabeled AC?',
    a: 'Older or resold units sometimes have a worn, missing, or non-English nameplate, and ISEER labelling only became mandatory in recent years — so tonnage/star-rating figures may not exist for an older unit at all. A clamp meter reading of the actual running current, or a legible rated-current figure, works even when the efficiency label doesn\'t.',
  },
  {
    q: 'Can I measure the current myself instead of reading the nameplate?',
    a: 'Yes — a basic clamp meter around one of the AC\'s supply wires gives a direct current reading with the unit running. This can be more accurate than the nameplate figure, which is a rated (not real-time) value.',
  },
  {
    q: 'Is it safe to open the AC unit to check the nameplate or wiring myself?',
    a: 'Reading a visible nameplate is fine. Opening electrical enclosures, checking internal wiring, or using a clamp meter inside the unit should only be done by, or under the supervision of, a licensed electrician — see our circuit safety calculator for the wiring side of this.',
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

export default function AcPowerConsumptionPage() {
  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Power Consumption Calculator', href: '/ac/power-consumption-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1="AC Power Consumption Calculator"
        subtitle={
          <>
            Find your AC&apos;s power draw and unit (kWh) consumption straight
            from its <strong>nameplate rated current</strong> — no tonnage or
            star-rating lookup needed.
          </>
        }
        stats={[
          { icon: '🔌', big: '230V', small: 'Standard supply', tone: 'hub' },
          { icon: '⚙️', big: '0.85', small: 'Assumed power factor', tone: 'hub' },
          { icon: '📊', big: 'kW', small: 'Result unit', tone: 'hub' },
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
          An AC rated at <strong>6A</strong> running <strong>8 hours/day</strong>{' '}
          draws about <strong>{example.inputKw} kW</strong> and uses roughly{' '}
          <strong>{example.dailyUnits} units/day</strong> ({example.monthlyUnits}{' '}
          units/month).
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your AC&apos;s power draw
        </h2>
        <AcPowerConsumptionCalculator />
      </section>

      <section aria-labelledby="reading-nameplate" className="mb-10">
        <h2 id="reading-nameplate" className="font-display mb-4 text-2xl font-semibold">
          Reading your AC&apos;s nameplate
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            The nameplate is a metal or sticker label on the outdoor
            (compressor) unit for a split AC, or the side panel for a window
            AC. Look for a field labelled <strong>Rated Current</strong> or{' '}
            <strong>Input Current</strong>, given in Amps (A) — that&apos;s
            the number this calculator needs.
          </p>
          <p>
            This route is especially useful for an <strong>older or
            resold unit</strong>: ISEER labelling only became mandatory in
            recent years, so a pre-ISEER AC may have no usable star rating
            at all, while its rated current is still readable — or
            measurable directly with a clamp meter if the label has worn off.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="safety-note"
        className="mb-10 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5"
      >
        <h2
          id="safety-note"
          className="font-display mb-2 text-lg font-semibold text-caution-amber"
        >
          ⚠ A note on electrical safety
        </h2>
        <p className="text-sm text-ash/80 dark:text-gazette-cream/70">
          Reading a visible nameplate is safe for anyone. Measuring current
          with a clamp meter inside an enclosure, or inspecting AC wiring
          directly, should only be done by a licensed electrician. Once you
          have the rated current figure, our{' '}
          <Link href="/ac/circuit-safety-calculator" className="underline hover:text-caution-amber">
            circuit safety calculator
          </Link>{' '}
          uses the same number to check the MCB and wire gauge the circuit needs.
        </p>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
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
              Turn these units into a ₹ figure for your DISCOM.
            </p>
          </Link>
          <Link
            href="/ac/circuit-safety-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🛡️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Circuit safety calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Same rated current, for MCB and wire sizing.
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
              Compare two AC configurations side by side.
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
