import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

/**
 * Prices ONE fixed AC config across several real DISCOMs, computed live via
 * calculateAcCost() — every number here comes from the same engine the
 * calculator uses, not a hardcoded comparison table.
 */
export default function AcSlabComparisonTable({
  tonnage,
  starRating,
  dailyHours,
  discoms,
}: {
  tonnage: number
  starRating: number
  dailyHours: number
  discoms: { code: string; label: string }[]
}) {
  const rows = discoms
    .map((d) => ({ ...d, result: calculateAcCost({ discomCode: d.code, tonnage, starRating, dailyHours }) }))
    .sort((a, b) => b.result.monthlyCost - a.result.monthlyCost)

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
          <tr>
            <th className="px-4 py-2 font-semibold">DISCOM</th>
            <th className="px-4 py-2 text-right font-semibold">₹/unit (top slab)</th>
            <th className="px-4 py-2 text-right font-semibold">Monthly cost</th>
            <th className="px-4 py-2 text-right font-semibold">Annual cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline dark:divide-white/10">
          {rows.map((r) => (
            <tr key={r.code}>
              <td className="px-4 py-2 font-medium">{r.label}</td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatINR(r.result.effectiveRatePerUnit)}
              </td>
              <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-ac">
                {formatINR(r.result.monthlyCost)}
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatINR(r.result.annualCost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
