import { computeGasBill, getGasTariff } from '@/lib/calc/gas'
import { formatINR } from '@/lib/format'

const SCM_LEVELS = [10, 20, 30, 40, 60, 80, 100]
const REFERENCE_CGD = 'IGL'

/**
 * Quick-reference grid — SCM consumed (per ~60-day cycle) against a rough
 * cooking-days equivalent and approximate monthly cost, computed live via
 * computeGasBill() at one representative CGD. Approximation for browsing —
 * the actual calculator above should be used for your real CGD.
 */
export default function GasConsumptionReferenceTable() {
  const tariff = getGasTariff(REFERENCE_CGD)
  const periodMonths = tariff.billingCycle === 'bimonthly' ? 2 : 1

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-mist text-ink-navy">
            <tr>
              <th className="px-4 py-2 font-semibold">SCM (per cycle)</th>
              <th className="px-4 py-2 text-right font-semibold">
                ~Cooking-days equivalent
              </th>
              <th className="px-4 py-2 text-right font-semibold">
                Approx. monthly cost ({tariff.cgdCode})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {SCM_LEVELS.map((scm) => {
              const bill = computeGasBill(tariff, { scmConsumed: scm })
              const monthly = bill.monthlyEquivalent?.total ?? bill.total
              return (
                <tr key={scm}>
                  <td className="px-4 py-2 font-medium">{scm} SCM</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    ~{Math.round(scm / periodMonths)} days/month
                  </td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-gas">
                    {formatINR(monthly)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ash/50">
        Approximate figures at {tariff.cgdName}&apos;s real rate (
        {formatINR(tariff.slabs[0].ratePerSCM)}/SCM), using the ~1 SCM ≈ 1
        cooking-day benchmark, for quick browsing only — your own CGD&apos;s
        rate may differ; use the calculator above for your specific provider.
      </p>
    </div>
  )
}
