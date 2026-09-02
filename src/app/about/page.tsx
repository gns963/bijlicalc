import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'
import { tariffRegistry } from '@/lib/calc/electricity'

export const metadata: Metadata = {
  title: 'About DesiMetrics — Indian Utility & Finance Calculators',
  description:
    'DesiMetrics builds accurate, source-cited calculators for Indian electricity bills, rooftop solar, AC running cost and personal finance. Learn who we are and how we work.',
  alternates: { canonical: 'https://desimetrics.com/about' },
}

const discomCount = Object.keys(tariffRegistry).length

export default function AboutPage() {
  return (
    <LegalPageShell
      title="About DesiMetrics"
      intro="DesiMetrics is an independent Indian calculator platform. We turn dense regulatory documents — state electricity tariff orders, the PM Surya Ghar scheme, income-tax slabs — into fast, accurate tools that a normal household can use in seconds."
      stub={false}
      path="/about"
    >
      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Why we exist
      </h2>
      <p>
        Indian electricity bills are genuinely hard to predict: telescopic slabs,
        bi-monthly or quarterly billing, fuel cost adjustments, electricity duty
        and state-specific subsidies all interact. Most online &quot;bill
        calculators&quot; hide their assumptions or use a single flat rate that is
        simply wrong. We started DesiMetrics to do the opposite — encode each
        DISCOM&apos;s actual published tariff, show our working, and cite the
        source order on every page.
      </p>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        What we cover today
      </h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Electricity bills</strong> for all {discomCount} DISCOMs
          across every Indian state and union territory — telescopic slabs,
          fixed charges, fuel cost adjustment, electricity duty and
          subsidies, each sourced to its own SERC tariff order.
        </li>
        <li>
          <strong>Rooftop solar</strong> — ROI/payback, panel sizing, battery
          backup, net metering earnings and the PM Surya Ghar subsidy, priced
          against your real DISCOM tariff.
        </li>
        <li>
          <strong>Air conditioners</strong> — running cost, room sizing, power
          consumption, circuit safety guidance, brand-specific calculators and
          3-star vs 5-star savings.
        </li>
        <li>
          <strong>Home appliances</strong> — ceiling fan and fridge running
          cost, inverter/UPS sizing and backup time, room cooling time and
          water tank fill time.
        </li>
        <li>
          <strong>Fuel costs</strong> — petrol/diesel per km, LPG cylinder
          usage and generator running cost.
        </li>
        <li>
          <strong>Water and gas bills</strong> — honest calculators that use
          your own consumption and rate, since municipal and city-gas tariffs
          aren&apos;t centrally published in a way we can verify.
        </li>
        <li>
          <strong>Personal finance</strong> — GST, SIP, the new vs old tax regime
          for the current financial year, and gratuity.
        </li>
      </ul>

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        How we&apos;re different
      </h2>
      <p>
        Every electricity tariff on DesiMetrics lives in a structured data file with
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

      <h2 className="font-display text-xl font-semibold text-ash dark:text-gazette-cream">
        Who runs it
      </h2>
      <p>
        DesiMetrics is maintained by the{' '}
        <Link href="/author/editorial-team" className="text-brass underline">
          DesiMetrics editorial team
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
