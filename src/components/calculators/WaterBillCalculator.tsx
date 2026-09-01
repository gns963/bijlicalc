'use client'

import { useMemo, useState } from 'react'
import { calculateWaterBill } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function WaterBillCalculator() {
  const [consumption, setConsumption] = useState(15)
  const [rate, setRate] = useState(15)
  const [fixedCharge, setFixedCharge] = useState(50)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateWaterBill({
          consumptionKl: consumption,
          ratePerKl: rate,
          fixedChargePerMonth: fixedCharge,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [consumption, rate, fixedCharge])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="💧"
        title="Water Bill Calculator"
        subtitle="From your own consumption and board's rate"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="water-consumption"
          label="Monthly consumption"
          value={consumption}
          onChange={setConsumption}
          min={1}
          max={100}
          unit="KL"
          hint="1 KL = 1,000 litres. Check your meter reading or last bill."
        />

        <SliderField
          id="water-rate"
          label="Your board's rate"
          value={rate}
          onChange={setRate}
          min={1}
          max={100}
          unit="₹/KL"
          hint="From your last bill or your water board's published tariff — this varies by city and connection type."
        />

        <SliderField
          id="water-fixed"
          label="Fixed / meter charge"
          value={fixedCharge}
          onChange={setFixedCharge}
          min={0}
          max={500}
          step={10}
          unit="₹/month"
        />

        <CalculatorCta label="Calculate Water Bill" tone="water" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-water/15 bg-hub-water/5 p-5 dark:border-hub-water/20 dark:bg-hub-water/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Estimated bill
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-water">
                {formatINR(result.total)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Volumetric charge
              </dt>
              <dd className="text-right tabular-nums">{formatINR(result.volumetricCharge)}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">Fixed charge</dt>
              <dd className="text-right tabular-nums">{formatINR(result.fixedCharge)}</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
