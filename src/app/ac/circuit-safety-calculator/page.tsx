import type { Metadata } from 'next'
import Link from 'next/link'
import AcCircuitSafetyCalculator from '@/components/calculators/AcCircuitSafetyCalculator'
import AcCircuitSafetyTable from '@/components/ac/AcCircuitSafetyTable'
import PageHero from '@/components/PageHero'
import { recommendAcCircuit } from '@/lib/calc/ac'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/ac/circuit-safety-calculator'

const example = recommendAcCircuit({ ratedCurrentAmps: 6 })

export const metadata: Metadata = {
  title: 'AC Circuit Safety Calculator 2026 — MCB & Wire Gauge Sizing (India)',
  description:
    'General planning guidance for the MCB rating and copper wire gauge for an AC circuit, from its rated current. Not a substitute for a licensed electrician.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AC Circuit Safety Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'AC', path: '/ac' },
  { name: 'Circuit Safety Calculator', path: PATH },
])

const faqs = [
  {
    q: 'Is this a substitute for a licensed electrician?',
    a: 'No. This is general planning guidance to help you understand roughly what to expect before an installation — the final MCB and wire specification must be confirmed by a licensed electrician, accounting for your specific wire run length, ambient temperature, conduit fill and local electrical code.',
  },
  {
    q: 'Why does the calculator add 25% headroom to the rated current?',
    a: 'AC compressors draw a brief surge current on startup well above their steady running current, and continuous-duty loads like ACs are conventionally derated for safety margin — a 25% headroom over nameplate rated current is a common starting point for sizing.',
  },
  {
    q: 'Why is a dedicated circuit recommended for an AC?',
    a: 'Sharing a circuit with other high-load appliances increases the risk of nuisance tripping or overheating. A dedicated MCB and wire run sized for the AC alone is standard practice for split and window AC installations in India.',
  },
  {
    q: 'What standard governs residential AC wiring in India?',
    a: 'IS 732 (Code of Practice for Electrical Wiring Installations) is the relevant Indian Standard, alongside your local electricity board\'s wiring rules. A licensed electrician will apply these correctly for your specific site.',
  },
  {
    q: 'What happens if the MCB is undersized for the AC?',
    a: 'An undersized MCB will trip repeatedly, especially on the compressor\'s startup surge — a nuisance, but the safe failure mode. It will not by itself cause a fire; it protects the circuit by cutting power before the wiring is overloaded.',
  },
  {
    q: 'What happens if the wire gauge is undersized?',
    a: 'This is the genuinely dangerous scenario: an undersized wire can overheat under sustained AC load even if the MCB doesn\'t trip, which is a real fire risk. This is exactly why wire sizing should be confirmed by a licensed electrician, not estimated from a table alone.',
  },
  {
    q: 'Can I run two ACs off the same circuit?',
    a: 'Not recommended. Standard practice in India is one dedicated MCB and wire run per AC unit, sized for that unit alone — sharing a circuit between two ACs risks nuisance tripping at best and overloading at worst.',
  },
  {
    q: 'Does the reference table below apply to window ACs the same way?',
    a: 'The same current-to-MCB-to-wire logic applies, but window ACs are typically lower tonnage and often run off a standard 15A/16A domestic socket circuit rather than a dedicated line — check your specific unit\'s nameplate current against the table regardless of AC type.',
  },
  {
    q: 'My AC\'s actual nameplate current is different from the reference table — which do I use?',
    a: 'Always use your own unit\'s actual nameplate current, not the table\'s tonnage-based estimate — the table is a general planning reference for browsing, while the calculator above and your electrician should work from your specific AC\'s real rated current.',
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

export default function AcCircuitSafetyPage() {
  return (
    <>
      <PageHero
        hub="ac"
        breadcrumb={[
          { label: 'AC', href: '/ac' },
          { label: 'Circuit Safety Calculator', href: '/ac/circuit-safety-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>❄️</span> AC hub
          </>
        }
        h1="AC Circuit Safety Calculator"
        subtitle="General planning guidance for the MCB rating and copper wire gauge an AC circuit typically needs. This is a starting point for conversations with your electrician — not a final specification."
        stats={[
          { icon: '🛡️', big: '+25%', small: 'Safety headroom', tone: 'hub' },
          { icon: '📘', big: 'IS 732', small: 'Reference standard', tone: 'hub' },
          { icon: '🔌', big: 'Dedicated', small: 'Circuit recommended', tone: 'hub' },
          { icon: '⚠️', big: 'Not final', small: 'Verify with electrician', tone: 'caution-amber' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-caution-amber bg-paper p-5"
      >
        <h2
          id="worked-example"
          className="font-display text-sm font-semibold tracking-wide text-caution-amber uppercase"
        >
          Worked example — general guidance only
        </h2>
        <p className="mt-2 text-ash/80">
          An AC rated at <strong>6A</strong> would typically call for around a{' '}
          <strong>{example.recommendedMcbAmps}A MCB</strong> and{' '}
          <strong>{example.recommendedWireSqmm} sq mm</strong> copper wire —
          always have this confirmed by a licensed electrician for your
          specific installation.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Get your circuit guidance
        </h2>
        <AcCircuitSafetyCalculator />
      </section>

      <section aria-labelledby="how" className="mb-10">
        <h2 id="how" className="font-display mb-4 text-2xl font-semibold">
          How this is calculated
        </h2>
        <div className="space-y-3 text-ash/80">
          <p>
            <strong>Design current.</strong> We take the AC&apos;s nameplate
            rated current and add 25% headroom, since compressor motors draw a
            brief starting surge above their running current.
          </p>
          <p>
            <strong>MCB rating.</strong> The next standard MCB size at or
            above the design current (from 6A, 10A, 16A, 20A, 25A, 32A, 40A…)
            is recommended.
          </p>
          <p>
            <strong>Wire gauge.</strong> We match the MCB rating to a copper
            wire cross-section commonly used in Indian residential wiring
            practice for that current range — a starting reference, not a
            calculation of your specific run&apos;s voltage drop or heat
            dissipation.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="reference-table"
        className="mb-10 rounded-xl border border-caution-amber/25 bg-caution-amber/5 p-5"
      >
        <h2
          id="reference-table"
          className="font-display mb-2 text-2xl font-semibold text-ink-navy"
        >
          Typical MCB &amp; wire gauge by AC tonnage — general reference
        </h2>
        <p className="mb-4 text-sm text-ash/70">
          For browsing only, not a specification — always size a real
          installation from the AC&apos;s own nameplate current using the
          calculator above, then have it confirmed by a licensed electrician.
        </p>
        <AcCircuitSafetyTable />
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/ac/power-consumption-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔢</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Power consumption
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Same rated current, for power draw and units.
            </p>
          </Link>
          <Link
            href="/ac/tonnage-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              AC tonnage calculator
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Still choosing an AC size? Start here.
            </p>
          </Link>
          <Link
            href="/appliances/inverter-sizing-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>🔌</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Inverter sizing
            </p>
            <p className="mt-1 text-xs text-ash/60">
              Planning backup power for other circuits too?
            </p>
          </Link>
          <Link
            href="/solar/roi-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm"
          >
            <span className="text-xl" aria-hidden>☀️</span>
            <p className="font-display mt-2 font-bold text-ink-navy">
              Offset it with solar
            </p>
            <p className="mt-1 text-xs text-ash/60">
              See the payback on a rooftop system sized for AC-heavy usage.
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

      <footer className="rounded-lg bg-caution-amber/10 p-4 text-sm text-ash/70">
        <p>
          ⚠ <strong>Safety notice:</strong> electrical wiring carries real
          fire and shock risk if sized or installed incorrectly. This
          calculator gives general planning guidance derived from common
          Indian residential wiring practice — it is not a substitute for
          assessment and installation by a licensed electrician, and does not
          account for wire run length, ambient temperature, conduit fill or
          your local electrical code in detail.
        </p>
      </footer>

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
