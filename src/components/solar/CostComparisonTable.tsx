'use client'

import { useMemo, useState } from 'react'
import { projectSolarCostComparison, type TariffEscalationScenario } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

const SCENARIOS: { value: TariffEscalationScenario; label: string }[] = [
  { value: 'conservative', label: 'Conservative (4%/yr)' },
  { value: 'base', label: 'Base (6%/yr)' },
  { value: 'optimistic', label: 'Optimistic (9%/yr)' },
]
const MILESTONE_YEARS = new Set([1, 5, 10, 15, 20, 25])

export default function CostComparisonTable({
  discomCode,
  monthlyUnits,
  systemSizeKw,
}: {
  discomCode: string
  monthlyUnits: number
  systemSizeKw: number
}) {
  const [scenario, setScenario] = useState<TariffEscalationScenario>('base')
  const [showAll, setShowAll] = useState(false)

  const result = useMemo(
    () => projectSolarCostComparison({ discomCode, monthlyUnits, systemSizeKw, scenario }),
    [discomCode, monthlyUnits, systemSizeKw, scenario],
  )
  const rows = showAll ? result.rows : result.rows.filter((r) => MILESTONE_YEARS.has(r.year))

  return (
    <section aria-labelledby="cost-comparison" className="mb-10">
      <h2 id="cost-comparison" className="font-display mb-2 text-2xl font-semibold">
        25-Year Cost Comparison: Solar vs. Grid
      </h2>
      <p className="mb-4 text-ash/70 dark:text-gazette-cream/60">
        How cumulative cost compares if your electricity tariff keeps rising —
        pick a scenario to see the effect:
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setScenario(s.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              scenario === s.value
                ? 'bg-hub-solar text-white'
                : 'border border-hairline text-ash/70 hover:border-hub-solar/50 dark:border-white/10 dark:text-gazette-cream/70'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-hairline dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-mist dark:border-white/10 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 font-semibold">Year</th>
              <th className="px-4 py-2 text-right font-semibold">Cumulative grid cost</th>
              <th className="px-4 py-2 text-right font-semibold">Cumulative solar cost</th>
              <th className="px-4 py-2 text-right font-semibold">Cumulative savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline dark:divide-white/10">
            {rows.map((r) => (
              <tr key={r.year}>
                <td className="px-4 py-2 font-medium">Year {r.year}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {formatINR(r.cumulativeGridCost)}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {formatINR(r.cumulativeSolarCost)}
                </td>
                <td className="px-4 py-2 text-right font-semibold tabular-nums text-spark-teal">
                  {formatINR(r.cumulativeSavings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="mt-3 text-sm font-semibold text-brass hover:underline"
      >
        {showAll ? 'Show milestone years only' : 'Show all 25 years'}
      </button>
      <p className="mt-3 text-xs text-ash/50 dark:text-gazette-cream/40">{result.notes[0]}</p>
    </section>
  )
}
