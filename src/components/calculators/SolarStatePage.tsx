import Link from 'next/link'
import PageHero from '@/components/PageHero'
import SolarRoiCalculator from '@/components/calculators/SolarRoiCalculator'
import discomsJson from '@/data/discoms.json'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'

const liveDiscoms = discomsJson.states.flatMap((s) =>
  s.discoms.filter((d) => d.hasTariffFile).map((d) => ({ code: d.code, state: s.state })),
)

export default function SolarStatePage({
  state,
  discomCode,
  slug,
}: {
  state: string
  discomCode: string
  slug: string
}) {
  const example = calculateSolarRoi({ discomCode, monthlyUnits: 300, systemSizeKw: 3 })

  const faqs = [
    {
      q: `How much does a rooftop solar system cost in ${state}?`,
      a: `A 3 kW system costs about ${formatINR(example.systemCost)} before subsidy in our estimate, dropping to ${formatINR(example.netCost)} after the PM Surya Ghar central subsidy. Actual installer quotes vary by panel type, roof condition and local installation costs.`,
    },
    {
      q: `Does this use ${discomCode}'s real tariff?`,
      a: `Yes — savings are computed against ${discomCode}'s actual telescopic slab tariff, so solar is valued at offsetting your real, most expensive units first, not a flat national average rate.`,
    },
    {
      q: 'What subsidy is available?',
      a: 'PM Surya Ghar: Muft Bijli Yojana, the central government scheme, pays ₹30,000/kW for the first 2 kW and ₹18,000 for the 3rd kW, capped at ₹78,000 — the same nationwide, regardless of state.',
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
    name: `${state} Solar Bill Calculator`,
    url: `${SITE}/solar/bill-calculator/${discomCode.toLowerCase()}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    areaServed: 'India',
  }

  return (
    <>
      <PageHero
        hub="solar"
        breadcrumb={[
          { label: 'Solar', href: '/solar' },
          { label: 'Bill Calculator', href: '/solar/bill-calculator' },
          { label: state, href: `/solar/bill-calculator/${discomCode.toLowerCase()}` },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>☀️</span> Solar hub
          </>
        }
        h1={`${state} Solar Bill Calculator`}
        subtitle={
          <>
            Estimate your rooftop solar payback and savings in {state}, using{' '}
            <strong>{discomCode}&apos;s real telescopic tariff</strong> and the
            PM Surya Ghar central subsidy.
          </>
        }
        stats={[
          { icon: '💸', big: '₹78,000', small: 'Max subsidy', tone: 'hub' },
          { icon: '☀️', big: '~4u/kW/day', small: 'Generation assumption', tone: 'hub' },
          { icon: '📆', big: '25 yrs', small: 'System lifetime', tone: 'hub' },
          { icon: '📊', big: discomCode, small: 'Real tariff', tone: 'hub' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8">
      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5 dark:border-white/10 dark:border-l-brass dark:bg-slate-900"
      >
        <h2
          id="worked-example"
          className="font-display text-sm font-semibold tracking-wide text-brass uppercase"
        >
          Worked example
        </h2>
        <p className="mt-2 text-ash/80 dark:text-gazette-cream/90">
          A <strong>3 kW</strong> rooftop system for a {state} home using 300
          units/month costs about <strong>{formatINR(example.systemCost)}</strong>,
          drops to <strong>{formatINR(example.netCost)}</strong> after the{' '}
          {formatINR(example.subsidy)} PM Surya Ghar subsidy, saves ~
          <strong className="text-spark-teal">{formatINR(example.annualSavings)}</strong>
          /year, and pays back in about{' '}
          <strong>
            {example.paybackYears != null ? `${example.paybackYears} years` : 'N/A'}
          </strong>
          .
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your {state} solar payback
        </h2>
        <SolarRoiCalculator discoms={liveDiscoms} defaultDiscomCode={discomCode} />
      </section>

      <section aria-labelledby="related" className="mb-10">
        <h2 id="related" className="font-display mb-4 text-2xl font-semibold">
          Related calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solar/subsidy-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>💸</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              PM Surya Ghar subsidy
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              Check your exact eligibility and subsidy amount.
            </p>
          </Link>
          <Link
            href="/solar/panel-size-calculator"
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-solar/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>📐</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              Panel size calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              What system size and roof area you need.
            </p>
          </Link>
          <Link
            href={`/electricity/${slug}`}
            className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-electricity/50 hover:shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <span className="text-xl" aria-hidden>⚡</span>
            <p className="font-display mt-2 font-bold text-ink-navy dark:text-gazette-cream">
              {state} bill calculator
            </p>
            <p className="mt-1 text-xs text-ash/60 dark:text-gazette-cream/50">
              See your full {discomCode} electricity bill.
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
