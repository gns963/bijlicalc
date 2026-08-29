import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Disclaimer — bijlicalc',
  description: 'Important limitations of our estimates.',
  alternates: { canonical: 'https://bijlicalc.com/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      intro="Our calculators give estimates — always confirm against your official utility bill."
    >
      <p>
        Actual bills can differ due to rounding, meter rent, tariff revisions,
        one-time charges, and changes to fuel cost adjustment or subsidies
        between our last verification and your billing date.
      </p>
      <p>
        bijlicalc is not affiliated with any DISCOM or regulatory commission and
        is not liable for decisions made on the basis of these estimates.
      </p>
    </LegalPageShell>
  )
}
