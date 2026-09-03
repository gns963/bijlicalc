'use client'

import { useMemo, useState } from 'react'
import { simpleApplianceCost } from '@/lib/calc/appliance'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export interface DiscomOption {
  code: string
  state: string
}

export default function GenericApplianceCostCalculator({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [wattage, setWattage] = useState(100)
  const [hours, setHours] = useState(4)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: simpleApplianceCost({ discomCode, wattage, hoursPerDay: hours }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, wattage, hours])

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔋"
        title="Appliance Electricity Cost Calculator"
        subtitle="Any appliance, from its wattage and daily hours"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="app-discom"
            className="mb-1.5 block text-sm font-medium text-ash"
          >
            DISCOM / state
          </label>
          <select
            id="app-discom"
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
          id="app-watts"
          label="Appliance wattage"
          value={wattage}
          onChange={setWattage}
          min={5}
          max={3000}
          step={5}
          unit="W"
          hint="Check the rating plate or box — most appliances print rated wattage."
        />

        <SliderField
          id="app-hours"
          label="Daily usage"
          value={hours}
          onChange={setHours}
          min={0.25}
          max={24}
          step={0.25}
          unit="hrs/day"
        />

        <CalculatorCta label="Calculate Running Cost" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-electricity/15 bg-hub-electricity/5 p-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60">
                Estimated monthly cost
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-electricity">
                {formatINR(result.monthlyCost)}
              </p>
              <p className="text-sm text-ash/60">
                ≈ {formatINR(result.annualCost)}/year · {result.monthlyUnits} units/month
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60">Units/day</dt>
              <dd className="text-right tabular-nums">{result.dailyUnits}</dd>
              <dt className="text-ash/60">
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
