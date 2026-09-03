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

const COOLER_TYPES: { value: string; label: string; icon: string; watts: number }[] = [
  { value: 'personal', label: 'Personal', icon: '🌬️', watts: 150 },
  { value: 'tower', label: 'Tower', icon: '🗼', watts: 180 },
  { value: 'desert', label: 'Desert/Window', icon: '🏜️', watts: 230 },
  { value: 'custom', label: 'Custom', icon: '⚙️', watts: 0 },
]

export default function AirCoolerCalculator({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [coolerType, setCoolerType] = useState('desert')
  const [customWatts, setCustomWatts] = useState(200)
  const [hours, setHours] = useState(8)

  const wattage =
    coolerType === 'custom' ? customWatts : (COOLER_TYPES.find((c) => c.value === coolerType)?.watts ?? 200)

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
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🌬️"
        title="Air Cooler Cost Calculator"
        subtitle="Estimate your air cooler's electricity cost"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="cooler-discom" className="mb-1.5 block text-sm font-medium text-ash">
            DISCOM / state
          </label>
          <select
            id="cooler-discom"
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

        <OptionCardGroup legend="Cooler type" options={COOLER_TYPES} value={coolerType} onChange={setCoolerType} />

        {coolerType === 'custom' && (
          <SliderField
            id="cooler-watts"
            label="Cooler wattage"
            value={customWatts}
            onChange={setCustomWatts}
            min={50}
            max={350}
            unit="W"
            hint="Check the wattage printed on the cooler's rating label or box."
          />
        )}

        <SliderField
          id="cooler-hours"
          label="Daily usage"
          value={hours}
          onChange={setHours}
          min={1}
          max={24}
          unit="hrs/day"
        />

        <CalculatorCta label="Calculate Cooler Cost" tone="appliance" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-appliance/15 bg-hub-appliance/5 p-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60">Estimated monthly cost</p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-appliance">
                {formatINR(result.monthlyCost)}
              </p>
              <p className="text-sm text-ash/60">
                ≈ {formatINR(result.annualCost)}/year · {result.monthlyUnits} units/month
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60">Wattage</dt>
              <dd className="text-right tabular-nums">{wattage} W</dd>
              <dt className="text-ash/60">Units per day</dt>
              <dd className="text-right tabular-nums">{result.dailyUnits}</dd>
              <dt className="text-ash/60">Billed at (top slab)</dt>
              <dd className="text-right tabular-nums">{formatINR(result.effectiveRatePerUnit)}/unit</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
