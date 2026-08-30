'use client'

import { useMemo, useState } from 'react'
import { pmSuryaGharSubsidy } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

const CRITERIA: { key: string; label: string }[] = [
  { key: 'residential', label: 'This is a residential (household) connection' },
  { key: 'ownRoof', label: 'I own the house / have rights to the roof' },
  { key: 'gridConnected', label: 'The home has a valid grid electricity connection' },
  { key: 'notAvailed', label: 'I have not already claimed a rooftop solar subsidy' },
]

export default function SolarSubsidyCalculator() {
  const [kw, setKw] = useState(3)
  const [checks, setChecks] = useState<Record<string, boolean>>({
    residential: true,
    ownRoof: true,
    gridConnected: true,
    notAvailed: true,
  })

  const subsidy = useMemo(() => pmSuryaGharSubsidy(kw), [kw])
  const eligible = CRITERIA.every((c) => checks[c.key])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="💸"
        title="PM Surya Ghar Subsidy Checker"
        subtitle="Estimate your rooftop solar subsidy and eligibility"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="subsidy-kw"
          label="Planned system size"
          value={kw}
          onChange={setKw}
          min={0.5}
          max={10}
          step={0.5}
          unit="kW"
        />

        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-medium text-ash dark:text-gazette-cream/80">
            Eligibility
          </legend>
          {CRITERIA.map((c) => (
            <label key={c.key} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={checks[c.key]}
                onChange={(e) =>
                  setChecks((prev) => ({ ...prev, [c.key]: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brass focus:ring-brass"
              />
              <span className="text-ash dark:text-gazette-cream/80">
                {c.label}
              </span>
            </label>
          ))}
        </fieldset>

        <CalculatorCta label="Check My Subsidy" />
      </form>

      <div className="mt-6 rounded-xl bg-gazette-cream p-5 dark:bg-slate-800/60">
        <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
          Estimated PM Surya Ghar subsidy
        </p>
        <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-white">
          {formatINR(subsidy)}
        </p>

        <div
          className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${
            eligible
              ? 'bg-spark-teal/15 text-spark-teal'
              : 'bg-brass/10 text-brass'
          }`}
        >
          {eligible
            ? '✅ You appear eligible for PM Surya Ghar.'
            : '⚠️ Tick all criteria above to qualify for the subsidy.'}
        </div>

        <ul className="mt-4 space-y-1 text-xs text-ash/50 dark:text-gazette-cream/40">
          <li>• ₹30,000/kW for the first 2 kW</li>
          <li>• ₹18,000 for the 3rd kW</li>
          <li>• Capped at ₹78,000 (systems of 3 kW and above)</li>
        </ul>
        {kw > 3 && (
          <p className="mt-2 text-xs text-brass">
            Systems above 3 kW still receive the same ₹78,000 cap.
          </p>
        )}
      </div>
    </CalculatorCard>
  )
}
