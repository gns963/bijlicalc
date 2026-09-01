'use client'

import { useMemo, useState } from 'react'
import { estimateLpgUsage } from '@/lib/calc/fuel'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, OptionCardGroup, SliderField } from './CalculatorShell'

const CYLINDER_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: '5', label: '5 kg', icon: '🫙' },
  { value: '14.2', label: '14.2 kg', icon: '🛢️' },
  { value: '19', label: '19 kg', icon: '🛢️' },
]

export default function LpgUsageCalculator() {
  const [cylinderKg, setCylinderKg] = useState('14.2')
  const [price, setPrice] = useState(900)
  const [dailyHours, setDailyHours] = useState(1.5)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: estimateLpgUsage({
          cylinderKg: Number(cylinderKg),
          cylinderPrice: price,
          dailyBurnerHours: dailyHours,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [cylinderKg, price, dailyHours])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔥"
        title="LPG Cylinder Usage Calculator"
        subtitle="How long your cylinder will last"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <OptionCardGroup
          legend="Cylinder size"
          options={CYLINDER_OPTIONS}
          value={cylinderKg}
          onChange={setCylinderKg}
          columns={3}
        />

        <SliderField
          id="lpg-price"
          label="Cylinder price"
          value={price}
          onChange={setPrice}
          min={300}
          max={2000}
          step={10}
          unit="₹"
          hint="Check your latest refill receipt — price varies by state and company."
        />

        <SliderField
          id="lpg-hours"
          label="Daily burner-hours"
          value={dailyHours}
          onChange={setDailyHours}
          min={0.5}
          max={6}
          step={0.5}
          unit="hrs/day"
          hint="Total active flame time across all burners you use in a day."
        />

        <CalculatorCta label="Calculate LPG Usage" tone="fuel" />
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
                Estimated days remaining
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-fuel">
                {result.daysRemaining} days
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                ≈ {formatINR(result.dailyCost)}/day · {formatINR(result.monthlyCost)}
                /month equivalent
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
