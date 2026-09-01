'use client'

import { useMemo, useState } from 'react'
import { estimateGeneratorCost } from '@/lib/calc/fuel'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function GeneratorFuelCalculator() {
  const [rate, setRate] = useState(2)
  const [price, setPrice] = useState(95)
  const [hours, setHours] = useState(4)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: estimateGeneratorCost({
          consumptionRateLph: rate,
          fuelPricePerLitre: price,
          hoursRun: hours,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [rate, price, hours])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🛠️"
        title="Generator Fuel Consumption Calculator"
        subtitle="From your genset's own rated consumption"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="gen-rate"
          label="Fuel consumption rate"
          value={rate}
          onChange={setRate}
          min={0.2}
          max={20}
          step={0.1}
          unit="L/hr"
          hint="From your generator's spec sheet or manual, at your typical load."
        />

        <SliderField
          id="gen-price"
          label="Fuel price"
          value={price}
          onChange={setPrice}
          min={60}
          max={130}
          unit="₹/litre"
        />

        <SliderField
          id="gen-hours"
          label="Hours run"
          value={hours}
          onChange={setHours}
          min={0.5}
          max={24}
          step={0.5}
          unit="hrs"
        />

        <CalculatorCta label="Calculate Fuel Cost" tone="fuel" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-fuel/15 bg-hub-fuel/5 p-5 dark:border-hub-fuel/20 dark:bg-hub-fuel/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Total fuel cost
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-fuel">
                {formatINR(result.totalCost)}
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                {result.litresUsed} litres · {formatINR(result.costPerHour)}/hour
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
