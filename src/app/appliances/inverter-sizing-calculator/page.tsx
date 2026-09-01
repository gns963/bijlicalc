import type { Metadata } from 'next'
import Link from 'next/link'
import InverterSizingCalculator from '@/components/calculators/InverterSizingCalculator'
import PageHero from '@/components/PageHero'
import { sizeInverter } from '@/lib/calc/inverter'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/appliances/inverter-sizing-calculator'

const example = sizeInverter({ totalLoadWatts: 600, backupHours: 4, batteryVoltage: 12 })

export const metadata: Metadata = {
  title: 'Home UPS / Inverter Sizing Calculator 2026 — VA & Battery Ah',
  description:
    'Find the right inverter VA rating and battery Ah capacity for your home backup load and desired backup hours, using standard electrical sizing formulas.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home UPS / Inverter Sizing Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Inverter Sizing Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How do I add up my load in watts?',
    a: 'List every appliance you want backed up and its rated wattage (printed on the appliance or its box), then add them together. Common figures: LED bulb 10W, ceiling fan 75W, TV 80–150W, fridge 100–200W (running, not starting), router 15W.',
  },
  {
    q: 'Why does the calculator add 25% headroom to VA?',
    a: 'It\'s a commonly recommended safety margin so the inverter isn\'t run at its absolute ceiling continuously, which shortens its life and hurts its ability to handle brief surges from motor-based appliances starting up.',
  },
  {
    q: 'Should I size for full battery discharge?',
    a: 'No — this calculator sizes the battery Ah for your stated backup hours using typical round-trip efficiency, but repeatedly draining a lead-acid battery to 100% shortens its life. See our battery backup time calculator for the safe-vs-full-capacity distinction.',
  },
  {
    q: 'Does a motor appliance need extra sizing beyond its running wattage?',
    a: 'Yes — motors (like a fridge or water pump) draw a brief surge of 2-3× their running wattage on startup. If you\'re backing up such appliances, size the inverter with that surge in mind, not just steady running load.',
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

export default function InverterSizingPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Inverter Sizing Calculator', href: '/appliances/inverter-sizing-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Home UPS / Inverter Sizing Calculator"
        subtitle="Work out the right inverter VA rating and battery Ah capacity for the appliances you want backed up during a power cut, and for how long."
        stats={[
          { icon: '⚡', big: '0.8', small: 'Power factor', tone: 'hub' },
          { icon: '🛡️', big: '+25%', small: 'Safety headroom', tone: 'hub' },
          { icon: '⚙️', big: '80%', small: 'System efficiency', tone: 'hub' },
          { icon: '🔌', big: '12/24/48V', small: 'Battery banks', tone: 'hub' },
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
          A <strong>600W load</strong> for <strong>4 hours</strong> backup on a
          12V battery bank needs about a{' '}
          <strong>{example.recommendedVA.toLocaleString('en-IN')} VA</strong>{' '}
          inverter and a <strong>{example.recommendedBatteryAh} Ah</strong>{' '}
          battery.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Size your inverter
        </h2>
        <InverterSizingCalculator />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>VA sizing.</strong> VA = (total watts ÷ 0.8 power factor) ×
            1.25 headroom, rounded up to the nearest 50 VA — a standard
            approach for sizing home inverters.
          </p>
          <p>
            <strong>Battery Ah sizing.</strong> Watt-hours needed = load ×
            backup hours. Battery Ah = watt-hours ÷ (voltage × 80% round-trip
            efficiency), accounting for inverter conversion and battery
            charge/discharge losses.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/appliances/household-bill-builder"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🏠</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Household bill builder
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Same appliance wattage data, for your electricity bill instead.
            </p>
          </Link>
          <Link
            href="/appliances/inverter-backup-time-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔋</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Battery backup time
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Already have a battery? Check how long it will actually last.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Solar ROI calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Pair backup with solar generation for daytime power cuts.
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
