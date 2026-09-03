import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { breadcrumbLd } from '@/lib/seo'

const SITE = 'https://desimetrics.com'
const PATH = '/blog/new-vs-old-tax-regime-who-actually-saves'
const TITLE = 'New vs Old Tax Regime: Who Actually Saves?'
const DESCRIPTION =
  'New vs old tax regime for FY 2026-27 — see the exact rule of thumb, two worked salary examples, and who actually saves more under each.'

export const metadata: Metadata = {
  title: 'New vs Old Tax Regime: Who Actually Saves?',
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: { url: `${SITE}${PATH}`, type: 'article' },
}

const breadcrumb = breadcrumbLd([
  { name: 'Home', path: '' },
  { name: 'Blog', path: '/blog' },
  { name: TITLE, path: PATH },
])

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE,
  description: DESCRIPTION,
  author: {
    '@type': 'Organization',
    name: 'DesiMetrics Editorial Team',
    url: `${SITE}/author/editorial-team`,
  },
  publisher: { '@type': 'Organization', name: 'DesiMetrics', url: SITE },
  datePublished: '2026-09-03',
  dateModified: '2026-09-03',
  mainEntityOfPage: `${SITE}${PATH}`,
}

const faqs = [
  {
    q: 'Can I switch between old and new regime every year?',
    a: 'Salaried individuals without business income can choose either regime each financial year when filing their return — you are not locked in. Those with business or professional income face more restricted switching rules, so check current CBDT guidance if that applies to you.',
  },
  {
    q: 'Is HRA available in the new tax regime?',
    a: 'No — the HRA (House Rent Allowance) exemption is one of the deductions the new regime does not allow. If your HRA exemption is large, that is one of the strongest reasons to compare against the old regime before deciding.',
  },
  {
    q: 'What is the Section 87A rebate?',
    a: 'It is a rebate that reduces your tax liability to zero up to a certain taxable income — ₹12 lakh under the new regime for FY 2026-27, or ₹5 lakh under the old regime. Combined with the new regime’s ₹75,000 standard deduction, this means salaried taxpayers with gross income up to about ₹12.75 lakh pay no tax under the new regime.',
  },
  {
    q: 'Which deductions can I still claim under the new regime?',
    a: 'Mainly the ₹75,000 standard deduction (for salaried/pensioners) and the employer’s NPS contribution under Section 80CCD(2). Most other common deductions — 80C, 80D, HRA, and home loan interest on a self-occupied property — are only available under the old regime.',
  },
  {
    q: 'Is the new tax regime always better?',
    a: 'Not always — it usually wins if you claim few deductions, but if your HRA, Section 80C investments and home loan interest add up to a large enough figure, the old regime can still save you more, even at its higher slab rates. The only way to know for sure is to compare both for your own numbers.',
  },
  {
    q: 'Do I have to actively choose the old regime, or is it automatic?',
    a: 'The new regime is the default as of now — if you want the old regime, you must actively opt for it when filing your return or submitting investment declarations to your employer.',
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

const h2Cls = 'font-display mb-3 text-2xl font-bold text-ink-navy'
const pCls = 'text-ash/80'
const takeawayCls = 'mt-3 font-semibold text-ink-navy'

const rowCls = 'px-4 py-2.5'
const rowLabelCls = `${rowCls} font-medium text-ash/70`
const rowValCls = `${rowCls} text-right font-display font-bold tabular-nums text-hub-financial`

const exampleA = [
  ['Gross salary', '₹15,00,000'],
  ['Deductions claimed (old regime)', '₹0 (minimal)'],
  ['New regime — taxable income', '₹14,25,000'],
  ['New regime — total tax', '₹97,500'],
  ['Old regime — taxable income', '₹14,50,000'],
  ['Old regime — total tax', '₹2,57,400'],
  ['Winner', 'New regime, by ₹1,59,900'],
]

const exampleB = [
  ['Gross salary', '₹15,00,000'],
  ['Deductions claimed (old regime)', '₹6,50,000 (80C ₹1.5L + HRA ~₹3L + home loan interest ₹2L)'],
  ['New regime — taxable income', '₹14,25,000'],
  ['New regime — total tax', '₹97,500'],
  ['Old regime — taxable income', '₹8,00,000'],
  ['Old regime — total tax', '₹75,400'],
  ['Winner', 'Old regime, by ₹22,100'],
]

export default function TaxRegimeArticlePage() {
  return (
    <>
      <PageHero
        hub="financial"
        breadcrumb={[
          { label: 'Blog', href: '/blog' },
          { label: 'New vs Old Tax Regime', href: PATH },
        ]}
        badgeLabel={
          <>
            <span aria-hidden>🧮</span> Explainer
          </>
        }
        h1={TITLE}
        subtitle={DESCRIPTION}
      />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-ash/50">
          By{' '}
          <Link href="/author/editorial-team" className="text-brass hover:underline">
            DesiMetrics Editorial Team
          </Link>{' '}
          · Updated 3 September 2026
        </p>

        <p className={`mt-6 text-lg ${pCls}`}>
          As a rule of thumb: if you claim <strong>few deductions</strong> — little
          or no HRA, 80C or home loan interest — the{' '}
          <strong>new regime usually saves you more</strong>. If your HRA, Section
          80C investments and home loan interest add up to a large figure, the{' '}
          <strong>old regime can still win</strong>, even with its higher slab
          rates. There is no single universal answer — it comes down to your own
          deduction total.
        </p>

        <section aria-labelledby="new-slabs" className="mt-10 scroll-mt-20">
          <h2 id="new-slabs" className={h2Cls}>
            What Are the Current New Regime Tax Slabs (FY 2026-27)?
          </h2>
          <p className={pCls}>
            Budget 2026 kept the new regime slabs unchanged from Budget 2025, for FY
            2026-27 (AY 2027-28):
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Income slab</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {[
                  ['₹0 – ₹4,00,000', 'Nil'],
                  ['₹4,00,000 – ₹8,00,000', '5%'],
                  ['₹8,00,000 – ₹12,00,000', '10%'],
                  ['₹12,00,000 – ₹16,00,000', '15%'],
                  ['₹16,00,000 – ₹20,00,000', '20%'],
                  ['₹20,00,000 – ₹24,00,000', '25%'],
                  ['Above ₹24,00,000', '30%'],
                ].map(([slab, rate]) => (
                  <tr key={slab}>
                    <td className="px-4 py-2 font-medium">{slab}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${pCls}`}>
            On top of these slabs, salaried employees and pensioners get a{' '}
            <strong>₹75,000 standard deduction</strong> — a flat amount subtracted
            from your salary before tax is calculated, no proof needed. A{' '}
            <strong>Section 87A rebate</strong> (a credit that cancels out your tax
            bill up to a threshold) then brings tax payable to zero up to ₹12 lakh{' '}
            <em>taxable</em> income — effectively up to about{' '}
            <strong>₹12.75 lakh gross salary</strong> once the standard deduction is
            applied.
          </p>
          <p className={takeawayCls}>
            Takeaway: Under the new regime, a salaried taxpayer earning up to about
            ₹12.75 lakh a year pays no income tax at all.
          </p>
        </section>

        <section aria-labelledby="old-slabs" className="mt-10 scroll-mt-20">
          <h2 id="old-slabs" className={h2Cls}>
            What Are the Old Regime Tax Slabs and Deductions?
          </h2>
          <p className={pCls}>The old regime uses the traditional slab structure:</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold">Income slab</th>
                  <th className="px-4 py-2 text-right font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {[
                  ['₹0 – ₹2,50,000', 'Nil'],
                  ['₹2,50,000 – ₹5,00,000', '5%'],
                  ['₹5,00,000 – ₹10,00,000', '20%'],
                  ['Above ₹10,00,000', '30%'],
                ].map(([slab, rate]) => (
                  <tr key={slab}>
                    <td className="px-4 py-2 font-medium">{slab}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${pCls}`}>
            The old regime&apos;s rates look higher at every slab — but it allows
            deductions the new regime doesn&apos;t: <strong>HRA exemption</strong>{' '}
            (a tax-free portion of your house rent allowance), <strong>Section
            80C</strong> (up to ₹1.5 lakh for PPF, ELSS, life insurance and similar),{' '}
            <strong>Section 80D</strong> (health insurance premiums), and{' '}
            <strong>home loan interest</strong> on a self-occupied property (Section
            24b), plus a smaller ₹50,000 standard deduction.
          </p>
          <p className={takeawayCls}>
            Takeaway: The old regime trades higher slab rates for a longer list of
            deductions — it only wins if those deductions are large enough to offset
            the rate difference.
          </p>
        </section>

        <section aria-labelledby="comparison" className="mt-10 scroll-mt-20">
          <h2 id="comparison" className={h2Cls}>
            Key Differences Between New and Old Regime
          </h2>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-mist text-ink-navy">
                <tr>
                  <th className="px-4 py-2 font-semibold"></th>
                  <th className="px-4 py-2 font-semibold">New Regime</th>
                  <th className="px-4 py-2 font-semibold">Old Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="px-4 py-2 font-medium">Standard deduction</td>
                  <td className="px-4 py-2">₹75,000</td>
                  <td className="px-4 py-2">₹50,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">87A rebate ceiling</td>
                  <td className="px-4 py-2">₹12,00,000 taxable income</td>
                  <td className="px-4 py-2">₹5,00,000 taxable income</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">HRA exemption</td>
                  <td className="px-4 py-2">Not allowed</td>
                  <td className="px-4 py-2">Allowed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Section 80C, 80D</td>
                  <td className="px-4 py-2">Not allowed</td>
                  <td className="px-4 py-2">Allowed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Home loan interest (24b)</td>
                  <td className="px-4 py-2">Not allowed (self-occupied)</td>
                  <td className="px-4 py-2">Allowed, up to ₹2,00,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Default regime</td>
                  <td className="px-4 py-2">Yes, applied automatically</td>
                  <td className="px-4 py-2">Must actively opt in</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Best suited to</td>
                  <td className="px-4 py-2">Few/no deductions to claim</td>
                  <td className="px-4 py-2">High HRA, 80C, home loan interest</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className={takeawayCls}>
            Takeaway: Every deduction row the old regime allows is a reason to at
            least run the comparison before defaulting to the new regime.
          </p>
        </section>

        <section aria-labelledby="new-wins" className="mt-10 scroll-mt-20">
          <h2 id="new-wins" className={h2Cls}>
            Who Actually Saves More Under the New Regime?
          </h2>
          <ul className="space-y-2">
            {[
              'You don\'t pay rent, or your HRA exemption would be small.',
              'You haven\'t invested much (or anything) under Section 80C.',
              'You don\'t have a home loan, or already finished repaying one.',
              'You want a simpler return with fewer proofs and declarations to manage.',
              'Your total realistic deductions under the old regime would add up to well under ₹1–1.5 lakh.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-hub-financial" aria-hidden>✓</span>
                <span className={pCls}>{t}</span>
              </li>
            ))}
          </ul>
          <p className={takeawayCls}>
            Takeaway: The new regime tends to win for taxpayers who wouldn&apos;t
            claim much under the old regime anyway.
          </p>
        </section>

        <section aria-labelledby="old-wins" className="mt-10 scroll-mt-20">
          <h2 id="old-wins" className={h2Cls}>
            Who Actually Saves More Under the Old Regime?
          </h2>
          <ul className="space-y-2">
            {[
              'You pay significant rent and would claim a large HRA exemption.',
              'You max out (or come close to) your ₹1.5 lakh Section 80C limit.',
              'You\'re repaying a home loan on a self-occupied property.',
              'You pay for health insurance and would claim Section 80D.',
              'Your combined deductions comfortably exceed roughly ₹4–5 lakh.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-hub-financial" aria-hidden>✓</span>
                <span className={pCls}>{t}</span>
              </li>
            ))}
          </ul>
          <p className={takeawayCls}>
            Takeaway: The old regime tends to win when several deductions stack
            together — rarely from just one alone.
          </p>
        </section>

        <section aria-labelledby="worked-examples" className="mt-10 scroll-mt-20">
          <h2 id="worked-examples" className={h2Cls}>
            Real Example: Same Salary, Two Regimes, Two Outcomes
          </h2>
          <p className={pCls}>
            Both examples below use the same <strong>₹15,00,000 gross salary</strong>{' '}
            — only the deductions claimed change. All figures are computed using the
            exact FY 2026-27 slabs and rebate rules above.
          </p>

          <h3 className="font-display mt-6 mb-2 text-lg font-bold text-ink-navy">
            Example A: Minimal deductions
          </h3>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-hairline">
                {exampleA.map(([label, value]) => (
                  <tr key={label}>
                    <td className={rowLabelCls}>{label}</td>
                    <td className={rowValCls}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-display mt-6 mb-2 text-lg font-bold text-ink-navy">
            Example B: High HRA + 80C + home loan interest
          </h3>
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-hairline">
                {exampleB.map(([label, value]) => (
                  <tr key={label}>
                    <td className={rowLabelCls}>{label}</td>
                    <td className={rowValCls}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={`mt-4 ${pCls}`}>
            Same salary, opposite winner — Example A shows the new regime saving
            nearly ₹1.6 lakh, while Example B&apos;s larger deductions flip the
            result, with the old regime saving about ₹22,100 instead. Run your own
            salary and deductions through our{' '}
            <Link href="/financial/new-vs-old-tax-regime-calculator" className="text-brass underline">
              new vs old tax regime calculator
            </Link>{' '}
            rather than relying on either example.
          </p>
          <p className={takeawayCls}>
            Takeaway: The exact same salary can favour either regime — the deciding
            factor is always your own deduction total, not the salary itself.
          </p>
        </section>

        <section aria-labelledby="how-to-decide" className="mt-10 scroll-mt-20">
          <h2 id="how-to-decide" className={h2Cls}>
            How to Decide Which Regime Is Right for You
          </h2>
          <ol className="space-y-2">
            {[
              'Add up your realistic old-regime deductions: HRA exemption, Section 80C investments, Section 80D premiums, and home loan interest (up to ₹2 lakh for a self-occupied property).',
              'If that total is small (well under ₹1–1.5 lakh), the new regime is very likely to win.',
              'If that total is large (₹4–5 lakh or more, as in Example B), compare both properly — the old regime may well win.',
              'For anything in between, run both numbers through a calculator rather than guessing.',
              'Remember the new regime is now the default — you must actively opt for the old regime if you want it.',
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hub-financial font-display text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className={pCls}>{s}</span>
              </li>
            ))}
          </ol>
          <p className={`mt-4 ${pCls}`}>
            This article is general information, not personalised financial or tax
            advice — individual circumstances vary, and it&apos;s worth consulting a
            CA or tax advisor for anything beyond a straightforward salaried
            situation.
          </p>
          <p className={takeawayCls}>
            Takeaway: When in doubt, add up your real deductions and compare both
            regimes directly — don&apos;t assume either one is automatically better.
          </p>
        </section>

        <section aria-labelledby="related" className="mt-10 scroll-mt-20">
          <h2 id="related" className={h2Cls}>
            Related tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/financial/new-vs-old-tax-regime-calculator"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-financial/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🏦</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                New vs old tax regime calculator
              </p>
              <p className="mt-1 text-xs text-ash/60">
                Run your own salary and deductions through both regimes.
              </p>
            </Link>
            <Link
              href="/financial"
              className="rounded-xl border border-hairline bg-paper p-5 transition hover:border-hub-financial/50 hover:shadow-sm"
            >
              <span className="text-xl" aria-hidden>🧮</span>
              <p className="font-display mt-2 font-bold text-ink-navy">
                All financial calculators
              </p>
              <p className="mt-1 text-xs text-ash/60">
                GST, SIP, and gratuity calculators for FY 2026-27.
              </p>
            </Link>
          </div>
        </section>

        <section aria-labelledby="faq" className="mt-10 scroll-mt-20">
          <h2 id="faq" className={h2Cls}>
            Frequently asked questions
          </h2>
          <div className="divide-y divide-hairline">
            {faqs.map((f, i) => (
              <details key={i} className="group py-3">
                <summary className="cursor-pointer list-none font-medium text-ash marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-ash/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-ash/40">
          Tax slabs, rebate thresholds and deduction limits are set by the Union
          Budget and can change every year. This article covers FY 2026-27 (AY
          2027-28) figures — always verify the current-year slabs on the official
          Income Tax Department website (incometax.gov.in) before filing, and this
          is not a substitute for advice from a qualified CA or tax advisor.
        </p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </main>
    </>
  )
}
