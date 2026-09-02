import { computeWaterBill, getWaterTariff } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'

const KL_LEVELS = [5, 10, 15, 20, 25, 40, 60]
const REFERENCE_BOARD = 'DJB'

/**
 * Quick-reference grid — KL consumed (per billing cycle) against a rough
 * household-size equivalent and approximate monthly cost, computed live via
 * computeWaterBill() at one representative board. Approximation for
 * browsing — the actual calculator above should be used for your own board.
 */
export default function WaterConsumptionReferenceTable() {
  const tariff = getWaterTariff(REFERENCE_BOARD)
  const periodMonths = tariff.billingCycle === 'bimonthly' ? 2 : 1

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-mist text-ink-navy dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream">
            <tr>
              <th className="px-4 py-2 font-semibold">KL (per cycle)</th>
              <th className="px-4 py-2 text-right font-semibold">~Household size</th>
              <th className="px-4 py-2 text-right font-semibold">
                Approx. monthly cost ({tariff.boardCode})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline dark:divide-white/10">
            {KL_LEVELS.map((kl) => {
              const bill = computeWaterBill(tariff, { consumptionKl: kl })
              const monthly = bill.monthlyEquivalent?.total ?? bill.total
              const monthlyKl = kl / periodMonths
              // ~4.5 KL/month is a commonly cited per-person domestic
              // benchmark — a rough sizing cue, not a precise figure.
              const peopleEquivalent = Math.max(1, Math.round(monthlyKl / 4.5))
              return (
                <tr key={kl}>
                  <td className="px-4 py-2 font-medium">{kl} KL</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ~{peopleEquivalent} {peopleEquivalent === 1 ? 'person' : 'people'}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-water">
                    {formatINR(monthly)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
        Approximate figures at {tariff.boardName}&apos;s real rate, using a
        commonly cited ~4.5 KL/person/month benchmark, for quick browsing
        only — your own board&apos;s rate and household&apos;s real usage may
        differ; use the calculator above for your specific board.
      </p>
    </div>
  )
}
