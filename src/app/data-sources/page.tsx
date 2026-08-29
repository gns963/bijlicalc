import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'Data Sources — bijlicalc',
  description: 'Where our tariff data comes from.',
  alternates: { canonical: 'https://bijlicalc.com/data-sources' },
}

export default function DataSourcesPage() {
  return (
    <LegalPageShell
      title="Data Sources"
      intro="Our tariff data comes from official regulatory orders, not third-party summaries."
    >
      <p>
        Rates are taken from State Electricity Regulatory Commission (SERC)
        tariff orders and DISCOM notifications. Each calculator shows the date
        its data was last verified and links directly to the source order.
      </p>
      <p>
        Tamil Nadu data is sourced from the Tamil Nadu Electricity Regulatory
        Commission (TNERC).
      </p>
    </LegalPageShell>
  )
}
