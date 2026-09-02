import Link from 'next/link'
import WaterBillCalculator from '@/components/calculators/WaterBillCalculator'
import { DropletIcon } from '@/components/HubMotifIcon'
import SplitHero from '@/components/SplitHero'
import { slugify } from '@/lib/format'

const SITE = 'https://desimetrics.com'

export default function WaterStatePage({ state }: { state: string }) {
  const faqs = [
    {
      q: `Does DesiMetrics know my exact water board's tariff in ${state}?`,
      a: `No — unlike electricity DISCOMs, municipal water tariffs in India aren't centrally published in a form we can verify and keep current, and billing basis varies by city (flat rate, metered volumetric, or tied to property tax). Enter your own rate from your last water bill or your board's published tariff for an accurate result.`,
    },
    {
      q: `Where do I find my water board's rate per KL in ${state}?`,
      a: `Check your last water bill — it typically shows consumption in KL (kilolitres) and the rate applied. You can also check your municipal corporation or water board's official website for the published tariff schedule.`,
    },
    {
      q: 'Why does the calculator ask for a fixed/meter charge separately?',
      a: 'Most Indian water bills combine a per-KL volumetric charge with a flat monthly meter or service charge — entering both gives a more accurate total than the volumetric charge alone.',
    },
    {
      q: 'What is a KL and how do I read my meter?',
      a: 'A kilolitre (KL) = 1,000 litres, the standard billing unit for metered water supply in India. Most meters show a running total in KL or cubic metres — subtract your previous reading from your current one to find your period\'s consumption.',
    },
    {
      q: 'What is the sewerage charge some water bills include?',
      a: 'Many Indian water boards add a wastewater treatment/sewerage charge on top of the volumetric water charge, commonly as a percentage of it (the exact percentage varies by board). If your bill includes one, fold it into the fixed/meter charge field, or the rate you enter, so the total reflects your real bill.',
    },
    {
      q: 'Does my water board offer a free consumption threshold?',
      a: `Some boards do (Delhi's is a well-known example), and some free schemes are all-or-nothing rather than a true allowance — crossing the threshold by even a little can make your entire consumption billable, not just the excess. Check your own board's specific rules; don't assume another city's scheme applies in ${state}.`,
    },
    {
      q: 'Is piped water cheaper than tanker or jar delivery?',
      a: 'Almost always yes, by a wide margin, when piped supply is reliable. A private water tanker commonly costs roughly ₹500-1,500 in many Indian cities, and a 20L jar commonly runs ₹40-80 — both vary by city, but either works out to many times more per litre than metered piped water.',
    },
    {
      q: 'How can I reduce my water bill?',
      a: 'Fix dripping taps and running cisterns promptly — a slow, easy-to-miss leak can waste hundreds of litres a month. Low-flow fixtures for showers and taps also meaningfully cut consumption without much lifestyle change.',
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
  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${state} Water Bill Calculator`,
    url: `${SITE}/water/${slugify(state)}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    areaServed: 'India',
  }

  return (
    <>
      <SplitHero
        hub="water"
        breadcrumb={[
          { label: 'Water', href: '/water' },
          { label: state, href: `/water/${slugify(state)}` },
        ]}
        badgeLabel="Your real rate · Honest input"
        h1={`${state} Water Bill Calculator`}
        subtitle={`Estimate your water bill in ${state} from your metered consumption and your board's own rate — we don't guess municipal tariffs we can't verify, so you enter your real rate.`}
        primaryCta={{ label: 'Calculate My Water Bill', href: '#calculator', emoji: '💧' }}
        secondaryCta={{ label: 'All states →', href: '/water' }}
        statChips={[
          { icon: '💧', big: 'KL', small: 'Consumption unit', tone: 'hub' },
          { icon: '✍️', big: 'Your rate', small: 'Honest input', tone: 'hub' },
          { icon: '➕', big: 'Fixed charge', small: 'Full bill', tone: 'hub' },
          { icon: '🔓', big: 'Free', small: 'No login', tone: 'hub' },
        ]}
        resultCard={
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-hub-water">
              <DropletIcon className="h-6 w-6" />
              <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">
                Why we ask for your rate
              </p>
            </div>
            <p className="mt-3 text-sm text-white/80">
              Unlike electricity DISCOMs, {state}&apos;s municipal water
              tariffs aren&apos;t centrally published in a form we can
              verify and keep current.
            </p>
            <p className="mt-2 text-sm text-white/70">
              Rather than guess a number, we ask for your own rate from your
              bill — the same honest approach we use across our fuel and
              net-metering calculators.
            </p>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section aria-labelledby="calculator" className="mb-10 scroll-mt-20">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your {state} water bill
        </h2>
        <WaterBillCalculator />
      </section>

      <section aria-labelledby="charges-explained" className="mb-10 scroll-mt-20">
        <h2 id="charges-explained" className="font-display mb-2 text-2xl font-semibold">
          Sewerage &amp; fixed charges explained
        </h2>
        <div className="space-y-3 text-ash/80 dark:text-gazette-cream/70">
          <p>
            <strong>Sewerage charge.</strong> Many water boards add a
            wastewater treatment fee on top of the volumetric water charge,
            commonly billed as a percentage of it — check your last bill for
            the exact line item, and roll it into the rate or fixed charge
            you enter above so the total reflects your real bill.
          </p>
          <p>
            <strong>Fixed / meter charge.</strong> A flat amount per billing
            period, often based on your connection&apos;s meter size,
            charged regardless of how much water you use — it covers the
            cost of maintaining your connection and meter.
          </p>
        </div>
      </section>

      <section aria-labelledby="tanker" className="mb-10 scroll-mt-20">
        <h2 id="tanker" className="font-display mb-2 text-2xl font-semibold">
          Piped water vs tanker/jar delivery
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          Piped municipal supply is almost always dramatically cheaper per
          litre than tanker or 20L jar delivery, when it&apos;s reliably
          available. As a rough sense of scale: a private water tanker
          (typically 5,000-10,000 litres) commonly costs somewhere in the{' '}
          <strong>₹500-1,500</strong> range in many Indian cities, and a 20L
          branded jar commonly runs <strong>₹40-80</strong> — both figures
          vary a lot by city and season, so check local rates for an exact
          comparison. Either way, that works out to many times more per
          litre than metered piped water.
        </p>
      </section>

      <section aria-labelledby="leaks" className="mb-10 scroll-mt-20">
        <h2 id="leaks" className="font-display mb-2 text-2xl font-semibold">
          Spotting a leak from your bill
        </h2>
        <p className="text-ash/80 dark:text-gazette-cream/70">
          If your consumption jumps well above your usual monthly range with
          no change in household usage, a running cistern or a slow pipe
          leak is a common cause — both can waste hundreds of litres a month
          without being obviously visible. Compare this cycle&apos;s KL
          figure against your last few bills; a sustained, unexplained
          increase is worth a quick check of taps, cisterns and any exposed
          piping before it repeats.
        </p>
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/water/delhi"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-water/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>📊</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              See a real-tariff example
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Delhi Jal Board uses a real, dated tariff — no rate entry needed.
            </p>
          </Link>
          <Link
            href="/gas"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-gas/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🔥</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Gas bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Same honest approach for your PNG bill.
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
              Real DISCOM tariffs, no guessing needed there.
            </p>
          </Link>
          <Link
            href="/appliances/water-tank-filling-time-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-appliance/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>🚰</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Water tank fill time
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              How long your tank takes to fill.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      </main>
    </>
  )
}
