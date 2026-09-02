import type { Metadata } from 'next'
import FinancialCrossSell from '@/components/FinancialCrossSell'
import PageHero from '@/components/PageHero'
import TaxRegimeCalculator from '@/components/calculators/TaxRegimeCalculator'
import { compareRegimes } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
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
  {
    q: 'Which deductions are only available under the old regime?',
    a: 'Section 80C (up to ₹1.5L — PF, ELSS, life insurance, etc.), 80D (health insurance premiums), HRA exemption, home loan interest on a self-occupied property (Section 24), and most other Chapter VI-A deductions are only available if you opt for the old regime.',
  },
  {
    q: 'Can I switch between regimes every year?',
    a: 'Salaried individuals without business income can choose either regime each financial year when filing their return. Those with business/professional income have more restricted switching rules — check current CBDT guidance for your specific situation.',
  },
  {
    q: 'What is the Section 87A rebate?',
    a: 'It\'s a rebate that effectively zeroes out tax liability up to a specified income threshold, which is higher under the new regime — this is a major reason many salaried taxpayers under ~₹12.75L now owe no tax under the new regime once combined with the standard deduction.',
  },
  {
    q: 'Does this calculator include cess?',
    a: 'Yes — a 4% health and education cess is applied on top of the computed income tax (after rebate) under both regimes, matching the standard calculation method.',
  },
  {
    q: 'Is this calculator accurate for freelancers or business income?',
    a: 'It\'s built around salaried-income deductions and slabs. Business/professional income has additional rules (presumptive taxation options, different regime-switching restrictions) that this calculator doesn\'t model — consult a tax professional for business income specifically.',
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
const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Financial', path: '/financial' },
  { name: 'New vs Old Tax Regime', path: PATH },
])

export default function TaxRegimePage() {
  return (
    <>
      <PageHero
        hub="financial"
        breadcrumb={[
          { label: 'Financial', href: '/financial' },
          { label: 'New vs Old Tax Regime', href: '/financial/new-vs-old-tax-regime-calculator' },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>📒</span> Financial hub
          </>
        }
        h1="New vs Old Tax Regime Calculator (FY 2026-27)"
        subtitle={
          <>
            Compare your income tax under the <strong>new</strong> and{' '}
            <strong>old</strong> regimes for FY 2026-27 (AY 2027-28), including the
            latest slabs, standard deduction, Section 87A rebate and 4% cess.
          </>
        }
        stats={[
          { icon: '🎯', big: '₹12.75L', small: 'Tax-free (new regime)', tone: 'hub' },
          { icon: '📊', big: '7 slabs', small: 'New regime', tone: 'hub' },
          { icon: '➕', big: '4%', small: 'Health & education cess', tone: 'hub' },
          { icon: '📅', big: 'FY 2026-27', small: 'AY 2027-28', tone: 'hub' },
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
          On a <strong>₹15,00,000</strong> salary with ₹1,50,000 of old-regime
          deductions, the new regime tax is{' '}
          <strong>{formatINR(example.newRegime.totalTax)}</strong> vs{' '}
          <strong>{formatINR(example.oldRegime.totalTax)}</strong> under the old
          regime — the {example.recommended} regime saves{' '}
          <strong>{formatINR(example.saving)}</strong>.
        </p>
      </section>

      <section aria-labelledby="calculator" className="mb-10">
        <h2 id="calculator" className="font-display mb-4 text-2xl font-semibold">
          Compare your tax
        </h2>
        <TaxRegimeCalculator />
      </section>

      <section aria-labelledby="slabs" className="mb-10">
        <h2 id="slabs" className="font-display mb-4 text-2xl font-semibold">
          New regime slabs — FY 2026-27
        </h2>
        <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist dark:bg-slate-800">
              <tr>
                <th className="px-4 py-2 font-semibold">Income slab</th>
                <th className="px-4 py-2 text-right font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline dark:divide-white/10">
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
          For general guidance only, not tax advice. Surcharge (income &gt; ₹50L)
          and marginal relief are not modelled; consult a professional for
          filing.
        </p>
      </section>

      <FinancialCrossSell current="new-vs-old-tax-regime-calculator" />

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
