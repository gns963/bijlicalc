import { describe, expect, it } from 'vitest'
import {
  estimateGeneratorCost,
  estimateGeneratorCostPerUnit,
  estimateLpgUsage,
  vehicleCostPerKm,
} from './fuel'

describe('vehicleCostPerKm', () => {
  it('computes cost per km as price / mileage', () => {
    const r = vehicleCostPerKm({ fuelPricePerLitre: 100, mileageKmPerLitre: 20, monthlyKm: 1000 })
    expect(r.costPerKm).toBeCloseTo(5, 5)
    expect(r.monthlyFuelLitres).toBeCloseTo(50, 5)
    expect(r.monthlyCost).toBeCloseTo(5000, 1)
  })

  it('a more fuel-efficient vehicle costs less per km', () => {
    const efficient = vehicleCostPerKm({ fuelPricePerLitre: 100, mileageKmPerLitre: 25, monthlyKm: 1000 })
    const thirsty = vehicleCostPerKm({ fuelPricePerLitre: 100, mileageKmPerLitre: 12, monthlyKm: 1000 })
    expect(efficient.costPerKm).toBeLessThan(thirsty.costPerKm)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      vehicleCostPerKm({ fuelPricePerLitre: 0, mileageKmPerLitre: 20, monthlyKm: 1000 }),
    ).toThrow()
  })
})

describe('estimateLpgUsage', () => {
  it('more burner-hours per day means fewer days remaining', () => {
    const light = estimateLpgUsage({ cylinderKg: 14.2, cylinderPrice: 900, dailyBurnerHours: 1 })
    const heavy = estimateLpgUsage({ cylinderKg: 14.2, cylinderPrice: 900, dailyBurnerHours: 3 })
    expect(heavy.daysRemaining).toBeLessThan(light.daysRemaining)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      estimateLpgUsage({ cylinderKg: 0, cylinderPrice: 900, dailyBurnerHours: 1 }),
    ).toThrow()
  })
})

describe('estimateGeneratorCost', () => {
  it('computes litres and cost from rate and hours', () => {
    const r = estimateGeneratorCost({ consumptionRateLph: 2, fuelPricePerLitre: 95, hoursRun: 5 })
    expect(r.litresUsed).toBeCloseTo(10, 5)
    expect(r.totalCost).toBeCloseTo(950, 1)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      estimateGeneratorCost({ consumptionRateLph: 2, fuelPricePerLitre: 95, hoursRun: 0 }),
    ).toThrow()
  })
})

describe('estimateGeneratorCostPerUnit', () => {
  it('computes cost per unit as fuel price / units-per-litre', () => {
    const r = estimateGeneratorCostPerUnit({ fuelPricePerLitre: 96, unitsPerLitre: 3.2 })
    expect(r.costPerUnit).toBeCloseTo(30, 1)
  })

  it('uses a sensible default units-per-litre when not overridden', () => {
    const r = estimateGeneratorCostPerUnit({ fuelPricePerLitre: 96 })
    expect(r.unitsPerLitre).toBeGreaterThan(0)
    expect(r.costPerUnit).toBeGreaterThan(0)
  })

  it('rejects invalid inputs', () => {
    expect(() => estimateGeneratorCostPerUnit({ fuelPricePerLitre: 0 })).toThrow()
  })
})
