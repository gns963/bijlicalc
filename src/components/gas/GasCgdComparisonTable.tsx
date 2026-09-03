import { computeGasBill, getGasTariff } from '@/lib/calc/gas'
import { formatINR } from '@/lib/format'

/**
 * Prices the SAME SCM consumption across multiple real CGD tariffs, computed
 * live via computeGasBill() — every number here comes from the same engine
 * the calculator uses, not a hardcoded comparison table.
 */
export default function GasCgdComparisonTable({
  scmConsumed,
  cgdCodes,
}: {
  scmConsumed: number
  cgdCodes: string[]
}) {
  const rows = cgdCodes
    .map((code) => {
      const tariff = getGasTariff(code)
      const result = computeGasBill(tariff, { scmConsumed })
      return { tariff, result }
    })
    .sort((a, b) => b.result.total - a.result.total)

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-hairline bg-mist text-ink-navy">
          <tr>
            <th className="px-4 py-2 font-semibold">CGD</th>
            <th className="px-4 py-2 text-right font-semibold">₹/SCM</th>
            <th className="px-4 py-2 text-right font-semibold">Fixed charge</th>
            <th className="px-4 py-2 text-right font-semibold">Total ({scmConsumed} SCM)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map(({ tariff, result }) => (
            <tr key={tariff.cgdCode}>
              <td className="px-4 py-2 font-medium">
                {tariff.cgdName} ({tariff.cgdCode})
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatINR(tariff.slabs[0].ratePerSCM)}
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatINR(tariff.fixedCharge)}
              </td>
              <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-gas">
                {formatINR(result.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
