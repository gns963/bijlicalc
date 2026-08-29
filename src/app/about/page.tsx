import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'About — bijlicalc',
  description: 'What bijlicalc is and why we built it.',
  alternates: { canonical: 'https://bijlicalc.com/about' },
}

export default function AboutPage() {
  return (
    <LegalPageShell
      title="About bijlicalc"
      intro="bijlicalc builds free, accurate calculators for Indian household utility costs — electricity bills, air-conditioner running costs and rooftop solar returns."
    >
      <p>
        Indian electricity tariffs are complex: telescopic slabs, bi-monthly
        billing, fuel cost adjustments and state-specific subsidies make it hard
        to know what a bill should be. We turn each DISCOM&apos;s published
        tariff order into a calculator anyone can use in seconds.
      </p>
      <p>
        We are starting with Tamil Nadu (TANGEDCO / TNEB) and expanding to every
        state and union territory.
      </p>
    </LegalPageShell>
  )
}
