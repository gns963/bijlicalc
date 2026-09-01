import { describe, expect, it } from 'vitest'
import {
  calculateSolarRoi,
  estimateCarbonOffset,
  estimateNetMeteringEarnings,
  estimateSystemCost,
  pmSuryaGharSubsidy,
  projectSolarCostComparison,
  recommendSystemSize,
  sizeSolarBattery,
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

describe('recommendSystemSize', () => {
  it('recommends a bigger system for a higher offset target', () => {
    const half = recommendSystemSize({ monthlyUnits: 300, offsetPercent: 50 })
    const full = recommendSystemSize({ monthlyUnits: 300, offsetPercent: 100 })
    expect(full.recommendedKw).toBeGreaterThan(half.recommendedKw)
  })

  it('rejects invalid inputs', () => {
    expect(() => recommendSystemSize({ monthlyUnits: 0, offsetPercent: 100 })).toThrow()
    expect(() => recommendSystemSize({ monthlyUnits: 300, offsetPercent: 200 })).toThrow()
  })
})

describe('sizeSolarBattery', () => {
  it('lithium needs less rated capacity than lead-acid for the same load', () => {
    const lead = sizeSolarBattery({ dailyLoadKwh: 5, daysOfAutonomy: 1, chemistry: 'lead-acid' })
    const lithium = sizeSolarBattery({ dailyLoadKwh: 5, daysOfAutonomy: 1, chemistry: 'lithium' })
    expect(lithium.recommendedCapacityKwh).toBeLessThan(lead.recommendedCapacityKwh)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      sizeSolarBattery({ dailyLoadKwh: 0, daysOfAutonomy: 1, chemistry: 'lithium' }),
    ).toThrow()
  })
})

describe('estimateNetMeteringEarnings', () => {
  it('computes exported units and credit when generation exceeds consumption', () => {
    const r = estimateNetMeteringEarnings({
      monthlyGenerationUnits: 400,
      monthlyConsumptionUnits: 300,
      exportRatePerUnit: 3,
    })
    expect(r.exportedUnits).toBeCloseTo(100, 5)
    expect(r.importedUnits).toBe(0)
    expect(r.monthlyExportCredit).toBeCloseTo(300, 1)
  })

  it('exports nothing when consumption exceeds generation', () => {
    const r = estimateNetMeteringEarnings({
      monthlyGenerationUnits: 200,
      monthlyConsumptionUnits: 300,
      exportRatePerUnit: 3,
    })
    expect(r.exportedUnits).toBe(0)
    expect(r.importedUnits).toBeCloseTo(100, 5)
  })
})

describe('projectSolarCostComparison', () => {
  it('produces one row per year and grows cumulative savings over time', () => {
    const r = projectSolarCostComparison({
      discomCode: 'TNEB',
      monthlyUnits: 300,
      systemSizeKw: 3,
      scenario: 'base',
      years: 25,
    })
    expect(r.rows).toHaveLength(25)
    expect(r.rows[24].cumulativeSavings).toBeGreaterThan(r.rows[0].cumulativeSavings)
    expect(r.rows[24].cumulativeGridCost).toBeGreaterThan(r.rows[0].cumulativeGridCost)
  })

  it('a higher escalation scenario produces bigger long-run savings', () => {
    const conservative = projectSolarCostComparison({
      discomCode: 'TNEB',
      monthlyUnits: 300,
      systemSizeKw: 3,
      scenario: 'conservative',
    })
    const optimistic = projectSolarCostComparison({
      discomCode: 'TNEB',
      monthlyUnits: 300,
      systemSizeKw: 3,
      scenario: 'optimistic',
    })
    const lastYear = conservative.rows.length - 1
    expect(optimistic.rows[lastYear].cumulativeSavings).toBeGreaterThan(
      conservative.rows[lastYear].cumulativeSavings,
    )
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      projectSolarCostComparison({
        discomCode: 'TNEB',
        monthlyUnits: 300,
        systemSizeKw: 0,
        scenario: 'base',
      }),
    ).toThrow()
  })
})

describe('estimateCarbonOffset', () => {
  it('scales linearly with annual generation', () => {
    const a = estimateCarbonOffset({ annualGenerationKwh: 1000 })
    const b = estimateCarbonOffset({ annualGenerationKwh: 2000 })
    expect(b.annualCo2OffsetKg).toBeCloseTo(a.annualCo2OffsetKg * 2, 1)
    expect(b.treeEquivalent).toBeGreaterThan(a.treeEquivalent)
  })

  it('rejects invalid inputs', () => {
    expect(() => estimateCarbonOffset({ annualGenerationKwh: 0 })).toThrow()
  })
})
