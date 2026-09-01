import { describe, expect, it } from 'vitest'
import { fridgeCost, simpleApplianceCost } from './appliance'

describe('simpleApplianceCost', () => {
  it('scales linearly with wattage and hours', () => {
    const a = simpleApplianceCost({ discomCode: 'TNEB', wattage: 75, hoursPerDay: 8 })
    const b = simpleApplianceCost({ discomCode: 'TNEB', wattage: 150, hoursPerDay: 8 })
    expect(b.dailyUnits).toBeCloseTo(a.dailyUnits * 2, 5)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      simpleApplianceCost({ discomCode: 'TNEB', wattage: 0, hoursPerDay: 8 }),
    ).toThrow()
    expect(() =>
      simpleApplianceCost({ discomCode: 'TNEB', wattage: 75, hoursPerDay: 25 }),
    ).toThrow()
  })
})

describe('fridgeCost', () => {
  it('derives monthly cost from the BEE label annual figure', () => {
    const r = fridgeCost({ discomCode: 'TNEB', annualUnitsFromLabel: 200 })
    expect(r.monthlyUnits).toBeCloseTo(200 / 12, 1)
    expect(r.monthlyCost).toBeGreaterThan(0)
  })

  it('rejects a non-positive label figure', () => {
    expect(() =>
      fridgeCost({ discomCode: 'TNEB', annualUnitsFromLabel: 0 }),
    ).toThrow()
  })
})
