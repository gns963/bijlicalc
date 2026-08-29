import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy — bijlicalc',
  description: 'How bijlicalc handles your data.',
  alternates: { canonical: 'https://bijlicalc.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      intro="We keep data collection to the minimum needed to run the site."
    >
      <p>
        The calculators run entirely in your browser — the units and options you
        enter are not sent to our servers or stored. We may use privacy-respecting
        analytics to understand aggregate usage.
      </p>
      <p>
        If we later add advertising or embedded services, this policy will be
        updated to describe exactly what those third parties collect.
      </p>
    </LegalPageShell>
  )
}
