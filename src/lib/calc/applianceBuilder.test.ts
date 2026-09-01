import { describe, expect, it } from 'vitest'
import { applianceMonthlyUnits, computeApplianceBuilder, slabForUnits } from './applianceBuilder'

describe('applianceMonthlyUnits', () => {
  it('computes watts × hours × 30 / 1000', () => {
    expect(applianceMonthlyUnits({ watts: 1000, hoursPerDay: 1 })).toBeCloseTo(30, 5)
  })
})

describe('slabForUnits', () => {
  it('returns null for zero units', () => {
    expect(slabForUnits(0, 'TNEB')).toBeNull()
  })

  it('finds a higher-rate slab for higher consumption (TNEB)', () => {
    const low = slabForUnits(50, 'TNEB')
    const high = slabForUnits(600, 'TNEB')
    expect(low).not.toBeNull()
    expect(high).not.toBeNull()
    expect(high!.ratePerUnit).toBeGreaterThan(low!.ratePerUnit)
  })
})

describe('computeApplianceBuilder', () => {
  it('sums appliance units and prices the combined total via real progressive slabs', () => {
    const result = computeApplianceBuilder('TNEB', [
      { id: '1', name: 'Ceiling Fan', watts: 70, hoursPerDay: 12 },
      { id: '2', name: 'Split AC 1.5 Ton (3-star)', watts: 1550, hoursPerDay: 6 },
    ])
    expect(result.items).toHaveLength(2)
    const expectedTotal = result.items.reduce((sum, i) => sum + i.monthlyUnits, 0)
    expect(result.totalMonthlyUnits).toBeCloseTo(expectedTotal, 1)
    expect(result.bill.total).toBeGreaterThan(0)
    expect(result.bill.slab.totalUnits).toBeCloseTo(result.totalMonthlyUnits, 1)
  })

  it('flags a slab crossing when a large appliance pushes the household into a higher slab', () => {
    // A big enough load added on top of nothing should land in, and be
    // flagged as crossing into, a non-trivial slab.
    const result = computeApplianceBuilder('TNEB', [
      { id: '1', name: 'Split AC 2.0 Ton (3-star)', watts: 1950, hoursPerDay: 10 },
    ])
    expect(result.items[0].slabCrossed).toBe(true)
    expect(result.items[0].slabAfter).not.toBeNull()
  })

  it('cumulative units after the last item equal the total', () => {
    const result = computeApplianceBuilder('TNEB', [
      { id: '1', name: 'Fridge', watts: 150, hoursPerDay: 24 },
      { id: '2', name: 'TV', watts: 100, hoursPerDay: 5 },
      { id: '3', name: 'Geyser', watts: 2000, hoursPerDay: 1 },
    ])
    const last = result.items[result.items.length - 1]
    expect(last.cumulativeUnitsAfter).toBeCloseTo(result.totalMonthlyUnits, 5)
  })

  it('handles an empty appliance list', () => {
    const result = computeApplianceBuilder('TNEB', [])
    expect(result.totalMonthlyUnits).toBe(0)
    expect(result.bill.total).toBeGreaterThanOrEqual(0)
  })

  it('does not throw for a DISCOM with a perLoad fixed charge (regression)', () => {
    // APSPDCL bills its fixed charge per kW of sanctioned load — the builder
    // must supply a default rather than crashing with "sanctionedLoad is
    // required for a perLoad fixed charge".
    expect(() =>
      computeApplianceBuilder('APSPDCL', [
        { id: '1', name: 'Ceiling Fan', watts: 70, hoursPerDay: 12 },
      ]),
    ).not.toThrow()
  })
})
