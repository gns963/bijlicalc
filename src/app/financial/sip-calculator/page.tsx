import type { Metadata } from 'next'
import FinancialCrossSell from '@/components/FinancialCrossSell'
import PageHero from '@/components/PageHero'
import SipCalculator from '@/components/calculators/SipCalculator'
import { calculateSip } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://bijlicalc.com'
const PATH = '/financial/sip-calculator'

const example = calculateSip(10000, 12, 10)

export const metadata: Metadata = {
  title: 'SIP Calculator 2026 — Mutual Fund SIP Returns & Maturity Value',
  description:
    'Free SIP calculator for India. Estimate the maturity value and gains of a monthly mutual fund SIP from your investment, expected return and duration, with a growth chart.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs = [
  {
    q: 'How is SIP maturity value calculated?',
    a: 'It uses the future value of a monthly annuity: M = P × [((1+i)^n − 1) / i] × (1+i), where P is the monthly amount, i is the monthly return (annual ÷ 12) and n is the number of months.',
  },
  {
    q: 'What return rate should I assume?',
    a: 'Equity mutual funds have historically returned ~10–13% annually over long periods, though returns are not guaranteed. Debt funds are lower. Use a conservative figure and remember past performance does not predict the future.',
  },
  {
    q: 'Does this account for taxes and expense ratio?',
    a: 'No. The estimate is a gross figure. Actual returns are reduced by the fund’s expense ratio and by capital gains tax on redemption.',
  },
  {
    q: 'What is the difference between SIP and lump-sum investing?',
    a: 'SIP spreads your investment into fixed periodic (usually monthly) instalments, which averages your purchase price over market ups and downs (rupee-cost averaging). Lump-sum invests the full amount at once — potentially higher return if markets rise steadily, but more exposed to bad timing.',
  },
  {
    q: 'Can I increase my SIP amount over time?',
    a: 'Yes — many investors use a "step-up SIP," increasing the monthly amount periodically (e.g. annually with a salary hike) rather than a flat amount throughout. This calculator models a flat monthly amount; a step-up would compound to a higher maturity value than shown here.',
  },
  {
    q: 'What happens if I stop my SIP early?',
    a: 'You keep whatever units/value has already accumulated — there\'s typically no penalty for stopping (unlike closing some fixed deposits early), though you\'ll obviously get less than the full-duration maturity value shown by running the calculator for a shorter period.',
  },
  {
    q: 'Is SIP better than a fixed deposit?',
    a: 'It depends on your risk tolerance and horizon. FDs offer a guaranteed, lower return; equity SIPs have historically outperformed FDs over long (7+ year) horizons but carry market risk and can underperform FDs over shorter or badly-timed periods.',
  },
  {
    q: 'How long should I stay invested in a SIP?',
    a: 'Equity SIPs are generally recommended for goals 5+ years away, since that horizon gives rupee-cost averaging and compounding more room to smooth out short-term market volatility — using one for a near-term goal carries more risk of redeeming during a downturn.',
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
  name: 'SIP Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Financial', path: '/financial' },
  { name: 'SIP Calculator', path: PATH },
])

export default function SipCalculatorPage() {
  return (
    <>
      <PageHero
        hub="financial"
        breadcrumb={[
          { label: 'Financial', href: '/financial' },
          { label: 'SIP Calculator', href: '/financial/sip-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>📒</span> Financial hub
          </>
        }
        h1="SIP Calculator"
        subtitle="Estimate what a monthly mutual fund SIP could grow to. Enter your monthly investment, expected annual return and duration to see the maturity value, total gains and a year-by-year growth chart."
        stats={[
          { icon: '📈', big: '10–13%', small: 'Historical equity range', tone: 'hub' },
          { icon: '📅', big: 'Monthly', small: 'Compounding basis', tone: 'hub' },
          { icon: '💰', big: 'Gross', small: 'Pre-tax figure', tone: 'hub' },
          { icon: '📊', big: 'Year-by-year', small: 'Growth chart', tone: 'hub' },
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
          Investing <strong>{formatINR(10000)}/month</strong> at 12% for 10 years
          means you invest {formatINR(example.invested)} and could reach about{' '}
          <strong>{formatINR(example.maturityValue)}</strong> — roughly{' '}
          <strong>{formatINR(example.gains)}</strong> in gains.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your SIP returns
        </h2>
        <SipCalculator />
      </section>

      <FinancialCrossSell current="sip-calculator" />

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
        <p className="mt-4 text-xs text-ash/40">
          SIP returns are market-linked and not guaranteed. This tool is for
          illustration only and is not investment advice.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
