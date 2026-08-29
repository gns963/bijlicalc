import type { Metadata } from 'next'
import Link from 'next/link'
import GratuityCalculator from '@/components/calculators/GratuityCalculator'
import { calculateGratuity } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'
const PATH = '/financial/gratuity-calculator'

const example = calculateGratuity(50000, 10)

export const metadata: Metadata = {
  title: 'Gratuity Calculator 2026 — Payment of Gratuity Act Formula',
  description:
    'Free gratuity calculator for India. Compute your gratuity from last drawn Basic + DA and years of service using the 15/26 formula, with the ₹20 lakh statutory cap.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs = [
  {
    q: 'What is the gratuity formula?',
    a: 'Under the Payment of Gratuity Act, gratuity = (15 / 26) × last drawn monthly Basic + DA × years of service. The 26 represents working days in a month and 15 is 15 days’ wages for each completed year.',
  },
  {
    q: 'How many years of service are needed for gratuity?',
    a: 'You generally need at least 5 years of continuous service. A part-year of more than 6 months counts as a full year for the calculation.',
  },
  {
    q: 'Is there a maximum gratuity amount?',
    a: 'Yes. The statutory ceiling is ₹20,00,000. Any amount above this may be taxable and depends on your employer’s policy.',
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
  name: 'Gratuity Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

export default function GratuityCalculatorPage() {
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
            Gratuity Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Gratuity Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Work out the gratuity you&apos;re entitled to under the Payment of
          Gratuity Act, from your last drawn Basic + DA and years of service,
          using the standard 15/26 formula.
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
          For a last drawn Basic + DA of <strong>{formatINR(50000)}</strong> and{' '}
          <strong>10 years</strong> of service, gratuity = (15 ÷ 26) × 50,000 ×
          10 = <strong>{formatINR(example.gratuity)}</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Calculate your gratuity
        </h2>
        <GratuityCalculator />
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
