'use client'

import { useMemo, useState } from 'react'
import { fridgeCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export interface DiscomOption {
  code: string
  state: string
}

export default function FridgeCostCalculator({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [annualUnits, setAnnualUnits] = useState(200)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: fridgeCost({ discomCode, annualUnitsFromLabel: annualUnits }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, annualUnits])

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="❄️"
        title="Fridge Cost Calculator"
        subtitle="From your fridge's own BEE label figure"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="fridge-discom"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            DISCOM / state
          </label>
          <select
            id="fridge-discom"
            value={discomCode}
            onChange={(e) => setDiscomCode(e.target.value)}
            className={fieldCls}
          >
            {discoms.map((d) => (
              <option key={d.code} value={d.code}>
                {d.state} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <SliderField
          id="fridge-annual"
          label="Annual energy consumption (from BEE label)"
          value={annualUnits}
          onChange={setAnnualUnits}
          min={80}
          max={500}
          step={5}
          unit="units/yr"
          hint="Look for the yellow BEE star sticker on your fridge — it states 'annual energy consumption' in kWh/year directly."
        />

        <CalculatorCta label="Calculate Fridge Cost" tone="appliance" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-appliance/15 bg-hub-appliance/5 p-5 dark:border-hub-appliance/20 dark:bg-hub-appliance/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Estimated monthly cost
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-appliance">
                {formatINR(result.monthlyCost)}
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                ≈ {formatINR(result.annualCost)}/year · {result.dailyUnits} units/day
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                From BEE label
              </dt>
              <dd className="text-right tabular-nums">{result.annualUnitsFromLabel} units/yr</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Billed at (top slab)
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.effectiveRatePerUnit)}/unit
              </dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
