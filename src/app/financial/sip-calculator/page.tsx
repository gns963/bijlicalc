import type { Metadata } from 'next'
import Link from 'next/link'
import SipCalculator from '@/components/calculators/SipCalculator'
import { calculateSip } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

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

export default function SipCalculatorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/financial" className="hover:text-indigo-600">
              Financial
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            SIP Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          SIP Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Estimate what a monthly mutual fund SIP could grow to. Enter your
          monthly investment, expected annual return and duration to see the
          maturity value, total gains and a year-by-year growth chart.
        </p>
      </header>

      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40"
      >
        <h2
          id="worked-example"
          className="text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300"
        >
          Worked example
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Investing <strong>{formatINR(10000)}/month</strong> at 12% for 10 years
          means you invest {formatINR(example.invested)} and could reach about{' '}
          <strong>{formatINR(example.maturityValue)}</strong> — roughly{' '}
          <strong>{formatINR(example.gains)}</strong> in gains.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Calculate your SIP returns
        </h2>
        <SipCalculator />
      </section>

      <section aria-labelledby="faq" className="mb-10">
        <h2 id="faq" className="mb-4 text-2xl font-semibold">
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
        <p className="mt-4 text-xs text-slate-400">
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
    </main>
  )
}
