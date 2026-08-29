import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Editorial Policy — bijlicalc',
  description: 'Our standards for accuracy and corrections.',
  alternates: { canonical: 'https://bijlicalc.com/editorial-policy' },
}

export default function EditorialPolicyPage() {
  return (
    <LegalPageShell
      title="Editorial Policy"
      intro="How we keep calculations accurate and correct mistakes."
    >
      <p>
        We do not publish a tariff until it has been checked against the primary
        regulatory source. Figures that are awaiting verification are labelled
        as such rather than presented as final.
      </p>
      <p>
        If you spot an error, contact us and we will review and correct it, and
        update the &quot;last verified&quot; date on the affected calculator.
      </p>
    </LegalPageShell>
  )
}
