import { describe, expect, it } from 'vitest'
import {
  acDailyUnits,
  calculateAcCost,
  calculateAcPowerConsumption,
  marginalRatePerUnit,
  recommendAcCircuit,
  recommendTonnage,
} from './ac'

describe('calculateAcCost', () => {
  it('a 5-star AC consumes fewer units than a 3-star of the same tonnage', () => {
    const three = calculateAcCost({
      discomCode: 'TNEB',
      tonnage: 1.5,
      starRating: 3,
      dailyHours: 8,
    })
    const five = calculateAcCost({
      discomCode: 'TNEB',
      tonnage: 1.5,
      starRating: 5,
      dailyHours: 8,
    })
    expect(five.dailyUnits).toBeLessThan(three.dailyUnits)
    expect(five.annualCost).toBeLessThan(three.annualCost)
  })

  it('prices AC at the DISCOM top slab incl. FCA and duty', () => {
    // MSEDCL top slab 9.56 + 0 FCA, then ×1.16 duty = 11.09
    expect(marginalRatePerUnit('MSEDCL')).toBeCloseTo(11.09, 1)
    const r = calculateAcCost({
      discomCode: 'MSEDCL',
      tonnage: 1.5,
      starRating: 3,
      dailyHours: 8,
    })
    expect(r.effectiveRatePerUnit).toBeCloseTo(11.09, 1)
    expect(r.monthlyCost).toBeGreaterThan(0)
  })

  it('acDailyUnits scales with hours', () => {
    expect(acDailyUnits(1.5, 3, 16)).toBeCloseTo(acDailyUnits(1.5, 3, 8) * 2, 5)
  })

  it('rejects invalid tonnage', () => {
    expect(() =>
      calculateAcCost({ discomCode: 'TNEB', tonnage: 0, starRating: 3, dailyHours: 8 }),
    ).toThrow()
  })
})

describe('recommendTonnage', () => {
  it('sizes a small shaded room modestly', () => {
    const r = recommendTonnage({ areaSqFt: 120, sunExposure: 'low', floor: 'other' })
    expect(r.recommendedTon).toBeLessThanOrEqual(1.0)
  })

  it('bumps up tonnage for a hot top-floor room', () => {
    const cool = recommendTonnage({ areaSqFt: 160, sunExposure: 'low', floor: 'other' })
    const hot = recommendTonnage({ areaSqFt: 160, sunExposure: 'high', floor: 'top' })
    expect(hot.rawTons).toBeGreaterThan(cool.rawTons)
  })

  it('caps and flags very large rooms', () => {
    const r = recommendTonnage({ areaSqFt: 400, sunExposure: 'high', floor: 'top' })
    expect(r.recommendedTon).toBe(2.0)
    expect(r.notes.join(' ')).toMatch(/large/i)
  })
})

describe('calculateAcPowerConsumption', () => {
  it('scales linearly with rated current and hours', () => {
    const a = calculateAcPowerConsumption({ ratedCurrentAmps: 5, hoursPerDay: 8 })
    const b = calculateAcPowerConsumption({ ratedCurrentAmps: 10, hoursPerDay: 8 })
    expect(b.dailyUnits).toBeCloseTo(a.dailyUnits * 2, 1)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      calculateAcPowerConsumption({ ratedCurrentAmps: 0, hoursPerDay: 8 }),
    ).toThrow()
  })
})

describe('recommendAcCircuit', () => {
  it('recommends a bigger MCB and wire for a higher rated current', () => {
    const small = recommendAcCircuit({ ratedCurrentAmps: 4 })
    const big = recommendAcCircuit({ ratedCurrentAmps: 20 })
    expect(big.recommendedMcbAmps).toBeGreaterThan(small.recommendedMcbAmps)
    expect(big.recommendedWireSqmm).toBeGreaterThanOrEqual(small.recommendedWireSqmm)
  })

  it('MCB rating always covers the design current with headroom', () => {
    const r = recommendAcCircuit({ ratedCurrentAmps: 8 })
    expect(r.recommendedMcbAmps).toBeGreaterThanOrEqual(r.designCurrentAmps)
  })

  it('rejects invalid inputs', () => {
    expect(() => recommendAcCircuit({ ratedCurrentAmps: 0 })).toThrow()
  })
})
