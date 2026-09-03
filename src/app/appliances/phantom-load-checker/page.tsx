import type { Metadata } from 'next'
import Link from 'next/link'
import PhantomLoadChecker from '@/components/calculators/PhantomLoadChecker'
import PageHero from '@/components/PageHero'
import discomsJson from '@/data/discoms.json'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/phantom-load-checker'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const rate = marginalRatePerUnit('TNEB')
const exampleWatts = 8 + 12 + 3
const exampleAnnual = ((exampleWatts * 24) / 1000) * 365 * rate

export const metadata: Metadata = {
  title: 'Phantom Load / Standby Power Checker 2026 — India',
  description:
    'Find out what your always-on standby devices (router, set-top box, chargers left plugged in) cost you over a year, priced at your real DISCOM tariff.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Phantom Load / Standby Power Checker',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Phantom Load Checker', path: PATH },
])

const faqs = [
  {
    q: 'What is a "phantom load" or "standby power"?',
    a: 'It\'s the electricity a device draws while switched "off" but still plugged in and connected to power — set-top boxes, routers, and chargers with no device attached are common examples. Individually small, but they run 24/7, 365 days a year.',
  },
  {
    q: 'How much does standby power actually add up to?',
    a: `A modest handful of always-on devices (router + set-top box + a TV left on standby) can add roughly ${formatINR(exampleAnnual)}/year in Tamil Nadu at our example wattages — check the calculator above with your own devices and DISCOM for your real figure.`,
  },
  {
    q: 'Which devices are the worst offenders for standby power?',
    a: 'Set-top boxes and older inverters/UPS units tend to draw the most in standby mode among common household devices — routers are lower individually but run continuously in nearly every home, so they add up too.',
  },
  {
    q: 'Should I unplug everything when not in use?',
    a: 'For devices you don\'t need instantly available (chargers with nothing attached, appliances used rarely), yes — a power strip with a physical switch makes this easy. For a router you rely on, or a set-top box that needs to stay connected for scheduled recordings, the convenience trade-off may not be worth a few rupees a month.',
  },
  {
    q: 'Are these standby wattage figures accurate for my specific device?',
    a: 'They\'re commonly cited planning estimates for typical devices, not a measurement of your specific unit — a plug-in power meter gives an exact reading if you want precision for a particular device.',
  },
  {
    q: 'Is standby power priced the same as normal usage?',
    a: 'Yes — like any other load, standby draw adds to your total consumption and is priced at your marginal (top-slab) rate, since it\'s on top of whatever else you already use.',
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

export default function PhantomLoadPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Phantom Load Checker', href: '/appliances/phantom-load-checker' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliances hub
          </>
        }
        h1="Phantom Load / Standby Power Checker"
        subtitle={
          <>
            Devices that stay plugged in but &ldquo;off&rdquo; still draw
            power around the clock. Tick which ones apply to your home and see
            what it costs you over a year.
          </>
        }
        stats={[
          { icon: '🔄', big: '24/7', small: 'Always drawing', tone: 'hub' },
          { icon: '🔌', big: '1-15W', small: 'Typical device range', tone: 'hub' },
          { icon: '👻', big: '8', small: 'Common devices checked', tone: 'hub' },
          { icon: '📊', big: 'Real tariff', small: 'Priced on your DISCOM', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Check your standby load
        </h2>
        <PhantomLoadChecker discoms={liveDiscoms} />
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/appliances/household-bill-builder"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🏠</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Household bill builder
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See your full appliance-by-appliance bill.
            </p>
          </Link>
          <Link
            href="/electricity/appliance-cost-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔋</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Any appliance cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              From its wattage and daily hours.
            </p>
          </Link>
          <Link
            href="/electricity"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>⚡</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Electricity bill calculators
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See your full monthly bill for your state.
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
