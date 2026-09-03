import type { Metadata } from 'next'
import Link from 'next/link'
import SolarPanelSizeCalculator from '@/components/calculators/SolarPanelSizeCalculator'
import PageHero from '@/components/PageHero'
import { ROOF_SQFT_PER_KW, recommendSystemSize } from '@/lib/calc/solar'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/solar/panel-size-calculator'

const example = recommendSystemSize({ monthlyUnits: 300, offsetPercent: 100 })

const ROOF_AREA_SIZES = [1, 1.5, 2, 3, 5, 7.5, 10]

export const metadata: Metadata = {
  title: 'Solar Panel Size Calculator 2026 — System kW & Roof Area (India)',
  description:
    'Find the rooftop solar system size (kW) and roof area you need to offset your electricity bill, from your monthly consumption and target offset percentage.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solar Panel Size Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Solar', path: '/solar' },
  { name: 'Panel Size Calculator', path: PATH },
])

const faqs = [
  {
    q: 'How is recommended system size calculated?',
    a: 'Recommended kW = (monthly units × offset %) ÷ (4 units/kW/day × 30 days) — a standard planning assumption of about 4 units generated per kW installed per day, averaged across the year for Indian conditions.',
  },
  {
    q: 'Why does the calculator round to the nearest 0.5 kW?',
    a: 'Rooftop solar systems are typically sized and quoted in half-kW increments based on standard panel and inverter combinations, so a rounded figure is more useful for getting real quotes.',
  },
  {
    q: 'Should I target 100% offset or more?',
    a: 'It depends on your state\'s net-metering rules. If your DISCOM credits exported units well, sizing above 100% can make sense; if export credit is low, sizing closer to 100% (or your actual daytime usage) usually gives the best payback. See our net metering calculator.',
  },
  {
    q: 'Does roof shading affect this?',
    a: 'Yes — this calculator assumes shadow-free roof space. Partial shading (from a water tank, trees, or a neighbouring building) reduces effective generation per panel and may mean you need more roof area than shown here for the same output.',
  },
  {
    q: 'How much roof space do I need for a typical system?',
    a: `Roughly ${ROOF_SQFT_PER_KW} sq ft per kW under standard planning assumptions — so a 1 kW system needs about ${ROOF_SQFT_PER_KW} sq ft, 3 kW needs about ${3 * ROOF_SQFT_PER_KW} sq ft, and 5 kW needs about ${5 * ROOF_SQFT_PER_KW} sq ft. See the reference table above for more sizes.`,
  },
  {
    q: 'Does panel orientation affect how much roof space I need?',
    a: 'Yes — a south-facing, unshaded roof gets the most output per panel, so it needs the least area for a given kW. East/west-facing or partially shaded roofs generate less per panel, so you may need extra panels (and area) to hit the same target system size.',
  },
  {
    q: 'What if my roof isn\'t a simple rectangle?',
    a: 'Installers work around vents, water tanks, staircases and irregular shapes routinely — the sq ft figures here are a planning estimate assuming a clear rectangular area. An installer\'s site survey will confirm exactly how many panels actually fit your specific roof.',
  },
  {
    q: 'Should I size my system for my whole house or just my AC load?',
    a: 'Size for your total household consumption, not just one appliance — but if AC is your single biggest load, make sure it\'s reflected in the "monthly units" figure you enter, since undersizing around it is a common mistake. See our AC running cost calculator to check that load specifically.',
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

export default function SolarPanelSizePage() {
  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'Panel Size Calculator', href: '/solar/panel-size-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Solar hub
          </>
        }
        h1="Solar Panel Size Calculator"
        subtitle="Find the rooftop solar system size and roof area you need, from your monthly electricity consumption and how much of your bill you want to offset."
        stats={[
          { icon: '☀️', big: '~4u/kW/day', small: 'Generation assumption', tone: 'hub' },
          { icon: '📐', big: '~100 sqft/kW', small: 'Roof space', tone: 'hub' },
          { icon: '⚙️', big: '0.5 kW', small: 'Sizing increments', tone: 'hub' },
          { icon: '📊', big: '20–150%', small: 'Offset range', tone: 'hub' },
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
          A household using <strong>300 units/month</strong> aiming for a{' '}
          <strong>100% offset</strong> needs about a{' '}
          <strong>{example.recommendedKw} kW</strong> system, needing roughly{' '}
          <strong>{example.roofAreaSqFt} sq ft</strong> of roof space.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Find your system size
        </h2>
        <SolarPanelSizeCalculator />
      </section>

      <section aria-labelledby="roof-space" className="mb-10">
        <h2 id="roof-space" className="font-display mb-2 text-2xl font-semibold">
          How Much Roof Space Do You Actually Need?
        </h2>
        <p className="mb-4 text-ash/70">
          A quick reference at ~{ROOF_SQFT_PER_KW} sq ft per kW — real space
          needed varies with panel efficiency, spacing and roof layout.
        </p>
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline bg-mist">
              <tr>
                <th className="px-4 py-2 font-semibold">System size</th>
                <th className="px-4 py-2 text-right font-semibold">Roof area needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {ROOF_AREA_SIZES.map((kw) => (
                <tr key={kw}>
                  <td className="px-4 py-2 font-medium">{kw} kW</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {Math.round(kw * ROOF_SQFT_PER_KW)} sq ft
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="shading" className="mb-10">
        <h2 id="shading" className="font-display mb-2 text-2xl font-semibold">
          How Shading and Orientation Affect Your Effective System Size
        </h2>
        <div className="space-y-3 text-ash/80">
          <p>
            The roof-area figures above assume unshaded, well-oriented space.
            A south-facing roof with no obstructions gets close to the
            standard generation assumption per panel; east- or west-facing
            roofs generate somewhat less through the day, and any shading —
            from a water tank, parapet, tree or neighbouring building — cuts
            output further on the affected panels.
          </p>
          <p>
            In practice this means a shaded or poorly-oriented roof may need
            <em> more </em> panels (and more area) than the table above to
            reach the same effective kW — an installer&apos;s site survey,
            which checks sun-path and obstructions directly, is the only way
            to confirm your roof&apos;s real capacity.
          </p>
        </div>
      </section>

      <section aria-labelledby="ac-load" className="mb-10">
        <h2 id="ac-load" className="font-display mb-2 text-2xl font-semibold">
          System Size vs. Your AC and Appliance Load
        </h2>
        <p className="mb-4 text-ash/80">
          Your &quot;monthly units&quot; input should reflect your real
          household consumption, not just base lighting and fans — AC in
          particular can be the single biggest line on your bill, so leaving
          it out will undersize your system. If you don&apos;t know that
          number yet, check it with the calculators below before sizing your
          system.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/ac/bill-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>❄️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC running cost
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Find your AC&apos;s share of your monthly units.
            </p>
          </Link>
          <Link
            href="/appliances"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Appliance calculators
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Fridge, fan and other everyday loads.
            </p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Solar ROI calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See payback and savings for this system size.
            </p>
          </Link>
          <Link
            href="/solar/subsidy-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>💸</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              PM Surya Ghar subsidy
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Check your subsidy amount for this size.
            </p>
          </Link>
          <Link
            href="/solar/net-metering-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔄</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Net metering earnings
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Sizing above 100%? See what the surplus is worth.
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
