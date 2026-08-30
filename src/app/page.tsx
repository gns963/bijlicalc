import type { Metadata } from 'next'
import Link from 'next/link'
import LeadGenForm from '@/components/LeadGenForm'
import MeterDial from '@/components/MeterDial'
import discomsJson from '@/data/discoms.json'
import tnebJson from '@/data/tariffs/tneb.json'
import { parseTariffFile } from '@/data/tariffs/_schema'
import { formatIsoDate } from '@/lib/format'

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

export const metadata: Metadata = {
  title: 'Free Indian Utility Calculators — Electricity, Solar, AC & Finance',
  description: `Free, accurate calculators for Indian electricity bills, rooftop solar, AC running cost and personal finance. Real DISCOM tariffs for all ${stateCount} states + ${utCount} UTs, verified against SERC orders.`,
  alternates: { canonical: `${SITE}/` },
  openGraph: { url: `${SITE}/`, type: 'website' },
}

interface Hub {
  emoji: string
  title: string
  chip: string
  border: string
  cta: string
  soon?: boolean
  tools: { label: string; href: string }[]
  explore: string
}

const hubs: Hub[] = [
  {
    emoji: '⚡',
    title: 'Electricity',
    chip: 'bg-brass/15 text-brass',
    border: 'hover:border-brass/50',
    cta: 'text-brass',
    tools: [
      { label: 'Tamil Nadu (TNEB)', href: '/electricity/tneb-bill-calculator' },
      { label: 'Maharashtra (MSEDCL)', href: '/electricity/msedcl-bill-calculator' },
      { label: 'Delhi (BSES)', href: '/electricity/delhi-electricity-bill-calculator' },
    ],
    explore: '/electricity',
  },
  {
    emoji: '☀️',
    title: 'Solar',
    chip: 'bg-gradient-to-br from-brass/30 to-spark-teal/30 text-brass',
    border: 'hover:border-brass/50',
    cta: 'text-brass',
    tools: [
      { label: 'ROI & payback', href: '/solar/roi-calculator' },
      { label: 'PM Surya Ghar subsidy', href: '/solar/subsidy-calculator' },
      { label: 'Free installer quotes', href: '#solar-leadgen' },
    ],
    explore: '/solar',
  },
  {
    emoji: '❄️',
    title: 'Air Conditioning',
    chip: 'bg-spark-teal/15 text-spark-teal',
    border: 'hover:border-spark-teal/50',
    cta: 'text-spark-teal',
    tools: [
      { label: 'AC running cost', href: '/ac/bill-calculator' },
      { label: 'Tonnage sizing', href: '/ac/tonnage-calculator' },
      { label: '3★ vs 5★ savings', href: '/ac/comparisons/3-star-vs-5-star-savings-guide' },
    ],
    explore: '/ac',
  },
  {
    emoji: '🧮',
    title: 'Finance',
    chip: 'bg-ink-navy/10 text-ink-navy dark:text-gazette-cream',
    border: 'hover:border-ink-navy/40',
    cta: 'text-ink-navy dark:text-gazette-cream',
    tools: [
      { label: 'GST calculator', href: '/financial/gst-calculator' },
      { label: 'SIP returns', href: '/financial/sip-calculator' },
      { label: 'New vs old tax regime', href: '/financial/new-vs-old-tax-regime-calculator' },
    ],
    explore: '/financial',
  },
  {
    emoji: '🔌',
    title: 'Appliances',
    chip: 'bg-ash/10 text-ash dark:text-gazette-cream',
    border: 'hover:border-slate-400',
    cta: 'text-slate-500',
    soon: true,
    tools: [
      { label: 'Appliance wattage', href: '/coming-soon' },
      { label: 'Fan & geyser cost', href: '/coming-soon' },
    ],
    explore: '/coming-soon',
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

export default function Home() {
  return (
    <>
      <main>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="bg-white dark:bg-[#0f1420]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/30 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass">
                Updated with 2026 tariff rates
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-navy sm:text-5xl dark:text-gazette-cream">
                Read your bill like the
                <span className="text-brass"> meter reads your home.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ash/80 dark:text-gazette-cream/70">
                Free, precise calculators for Indian electricity, rooftop solar,
                AC running cost and everyday finance — built on real DISCOM
                tariffs, verified against SERC orders. No login, nothing stored.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/electricity"
                  className="rounded-xl bg-brass px-6 py-3 text-sm font-semibold text-ink-navy shadow-sm transition hover:bg-brass/90"
                >
                  Calculate Electricity Bill
                </Link>
                <Link
                  href="#tools"
                  className="rounded-xl border border-ink-navy/20 px-6 py-3 text-sm font-semibold text-ink-navy transition hover:border-ink-navy/50 dark:border-gazette-cream/20 dark:text-gazette-cream"
                >
                  Explore All Tools
                </Link>
              </div>
            </div>

            {/* Signature: live analog meter dial */}
            <div className="lg:justify-self-end">
              <MeterDial
                states={stateAvailability.map((s) => ({
                  name: s.name,
                  available: s.available,
                  discomCode: s.discoms.find((d) => d.hasTariffFile)?.code,
                  href: s.href,
                }))}
              />
            </div>
          </div>

          {/* Trust strip */}
          <div className="border-y border-brass/20 bg-gazette-cream dark:border-brass/20 dark:bg-ink-navy/40">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-sm text-ash dark:text-gazette-cream/80">
              <span>
                <span className="text-brass">◆</span> {stateCount} states +{' '}
                {utCount} UTs
              </span>
              <span>
                <span className="text-brass">◆</span> Verified against SERC orders
              </span>
              <span>
                <span className="text-brass">◆</span> Updated {verified}
              </span>
              <span>
                <span className="text-brass">◆</span> Private — nothing stored
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- Tool grid */}
        <section
          id="tools"
          aria-labelledby="tools-h"
          className="bg-gazette-cream dark:bg-[#0f1420]"
        >
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                The complete toolkit
              </span>
              <h2
                id="tools-h"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-navy dark:text-gazette-cream"
              >
                Every rupee you spend on power &amp; more
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hubs.map((h) => (
                <div
                  key={h.title}
                  className={`flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${h.border}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${h.chip}`}
                    >
                      {h.emoji}
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
                      {h.title}
                    </h3>
                    {h.soon && (
                      <span className="ml-auto rounded-full bg-ash/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-ash dark:text-gazette-cream/70">
                        Soon
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {h.tools.map((t) => (
                      <li key={t.label}>
                        <Link
                          href={t.href}
                          className="flex items-center justify-between rounded-lg px-2 py-1.5 text-ash hover:bg-gazette-cream dark:text-gazette-cream/80 dark:hover:bg-slate-800"
                        >
                          {t.label}
                          <span className={h.cta}>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={h.explore}
                    className={`mt-4 text-sm font-semibold ${h.cta}`}
                  >
                    Explore {h.title} hub →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- State grid */}
        <section aria-labelledby="states" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
              State DISCOM calculators
            </span>
            <h2
              id="states"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-navy dark:text-gazette-cream"
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
                    className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brass hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
                  className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="font-medium text-slate-500 dark:text-slate-400">
                    {s.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    Coming soon
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* -------------------------------------------------------- Solar lead-gen */}
        <section
          id="solar-leadgen"
          className="bg-gradient-to-br from-brass via-brass to-spark-teal"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
            <div className="text-ink-navy">
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Only on bijlicalc
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                See what solar could save you
              </h2>
              <p className="mt-4 max-w-md text-ink-navy/80">
                Get your rooftop payback and PM Surya Ghar subsidy in seconds —
                then, if you want, we’ll connect you with three verified
                installers in your area. Free, no obligation.
              </p>
              <ul className="mt-5 space-y-1.5 text-sm text-ink-navy/90">
                <li>✓ Payback priced against your real DISCOM tariff</li>
                <li>✓ Central subsidy up to ₹78,000</li>
                <li>✓ Quotes from vetted local installers</li>
              </ul>
            </div>
            <div>
              <LeadGenForm source="homepage-solar-block" />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- How we verify */}
        <section className="bg-gazette-cream dark:bg-[#0f1420]">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                Built on the gazette, not guesswork
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-navy dark:text-gazette-cream">
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
                  className="relative rounded-2xl border border-ink-navy/10 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-navy font-display text-lg font-bold text-brass">
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
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink-navy dark:text-gazette-cream">
              From the blog
            </h2>
            <span className="text-sm text-slate-400">Coming soon</span>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brass hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
          className="border-t border-slate-100 bg-gazette-cream dark:border-slate-800 dark:bg-[#0f1420]"
        >
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2
              id="home-faq"
              className="text-center font-display text-3xl font-bold tracking-tight text-ink-navy dark:text-gazette-cream"
            >
              Frequently asked questions
            </h2>
            <div className="mt-8 divide-y divide-ink-navy/10 dark:divide-slate-700">
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
    </>
  )
}
