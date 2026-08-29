import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — bijlicalc',
  description: 'How bijlicalc may earn from links.',
  alternates: { canonical: 'https://bijlicalc.com/affiliate-disclosure' },
}

export default function AffiliateDisclosurePage() {
  return (
    <LegalPageShell
      title="Affiliate Disclosure"
      intro="Some links on bijlicalc may be affiliate links."
    >
      <p>
        If we recommend products such as solar installers or energy-efficient
        appliances, some links may earn us a commission at no extra cost to you.
        This never influences our tariff data or the numbers a calculator
        produces.
      </p>
      <p>
        Any page containing affiliate links will say so clearly.
      </p>
    </LegalPageShell>
  )
}
