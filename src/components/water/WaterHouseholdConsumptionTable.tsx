import type { WaterTariffFile } from '@/data/water-tariffs/_schema'
import { computeWaterBill } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'

const HOUSEHOLD_TYPES = [
  { label: 'Single occupant / bachelor', people: 1 },
  { label: 'Couple, no kids', people: 2 },
  { label: 'Small family (3-4 people)', people: 3.5 },
  { label: 'Large family (5-6 people)', people: 5.5 },
  { label: 'Joint household (7+ people)', people: 8 },
]

// ~4.5 KL/person/month is the same commonly cited domestic benchmark used
// elsewhere on this site — a sizing cue, not a verified per-city figure.
const KL_PER_PERSON_PER_MONTH = 4.5

export default function WaterHouseholdConsumptionTable({ tariff }: { tariff: WaterTariffFile }) {
  const periodMonths = tariff.billingCycle === 'bimonthly' ? 2 : 1

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-mist text-ink-navy">
            <tr>
              <th className="px-4 py-2 font-semibold">Household type</th>
              <th className="px-4 py-2 text-right font-semibold">Est. monthly KL</th>
              <th className="px-4 py-2 text-right font-semibold">
                Approx. monthly {tariff.boardCode} bill
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {HOUSEHOLD_TYPES.map((h) => {
              const monthlyKl = Math.round(h.people * KL_PER_PERSON_PER_MONTH)
              const cycleKl = monthlyKl * periodMonths
              const bill = computeWaterBill(tariff, { consumptionKl: cycleKl })
              const monthlyCost = bill.monthlyEquivalent?.total ?? bill.total
              return (
                <tr key={h.label}>
                  <td className="px-4 py-2 font-medium">{h.label}</td>
                  <td className="px-4 py-2 text-right tabular-nums">~{monthlyKl} KL</td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums text-hub-water">
                    {formatINR(monthlyCost)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-ash/50">
        Illustrative only, using a commonly cited ~{KL_PER_PERSON_PER_MONTH} KL/person/month
        domestic benchmark and {tariff.boardCode}&apos;s real tariff — not a verified
        per-household-type figure. Commercial, institutional and bulk-metered
        connections are billed on a different tariff not modelled here. Use
        the calculator above with your own meter reading for an accurate number.
      </p>
    </div>
  )
}
