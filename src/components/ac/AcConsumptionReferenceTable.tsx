import { acDailyUnits, marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

const TONNAGES = [0.8, 1, 1.5, 2]
const STARS = [3, 4, 5]
const REFERENCE_DISCOM = 'TNEB'
const REFERENCE_LABEL = 'Tamil Nadu (TNEB)'

/**
 * Quick-reference grid — units/hour and monthly cost by tonnage × star
 * rating, computed via the real acDailyUnits()/marginalRatePerUnit()
 * functions at one representative DISCOM. Approximation for browsing —
 * the actual calculator above should be used for a real DISCOM/hours figure.
 */
export default function AcConsumptionReferenceTable() {
  const rate = marginalRatePerUnit(REFERENCE_DISCOM)

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
            <tr>
              <th className="px-4 py-2 font-semibold">Tonnage</th>
              {STARS.map((s) => (
                <th key={s} className="px-4 py-2 text-right font-semibold">
                  {s}★ (units/hr — ₹/month, 8h/day)
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline dark:divide-white/10">
            {TONNAGES.map((t) => (
              <tr key={t}>
                <td className="px-4 py-2 font-medium">{t} Ton</td>
                {STARS.map((s) => {
                  const perHour = acDailyUnits(t, s, 1)
                  const monthlyCost = acDailyUnits(t, s, 8) * 30 * rate
                  return (
                    <td key={s} className="px-4 py-2 text-right tabular-nums">
                      {perHour.toFixed(2)} — {formatINR(Math.round(monthlyCost))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
        Approximate figures at {REFERENCE_LABEL}&apos;s top-slab rate (
        {formatINR(rate)}/unit) and 8 hours/day usage, for quick browsing
        only. Use the calculator above for your own DISCOM and hours.
      </p>
    </div>
  )
}
