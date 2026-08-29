import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Methodology — bijlicalc',
  description: 'How bijlicalc calculates electricity bills.',
  alternates: { canonical: 'https://bijlicalc.com/methodology' },
}

export default function MethodologyPage() {
  return (
    <LegalPageShell
      title="Methodology"
      intro="How our calculators turn your consumption into an estimated bill."
    >
      <p>
        Every bill is built from the DISCOM&apos;s published tariff: consumption
        is split across telescopic slabs and each slab is charged at its own
        rate. We then add the fuel cost adjustment, the phase-based fixed charge,
        any electricity duty and meter rent, and subtract eligible subsidies.
      </p>
      <p>
        For DISCOMs that bill bi-monthly, we always show both the two-month total
        and a monthly-equivalent figure to avoid confusion.
      </p>
    </LegalPageShell>
  )
}
