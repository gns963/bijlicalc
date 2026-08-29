import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Disclaimer — bijlicalc',
  description:
    'Important limitations of bijlicalc estimates: what tariff components we do not model, and why results are indicative, not professional, tax or investment advice.',
  alternates: { canonical: 'https://bijlicalc.com/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      intro="Our calculators give close estimates for planning and comparison. Always confirm important figures against your official bill or a qualified professional."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Electricity bills
      </h2>
      <p>
        Actual bills can differ from our estimates due to rounding, meter rent,
        one-time charges and tariff revisions between our last verification and
        your billing date. Some components are deliberately not modelled,
        including Maharashtra&apos;s wheeling charge and fuel adjustment, West
        Bengal&apos;s monthly MVCA surcharge, and Kerala&apos;s non-telescopic
        rate above 250 units a month. These limits are noted on the relevant
        calculators; see our{' '}
        <Link href="/methodology" className="text-indigo-600 underline">
          methodology
        </Link>
        .
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Solar and AC
      </h2>
      <p>
        Solar savings, system costs and payback use indicative benchmarks and a
        typical generation assumption; real quotes and output vary by location,
        shading and installer. AC running costs assume a standard compressor duty
        factor and ISEER bands. Treat both as planning estimates.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Financial calculators
      </h2>
      <p>
        GST, SIP, income-tax and gratuity tools are for general guidance only and
        are not tax, legal or investment advice. The income-tax calculator does
        not model surcharge (income above ₹50 lakh) or marginal relief, and SIP
        figures are gross of expense ratio and capital-gains tax. SIP returns are
        market-linked and not guaranteed. Consult a qualified professional before
        acting.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        No affiliation
      </h2>
      <p>
        bijlicalc is independent and not affiliated with any DISCOM, regulatory
        commission or government body, and is not liable for decisions made on the
        basis of these estimates.
      </p>
    </LegalPageShell>
  )
}
