'use client'

import { useMemo, useState } from 'react'
import {
  recommendTonnage,
  type FloorLevel,
  type SunExposure,
} from '@/lib/calc/ac'
import { CalculatorCard, CalculatorCta, CalculatorHeader, OptionCardGroup, SliderField } from './CalculatorShell'

const SUN_OPTIONS: { value: SunExposure; label: string; icon: string }[] = [
  { value: 'low', label: 'Shaded', icon: '🌥️' },
  { value: 'medium', label: 'Medium', icon: '⛅' },
  { value: 'high', label: 'Direct sun', icon: '☀️' },
]
const FLOOR_OPTIONS: { value: FloorLevel; label: string; icon: string }[] = [
  { value: 'other', label: 'Not top floor', icon: '🏢' },
  { value: 'top', label: 'Top floor', icon: '🏠' },
]

export default function AcTonnageCalculator() {
  const [area, setArea] = useState(150)
  const [sun, setSun] = useState<SunExposure>('medium')
  const [floor, setFloor] = useState<FloorLevel>('other')

  const { result, error } = useMemo(() => {
    if (area <= 0) return { result: null, error: 'Enter a valid room area in sq ft.' }
    return {
      result: recommendTonnage({ areaSqFt: area, sunExposure: sun, floor }),
      error: null as string | null,
    }
  }, [area, sun, floor])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="📐"
        title="AC Tonnage Calculator"
        subtitle="Find the right AC size for your room"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="ton-area"
          label="Room area"
          value={area}
          onChange={setArea}
          min={50}
          max={500}
          step={10}
          unit="sq ft"
        />

        <OptionCardGroup
          legend="Sun exposure"
          options={SUN_OPTIONS}
          value={sun}
          onChange={setSun}
          columns={3}
        />

        <OptionCardGroup
          legend="Floor level"
          options={FLOOR_OPTIONS}
          value={floor}
          onChange={setFloor}
          columns={2}
        />

        <CalculatorCta label="Find My AC Size" />
      </form>

      <div className="mt-6 rounded-xl bg-mist p-5 dark:bg-slate-800/60">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-3">
            <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
              Recommended AC size
            </p>
            <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-gazette-cream">
              {result.recommendedTon} ton
            </p>
            <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
              Estimated cooling load: {result.coolingBtu.toLocaleString('en-IN')}{' '}
              BTU ({result.rawTons} ton raw)
            </p>
            {result.notes[0] && (
              <p className="rounded-lg bg-brass/10 px-3 py-2 text-xs text-brass">
                {result.notes[0]}
              </p>
            )}
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
