import { describe, expect, it } from 'vitest'
import { calculateEvChargingCost } from './ev'

describe('calculateEvChargingCost', () => {
  it('a bigger battery costs more to fully charge', () => {
    const small = calculateEvChargingCost({ discomCode: 'TNEB', batteryCapacityKwh: 20 })
    const big = calculateEvChargingCost({ discomCode: 'TNEB', batteryCapacityKwh: 40 })
    expect(big.costToFullCharge).toBeGreaterThan(small.costToFullCharge)
  })

  it('computes cost per km when range is given', () => {
    const r = calculateEvChargingCost({
      discomCode: 'TNEB',
      batteryCapacityKwh: 30,
      fullRangeKm: 200,
    })
    expect(r.costPerKm).not.toBeNull()
    expect(r.costPerKm).toBeCloseTo(r.costToFullCharge / 200, 1)
  })

  it('costPerKm is null without a range', () => {
    const r = calculateEvChargingCost({ discomCode: 'TNEB', batteryCapacityKwh: 30 })
    expect(r.costPerKm).toBeNull()
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      calculateEvChargingCost({ discomCode: 'TNEB', batteryCapacityKwh: 0 }),
    ).toThrow()
    expect(() =>
      calculateEvChargingCost({ discomCode: 'TNEB', batteryCapacityKwh: 30, chargerEfficiency: 1.5 }),
    ).toThrow()
  })
})
