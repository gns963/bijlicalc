'use client'

import { useMemo, useState } from 'react'
import { calculateEvChargingCost } from '@/lib/calc/ev'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export interface DiscomOption {
  code: string
  state: string
}

export default function EvChargingCostCalculator({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [battery, setBattery] = useState(30)
  const [range, setRange] = useState(200)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateEvChargingCost({
          discomCode,
          batteryCapacityKwh: battery,
          fullRangeKm: range,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, battery, range])

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔌"
        title="EV Charging Cost Calculator"
        subtitle="What a full home charge costs"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="ev-discom"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            DISCOM / state
          </label>
          <select
            id="ev-discom"
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
          id="ev-battery"
          label="Battery capacity"
          value={battery}
          onChange={setBattery}
          min={5}
          max={100}
          unit="kWh"
        />

        <SliderField
          id="ev-range"
          label="Full-charge range"
          value={range}
          onChange={setRange}
          min={50}
          max={600}
          step={10}
          unit="km"
        />

        <CalculatorCta label="Calculate Charging Cost" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-electricity/15 bg-hub-electricity/5 p-5 dark:border-hub-electricity/20 dark:bg-hub-electricity/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Cost to fully charge
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-electricity">
                {formatINR(result.costToFullCharge)}
              </p>
              {result.costPerKm != null && (
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  ≈ {formatINR(result.costPerKm)}/km
                </p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">Units needed</dt>
              <dd className="text-right tabular-nums">{result.unitsNeeded}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Billed at (top slab)
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.effectiveRatePerUnit)}/unit
              </dd>
            </dl>
            <p className="text-xs text-ash/50 dark:text-gazette-cream/40">
              {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
