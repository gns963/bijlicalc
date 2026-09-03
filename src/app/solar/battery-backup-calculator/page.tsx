import type { Metadata } from 'next'
import Link from 'next/link'
import SolarBatteryBackupCalculator from '@/components/calculators/SolarBatteryBackupCalculator'
import PageHero from '@/components/PageHero'
import { sizeSolarBattery } from '@/lib/calc/solar'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/solar/battery-backup-calculator'

const example = sizeSolarBattery({ dailyLoadKwh: 3, daysOfAutonomy: 1, chemistry: 'lead-acid' })

export const metadata: Metadata = {
  title: 'Solar Battery Backup Calculator 2026 — kWh Sizing (India)',
  description:
    'Size the battery bank for your solar system, from your critical daily load and days of autonomy — with lead-acid vs lithium depth-of-discharge compared.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solar Battery Backup Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Solar', path: '/solar' },
  { name: 'Battery Backup Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Why does lithium need less rated capacity than lead-acid for the same job?',
    a: 'Lead-acid batteries are conventionally limited to about 50% usable depth of discharge for reasonable lifespan, while lithium (LiFePO4) batteries can be safely used to around 90% — so a lithium battery needs a smaller rated capacity to deliver the same usable energy.',
  },
  {
    q: 'What should I count as "critical load"?',
    a: 'The essentials you actually want covered during low-sun periods — typically lights, fans, fridge, router and phone charging — rather than your whole household load including AC, which is usually left off a backup circuit.',
  },
  {
    q: 'Does this calculator size the solar panels too?',
    a: 'No — this sizes only the battery bank. For the panel/system size itself, see our solar panel size calculator.',
  },
  {
    q: 'Why size for more than 1 day of autonomy?',
    a: 'A string of cloudy or rainy days can mean your panels don\'t fully recharge the battery overnight. Extra autonomy days act as a buffer so backup power doesn\'t run out during a low-generation stretch.',
  },
  {
    q: 'How is battery backup sizing different from grid-tied solar sizing?',
    a: 'Grid-tied sizing (see our panel size calculator) is about how much of your annual consumption solar generation offsets — it works fine with no battery at all if you have reliable grid supply and net metering. Battery backup sizing is a separate question: how much stored energy you need to ride out an outage, sized around your critical loads and how long you want them covered, independent of your panel size.',
  },
  {
    q: 'Tubular lead-acid or lithium — which should I choose?',
    a: 'Lead-acid costs less upfront but needs periodic maintenance (water top-ups) and typically has a shorter usable lifespan. Lithium (LiFePO4) costs more upfront but is maintenance-free, generally lasts longer, and gives more usable capacity per rated kWh thanks to its higher depth of discharge. For many new installations lithium\'s total cost of ownership is increasingly competitive despite the higher sticker price.',
  },
  {
    q: 'Does a hybrid inverter matter for battery backup?',
    a: 'Yes — a hybrid inverter is what allows automatic switching between grid, solar and battery power. A plain grid-tied (non-hybrid) inverter shuts down completely during a grid outage as a safety measure, regardless of how much battery capacity you have, so battery backup requires a hybrid or off-grid-capable inverter.',
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

export default function SolarBatteryBackupPage() {
  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'Battery Backup Calculator', href: '/solar/battery-backup-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Solar hub
          </>
        }
        h1="Solar Battery Backup Calculator"
        subtitle="Size the battery bank for your solar system, so essential loads stay powered overnight or through a run of cloudy days."
        stats={[
          { icon: '🔋', big: '50%', small: 'Lead-acid DoD', tone: 'hub' },
          { icon: '🔋', big: '90%', small: 'Lithium DoD', tone: 'hub' },
          { icon: '⚙️', big: '90%', small: 'System efficiency', tone: 'hub' },
          { icon: '📆', big: '1–5', small: 'Days of autonomy', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5"
      >
        <h2
          id="worked-example"
          className="font-display text-sm font-semibold tracking-wide text-brass uppercase"
        >
          Worked example
        </h2>
        <p className="mt-2 text-ash/80">
          A <strong>3 kWh daily critical load</strong> with{' '}
          <strong>1 day of autonomy</strong> on lead-acid batteries needs about{' '}
          <strong>{example.recommendedCapacityKwh} kWh</strong> of rated
          battery capacity.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Size your battery bank
        </h2>
        <SolarBatteryBackupCalculator />
      </section>

      <section aria-labelledby="sizing-diff" className="mb-10">
        <h2 id="sizing-diff" className="font-display mb-2 text-2xl font-semibold">
          Battery Backup Sizing vs. Grid-Tied Solar Sizing
        </h2>
        <p className="text-ash/80">
          These are two different sizing questions, easy to conflate. Sizing
          your <strong>solar panels</strong> (see our{' '}
          <Link href="/solar/panel-size-calculator" className="text-brass underline">
            panel size calculator
          </Link>
          ) is about how many units you generate over a year to offset your
          bill — a grid-tied system with no battery at all still does this
          job fine, using net metering to bank surplus daytime generation.
          Sizing a <strong>battery</strong> is a separate question: how much
          energy you can store to keep specific loads running when the grid
          — and the sun — aren&apos;t available. A well-designed hybrid
          system does both, but they&apos;re calculated independently.
        </p>
      </section>

      <section aria-labelledby="battery-types" className="mb-10">
        <h2 id="battery-types" className="font-display mb-4 text-2xl font-semibold">
          Battery Types Available in India
        </h2>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline bg-mist">
              <tr>
                <th className="px-4 py-2 font-semibold"> </th>
                <th className="px-4 py-2 font-semibold">Tubular lead-acid</th>
                <th className="px-4 py-2 font-semibold">Lithium (LiFePO4)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              <tr>
                <td className="px-4 py-2 font-medium">Upfront cost</td>
                <td className="px-4 py-2">Lower</td>
                <td className="px-4 py-2">Higher</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Usable depth of discharge</td>
                <td className="px-4 py-2">~50%</td>
                <td className="px-4 py-2">~90%</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Typical lifespan</td>
                <td className="px-4 py-2">Shorter, more charge cycles degrade it faster</td>
                <td className="px-4 py-2">Longer, holds capacity over more cycles</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Maintenance</td>
                <td className="px-4 py-2">Periodic water top-ups needed</td>
                <td className="px-4 py-2">Maintenance-free</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Weight &amp; footprint</td>
                <td className="px-4 py-2">Heavier, bulkier per kWh</td>
                <td className="px-4 py-2">Lighter, more compact per kWh</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="hours-needed" className="mb-10">
        <h2 id="hours-needed" className="font-display mb-2 text-2xl font-semibold">
          How Many Hours of Backup Do You Actually Need?
        </h2>
        <p className="mb-4 text-ash/80">
          Start from what you actually want to keep running, not your whole
          house. A common approach: list your critical loads (lights, fans,
          fridge, router, phone charging), add up their wattage, and multiply
          by how many hours you want them covered to get your daily load in
          kWh — the input the calculator above uses.
        </p>
        <div className="rounded-xl bg-mist p-5">
          <p className="text-sm font-semibold text-ink-navy">
            Typical &quot;essentials only&quot; combo
          </p>
          <p className="mt-1 text-sm text-ash/70">
            A few LED lights + 2 ceiling fans + a fridge + a router/phone
            charging together draw roughly 250–350W continuously — over a
            4-hour outage that&apos;s about 1–1.4 kWh of daily load, before
            accounting for battery losses. Use the exact wattages from your
            own appliances for a real figure; our{' '}
            <Link href="/appliances/inverter-backup-time-calculator" className="text-brass underline">
              inverter backup time calculator
            </Link>{' '}
            works the other direction — telling you how long a battery you
            already own will last for a given load.
          </p>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solar/panel-size-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Solar panel size
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Size the panels that will recharge this battery bank.
            </p>
          </Link>
          <Link
            href="/appliances/inverter-backup-time-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔋</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Inverter backup time
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Already have a battery? Check how long it lasts.
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Solar ROI calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See the payback on the panels themselves.
            </p>
          </Link>
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
