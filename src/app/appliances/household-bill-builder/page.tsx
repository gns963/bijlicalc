import type { Metadata } from 'next'
import Link from 'next/link'
import ApplianceBuilder from '@/components/calculators/ApplianceBuilder'
import PageHero from '@/components/PageHero'
import { ALL_APPLIANCES } from '@/data/appliances'
import discomsJson from '@/data/discoms.json'
import { applianceMonthlyUnits } from '@/lib/calc/applianceBuilder'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/appliances/household-bill-builder'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

const rate = marginalRatePerUnit('TNEB')
const rankedAppliances = [...ALL_APPLIANCES]
  .map((a) => ({ ...a, monthlyUnits: applianceMonthlyUnits({ watts: a.watts, hoursPerDay: a.typicalHoursPerDay }) }))
  .sort((a, b) => b.monthlyUnits - a.monthlyUnits)
  .slice(0, 8)

export const metadata: Metadata = {
  title: 'Household Bill Builder 2026 — Multi-Appliance Cost Calculator (India)',
  description:
    'Add your appliances one at a time and see your combined household electricity bill, priced through your real DISCOM\'s progressive slab tariff — see exactly when adding a load pushes you into a costlier slab.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const webAppLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Household Bill Builder',
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

const faqs = [
  {
    q: 'How is this different from the single-appliance cost calculator?',
    a: 'That tool prices one appliance in isolation, at your DISCOM\'s top (marginal) slab rate. This builder sums ALL your appliances into a combined household total and prices that whole total through the real progressive slab structure — so you see your actual bill, and exactly which slab each addition lands you in, not just each appliance\'s standalone marginal cost.',
  },
  {
    q: 'Why does adding an appliance sometimes show a slab-crossing warning?',
    a: 'Indian electricity tariffs are telescopic — the more you consume, the higher the rate on your last units. When an appliance\'s units push your running household total past a slab boundary, the warning shows you the new, higher rate that now applies to your marginal units.',
  },
  {
    q: 'Are the wattage figures for each appliance accurate for my specific unit?',
    a: 'They\'re typical mid-range reference figures for estimation, not your exact model\'s nameplate rating — check your own appliance\'s rating label or box for a more precise number, and adjust the hours/day slider to match your real usage.',
  },
  {
    q: 'What\'s the difference between "I know my appliances" and "I have my meter reading" mode?',
    a: 'Use appliance-wise mode if you want to understand what\'s driving your bill, appliance by appliance. Use meter-reading mode if you just want a quick total-bill estimate from the units figure already on your meter or last bill, without listing every appliance individually.',
  },
  {
    q: 'Does this include appliances not in the dropdown list?',
    a: 'Not directly — but you can approximate an unlisted appliance by adding a similar-wattage item from the list and adjusting its hours, or use the single-appliance calculator with your own wattage figure and add its cost manually to this builder\'s total.',
  },
  {
    q: 'Why do fridges and always-on devices contribute so much even at low wattage?',
    a: 'It\'s about hours, not just watts — a 150W fridge running 24 hours a day (even with a duty cycle) accumulates more monthly units than many higher-wattage appliances used briefly. See the ranked list below for how continuous-use appliances compare to high-power intermittent ones.',
  },
  {
    q: 'How can I lower my combined household bill?',
    a: 'Start with your biggest contributors (see the ranked list below) — AC and water heating dominate most Indian homes\' bills. Reducing their hours, upgrading to a higher star rating, or shifting usage doesn\'t just save on that appliance directly — it can also pull your whole household out of a higher tariff slab.',
  },
  {
    q: 'Does this builder use my real DISCOM tariff?',
    a: 'Yes — pick your DISCOM and the combined total is priced through that state\'s real, source-cited, progressive slab structure, not a flat national average.',
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
        h1="Household Bill Builder"
        subtitle={
          <>
            Add your appliances one at a time and watch your household total
            build up — priced through your real DISCOM&apos;s{' '}
            <strong>progressive slab tariff</strong>, so you can see exactly
            when a new appliance pushes your bill into a costlier slab.
          </>
        }
        stats={[
          { icon: '🏠', big: '20+', small: 'Appliances', tone: 'hub' },
          { icon: '📶', big: 'Real slabs', small: 'Not a flat rate', tone: 'hub' },
          { icon: '⚠️', big: 'Slab alerts', small: 'See the crossover', tone: 'caution-amber' },
          { icon: '🗺️', big: '36 states', small: 'DISCOM coverage', tone: 'hub' },
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

      <section aria-labelledby="tips" className="mb-10">
        <h2 id="tips" className="font-display mb-4 text-2xl font-semibold">
          Simple ways to cut your biggest line items
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: 'AC', body: 'Raise the thermostat 1-2°C and get coils/filters cleaned each season — commonly cited to save roughly ₹300-600/month on heavy AC usage.' },
            { title: 'Geyser', body: 'Use a timer or manual shut-off instead of leaving it on standby-heating all day — commonly cited to save roughly ₹300-600/month on instant/storage geysers.' },
            { title: 'Fridge', body: 'Clean the condenser coils twice a year and keep the door seal tight — commonly cited to save roughly ₹100-300/month on an aging or dusty unit.' },
            { title: 'Fans', body: 'A BLDC ceiling fan uses roughly a third of the power of an old induction-motor fan for the same airflow — a modest but real saving across multiple fans run for many hours daily.' },
          ].map((t) => (
            <div key={t.title} className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
              <p className="font-display font-bold text-ink-navy dark:text-gazette-cream">{t.title}</p>
              <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">{t.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
          These are commonly cited indicative ranges, not guaranteed savings
          for your specific household — your real saving depends on your
          current usage pattern, tariff slab, and the appliance&apos;s
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
