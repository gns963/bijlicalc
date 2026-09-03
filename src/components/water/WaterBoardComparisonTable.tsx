import { computeWaterBill, getWaterTariff } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'

/**
 * Prices the SAME KL consumption across multiple real board tariffs,
 * computed live via computeWaterBill() — every number here comes from the
 * same engine the calculator uses, not a hardcoded comparison table.
 */
export default function WaterBoardComparisonTable({
  consumptionKl,
  boardCodes,
}: {
  consumptionKl: number
  boardCodes: string[]
}) {
  const rows = boardCodes
    .map((code) => {
      const tariff = getWaterTariff(code)
      const result = computeWaterBill(tariff, { consumptionKl })
      return { tariff, result }
    })
    .sort((a, b) => b.result.total - a.result.total)

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-hairline bg-mist text-ink-navy">
          <tr>
            <th className="px-4 py-2 font-semibold">Board</th>
            <th className="px-4 py-2 text-right font-semibold">Entry ₹/KL</th>
            <th className="px-4 py-2 text-right font-semibold">Sewerage</th>
            <th className="px-4 py-2 text-right font-semibold">Total ({consumptionKl} KL)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map(({ tariff, result }) => (
            <tr key={tariff.boardCode}>
              <td className="px-4 py-2 font-medium">
                {tariff.boardName} ({tariff.boardCode})
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {formatINR(tariff.slabs[0].ratePerKL)}
              </td>
              <td className="px-4 py-2 text-right tabular-nums">
                {tariff.sewerageChargePercent}%
              </td>
              <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-water">
                {formatINR(result.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
