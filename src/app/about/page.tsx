import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'
import { tariffRegistry } from '@/lib/calc/electricity'

export const metadata: Metadata = {
  title: 'About bijlicalc — Indian Utility & Finance Calculators',
  description:
    'bijlicalc builds accurate, source-cited calculators for Indian electricity bills, rooftop solar, AC running cost and personal finance. Learn who we are and how we work.',
  alternates: { canonical: 'https://bijlicalc.com/about' },
}

const discomCount = Object.keys(tariffRegistry).length

export default function AboutPage() {
  return (
    <LegalPageShell
      title="About bijlicalc"
      intro="bijlicalc is an independent Indian calculator platform. We turn dense regulatory documents — state electricity tariff orders, the PM Surya Ghar scheme, income-tax slabs — into fast, accurate tools that a normal household can use in seconds."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Why we exist
      </h2>
      <p>
        Indian electricity bills are genuinely hard to predict: telescopic slabs,
        bi-monthly or quarterly billing, fuel cost adjustments, electricity duty
        and state-specific subsidies all interact. Most online &quot;bill
        calculators&quot; hide their assumptions or use a single flat rate that is
        simply wrong. We started bijlicalc to do the opposite — encode each
        DISCOM&apos;s actual published tariff, show our working, and cite the
        source order on every page.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        What we cover today
      </h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Electricity bills</strong> for {discomCount} DISCOMs — TANGEDCO
          (Tamil Nadu), MSEDCL (Maharashtra), UPPCL (Uttar Pradesh), BESCOM
          (Karnataka), KSEB (Kerala) and WBSEDCL (West Bengal) — with more states
          in progress.
        </li>
        <li>
          <strong>Rooftop solar</strong> ROI and the PM Surya Ghar subsidy,
          priced against your real DISCOM tariff.
        </li>
        <li>
          <strong>Air conditioners</strong> — running cost, room sizing and
          3-star vs 5-star savings.
        </li>
        <li>
          <strong>Personal finance</strong> — GST, SIP, the new vs old tax regime
          for the current financial year, and gratuity.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        How we&apos;re different
      </h2>
      <p>
        Every electricity tariff on bijlicalc lives in a structured data file with
        a <code>sourceUrl</code> pointing to the State Electricity Regulatory
        Commission order it came from, a <code>lastVerified</code> date and a{' '}
        <code>verifiedBy</code> status. We show these on each calculator, and we
        clearly label figures that are sourced but not yet cross-checked against
        the primary order. If we don&apos;t model a charge (for example
        Maharashtra&apos;s wheeling charge, or Kerala&apos;s non-telescopic slab
        above 250 units), we say so on the page rather than quietly under- or
        over-stating your bill. Read our{' '}
        <Link href="/methodology" className="text-brass underline">
          methodology
        </Link>{' '}
        for the full mechanism.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Who runs it
      </h2>
      <p>
        bijlicalc is maintained by the{' '}
        <Link href="/author/editorial-team" className="text-brass underline">
          bijlicalc editorial team
        </Link>
        , who research tariff orders, build the calculation engine and review
        every number before it goes live. Spotted an error or want a state added?{' '}
        <Link href="/contact" className="text-brass underline">
          Contact us
        </Link>
        .
      </p>
    </LegalPageShell>
  )
}
