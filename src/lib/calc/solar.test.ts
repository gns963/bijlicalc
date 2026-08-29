import { describe, expect, it } from 'vitest'
import {
  calculateSolarRoi,
  estimateSystemCost,
  pmSuryaGharSubsidy,
} from './solar'

describe('pmSuryaGharSubsidy', () => {
  it('matches the published slab amounts', () => {
    expect(pmSuryaGharSubsidy(1)).toBe(30000)
    expect(pmSuryaGharSubsidy(2)).toBe(60000)
    expect(pmSuryaGharSubsidy(3)).toBe(78000)
  })

  it('caps at ₹78,000 above 3 kW', () => {
    expect(pmSuryaGharSubsidy(5)).toBe(78000)
    expect(pmSuryaGharSubsidy(10)).toBe(78000)
  })

  it('handles fractional and zero sizes', () => {
    expect(pmSuryaGharSubsidy(1.5)).toBe(45000) // 1.5 × 30000
    expect(pmSuryaGharSubsidy(0)).toBe(0)
  })
})

describe('calculateSolarRoi', () => {
  it('computes a full TNEB 3 kW ROI with capped subsidy', () => {
    const r = calculateSolarRoi({
      discomCode: 'TNEB',
      monthlyUnits: 300,
      systemSizeKw: 3,
    })
    expect(r.systemCost).toBe(estimateSystemCost(3)) // 3 × 55000 = 165000
    expect(r.subsidy).toBe(78000)
    expect(r.netCost).toBe(r.systemCost - 78000)
    expect(r.annualGeneration).toBe(3 * 4 * 365) // 4380 units
    expect(r.annualSavings).toBeGreaterThan(0)
    expect(r.paybackYears).not.toBeNull()
    expect(r.paybackYears!).toBeGreaterThan(0)
  })

  it('caps savings and flags oversized systems (generation > consumption)', () => {
    const r = calculateSolarRoi({
      discomCode: 'MSEDCL',
      monthlyUnits: 50,
      systemSizeKw: 5,
    })
    // 5 kW generates ~600 units/month vs 50 consumed → savings capped at bill
    expect(r.notes.join(' ')).toMatch(/more than you consume/i)
    expect(r.annualSavings).toBeGreaterThan(0)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      calculateSolarRoi({ discomCode: 'TNEB', monthlyUnits: 300, systemSizeKw: 0 }),
    ).toThrow()
  })
})
