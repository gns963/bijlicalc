import type { Metadata } from 'next'
import Link from 'next/link'
import TaxRegimeCalculator from '@/components/calculators/TaxRegimeCalculator'
import { compareRegimes } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'
const PATH = '/financial/new-vs-old-tax-regime-calculator'

const example = compareRegimes(1500000, 150000)

export const metadata: Metadata = {
  title: 'New vs Old Tax Regime Calculator FY 2026-27 (AY 2027-28)',
  description:
    'Compare income tax under the new and old regimes for FY 2026-27. Includes updated slabs, ₹75,000/₹50,000 standard deduction, 87A rebate and 4% cess. See which saves you more.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs = [
  {
    q: 'Is the new or old tax regime better?',
    a: 'It depends on your deductions. The new regime has lower rates and a ₹75,000 standard deduction but disallows most other deductions. The old regime is better only if your 80C/80D/HRA and other deductions are large enough to offset its higher rates. This calculator compares both for your numbers.',
  },
  {
    q: 'What income is tax-free under the new regime in FY 2026-27?',
    a: 'Thanks to the ₹75,000 standard deduction and the enhanced Section 87A rebate, salaried individuals with income up to about ₹12.75 lakh pay zero tax under the new regime.',
  },
  {
    q: 'Which deductions still work in the new regime?',
    a: 'The standard deduction of ₹75,000 and the employer’s NPS contribution (80CCD(2)) are allowed. Most others — 80C, 80D, HRA, home loan interest on self-occupied property — are only available in the old regime.',
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
  name: 'New vs Old Tax Regime Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

export default function TaxRegimePage() {
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
            New vs Old Tax Regime
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          New vs Old Tax Regime Calculator (FY 2026-27)
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Compare your income tax under the <strong>new</strong> and{' '}
          <strong>old</strong> regimes for FY 2026-27 (AY 2027-28), including the
          latest slabs, standard deduction, Section 87A rebate and 4% cess.
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
          On a <strong>₹15,00,000</strong> salary with ₹1,50,000 of old-regime
          deductions, the new regime tax is{' '}
          <strong>{formatINR(example.newRegime.totalTax)}</strong> vs{' '}
          <strong>{formatINR(example.oldRegime.totalTax)}</strong> under the old
          regime — the {example.recommended} regime saves{' '}
          <strong>{formatINR(example.saving)}</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Compare your tax
        </h2>
        <TaxRegimeCalculator />
      </section>

      <section aria-labelledby="slabs" className="mb-10">
        <h2 id="slabs" className="mb-4 text-2xl font-semibold">
          New regime slabs — FY 2026-27
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-2 font-semibold">Income slab</th>
                <th className="px-4 py-2 text-right font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                ['Up to ₹4,00,000', 'Nil'],
                ['₹4,00,001 – ₹8,00,000', '5%'],
                ['₹8,00,001 – ₹12,00,000', '10%'],
                ['₹12,00,001 – ₹16,00,000', '15%'],
                ['₹16,00,001 – ₹20,00,000', '20%'],
                ['₹20,00,001 – ₹24,00,000', '25%'],
                ['Above ₹24,00,000', '30%'],
              ].map(([slab, rate]) => (
                <tr key={slab}>
                  <td className="px-4 py-2">{slab}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          For general guidance only, not tax advice. Surcharge (income &gt; ₹50L)
          and marginal relief are not modelled; consult a professional for
          filing.
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
