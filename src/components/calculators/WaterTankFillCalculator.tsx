'use client'

import { useMemo, useState } from 'react'
import { estimateTankFillTime } from '@/lib/calc/watertank'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function WaterTankFillCalculator() {
  const [capacity, setCapacity] = useState(1000)
  const [flowRate, setFlowRate] = useState(50)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: estimateTankFillTime({ capacityLiters: capacity, flowRateLpm: flowRate }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [capacity, flowRate])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🚰"
        title="Water Tank Filling Time Calculator"
        subtitle="How long your tank takes to fill"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="tank-capacity"
          label="Tank capacity"
          value={capacity}
          onChange={setCapacity}
          min={100}
          max={5000}
          step={50}
          unit="litres"
        />

        <SliderField
          id="tank-flow"
          label="Pump flow rate"
          value={flowRate}
          onChange={setFlowRate}
          min={10}
          max={300}
          step={5}
          unit="LPM"
          hint="Check your pump's rated flow (litres per minute) — actual flow is often lower once water is lifted to an overhead tank."
        />

        <CalculatorCta label="Calculate Fill Time" tone="appliance" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-appliance/15 bg-hub-appliance/5 p-5 dark:border-hub-appliance/20 dark:bg-hub-appliance/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-3">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Estimated fill time
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-appliance">
                {result.minutes} min
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                ≈ {result.hours} hours
              </p>
            </div>
            <p className="text-xs text-ash/50 dark:text-gazette-cream/40">
              {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
