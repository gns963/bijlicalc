import { getTariff } from '@/lib/calc/electricity'
import { cycleLabel } from '@/lib/format'

function topRate(discomCode: string): number {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  return res.slabs[res.slabs.length - 1].ratePerUnit
}

function fixedChargeLabel(discomCode: string): string {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  const fc = res.fixedCharge
  switch (fc.basis) {
    case 'perPhase':
      return `₹${fc.singlePhase}`
    case 'perLoad':
      return `₹${fc.perKW}/kW`
    case 'flat':
      return `₹${fc.flat}`
  }
}

/** Structured, live comparison against neighbouring/similarly-sized DISCOMs. */
export default function DiscomComparisonTable({
  currentDiscomCode,
  compareDiscomCodes,
}: {
  currentDiscomCode: string
  compareDiscomCodes: string[]
}) {
  const codes = [currentDiscomCode, ...compareDiscomCodes]

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-2 font-semibold">DISCOM</th>
            <th className="px-4 py-2 font-semibold">State</th>
            <th className="px-4 py-2 text-right font-semibold">Top slab rate</th>
            <th className="px-4 py-2 text-right font-semibold">Fixed charge</th>
            <th className="px-4 py-2 text-right font-semibold">Duty</th>
            <th className="px-4 py-2 font-semibold">Billing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {codes.map((code) => {
            const t = getTariff(code)
            const isCurrent = code === currentDiscomCode
            return (
              <tr
                key={code}
                className={isCurrent ? 'bg-brass/10 font-semibold' : undefined}
              >
                <td className="px-4 py-2">
                  {t.discomCode}
                  {isCurrent && (
                    <span className="ml-1.5 text-[10px] uppercase text-brass">
                      this page
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">{t.state}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  ₹{topRate(code).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {fixedChargeLabel(code)}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {t.electricityDutyPercent}%
                </td>
                <td className="px-4 py-2 capitalize">
                  {cycleLabel(t.billingCycle)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
