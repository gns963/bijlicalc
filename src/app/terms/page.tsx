import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Terms of Use — bijlicalc',
  description: 'The terms governing use of bijlicalc.',
  alternates: { canonical: 'https://bijlicalc.com/terms' },
}

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Use"
      intro="By using bijlicalc you agree to these terms."
    >
      <p>
        Our calculators are provided for general information only and produce
        estimates, not official bills. You use them at your own discretion.
      </p>
      <p>
        We work to keep tariff data accurate but do not warrant that every figure
        is current or error-free. See our Disclaimer for details.
      </p>
    </LegalPageShell>
  )
}
