import { describe, expect, it } from 'vitest'
import {
  calculateFullGasBill,
  calculateGasSlabCharges,
  comparePngVsLpg,
  computeGasBill,
  getGasTariff,
} from './gas'

describe('calculateGasSlabCharges', () => {
  it('prices a flat single-slab CGD linearly', () => {
    const slabs = [{ minSCM: 0, maxSCM: null, ratePerSCM: 50 }]
    const result = calculateGasSlabCharges(30, slabs)
    expect(result.subtotal).toBe(1500)
    expect(result.lines).toHaveLength(1)
    expect(result.lines[0].scmInSlab).toBe(30)
  })

  it('throws on negative consumption', () => {
    expect(() => calculateGasSlabCharges(-1, [{ minSCM: 0, maxSCM: null, ratePerSCM: 50 }])).toThrow()
  })
})

describe('computeGasBill / calculateFullGasBill (IGL)', () => {
  it('a low-usage IGL bill totals gas charge + fixed charge', () => {
    const tariff = getGasTariff('IGL')
    const bill = computeGasBill(tariff, { scmConsumed: 20 })
    expect(bill.gasChargeGross).toBeCloseTo(20 * tariff.slabs[0].ratePerSCM, 2)
    expect(bill.total).toBeCloseTo(bill.gasChargeGross + tariff.fixedCharge, 2)
    expect(bill.monthlyEquivalent).not.toBeNull()
    expect(bill.monthlyEquivalent!.total).toBeCloseTo(bill.total / 2, 2)
  })

  it('a higher-usage IGL bill costs proportionally more on the gas charge', () => {
    const low = calculateFullGasBill({ cgdCode: 'IGL', scmConsumed: 20 })
    const high = calculateFullGasBill({ cgdCode: 'IGL', scmConsumed: 80 })
    expect(high.gasChargeGross).toBeGreaterThan(low.gasChargeGross)
    expect(high.gasChargeGross).toBeCloseTo(low.gasChargeGross * 4, 2)
    // Fixed charge doesn't scale with usage.
    expect(high.fixedCharge).toBe(low.fixedCharge)
  })

  it('throws for an unregistered CGD code', () => {
    expect(() => getGasTariff('NOPE')).toThrow()
  })
})

describe('comparePngVsLpg', () => {
  it('flags PNG or LPG as cheaper based on real cylinder price input', () => {
    const result = comparePngVsLpg({
      scmConsumedPerCycle: 40,
      cgdCode: 'IGL',
      lpgCylinderPrice: 900,
      cycleDays: 60,
    })
    expect(result.pngCost).toBeGreaterThan(0)
    expect(result.lpgEquivalentCost).toBeGreaterThan(0)
    expect(['png', 'lpg', 'equal']).toContain(result.cheaperOption)
  })

  it('scales LPG-equivalent cost linearly with cylinder price', () => {
    const cheap = comparePngVsLpg({
      scmConsumedPerCycle: 40,
      cgdCode: 'IGL',
      lpgCylinderPrice: 500,
      cycleDays: 60,
    })
    const expensive = comparePngVsLpg({
      scmConsumedPerCycle: 40,
      cgdCode: 'IGL',
      lpgCylinderPrice: 1000,
      cycleDays: 60,
    })
    expect(expensive.lpgEquivalentCost).toBeCloseTo(cheap.lpgEquivalentCost * 2, 1)
  })
})
