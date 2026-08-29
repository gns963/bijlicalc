import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import HomeMiniCalculator from '@/components/calculators/HomeMiniCalculator'
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
}

type StateEntry = (typeof discomsJson.states)[number]

const states = discomsJson.states as StateEntry[]
const stateAvailability = states.map((s) => ({
  name: s.state,
  type: s.type,
  discoms: s.discoms,
  available: s.discoms.some((d) => d.hasTariffFile),
  href:
    s.discoms
      .filter((d) => d.hasTariffFile)
      .map((d) => CALCULATOR_ROUTES[d.code])
      .find(Boolean) ?? '/coming-soon',
}))

const liveCount = stateAvailability.filter((s) => s.available).length
const totalCount = stateAvailability.length

export const metadata: Metadata = {
  title: 'Free Indian Utility Calculators — Electricity, AC & Solar Bills',
  description:
    'Free, accurate calculators for Indian electricity bills, AC running cost and rooftop solar ROI. Real DISCOM tariffs, telescopic slabs and subsidies — starting with Tamil Nadu (TNEB).',
  alternates: { canonical: `${SITE}/` },
  openGraph: { url: `${SITE}/`, type: 'website' },
}

const faqs: { q: string; a: string }[] = [
  {
    q: 'Are these electricity bill calculators free to use?',
    a: 'Yes. Every calculator on bijlicalc is free, needs no login, and works on any device. We plan to keep the core calculators free permanently.',
  },
  {
    q: 'Which states and DISCOMs are supported?',
    a: `Right now we have verified tariff data for Tamil Nadu (TANGEDCO / TNEB). ${totalCount - liveCount} more states and union territories are on the way — you can already see the full list, with unsupported states marked "coming soon".`,
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
        {/* 1. Hero */}
        <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Free Indian Utility Calculators — Electricity, AC &amp; Solar Bills
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Estimate your electricity bill, AC running cost and rooftop solar
              savings using real DISCOM tariffs — telescopic slabs, subsidies and
              fuel cost adjustment included.
            </p>

            {/* Live mini calculator */}
            <div className="mx-auto mt-8 max-w-xl text-left">
              <HomeMiniCalculator
                states={stateAvailability.map((s) => ({
                  name: s.name,
                  available: s.available,
                  discomCode: s.discoms.find((d) => d.hasTariffFile)?.code,
                  href: s.href,
                }))}
              />
            </div>

            {/* Trust strip */}
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              ✅ {liveCount} of {totalCount} states/UTs live — Tamil Nadu,
              Maharashtra, Uttar Pradesh, Karnataka, Kerala &amp; West Bengal ·
              Tariffs verified {formatIsoDate(tariff.lastVerified)} · Free, no
              login
            </p>
          </div>
        </section>

        {/*
          AD SLOT PLACEHOLDER — intentionally NOT placed above the hero calculator.
          Final ad placement to be decided later (post-AdSense approval).
        */}

        {/* 2. State DISCOM grid */}
        <section
          aria-labelledby="states"
          className="mx-auto max-w-6xl px-4 py-14"
        >
          <h2 id="states" className="text-2xl font-semibold">
            Electricity bill calculators by state
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Six states are live now. The rest are being added — data
            verification in progress.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stateAvailability.map((s) => {
              const label = s.discoms.map((d) => d.code).join(' / ')
              return s.available ? (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="block h-full rounded-xl border border-indigo-200 bg-indigo-50 p-4 transition hover:border-indigo-400 hover:shadow-sm dark:border-indigo-800 dark:bg-indigo-950/40"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-xs text-indigo-700 dark:text-indigo-300">
                      {label} · Available →
                    </span>
                  </Link>
                </li>
              ) : (
                <li
                  key={s.name}
                  aria-disabled
                  className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60 dark:border-slate-800 dark:bg-slate-900"
                  title="Coming soon"
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

        {/* 3 & 4. Solar + AC + Financial teasers */}
        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 md:grid-cols-3">
          {/* 3. Solar teaser */}
          <div className="flex flex-col rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Live now
            </span>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              ☀️ Rooftop Solar ROI Calculator
            </h2>
            <p className="mt-2 flex-1 text-slate-600 dark:text-slate-300">
              Work out payback period and lifetime savings for a rooftop solar
              system based on your bill, roof size and PM Surya Ghar subsidy.
            </p>
            <Link
              href="/solar"
              className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:text-amber-600 dark:text-amber-300"
            >
              Open solar tools →
            </Link>
          </div>

          {/* 4. AC hub teaser */}
          <div className="flex flex-col rounded-2xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-900 dark:bg-sky-950/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              Live now
            </span>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              ❄️ AC Running Cost Hub
            </h2>
            <p className="mt-2 flex-1 text-slate-600 dark:text-slate-300">
              Estimate how much your AC costs per hour, per night and per month
              using ISEER ratings and your state&apos;s electricity tariff.
            </p>
            <Link
              href="/ac"
              className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300"
            >
              Open AC tools →
            </Link>
          </div>

          {/* Financial teaser */}
          <div className="flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Live now
            </span>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              🧮 Financial Calculators
            </h2>
            <p className="mt-2 flex-1 text-slate-600 dark:text-slate-300">
              GST, SIP returns, new vs old tax regime (FY 2026-27) and gratuity —
              the everyday money numbers, done right.
            </p>
            <Link
              href="/financial"
              className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-300"
            >
              Open financial tools →
            </Link>
          </div>
        </section>

        {/* 5. FAQ */}
        <section
          aria-labelledby="home-faq"
          className="mx-auto max-w-3xl px-4 pb-16"
        >
          <h2 id="home-faq" className="mb-4 text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {faqs.map((f, i) => (
              <details key={i} className="group py-3">
                <summary className="cursor-pointer list-none font-medium text-slate-800 marker:hidden dark:text-slate-100">
                  {f.q}
                </summary>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  )
}
