import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'
import { tariffRegistry } from '@/lib/calc/electricity'
import { formatIsoDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Data Sources — Official Tariff Orders Behind Every Calculator',
  description:
    'The official SERC tariff order and last-verified date behind every DISCOM bijlicalc covers, plus the source for solar subsidy and income-tax data.',
  alternates: { canonical: 'https://bijlicalc.com/data-sources' },
}

const tariffs = Object.values(tariffRegistry).sort((a, b) =>
  a.state.localeCompare(b.state),
)

export default function DataSourcesPage() {
  return (
    <LegalPageShell
      title="Data Sources"
      intro="Every tariff on bijlicalc traces to a primary regulatory document. Below is the exact source order and last-verified date for each DISCOM we currently cover — the same sourceUrl and lastVerified values stored in our tariff data files."
      stub={false}
    >
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Electricity DISCOMs
      </h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 font-semibold">State</th>
              <th className="px-4 py-2 font-semibold">DISCOM</th>
              <th className="px-4 py-2 font-semibold">Source order</th>
              <th className="px-4 py-2 font-semibold">Last verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {tariffs.map((t) => (
              <tr key={t.discomCode}>
                <td className="px-4 py-2">{t.state}</td>
                <td className="px-4 py-2 font-medium">{t.discomCode}</td>
                <td className="px-4 py-2">
                  <a
                    href={t.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brass underline hover:text-brass"
                  >
                    View order
                  </a>
                </td>
                <td className="px-4 py-2 tabular-nums">
                  {formatIsoDate(t.lastVerified)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Some entries are currently sourced from secondary references while we
        cross-check the primary SERC order — each such file carries an explicit
        &quot;pending primary cross-check&quot; note, shown on its calculator
        page.
      </p>

      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Other data
      </h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Rooftop solar subsidy</strong> — PM Surya Ghar: Muft Bijli
          Yojana, Government of India (₹30,000/kW for the first 2 kW, ₹18,000 for
          the 3rd, capped at ₹78,000).
        </li>
        <li>
          <strong>Income tax slabs</strong> — Finance Act rates for FY 2026-27
          (AY 2027-28), including the ₹75,000/₹50,000 standard deductions and
          Section 87A rebates.
        </li>
        <li>
          <strong>AC efficiency</strong> — Bureau of Energy Efficiency (BEE)
          ISEER star-rating bands.
        </li>
        <li>
          <strong>Gratuity</strong> — Payment of Gratuity Act, 1972 (15/26
          formula, ₹20,00,000 ceiling).
        </li>
      </ul>
    </LegalPageShell>
  )
}
