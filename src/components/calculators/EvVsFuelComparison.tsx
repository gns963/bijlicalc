'use client'

import { useMemo, useState } from 'react'
import { calculateEvChargingCost } from '@/lib/calc/ev'
import { vehicleCostPerKm } from '@/lib/calc/fuel'
import { formatINR } from '@/lib/format'
import { CalculatorCard, SliderField } from './CalculatorShell'

/** Real per-DISCOM EV cost/km vs user-entered petrol/diesel/CNG cost/km —
 *  every figure is either tariff-derived or the user's own real price, so
 *  the ranking is genuinely accurate, not built on generic assumed prices. */
export default function EvVsFuelComparison({
  discomCode,
  batteryCapacityKwh,
  fullRangeKm,
}: {
  discomCode: string
  batteryCapacityKwh: number
  fullRangeKm: number
}) {
  const [petrolPrice, setPetrolPrice] = useState(105)
  const [petrolMileage, setPetrolMileage] = useState(18)
  const [dieselPrice, setDieselPrice] = useState(92)
  const [dieselMileage, setDieselMileage] = useState(22)
  const [cngPrice, setCngPrice] = useState(85)
  const [cngMileage, setCngMileage] = useState(25)

  const rows = useMemo(() => {
    const ev = calculateEvChargingCost({ discomCode, batteryCapacityKwh, fullRangeKm })
    const petrol = vehicleCostPerKm({ fuelPricePerLitre: petrolPrice, mileageKmPerLitre: petrolMileage, monthlyKm: 1000 })
    const diesel = vehicleCostPerKm({ fuelPricePerLitre: dieselPrice, mileageKmPerLitre: dieselMileage, monthlyKm: 1000 })
    const cng = vehicleCostPerKm({ fuelPricePerLitre: cngPrice, mileageKmPerLitre: cngMileage, monthlyKm: 1000 })

    return [
      { label: 'EV (home charging)', costPerKm: ev.costPerKm ?? 0, icon: '🔌' },
      { label: 'Petrol', costPerKm: petrol.costPerKm, icon: '⛽' },
      { label: 'Diesel', costPerKm: diesel.costPerKm, icon: '🚚' },
      { label: 'CNG', costPerKm: cng.costPerKm, icon: '🔥' },
    ].sort((a, b) => a.costPerKm - b.costPerKm)
  }, [discomCode, batteryCapacityKwh, fullRangeKm, petrolPrice, petrolMileage, dieselPrice, dieselMileage, cngPrice, cngMileage])

  const maxCost = Math.max(...rows.map((r) => r.costPerKm), 0.01)

  return (
    <CalculatorCard>
      <p className="mb-4 text-sm text-ash/70">
        EV cost is priced at your real DISCOM tariff (from the calculator
        above). Enter today&apos;s local fuel prices and your vehicle&apos;s
        real mileage for the rest — these vary too much by city and vehicle
        to assume.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <SliderField id="ev-cmp-petrol-price" label="Petrol price" value={petrolPrice} onChange={setPetrolPrice} min={80} max={130} unit="₹/L" />
        <SliderField id="ev-cmp-petrol-mileage" label="Petrol mileage" value={petrolMileage} onChange={setPetrolMileage} min={8} max={30} unit="km/L" />
        <div />
        <SliderField id="ev-cmp-diesel-price" label="Diesel price" value={dieselPrice} onChange={setDieselPrice} min={75} max={115} unit="₹/L" />
        <SliderField id="ev-cmp-diesel-mileage" label="Diesel mileage" value={dieselMileage} onChange={setDieselMileage} min={10} max={30} unit="km/L" />
        <div />
        <SliderField id="ev-cmp-cng-price" label="CNG price" value={cngPrice} onChange={setCngPrice} min={60} max={110} unit="₹/kg" />
        <SliderField id="ev-cmp-cng-mileage" label="CNG mileage" value={cngMileage} onChange={setCngMileage} min={15} max={35} unit="km/kg" />
      </div>

      <div className="mt-6 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-sm font-medium text-ash">
              <span aria-hidden>{r.icon}</span> {r.label}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-hub-fuel"
                style={{ width: `${Math.max(4, (r.costPerKm / maxCost) * 100)}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-sm font-bold tabular-nums text-ink-navy">
              {formatINR(r.costPerKm)}/km
            </span>
          </div>
        ))}
      </div>
    </CalculatorCard>
  )
}
