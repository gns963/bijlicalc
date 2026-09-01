import type { Metadata } from 'next'
import Link from 'next/link'
import InverterBackupCalculator from '@/components/calculators/InverterBackupCalculator'
import PageHero from '@/components/PageHero'
import { estimateBackupTime } from '@/lib/calc/inverter'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/appliances/inverter-backup-time-calculator'

const example = estimateBackupTime({ batteryAh: 150, batteryVoltage: 12, loadWatts: 400 })

export const metadata: Metadata = {
  title: 'Inverter Battery Backup Time Calculator 2026 — How Long It Lasts',
  description:
    'Calculate how long your inverter battery will actually last for a given load, with both a safe (50% depth of discharge) and full-capacity estimate.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Inverter Battery Backup Time Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Inverter Backup Time Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Why does the calculator show two different backup times?',
    a: 'The full-capacity figure is the theoretical maximum if you drain the battery completely. The safe figure uses a 50% depth of discharge, which is a widely recommended limit for lead-acid batteries — draining deeper repeatedly shortens the battery\'s usable life significantly.',
  },
  {
    q: 'How do I find my battery\'s Ah rating?',
    a: 'It\'s printed on the battery\'s nameplate or case, usually alongside the voltage — for example "12V 150Ah".',
  },
  {
    q: 'Does battery age affect real backup time?',
    a: 'Yes, significantly. A battery\'s usable capacity degrades with age and charge cycles — an older battery may deliver noticeably less than its rated Ah. This calculator uses the nameplate rating, which reflects a new, fully healthy battery.',
  },
  {
    q: 'What load should I enter?',
    a: 'Add up the wattage of everything actually running on the inverter during the cut — not your inverter\'s VA rating. If you\'re unsure of your total load, see our inverter sizing calculator.',
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

export default function InverterBackupPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Inverter Backup Time Calculator', href: '/appliances/inverter-backup-time-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliance hub
          </>
        }
        h1="Inverter Battery Backup Time Calculator"
        subtitle="Already have a battery? Find out how long it will realistically last for your load — both a safe estimate and the theoretical maximum."
        stats={[
          { icon: '🔋', big: '50%', small: 'Safe depth of discharge', tone: 'hub' },
          { icon: '⚙️', big: '80%', small: 'System efficiency', tone: 'hub' },
          { icon: '🔌', big: '12/24/48V', small: 'Battery banks', tone: 'hub' },
          { icon: '⏱️', big: '2 modes', small: 'Safe vs full', tone: 'hub' },
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
          A <strong>150 Ah, 12V battery</strong> running a{' '}
          <strong>400W load</strong> lasts about{' '}
          <strong>{example.safeCapacityHours} hours</strong> at a safe 50%
          depth of discharge, or up to {example.fullCapacityHours} hours if
          fully drained.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your backup time
        </h2>
        <InverterBackupCalculator />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>Watt-hours available.</strong> Battery Ah × voltage × 80%
            round-trip efficiency gives the usable watt-hours, accounting for
            inverter conversion and battery losses.
          </p>
          <p>
            <strong>Divide by load.</strong> Backup hours = usable watt-hours ÷
            connected load in watts. The safe figure applies a 50% depth-of-
            discharge limit on top of that.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/appliances/inverter-sizing-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Inverter sizing
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Buying new? Find the right VA and Ah for your needs.
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
              Recharge your battery bank from the sun during the day.
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
