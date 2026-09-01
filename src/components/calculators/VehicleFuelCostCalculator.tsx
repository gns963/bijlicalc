'use client'

import { useMemo, useState } from 'react'
import { vehicleCostPerKm } from '@/lib/calc/fuel'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function VehicleFuelCostCalculator() {
  const [fuelPrice, setFuelPrice] = useState(100)
  const [mileage, setMileage] = useState(18)
  const [monthlyKm, setMonthlyKm] = useState(1000)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: vehicleCostPerKm({
          fuelPricePerLitre: fuelPrice,
          mileageKmPerLitre: mileage,
          monthlyKm,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [fuelPrice, mileage, monthlyKm])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="⛽"
        title="Petrol/Diesel Cost Per KM Calculator"
        subtitle="Your vehicle's real running cost"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="fuel-price"
          label="Fuel price"
          value={fuelPrice}
          onChange={setFuelPrice}
          min={60}
          max={130}
          unit="₹/litre"
          hint="Check today's local price — it varies by state and fuel type."
        />

        <SliderField
          id="fuel-mileage"
          label="Vehicle mileage"
          value={mileage}
          onChange={setMileage}
          min={5}
          max={40}
          unit="km/litre"
        />

        <SliderField
          id="fuel-monthly-km"
          label="Monthly distance"
          value={monthlyKm}
          onChange={setMonthlyKm}
          min={100}
          max={5000}
          step={50}
          unit="km"
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
                Cost per km
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-fuel">
                {formatINR(result.costPerKm)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Monthly fuel cost
              </dt>
              <dd className="text-right tabular-nums">{formatINR(result.monthlyCost)}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Annual fuel cost
              </dt>
              <dd className="text-right tabular-nums">{formatINR(result.annualCost)}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Fuel used/month
              </dt>
              <dd className="text-right tabular-nums">{result.monthlyFuelLitres} L</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
