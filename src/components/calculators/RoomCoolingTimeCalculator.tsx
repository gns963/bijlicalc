'use client'

import { useMemo, useState } from 'react'
import { estimateCoolingTime } from '@/lib/calc/cooling'
import { CalculatorCard, CalculatorCta, CalculatorHeader, OptionCardGroup, SliderField } from './CalculatorShell'

const TON_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: '1', label: '1 Ton', icon: '❄️' },
  { value: '1.5', label: '1.5 Ton', icon: '❄️' },
  { value: '2', label: '2 Ton', icon: '🥶' },
]

export default function RoomCoolingTimeCalculator() {
  const [area, setArea] = useState(150)
  const [dropTemp, setDropTemp] = useState(6)
  const [ton, setTon] = useState('1.5')

  const { result, error } = useMemo(() => {
    try {
      return {
        result: estimateCoolingTime({
          areaSqFt: area,
          ceilingHeightFt: 9,
          dropTempC: dropTemp,
          acTon: Number(ton),
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [area, dropTemp, ton])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="⏱️"
        title="Room Cooling Time Calculator"
        subtitle="Theoretical minimum time to cool your room's air"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="cool-area"
          label="Room area"
          value={area}
          onChange={setArea}
          min={50}
          max={500}
          step={10}
          unit="sq ft"
        />

        <SliderField
          id="cool-drop"
          label="Temperature drop needed"
          value={dropTemp}
          onChange={setDropTemp}
          min={1}
          max={15}
          unit="°C"
          hint="Assumes a 9 ft ceiling height."
        />

        <OptionCardGroup legend="AC size" options={TON_OPTIONS} value={ton} onChange={setTon} columns={3} />

        <CalculatorCta label="Estimate Cooling Time" tone="appliance" />
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
                Theoretical minimum time
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-appliance">
                {result.minutesToCoolAirOnly} min
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
