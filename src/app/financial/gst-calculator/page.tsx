import type { Metadata } from 'next'
import Link from 'next/link'
import GstCalculator from '@/components/calculators/GstCalculator'
import { calculateGst } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

const SITE = 'https://bijlicalc.com'
const PATH = '/financial/gst-calculator'

const example = calculateGst(1000, 18, 'exclusive')

export const metadata: Metadata = {
  title: 'GST Calculator 2026 — Add or Remove GST (5%, 12%, 18%, 28%)',
  description:
    'Free GST calculator for India. Add GST to a base price or extract GST from an inclusive amount, with CGST/SGST split, for all standard slabs.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'website' },
}

const faqs = [
  {
    q: 'How do I add GST to a price?',
    a: 'Multiply the base amount by (1 + rate/100). For example, ₹1,000 + 18% GST = ₹1,180. The calculator does this in “GST-exclusive” mode.',
  },
  {
    q: 'How do I remove GST from an inclusive price?',
    a: 'Divide the inclusive amount by (1 + rate/100) to get the base. For 18% GST, ₹1,180 ÷ 1.18 = ₹1,000, so the GST is ₹180. Use “GST-inclusive” mode.',
  },
  {
    q: 'What is the CGST and SGST split?',
    a: 'For intra-state sales, GST is split equally into CGST and SGST. An 18% rate is 9% CGST + 9% SGST. For inter-state sales it is charged as a single IGST.',
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
  name: 'GST Calculator',
  url: `${SITE}${PATH}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  areaServed: 'India',
}

export default function GstCalculatorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brass">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/financial" className="hover:text-brass">
              Financial
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-slate-700 dark:text-slate-300">
            GST Calculator
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          GST Calculator
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Add GST to a base price or remove it from an inclusive amount, for any
          Indian GST slab (5%, 12%, 18%, 28% and more), with the CGST/SGST split.
        </p>
      </header>

      <section
        aria-labelledby="worked-example"
        className="mb-8 rounded-xl border border-brass/10 bg-brass/5 p-5 dark:border-brass/20 dark:bg-brass/15/40"
      >
        <h2
          id="worked-example"
          className="text-sm font-semibold uppercase tracking-wide text-brass dark:text-brass"
        >
          Worked example
        </h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">
          Adding 18% GST to <strong>{formatINR(example.base)}</strong> gives{' '}
          <strong>{formatINR(example.gstAmount)}</strong> GST (
          {formatINR(example.cgst)} CGST + {formatINR(example.sgst)} SGST) for a
          total of <strong>{formatINR(example.total)}</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="mb-4 text-2xl font-semibold">
          Calculate GST
        </h2>
        <GstCalculator />
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
