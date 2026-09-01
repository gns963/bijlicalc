import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import LeadGenForm from '@/components/LeadGenForm'
import QuickBillEstimate from '@/components/QuickBillEstimate'
import discomsJson from '@/data/discoms.json'
import tnebJson from '@/data/tariffs/tneb.json'
import { parseTariffFile } from '@/data/tariffs/_schema'
import { calculateAcCost } from '@/lib/calc/ac'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR, formatIsoDate } from '@/lib/format'
import { itemListLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'

const tariff = parseTariffFile(tnebJson)

// Map a live DISCOM code → its calculator route. Extend as we add DISCOMs.
const CALCULATOR_ROUTES: Record<string, string> = {
  TNEB: '/electricity/tneb-bill-calculator',
  MSEDCL: '/electricity/msedcl-bill-calculator',
  UPPCL: '/electricity/uppcl-bill-calculator',
  BESCOM: '/electricity/bescom-bill-calculator',
  KSEB: '/electricity/kseb-bill-calculator',
  WBSEDCL: '/electricity/wbsedcl-bill-calculator',
  MGVCL: '/electricity/gujarat-electricity-bill-calculator',
  JVVNL: '/electricity/rajasthan-electricity-bill-calculator',
  PSPCL: '/electricity/punjab-electricity-bill-calculator',
  BRPL: '/electricity/delhi-electricity-bill-calculator',
  TSSPDCL: '/electricity/telangana-electricity-bill-calculator',
  APSPDCL: '/electricity/andhra-pradesh-electricity-bill-calculator',
  MPCZ: '/electricity/madhya-pradesh-electricity-bill-calculator',
  UHBVN: '/electricity/haryana-electricity-bill-calculator',
  HPSEBL: '/electricity/himachal-pradesh-electricity-bill-calculator',
  UPCL: '/electricity/uttarakhand-electricity-bill-calculator',
  GED: '/electricity/goa-electricity-bill-calculator',
  SBPDCL: '/electricity/bihar-electricity-bill-calculator',
  TPCODL: '/electricity/odisha-electricity-bill-calculator',
  APDCL: '/electricity/assam-electricity-bill-calculator',
  JBVNL: '/electricity/jharkhand-electricity-bill-calculator',
  CSPDCL: '/electricity/chhattisgarh-electricity-bill-calculator',
  CED: '/electricity/chandigarh-electricity-bill-calculator',
  'PED-PY': '/electricity/puducherry-electricity-bill-calculator',
  JPDCL: '/electricity/jammu-and-kashmir-electricity-bill-calculator',
  TSECL: '/electricity/tripura-electricity-bill-calculator',
  'EPD-SK': '/electricity/sikkim-electricity-bill-calculator',
  MePDCL: '/electricity/meghalaya-electricity-bill-calculator',
  MSPDCL: '/electricity/manipur-electricity-bill-calculator',
  APDOP: '/electricity/arunachal-pradesh-electricity-bill-calculator',
  'PED-MZ': '/electricity/mizoram-electricity-bill-calculator',
  DOPN: '/electricity/nagaland-electricity-bill-calculator',
  ANED: '/electricity/andaman-and-nicobar-islands-electricity-bill-calculator',
  DNHPDCL:
    '/electricity/dadra-and-nagar-haveli-and-daman-and-diu-electricity-bill-calculator',
  LED: '/electricity/lakshadweep-electricity-bill-calculator',
  LPDD: '/electricity/ladakh-electricity-bill-calculator',
}

type StateEntry = (typeof discomsJson.states)[number]

const states = discomsJson.states as StateEntry[]
const stateAvailability = states.map((s) => ({
  name: s.state,
  discoms: s.discoms,
  available: s.discoms.some((d) => d.hasTariffFile),
  href:
    s.discoms
      .filter((d) => d.hasTariffFile)
      .map((d) => CALCULATOR_ROUTES[d.code])
      .find(Boolean) ?? '/coming-soon',
}))

const stateCount = states.filter((s) => s.type === 'state').length
const utCount = states.filter((s) => s.type === 'ut').length
const verified = formatIsoDate(tariff.lastVerified)

const heroStats: [string, string][] = [
  [`${stateCount + utCount}`, 'States & UTs'],
  ['200+', 'Calculators'],
  ['100%', 'Free, no login'],
  ['SERC', 'Source-verified'],
]

// Loosely scattered placement for the xl+ hero — varied offsets, tilts and
// float timings per chip so it reads as scattered rather than a fixed grid.
const scatteredHeroStats: { big: string; small: string; style: CSSProperties }[] = [
  {
    big: heroStats[0][0],
    small: heroStats[0][1],
    style: {
      top: '9%',
      left: '4%',
      '--tilt': '-7deg',
      animationDuration: '7.5s',
      animationDelay: '0s',
    } as CSSProperties,
  },
  {
    big: heroStats[1][0],
    small: heroStats[1][1],
    style: {
      top: '24%',
      right: '6%',
      '--tilt': '5deg',
      animationDuration: '8.5s',
      animationDelay: '1.1s',
    } as CSSProperties,
  },
  {
    big: heroStats[2][0],
    small: heroStats[2][1],
    style: {
      top: '58%',
      left: '9%',
      '--tilt': '4deg',
      animationDuration: '6.5s',
      animationDelay: '0.6s',
    } as CSSProperties,
  },
  {
    big: heroStats[3][0],
    small: heroStats[3][1],
    style: {
      top: '70%',
      right: '3%',
      '--tilt': '-5deg',
      animationDuration: '7.8s',
      animationDelay: '1.8s',
    } as CSSProperties,
  },
]

const quickEstimateDiscoms = Object.entries(CALCULATOR_ROUTES)
  .map(([code, href]) => {
    const state = states.find((s) => s.discoms.some((d) => d.code === code))?.state
    return state ? { code, state, href } : null
  })
  .filter((d): d is { code: string; state: string; href: string } => Boolean(d))

// ---------------------------------------------------------------------------
// Real, computed facts for the ticker and comparison section — no invented
// testimonials or fabricated numbers. Every figure below comes straight out
// of the same calculation engines the calculator pages use.
const tnebExample = computeBill(tariff, {
  connectionType: 'residential',
  unitsConsumed: 200,
  phase: 'single',
})
const acExample3 = calculateAcCost({
  discomCode: 'TNEB',
  tonnage: 1.5,
  starRating: 3,
  dailyHours: 6,
})
const acExample5 = calculateAcCost({
  discomCode: 'TNEB',
  tonnage: 1.5,
  starRating: 5,
  dailyHours: 6,
})
const acAnnualSavings = acExample3.annualCost - acExample5.annualCost
const solarExample = calculateSolarRoi({
  discomCode: 'TNEB',
  monthlyUnits: 300,
  systemSizeKw: 3,
})

const rateComparisons = Object.keys(CALCULATOR_ROUTES)
  .map((code) => {
    const t = getTariff(code)
    const res =
      t.connectionTypes.find((c) => c.connectionType === 'residential') ??
      t.connectionTypes[0]
    const topRate = res.slabs[res.slabs.length - 1].ratePerUnit
    return { code, state: t.state, topRate, href: CALCULATOR_ROUTES[code] }
  })
  .filter((r) => r.topRate > 0)
  .sort((a, b) => a.topRate - b.topRate)

const cheapestRates = rateComparisons.slice(0, 4)
const priciestRates = rateComparisons.slice(-4).reverse()

const tickerFacts = [
  `TNEB 200 units/month ≈ ${formatINR(tnebExample.total)}`,
  `5-star vs 3-star AC (1.5T, 6 hrs/day) saves ~${formatINR(acAnnualSavings)}/year`,
  `3 kW rooftop solar pays back in ~${solarExample.paybackYears ?? '—'} years in Tamil Nadu`,
  `Cheapest top slab: ${cheapestRates[0]?.state} at ₹${cheapestRates[0]?.topRate.toFixed(2)}/unit`,
  `${stateCount + utCount} states & UTs covered, one calculator engine`,
]
// ---------------------------------------------------------------------------

interface Hub {
  emoji: string
  title: string
  description: string
  count: number
  countLabel: string
  accent: string
  chipBg: string
  cardBorder: string
  badge?: string
  tools: { label: string; href: string }[]
  explore: string
}

const hubs: Hub[] = [
  {
    emoji: '⚡',
    title: 'Electricity',
    description: 'Slab-by-slab bills for every DISCOM in India',
    count: stateCount + utCount,
    countLabel: 'calculators',
    accent: 'text-hub-electricity',
    chipBg: 'bg-hub-electricity/15 text-hub-electricity',
    cardBorder: 'hover:border-hub-electricity/60',
    badge: `${stateCount + utCount} states & UTs`,
    tools: [
      { label: 'Tamil Nadu (TNEB)', href: '/electricity/tneb-bill-calculator' },
      { label: 'Maharashtra (MSEDCL)', href: '/electricity/msedcl-bill-calculator' },
      { label: 'EV charging cost', href: '/electricity/ev-charging-cost-calculator' },
    ],
    explore: '/electricity',
  },
  {
    emoji: '☀️',
    title: 'Solar',
    description: 'Rooftop payback, sizing, backup and subsidy, priced on your tariff',
    count: 5,
    countLabel: 'calculators',
    accent: 'text-hub-solar',
    chipBg: 'bg-hub-solar/15 text-hub-solar',
    cardBorder: 'hover:border-hub-solar/60',
    tools: [
      { label: 'ROI & payback', href: '/solar/roi-calculator' },
      { label: 'PM Surya Ghar subsidy', href: '/solar/subsidy-calculator' },
      { label: 'Panel size calculator', href: '/solar/panel-size-calculator' },
    ],
    explore: '/solar',
  },
  {
    emoji: '❄️',
    title: 'Air Conditioning',
    description: 'What your AC actually costs, priced at your top slab',
    count: 6,
    countLabel: 'calculators',
    accent: 'text-hub-ac',
    chipBg: 'bg-hub-ac/15 text-hub-ac',
    cardBorder: 'hover:border-hub-ac/60',
    badge: 'Most popular',
    tools: [
      { label: 'AC running cost', href: '/ac/bill-calculator' },
      { label: 'Tonnage sizing', href: '/ac/tonnage-calculator' },
      { label: 'AC brand calculators', href: '/ac/brands' },
    ],
    explore: '/ac',
  },
  {
    emoji: '💧',
    title: 'Water',
    description: 'Municipal water bill, from your own consumption and rate',
    count: 36,
    countLabel: 'states covered',
    accent: 'text-hub-water',
    chipBg: 'bg-hub-water/15 text-hub-water',
    cardBorder: 'hover:border-hub-water/60',
    tools: [
      { label: 'Water bill calculator', href: '/water' },
      { label: 'Tamil Nadu', href: '/water/tamil-nadu' },
      { label: 'Maharashtra', href: '/water/maharashtra' },
    ],
    explore: '/water',
  },
  {
    emoji: '🔥',
    title: 'Gas',
    description: 'Piped gas (PNG) bill, from your own consumption and rate',
    count: 21,
    countLabel: 'providers listed',
    accent: 'text-hub-gas',
    chipBg: 'bg-hub-gas/15 text-hub-gas',
    cardBorder: 'hover:border-hub-gas/60',
    tools: [
      { label: 'Gas bill calculator', href: '/gas' },
      { label: 'Adani Gas', href: '/gas/adani-gas' },
      { label: 'Mahanagar Gas', href: '/gas/mahanagar-gas' },
    ],
    explore: '/gas',
  },
  {
    emoji: '🔌',
    title: 'Appliances',
    description: 'Fan, fridge, inverter sizing and backup — real running cost',
    count: 6,
    countLabel: 'calculators',
    accent: 'text-hub-appliance',
    chipBg: 'bg-hub-appliance/15 text-hub-appliance',
    cardBorder: 'hover:border-hub-appliance/60',
    tools: [
      { label: 'Ceiling fan cost', href: '/appliances/ceiling-fan-cost-calculator' },
      { label: 'Fridge cost', href: '/appliances/fridge-cost-calculator' },
      { label: 'Inverter sizing', href: '/appliances/inverter-sizing-calculator' },
    ],
    explore: '/appliances',
  },
  {
    emoji: '⛽',
    title: 'Fuel Cost',
    description: 'Petrol/diesel, LPG cylinder and generator running cost',
    count: 3,
    countLabel: 'calculators',
    accent: 'text-hub-fuel',
    chipBg: 'bg-hub-fuel/15 text-hub-fuel',
    cardBorder: 'hover:border-hub-fuel/60',
    tools: [
      { label: 'Petrol/diesel per km', href: '/fuel-cost/petrol-diesel-cost-per-km-calculator' },
      { label: 'LPG cylinder usage', href: '/fuel-cost/lpg-cylinder-usage-calculator' },
      { label: 'Generator fuel cost', href: '/fuel-cost/generator-fuel-consumption-calculator' },
    ],
    explore: '/fuel-cost',
  },
  {
    emoji: '🧮',
    title: 'Finance',
    description: 'GST, SIP, gratuity and tax-regime maths, done right',
    count: 4,
    countLabel: 'calculators',
    accent: 'text-hub-financial',
    chipBg: 'bg-hub-financial/15 text-hub-financial',
    cardBorder: 'hover:border-hub-financial/60',
    tools: [
      { label: 'GST calculator', href: '/financial/gst-calculator' },
      { label: 'SIP returns', href: '/financial/sip-calculator' },
      { label: 'New vs old tax regime', href: '/financial/new-vs-old-tax-regime-calculator' },
    ],
    explore: '/financial',
  },
]

const posts = [
  {
    title: 'How telescopic electricity slabs actually work',
    tag: 'Explainer',
    href: '/coming-soon',
  },
  {
    title: 'Is rooftop solar worth it in India in 2026?',
    tag: 'Solar',
    href: '/coming-soon',
  },
  {
    title: 'New vs old tax regime: who actually saves?',
    tag: 'Finance',
    href: '/coming-soon',
  },
]

const faqs: { q: string; a: string }[] = [
  {
    q: 'Are these calculators free to use?',
    a: 'Yes. Every calculator on bijlicalc is free, needs no login, and works on any device. We plan to keep the core calculators free permanently.',
  },
  {
    q: 'Which states and DISCOMs are supported?',
    a: `All ${stateCount} states and ${utCount} union territories are covered, each using its main DISCOM's domestic tariff. Data is being progressively cross-checked against primary SERC orders; each calculator shows its verification status.`,
  },
  {
    q: 'How accurate are the bill estimates?',
    a: 'Calculations use each DISCOM’s published telescopic slab rates, fixed charges, fuel cost adjustment and subsidies. They are close estimates; your final bill can vary slightly due to rounding, meter rent or tariff revisions.',
  },
  {
    q: 'Where does the tariff data come from?',
    a: 'From State Electricity Regulatory Commission (SERC) tariff orders and DISCOM notifications. Each calculator shows when its data was last verified and links to the source order.',
  },
  {
    q: 'Do you sell or store my data?',
    a: 'No. Every calculator runs entirely in your browser — nothing you enter is saved, logged in against an account, or sold. The optional installer-quote form is the only place we collect contact details, and only if you submit it yourself.',
  },
  {
    q: 'How is bijlicalc different from other bill calculators?',
    a: 'Most bill-calculator sites use one generic slab table for every state. Ours is one schema-validated tariff file per DISCOM, so telescopic slabs, fixed charges, FCA and subsidies are modelled exactly as that DISCOM bills them — not approximated.',
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

const hubsItemList = itemListLd(hubs.map((h) => ({ name: `${h.title} Calculators`, path: h.explore })))

export const metadata: Metadata = {
  title: 'Free Indian Utility Calculators — Electricity, Water, Gas, Solar, AC & Finance',
  description: `Free, accurate calculators for Indian electricity, water and gas bills, rooftop solar, AC running cost, home appliances, fuel cost and personal finance. Real DISCOM tariffs for all ${stateCount} states + ${utCount} UTs, verified against SERC orders.`,
  alternates: { canonical: `${SITE}/` },
  openGraph: { url: `${SITE}/`, type: 'website' },
}

export default function Home() {
  return (
    <>
      <main>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative -mt-16 overflow-hidden pt-16 hero-gradient">
          <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 py-6 text-center lg:py-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-spark-teal/40 bg-spark-teal/10 px-3 py-1 text-xs font-semibold text-spark-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-spark-teal" aria-hidden />
              Updated with 2026 tariff rates
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Free Indian Utility Calculators
            </h1>
            <p className="mt-2 font-display text-xl font-extrabold text-brass sm:text-3xl">
              Electricity, Water, Gas, Solar, AC &amp; Finance — done precisely.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
              Slab-by-slab bill calculators, payback tools and everyday finance
              maths for every Indian household — built on real DISCOM tariffs.
              No login, nothing stored.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/electricity"
                className="rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brass/90"
              >
                Calculate Electricity Bill
              </Link>
              <Link
                href="#tools"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-white/50"
              >
                Explore All Tools
                <span
                  aria-hidden
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-[10px]"
                >
                  →
                </span>
              </Link>
            </div>

            {/* Signature: live, real quick-estimate widget — below the copy */}
            <div className="mx-auto mt-4 max-w-md text-left">
              <QuickBillEstimate discoms={quickEstimateDiscoms} />
            </div>

            {/* Stats row — stacked under the copy below xl, where there's no side room */}
            <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 xl:hidden">
              {heroStats.map(([big, small]) => (
                <div
                  key={small}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center"
                >
                  <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                  <p className="mt-0.5 text-xs leading-tight text-white/50">{small}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Same stats, scattered loosely into the empty side space once there's room (xl+) —
              varied offsets and tilts so it reads as scattered, not a grid */}
          <div className="pointer-events-none absolute inset-0 hidden xl:block">
            {scatteredHeroStats.map(({ big, small, style }) => (
              <div
                key={small}
                style={style}
                className="hero-float-chip absolute rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center"
              >
                <p className="font-display text-lg font-extrabold text-brass">{big}</p>
                <p className="mt-0.5 text-xs leading-tight text-white/50">{small}</p>
              </div>
            ))}
          </div>

          {/* Ticker — real computed facts, not fabricated testimonials */}
          <div className="overflow-hidden border-y border-white/10 bg-black/20 py-2">
            <div className="ticker-track flex w-max gap-10 text-sm text-white/70">
              {[...tickerFacts, ...tickerFacts].map((fact, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden />
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- Tool grid */}
        <section id="tools" aria-labelledby="tools-h" className="bg-gazette-cream dark:bg-[#02181c]">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                The complete toolkit
              </span>
              <h2
                id="tools-h"
                className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy dark:text-gazette-cream"
              >
                Every rupee you spend on power &amp; more
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hubs.map((h) => (
                <div
                  key={h.title}
                  className={`relative flex flex-col rounded-2xl border border-hairline bg-paper p-6 text-center transition hover:shadow-lg dark:border-white/10 dark:bg-slate-900 ${h.cardBorder}`}
                >
                  {h.badge && (
                    <span
                      className={`absolute top-4 right-4 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${h.chipBg}`}
                    >
                      {h.badge}
                    </span>
                  )}
                  <span
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${h.chipBg}`}
                  >
                    {h.emoji}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
                    {h.title}
                  </h3>
                  <p className={`mt-0.5 font-display text-sm font-bold ${h.accent}`}>
                    {h.count > 0 ? `${h.count} ${h.countLabel}` : h.countLabel}
                  </p>
                  <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
                    {h.description}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-left text-sm">
                    {h.tools.map((t) => (
                      <li key={t.label}>
                        <Link
                          href={t.href}
                          className="flex items-center justify-between rounded-lg px-2 py-1.5 text-ash hover:bg-mist dark:text-gazette-cream/80 dark:hover:bg-slate-800"
                        >
                          {t.label}
                          <span className={h.accent}>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={h.explore}
                    className={`mt-4 text-sm font-semibold ${h.accent}`}
                  >
                    Explore {h.title} hub →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Real rate comparison */}
        <section aria-labelledby="rate-compare" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
              Straight from the tariff files
            </span>
            <h2
              id="rate-compare"
              className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy dark:text-gazette-cream"
            >
              Who pays the least — and the most — per unit?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-ash/70 dark:text-gazette-cream/60">
              Top domestic slab rate by state, computed straight from each
              DISCOM&apos;s own tariff file — not a national average.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-spark-teal/25 bg-spark-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-spark-teal">
                Cheapest top-slab rates
              </p>
              <ul className="mt-4 space-y-3">
                {cheapestRates.map((r) => (
                  <li key={r.code}>
                    <Link
                      href={r.href}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/60 dark:hover:bg-white/5"
                    >
                      <span className="text-sm font-medium text-ink-navy dark:text-gazette-cream">
                        {r.state} <span className="text-ash/50">({r.code})</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-spark-teal">
                        ₹{r.topRate.toFixed(2)}/unit
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-caution-amber/25 bg-caution-amber/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-caution-amber">
                Highest top-slab rates
              </p>
              <ul className="mt-4 space-y-3">
                {priciestRates.map((r) => (
                  <li key={r.code}>
                    <Link
                      href={r.href}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/60 dark:hover:bg-white/5"
                    >
                      <span className="text-sm font-medium text-ink-navy dark:text-gazette-cream">
                        {r.state} <span className="text-ash/50">({r.code})</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-caution-amber">
                        ₹{r.topRate.toFixed(2)}/unit
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- State grid */}
        <section aria-labelledby="states" className="bg-gazette-cream px-4 py-16 dark:bg-[#02181c]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                State DISCOM calculators
              </span>
              <h2
                id="states"
                className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy dark:text-gazette-cream"
              >
                Pick your state
              </h2>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {stateAvailability.map((s) => {
                const label = s.discoms.map((d) => d.code).join(' / ')
                return s.available ? (
                  <li key={s.name}>
                    <Link
                      href={s.href}
                      className="flex h-full flex-col rounded-xl border border-hairline bg-paper p-4 transition hover:border-brass hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
                    >
                      <span className="font-semibold text-ink-navy dark:text-gazette-cream">
                        {s.name}
                      </span>
                      <span className="mt-1 text-xs text-brass">{label}</span>
                    </Link>
                  </li>
                ) : (
                  <li
                    key={s.name}
                    title="Coming soon"
                    className="cursor-not-allowed rounded-xl border border-hairline bg-mist p-4 opacity-60 dark:border-white/10 dark:bg-slate-900"
                  >
                    <span className="font-medium text-ash/60 dark:text-gazette-cream/50">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-xs text-ash/40 dark:text-gazette-cream/30">
                      Coming soon
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- Solar lead-gen */}
        <section id="solar-leadgen" className="relative overflow-hidden hero-gradient">
          <div className="hero-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
            <div className="text-white">
              <span className="text-xs font-semibold tracking-[0.2em] text-spark-teal uppercase">
                Only on bijlicalc
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                See what solar could save you
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                Get your rooftop payback and PM Surya Ghar subsidy in seconds —
                then, if you want, we’ll connect you with three verified
                installers in your area. Free, no obligation.
              </p>
              <ul className="mt-5 space-y-1.5 text-sm text-white/70">
                <li>✓ Payback priced against your real DISCOM tariff</li>
                <li>✓ Central subsidy up to ₹78,000</li>
                <li>✓ Quotes from vetted local installers</li>
              </ul>
            </div>
            <div>
              <LeadGenForm source="homepage-solar-block" tone="glass" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- How we verify */}
        <section className="bg-gazette-cream dark:bg-[#02181c]">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] text-brass uppercase">
                Built on the record, not guesswork
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-navy dark:text-gazette-cream">
                How we verify every tariff
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  n: '1',
                  title: 'Source the order',
                  body: 'We pull rates straight from the SERC tariff order or DISCOM notification — the primary document, not another calculator.',
                },
                {
                  n: '2',
                  title: 'Cross-check the figures',
                  body: 'Every slab, fixed charge and subsidy is encoded into a schema-validated file so the maths is reproducible and auditable.',
                },
                {
                  n: '3',
                  title: 'Publish with a date-stamp',
                  body: 'Each calculator carries a verification status and last-checked date, linked back to its source order.',
                  seal: true,
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-2xl border border-hairline bg-paper p-6 dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass font-display text-lg font-bold text-white">
                      {s.n}
                    </span>
                    {s.seal && (
                      <span className="ml-auto flex items-center gap-1.5 rounded-full border border-seal-red/40 px-2.5 py-1 text-xs font-semibold text-seal-red">
                        ⦿ Verified {verified}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-ash/80 dark:text-gazette-cream/70">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/methodology"
                className="text-sm font-semibold text-brass hover:underline"
              >
                Read the full methodology →
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- Blog */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink-navy dark:text-gazette-cream">
              From the blog
            </h2>
            <span className="text-sm text-ash/40 dark:text-gazette-cream/30">Coming soon</span>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="flex flex-col rounded-2xl border border-hairline bg-paper p-6 transition hover:border-brass hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
              >
                <span className="w-fit rounded-full bg-brass/10 px-2.5 py-0.5 text-xs font-semibold text-brass">
                  {p.tag}
                </span>
                <h3 className="mt-3 flex-1 font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
                  {p.title}
                </h3>
                <span className="mt-4 text-sm font-semibold text-brass">
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------------- FAQ */}
        <section
          aria-labelledby="home-faq"
          className="border-t border-hairline bg-gazette-cream dark:border-white/10 dark:bg-[#02181c]"
        >
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2
              id="home-faq"
              className="text-center font-display text-3xl font-extrabold tracking-tight text-ink-navy dark:text-gazette-cream"
            >
              Frequently asked questions
            </h2>
            <div className="mt-8 divide-y divide-hairline dark:divide-white/10">
              {faqs.map((f, i) => (
                <details key={i} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink-navy dark:text-gazette-cream">
                    {f.q}
                    <span className="ml-4 text-brass transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-ash/80 dark:text-gazette-cream/70">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubsItemList) }}
      />
    </>
  )
}
