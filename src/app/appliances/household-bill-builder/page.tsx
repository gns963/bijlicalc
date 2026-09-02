import type { Metadata } from 'next'
import Link from 'next/link'
import ApplianceBuilder from '@/components/calculators/ApplianceBuilder'
import PageHero from '@/components/PageHero'
import { ALL_APPLIANCES, APPLIANCE_CATEGORIES } from '@/data/appliances'
import discomsJson from '@/data/discoms.json'
import { computeApplianceBuilder, applianceMonthlyUnits } from '@/lib/calc/applianceBuilder'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { getTariff } from '@/lib/calc/electricity'
import { formatINR, formatIsoDate } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/household-bill-builder'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)
const liveStateCount = new Set(liveDiscoms.map((d) => d.state)).size
const applianceCount = ALL_APPLIANCES.length

const rate = marginalRatePerUnit('TNEB')
const rankedAppliances = [...ALL_APPLIANCES]
  .map((a) => ({ ...a, monthlyUnits: applianceMonthlyUnits({ watts: a.watts, hoursPerDay: a.typicalHoursPerDay }) }))
  .sort((a, b) => b.monthlyUnits - a.monthlyUnits)
  .slice(0, 8)

// -----------------------------------------------------------------------
// Trust-section citation: a real DISCOM tariff file's own source metadata,
// not an abstract accuracy claim. MSEDCL chosen for its specific, dated
// citation (MERC MYT order) and monthly billing cycle (no bi-monthly
// ambiguity to explain alongside a trust claim).
const citationTariff = getTariff('MSEDCL')

// Formula worked example, computed live so it can never drift from what
// applianceMonthlyUnits() actually returns.
const formulaExample = applianceMonthlyUnits({ watts: 1500, hoursPerDay: 8 })

// -----------------------------------------------------------------------
// "A real household" worked example — a realistic Maharashtra appliance
// mix, priced through MSEDCL's real monthly slab tariff via the SAME
// engine the builder above uses (computeApplianceBuilder), not restated
// by hand.
const exampleHouseholdItems = [
  { id: 'ac', name: 'Split AC 1.5 Ton (3-star)', watts: 1550, hoursPerDay: 6 },
  { id: 'fan1', name: 'Ceiling Fan', watts: 70, hoursPerDay: 12 },
  { id: 'fan2', name: 'Ceiling Fan', watts: 70, hoursPerDay: 12 },
  { id: 'fridge', name: 'Refrigerator 200L (3-star)', watts: 150, hoursPerDay: 24 },
  { id: 'tv', name: 'LED TV 43"', watts: 80, hoursPerDay: 5 },
  { id: 'geyser', name: 'Storage Geyser 15L (5-star)', watts: 2000, hoursPerDay: 1 },
]
const exampleResult = computeApplianceBuilder('MSEDCL', exampleHouseholdItems)
const exampleRate = marginalRatePerUnit('MSEDCL')

export const metadata: Metadata = {
  title: 'Appliance Electricity Cost Calculator — Household Bill Builder (India)',
  description:
    'See what each appliance costs you, and your combined household bill, priced through your real DISCOM\'s progressive slab tariff — with a live alert when adding a device pushes you into a costlier slab.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Appliance Electricity Cost Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Appliances', path: '/appliances' },
  { name: 'Household Bill Builder', path: PATH },
])
const datasetLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Common home appliance power consumption (India)',
  description:
    'Typical wattage and daily-use reference figures for common Indian household appliances, used to estimate monthly electricity units and cost.',
  url: `${SITE}${PATH}#wattage-chart`,
  variableMeasured: 'Power consumption (watts)',
}

const faqs = [
  {
    q: 'Which appliance consumes the most electricity in an Indian home?',
    a: 'Air conditioners, water geysers and refrigerators are typically the top three — ACs and geysers because of their high wattage, and refrigerators because they run continuously. Add your own mix above to see which one dominates your specific household.',
  },
  {
    q: 'How is appliance electricity cost calculated?',
    a: 'Each appliance\'s monthly units = (wattage × hours used per day × 30 days) / 1000. All your appliances\' units are then summed into one household total and priced through your real DISCOM\'s progressive slab tariff — not each appliance billed separately.',
  },
  {
    q: 'What is 1 unit of electricity?',
    a: '1 unit = 1 kWh (kilowatt-hour) — the energy a 1000-watt appliance uses running for one hour. It\'s the billing unit every DISCOM in India uses on your meter and bill.',
  },
  {
    q: 'How many units does an AC consume per hour?',
    a: 'A typical 1.5-ton 3-star split AC draws roughly 1.5-1.6 units per hour of continuous run-time; a 5-star unit of the same size draws less, around 1.2-1.3 units per hour — add yours above with your actual daily hours for a precise figure.',
  },
  {
    q: 'How much electricity does a ceiling fan use per day?',
    a: `A standard ceiling fan (about 70W) run 12 hours a day uses roughly ${applianceMonthlyUnits({ watts: 70, hoursPerDay: 12 })} units a month — a BLDC fan of the same airflow can use roughly a third of that for the same hours.`,
  },
  {
    q: 'Fridge ka bill kitna aata hai mahine mein?',
    a: `For a typical 200L 3-star fridge running continuously, expect somewhere around ${applianceMonthlyUnits({ watts: 150, hoursPerDay: 24 })} units a month at the reference wattage used here — your real bill impact depends on your fridge's actual rating label and duty cycle, and the tariff slab it lands you in. Add it to the builder above for your own DISCOM's real number.`,
  },
  {
    q: 'Ceiling fan kitne watt ka hota hai?',
    a: 'A standard induction-motor ceiling fan typically draws 60-75 watts; a modern BLDC ceiling fan draws roughly 25-30 watts for similar airflow — check your own fan\'s rating label for its exact figure.',
  },
  {
    q: 'Can I use this calculator for a shop or office (commercial connection)?',
    a: 'The household builder above is scoped to residential/domestic connection types. For a shop or office, use our full DISCOM bill calculators under the Electricity hub and select the Commercial connection type there — commercial slabs and fixed charges differ from domestic ones.',
  },
  {
    q: 'Are the tariff rates on this calculator kept updated?',
    a: 'Yes — every DISCOM tariff file carries its own source link and last-verified date (shown in the trust section above), and we periodically re-check them against the DISCOM\'s own tariff order. Appliance wattage reference figures are separately dated too.',
  },
  {
    q: "How can I reduce my home's electricity bill?",
    a: 'Start with your biggest line items — usually AC and water heating. Raise your AC thermostat a couple of degrees, use geysers on a timer instead of standby-heating, unplug idle chargers and routers when not needed, and prefer BEE 5-star or BLDC appliances where you\'re replacing an old unit. See the tips section above for specifics.',
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

export default function ApplianceBuilderPage() {
  return (
    <>
      <PageHero
        hub="appliance"
        breadcrumb={[
          { label: 'Appliances', href: '/appliances' },
          { label: 'Household Bill Builder', href: '/appliances/household-bill-builder' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🔌</span> Appliances hub
          </>
        }
        h1="Appliance Electricity Cost Calculator — See What Each Device Costs You"
        subtitle={
          <>
            Add your appliances one at a time in our household bill builder
            and watch your total build up — priced through your real
            DISCOM&apos;s <strong>progressive slab tariff</strong>, so you
            see exactly when a new appliance pushes your bill into a
            costlier slab.
          </>
        }
        stats={[
          { icon: '🔌', big: `${applianceCount}+`, small: 'Appliances covered', tone: 'hub' },
          { icon: '🗺️', big: `${liveStateCount}`, small: 'States & UTs', tone: 'hub' },
          { icon: '⚠️', big: 'Slab alerts', small: 'See the crossover', tone: 'caution-amber' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section aria-labelledby="why" className="mb-10">
          <h2 id="why" className="font-display mb-2 text-2xl font-semibold">
            Why appliance-level breakdown matters
          </h2>
          <p className="text-ash/80 dark:text-gazette-cream/70">
            Your electricity bill isn&apos;t one number — it&apos;s the sum of
            every appliance running at its own wattage and hours, all landing
            on the SAME progressive tariff. Because Indian slabs are
            telescopic, an appliance you add doesn&apos;t just cost its own
            units — it can push your whole household&apos;s marginal rate
            higher for everything else too. This builder is the only way to
            see that combined effect, not just each appliance priced in
            isolation.
          </p>
        </section>

        <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
          <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
            Build your household bill
          </h2>
          <ApplianceBuilder discoms={liveDiscoms} />
        </section>

        <section aria-labelledby="trust" className="mb-10 scroll-mt-20">
          <h2 id="trust" className="font-display mb-4 text-2xl font-semibold">
            Why our appliance cost numbers are more accurate
          </h2>
          <p className="mb-4 text-ash/80 dark:text-gazette-cream/70">
            Plenty of appliance calculators sum your wattage and hours, then
            price the total against a generic &ldquo;central tariffs
            database&rdquo; with no visible citation. We don&apos;t do that.
            Every DISCOM in this builder is backed by an actual tariff file
            with a source link and a verification date — so you can check
            our numbers, not just trust them.
          </p>
          <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-semibold tracking-wide text-hub-appliance uppercase">
              Example: {citationTariff.discomName} ({citationTariff.discomCode})
            </p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-ash/50 dark:text-gazette-cream/40">Source</dt>
                <dd>
                  <a
                    href={citationTariff.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass underline"
                  >
                    Official tariff page →
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-ash/50 dark:text-gazette-cream/40">Last verified</dt>
                <dd className="tabular-nums text-ink-navy dark:text-gazette-cream">
                  {formatIsoDate(citationTariff.lastVerified)}
                </dd>
              </div>
              <div>
                <dt className="text-ash/50 dark:text-gazette-cream/40">Verification status</dt>
                <dd className="text-ink-navy dark:text-gazette-cream">{citationTariff.verifiedBy}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-3 text-xs text-ash/50 dark:text-gazette-cream/40">
            Every calculator on this site shows this same tariff-file
            citation — see it on any DISCOM page under the{' '}
            <Link href="/electricity" className="underline hover:text-hub-appliance">
              Electricity hub
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="formula" className="mb-10 scroll-mt-20">
          <h2 id="formula" className="font-display mb-4 text-2xl font-semibold">
            How this calculator works
          </h2>
          <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
            <div className="space-y-2 font-mono text-sm">
              <p className="rounded-lg bg-mist px-3 py-2 dark:bg-slate-800">
                Units (kWh) = (Wattage × Hours per day × 30 days) / 1000
              </p>
              <p className="rounded-lg bg-mist px-3 py-2 dark:bg-slate-800">
                Household total = Σ (each appliance&apos;s units)
              </p>
              <p className="rounded-lg bg-mist px-3 py-2 dark:bg-slate-800">
                Bill = household total priced through your real DISCOM&apos;s progressive slab tariff
              </p>
            </div>
            <p className="mt-3 text-sm text-ash/70 dark:text-gazette-cream/60">
              Example: a <strong>1500W AC</strong> running <strong>8 hrs/day</strong> ={' '}
              1500 × 8 × 30 / 1000 ={' '}
              <strong className="text-hub-appliance">{formulaExample} units/month</strong>.
            </p>
            <p className="mt-3 text-xs text-ash/50 dark:text-gazette-cream/40">
              This is the exact function the builder above uses — not a
              simplified restatement. Every appliance&apos;s units add to one
              running total, which is then priced through the slab structure
              as a whole, so the rate on your last units depends on
              everything you&apos;ve already added.
            </p>
          </div>
        </section>

        <section aria-labelledby="how-to" className="mb-10 scroll-mt-20">
          <h2 id="how-to" className="font-display mb-4 text-2xl font-semibold">
            Step by step: how to use this calculator
          </h2>
          <ol className="space-y-3">
            {[
              'Select your DISCOM/state from the dropdown.',
              'Choose your connection type (residential by default).',
              'Add your appliances one at a time from the dropdown.',
              'Adjust each appliance\'s daily hours to match your real usage.',
              'Review your combined bill breakdown, and any slab-crossing alerts.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-appliance font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-ash/80 dark:text-gazette-cream/70">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="who" className="mb-10 scroll-mt-20">
          <h2 id="who" className="font-display mb-4 text-2xl font-semibold">
            Who can use this calculator
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Homeowners & families', body: 'Spot which single appliance is really driving your bill up, and by how much.' },
              { title: 'Tenants & PG residents', body: 'Estimate your likely electricity share before moving in, from the appliances you\'ll actually use.' },
              { title: 'Shop & office owners', body: 'Switch to a Commercial connection type on our full DISCOM calculators for business premises.' },
              { title: 'Students & young adults', body: 'Budget realistically for your first independent stay, appliance by appliance.' },
              { title: 'Solar panel users', body: <>Compare your household consumption against what a rooftop system would generate — see our <Link href="/solar/roi-calculator" className="underline hover:text-hub-appliance">solar ROI calculator</Link>.</> },
              { title: 'Anyone wanting to save', body: 'Find your biggest line items first — that\'s where cutting usage actually moves the needle.' },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
                <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">{c.title}</p>
                <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="example" className="mb-10 scroll-mt-20">
          <h2 id="example" className="font-display mb-2 text-2xl font-semibold">
            Example calculation — a real household
          </h2>
          <p className="mb-4 text-sm text-ash/60 dark:text-gazette-cream/50">
            A realistic Maharashtra household&apos;s appliance mix, computed
            live through {citationTariff.discomCode}&apos;s real slab tariff
            via the same engine as the builder above:
          </p>
          <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold">Appliance</th>
                  <th className="px-4 py-2 text-right font-semibold">Watt</th>
                  <th className="px-4 py-2 text-right font-semibold">Hours/day</th>
                  <th className="px-4 py-2 text-right font-semibold">Units/month</th>
                  <th className="px-4 py-2 text-right font-semibold">Approx. cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {exampleResult.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{item.watts}W</td>
                    <td className="px-4 py-2 text-right tabular-nums">{item.hoursPerDay}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{item.monthlyUnits}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-hub-appliance">
                      {formatINR(item.monthlyUnits * exampleRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-mist text-ink-navy dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <td className="px-4 py-2 font-semibold" colSpan={3}>
                    Combined total ({exampleResult.totalMonthlyUnits} units, real slab pricing)
                  </td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums" colSpan={2}>
                    {formatINR(exampleResult.bill.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
            The per-appliance &ldquo;approx. cost&rdquo; column is illustrative,
            split at {citationTariff.discomCode}&apos;s top marginal rate
            (₹{exampleRate.toFixed(2)}/unit) — your real bill is the combined
            total on the right, priced through the full progressive slab
            structure, fixed charge and duty together, exactly as the builder
            above computes it.
          </p>
        </section>

        <section aria-labelledby="wattage-chart" className="mb-10 scroll-mt-20">
          <h2 id="wattage-chart" className="font-display mb-2 text-2xl font-semibold">
            Common home appliances — power consumption chart
          </h2>
          <p className="mb-4 text-sm text-ash/60 dark:text-gazette-cream/50">
            Typical wattage by appliance, grouped by category — the exact
            reference data the builder above uses.
          </p>
          <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold">Appliance</th>
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-4 py-2 text-right font-semibold">Typical wattage</th>
                  <th className="px-4 py-2 text-right font-semibold">Typical use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {APPLIANCE_CATEGORIES.flatMap((cat) =>
                  cat.appliances.map((a) => (
                    <tr key={a.name}>
                      <td className="px-4 py-2 font-medium">{a.name}</td>
                      <td className="px-4 py-2 text-ash/60 dark:text-gazette-cream/50">{cat.category}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{a.watts}W</td>
                      <td className="px-4 py-2 text-right tabular-nums">{a.typicalHoursPerDay} hrs/day</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
            These are typical mid-range reference figures for estimation, not
            nameplate guarantees — always check your own appliance&apos;s
            rating label for its exact wattage, since real models vary.
          </p>
        </section>

        <section aria-labelledby="ranked" className="mb-10">
          <h2 id="ranked" className="font-display mb-2 text-2xl font-semibold">
            Biggest electricity consumers in an Indian home
          </h2>
          <p className="mb-4 text-sm text-ash/60 dark:text-gazette-cream/50">
            Ranked by typical monthly units at commonly cited usage patterns —
            computed live from the same reference data the builder above uses,
            priced at a representative ₹{rate.toFixed(2)}/unit (Tamil Nadu top
            slab).
          </p>
          <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
                <tr>
                  <th className="px-4 py-2 font-semibold">Appliance</th>
                  <th className="px-4 py-2 text-right font-semibold">Typical use</th>
                  <th className="px-4 py-2 text-right font-semibold">Units/month</th>
                  <th className="px-4 py-2 text-right font-semibold">Approx. cost/month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline dark:divide-white/10">
                {rankedAppliances.map((a) => (
                  <tr key={a.name}>
                    <td className="px-4 py-2 font-medium">{a.name}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{a.typicalHoursPerDay} hrs/day</td>
                    <td className="px-4 py-2 text-right tabular-nums">{a.monthlyUnits}</td>
                    <td className="px-4 py-2 text-right tabular-nums text-hub-appliance">
                      {formatINR(a.monthlyUnits * rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
            Reference wattage figures are typical mid-range estimates, not
            nameplate guarantees for your specific model — see our{' '}
            <Link href="/appliances" className="underline hover:text-hub-appliance">
              Appliances hub
            </Link>{' '}
            for single-appliance tools with more precise inputs (like the
            fridge calculator, which uses your unit&apos;s own BEE label
            figure).
          </p>
        </section>

        <section aria-labelledby="differ" className="mb-10 scroll-mt-20">
          <h2 id="differ" className="font-display mb-2 text-2xl font-semibold">
            Why your estimate might differ from your actual bill
          </h2>
          <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
            <p>
              Our combined breakdown already includes your DISCOM&apos;s
              fixed/meter charge, fuel cost adjustment (FCA) and electricity
              duty alongside the slab-priced energy charge — unlike a pure
              appliance-level estimate that stops at units × rate. Even so,
              a few things can still make your real bill differ:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Category-specific subsidies</strong> — universal
                (&ldquo;all domestic&rdquo;) schemes are applied
                automatically, but income- or category-linked subsidies (BPL,
                agricultural, etc.) need your specific eligibility, which this
                tool doesn&apos;t currently ask for.
              </li>
              <li>
                <strong>Meter reading and billing-cycle timing</strong> — your
                actual bill covers your DISCOM&apos;s specific reading dates,
                not a clean 30-day month, so real usage days can run a little
                more or less than our monthly assumption.
              </li>
              <li>
                <strong>Rounding and minor local charges</strong> — some
                DISCOMs add small municipal or local-body charges we
                don&apos;t model, and bills round differently than a
                calculator does.
              </li>
              <li>
                <strong>Appliance wattage variance</strong> — our reference
                wattages are typical mid-range figures; your specific model&apos;s
                rating label may differ, especially for older or unusually
                efficient units.
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="tips" className="mb-10">
          <h2 id="tips" className="font-display mb-4 text-2xl font-semibold">
            Tips to reduce your appliance electricity cost
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Switch to BLDC fans',
                body: <>A BLDC ceiling fan uses roughly 60% less power than a standard induction-motor fan for the same airflow — see our <Link href="/appliances/ceiling-fan-cost-calculator" className="underline hover:text-hub-appliance">ceiling fan cost calculator</Link> to size the saving across your home.</>,
              },
              {
                title: 'Keep your AC at 24°C or higher',
                body: <>Each degree below 24°C is commonly cited to add roughly 6% more consumption — see our <Link href="/ac" className="underline hover:text-hub-appliance">AC calculators</Link> for a deeper running-cost breakdown by tonnage and star rating.</>,
              },
              {
                title: 'Unplug standby/phantom loads',
                body: <>Routers, set-top boxes and chargers left plugged in 24/7 add up over a year — check our <Link href="/appliances/phantom-load-checker" className="underline hover:text-hub-appliance">phantom load checker</Link>.</>,
              },
              {
                title: 'Use geysers efficiently',
                body: 'A timer or manual shut-off instead of leaving a geyser on standby-heating all day is commonly cited to save meaningfully on instant/storage geysers alike.',
              },
              {
                title: 'Choose BEE star-rated appliances',
                body: 'A higher star rating directly lowers the wattage or annual kWh figure for the same job — especially impactful on always-on devices like refrigerators.',
              },
            ].map((t) => (
              <div key={t.title} className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
                <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">{t.title}</p>
                <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
            These are commonly cited indicative figures, not guaranteed
            savings for your specific household — your real saving depends on
            your current usage pattern, tariff slab, and the appliance&apos;s
            condition.
          </p>
        </section>

        <section aria-labelledby="related" className="mb-10">
          <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
            Related calculators
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/appliances/inverter-sizing-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>🔌</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Inverter sizing
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Same wattage data, sized for backup power instead.
              </p>
            </Link>
            <Link
              href="/appliances/phantom-load-checker"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>👻</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Phantom load checker
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                What always-on standby devices cost you.
              </p>
            </Link>
            <Link
              href="/ac"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-ac/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>❄️</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                AC calculators
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                A deeper dive into your biggest single line item.
              </p>
            </Link>
            <Link
              href="/electricity"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <span className="text-xl" aria-hidden>⚡</span>
              <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
                Electricity bill calculators
              </p>
              <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                Your full bill from an actual meter reading.
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </main>
    </>
  )
}
