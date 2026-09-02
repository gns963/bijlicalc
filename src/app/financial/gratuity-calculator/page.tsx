import type { Metadata } from 'next'
import FinancialCrossSell from '@/components/FinancialCrossSell'
import PageHero from '@/components/PageHero'
import GratuityCalculator from '@/components/calculators/GratuityCalculator'
import { calculateGratuity } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
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
  {
    q: 'Is gratuity taxable?',
    a: 'For government employees, gratuity is fully tax-exempt. For private-sector employees covered under the Payment of Gratuity Act, it\'s exempt up to the statutory ceiling (₹20,00,000) or the amount actually received, whichever is lower — amounts above that may be taxable as per current income tax rules.',
  },
  {
    q: 'Does gratuity apply to all employees?',
    a: 'The Payment of Gratuity Act applies to organisations with 10 or more employees. Employees covered by it become eligible after 5 years of continuous service (with exceptions for death or disability, where the 5-year requirement is waived).',
  },
  {
    q: 'What counts as "last drawn salary" for gratuity?',
    a: 'It\'s your last drawn Basic pay plus Dearness Allowance (DA) — other components like HRA, bonus, and other allowances are typically excluded from the gratuity calculation base.',
  },
  {
    q: 'Does gratuity apply if I resign vs get terminated?',
    a: 'Generally yes, gratuity is payable on resignation too, provided you\'ve completed the minimum 5 years of continuous service — the entitlement isn\'t limited to retirement or layoff scenarios.',
  },
  {
    q: 'Why does the formula use 26 days instead of 30?',
    a: '26 represents the typical number of working days in a month under the Payment of Gratuity Act\'s calculation convention (excluding weekly offs), not the calendar month length — this is a fixed part of the statutory formula, not an assumption we\'ve added.',
  },
  {
    q: 'What if my company isn\'t covered under the Payment of Gratuity Act?',
    a: 'Some employers offer gratuity under their own policy even if not statutorily required to — the calculation basis may differ from the 15/26 formula in that case, so check your specific employment terms rather than assuming this calculator applies.',
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
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Financial', path: '/financial' },
  { name: 'Gratuity Calculator', path: PATH },
])

export default function GratuityCalculatorPage() {
  return (
    <>
      <PageHero
        hub="financial"
        breadcrumb={[
          { label: 'Financial', href: '/financial' },
          { label: 'Gratuity Calculator', href: '/financial/gratuity-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>📒</span> Financial hub
          </>
        }
        h1="Gratuity Calculator"
        subtitle={
          <>
            Work out the gratuity you&apos;re entitled to under the Payment of
            Gratuity Act, from your last drawn Basic + DA and years of service,
            using the standard 15/26 formula.
          </>
        }
        stats={[
          { icon: '🧮', big: '15 / 26', small: 'Formula basis', tone: 'hub' },
          { icon: '📅', big: '5 yrs', small: 'Minimum service', tone: 'hub' },
          { icon: '🧢', big: '₹20,00,000', small: 'Statutory cap', tone: 'hub' },
          { icon: '💼', big: 'Basic + DA', small: 'What counts', tone: 'hub' },
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
          For a last drawn Basic + DA of <strong>{formatINR(50000)}</strong> and{' '}
          <strong>10 years</strong> of service, gratuity = (15 ÷ 26) × 50,000 ×
          10 = <strong>{formatINR(example.gratuity)}</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Calculate your gratuity
        </h2>
        <GratuityCalculator />
      </section>

      <FinancialCrossSell current="gratuity-calculator" />

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
    </>
  )
}
