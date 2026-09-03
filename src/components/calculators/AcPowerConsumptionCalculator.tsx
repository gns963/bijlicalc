'use client'

import { useMemo, useState } from 'react'
import { calculateAcPowerConsumption } from '@/lib/calc/ac'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function AcPowerConsumptionCalculator() {
  const [current, setCurrent] = useState(6)
  const [hours, setHours] = useState(8)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateAcPowerConsumption({ ratedCurrentAmps: current, hoursPerDay: hours }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [current, hours])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔢"
        title="AC Power Consumption Calculator"
        subtitle="From your AC's rated current (nameplate)"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="ac-power-current"
          label="Rated current"
          value={current}
          onChange={setCurrent}
          min={1}
          max={20}
          step={0.5}
          unit="A"
          hint="Check the nameplate on the AC's outdoor unit — usually labelled 'Rated Current' in Amps."
        />

        <SliderField
          id="ac-power-hours"
          label="Daily usage"
          value={hours}
          onChange={setHours}
          min={1}
          max={24}
          unit="hrs/day"
        />

        <CalculatorCta label="Calculate Power Consumption" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-ac/15 bg-hub-ac/5 p-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60">
                Power draw
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-ac">
                {result.inputKw} kW
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60">Units/day</dt>
              <dd className="text-right tabular-nums">{result.dailyUnits}</dd>
              <dt className="text-ash/60">Units/month</dt>
              <dd className="text-right tabular-nums">{result.monthlyUnits}</dd>
              <dt className="text-ash/60">Units/year</dt>
              <dd className="text-right tabular-nums">{result.annualUnits}</dd>
            </dl>
            <p className="text-xs text-ash/50">
              {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
