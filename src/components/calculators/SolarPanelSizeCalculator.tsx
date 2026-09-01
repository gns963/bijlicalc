'use client'

import { useMemo, useState } from 'react'
import { recommendSystemSize } from '@/lib/calc/solar'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function SolarPanelSizeCalculator() {
  const [monthlyUnits, setMonthlyUnits] = useState(300)
  const [offsetPercent, setOffsetPercent] = useState(100)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: recommendSystemSize({ monthlyUnits, offsetPercent }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [monthlyUnits, offsetPercent])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="📐"
        title="Solar Panel Size Calculator"
        subtitle="What system size and roof area you need"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="panel-units"
          label="Average monthly consumption"
          value={monthlyUnits}
          onChange={setMonthlyUnits}
          min={50}
          max={1000}
          step={10}
          unit="units"
        />

        <SliderField
          id="panel-offset"
          label="Bill offset target"
          value={offsetPercent}
          onChange={setOffsetPercent}
          min={20}
          max={150}
          step={5}
          unit="%"
          hint="100% aims to fully offset your current usage; above 100% targets a surplus for export."
        />

        <CalculatorCta label="Recommend System Size" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-solar/15 bg-hub-solar/5 p-5 dark:border-hub-solar/20 dark:bg-hub-solar/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Recommended size
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-solar">
                  {result.recommendedKw} kW
                </p>
              </div>
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Roof area needed
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-solar">
                  {result.roofAreaSqFt} sq ft
                </p>
              </div>
            </div>
            <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
              ≈ {result.monthlyGeneration} units/month generation
            </p>
            <p className="text-xs text-ash/50 dark:text-gazette-cream/40">
              {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
