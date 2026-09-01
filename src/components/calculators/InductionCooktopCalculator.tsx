'use client'

import { useMemo, useState } from 'react'
import { simpleApplianceCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import {
  CalculatorCard,
  CalculatorCta,
  CalculatorHeader,
  OptionCardGroup,
  SliderField,
} from './CalculatorShell'

export interface DiscomOption {
  code: string
  state: string
}

const INDUCTION_TYPES: { value: string; label: string; icon: string; watts: number }[] = [
  { value: 'basic', label: 'Basic (1200W)', icon: '🍳', watts: 1200 },
  { value: 'standard', label: 'Standard (1600W)', icon: '🔥', watts: 1600 },
  { value: 'high', label: 'High-power (2000W)', icon: '⚡', watts: 2000 },
  { value: 'custom', label: 'Custom', icon: '⚙️', watts: 0 },
]

export default function InductionCooktopCalculator({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [cooktopType, setCooktopType] = useState('standard')
  const [customWatts, setCustomWatts] = useState(1600)
  const [hours, setHours] = useState(1)

  const wattage =
    cooktopType === 'custom' ? customWatts : (INDUCTION_TYPES.find((c) => c.value === cooktopType)?.watts ?? 1600)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: simpleApplianceCost({ discomCode, wattage, hoursPerDay: hours }),
        error: null as string | null,
      }
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Calculation error' }
    }
  }, [discomCode, wattage, hours])

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🍳"
        title="Induction Cooktop Cost Calculator"
        subtitle="Estimate your induction cooktop's electricity cost"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="induction-discom" className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80">
            DISCOM / state
          </label>
          <select
            id="induction-discom"
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

        <OptionCardGroup legend="Cooktop power" options={INDUCTION_TYPES} value={cooktopType} onChange={setCooktopType} />

        {cooktopType === 'custom' && (
          <SliderField
            id="induction-watts"
            label="Cooktop wattage"
            value={customWatts}
            onChange={setCustomWatts}
            min={800}
            max={2200}
            step={50}
            unit="W"
            hint="Check the wattage printed on the cooktop's rating label or box."
          />
        )}

        <SliderField
          id="induction-hours"
          label="Daily cooking time"
          value={hours}
          onChange={setHours}
          min={0.25}
          max={6}
          step={0.25}
          unit="hrs/day"
          hint="Active cooking time only — most households use an induction cooktop for well under an hour a day."
        />

        <CalculatorCta label="Calculate Cooktop Cost" tone="appliance" />
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
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">Estimated monthly cost</p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-appliance">
                {formatINR(result.monthlyCost)}
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                ≈ {formatINR(result.annualCost)}/year · {result.monthlyUnits} units/month
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">Wattage</dt>
              <dd className="text-right tabular-nums">{wattage} W</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">Units per day</dt>
              <dd className="text-right tabular-nums">{result.dailyUnits}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">Billed at (top slab)</dt>
              <dd className="text-right tabular-nums">{formatINR(result.effectiveRatePerUnit)}/unit</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
