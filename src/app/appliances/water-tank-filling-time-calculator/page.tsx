import type { Metadata } from 'next'
import Link from 'next/link'
import WaterTankFillCalculator from '@/components/calculators/WaterTankFillCalculator'
import PageHero from '@/components/PageHero'
import { estimateTankFillTime } from '@/lib/calc/watertank'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/water-tank-filling-time-calculator'

const example = estimateTankFillTime({ capacityLiters: 1000, flowRateLpm: 50 })

export const metadata: Metadata = {
  title: 'Water Tank Filling Time Calculator 2026 — By Capacity & Pump Flow',
  description:
    'Calculate how long your water tank takes to fill from its capacity in litres and your pump\'s flow rate in LPM, with a note on why real-world lift affects flow.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Water Tank Filling Time Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Water Tank Filling Time Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How do I find my pump\'s flow rate?',
    a: 'It\'s printed on the pump\'s nameplate or spec sheet, usually in LPM (litres per minute) or LPH (litres per hour, divide by 60 for LPM). A typical 0.5 HP domestic pump delivers roughly 40-70 LPM and a 1 HP pump roughly 80-120 LPM at low head — but this varies a lot by model, so check your specific pump where possible.',
  },
  {
    q: 'Why might my tank actually take longer to fill than this estimate?',
    a: 'Pump nameplate flow rates are usually measured at zero or low head (no vertical lift). Pumping water up to an overhead or rooftop tank, through narrow or long pipework, or through a partially closed valve all reduce real flow below the rated figure.',
  },
  {
    q: 'Does tank shape affect fill time?',
    a: 'No — fill time depends only on volume and flow rate, not shape. A tall narrow tank and a short wide tank of the same litre capacity fill in the same time at the same flow rate.',
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

export default function WaterTankFillPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Water Tank Filling Time Calculator', href: '/appliances/water-tank-filling-time-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Water Tank Filling Time Calculator"
        subtitle="Find out how long your water tank takes to fill, from its capacity and your pump's flow rate."
        stats={[
          { icon: '🧮', big: 'V ÷ Q', small: 'Formula', tone: 'hub' },
          { icon: '💧', big: 'LPM', small: 'Flow rate unit', tone: 'hub' },
          { icon: '📏', big: 'Zero-head', small: 'Nameplate basis', tone: 'hub' },
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
          A <strong>1,000-litre tank</strong> filled by a pump delivering{' '}
          <strong>50 LPM</strong> takes about{' '}
          <strong>{example.minutes} minutes</strong> ({example.hours} hours).
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your fill time
        </h2>
        <WaterTankFillCalculator />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Fill time (minutes) = tank capacity (litres) ÷ pump flow rate
          (litres/minute). Simple volumetric arithmetic — the only real-world
          variable is getting an accurate flow rate for your actual setup,
          since lift height and pipe size both reduce flow below a pump&apos;s
          rated (zero-head) figure.
        </p>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/appliances/room-cooling-time-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⏱️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Room cooling time
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Another simple physics-based home-utility timer.
            </p>
          </Link>
          <Link
            href="/appliances/inverter-sizing-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Inverter sizing
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Size backup power for your pump during a power cut.
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⚡</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Electricity bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See your full monthly bill for your state.
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
