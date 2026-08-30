import { describe, expect, it } from 'vitest'
import type { TariffFile } from '../../data/tariffs/_schema'
import {
  applySubsidy,
  calculateFullBill,
  calculateSlabCharges,
  computeBill,
  findMaxUnitsForBudget,
  getTariff,
} from './electricity'

// TANGEDCO residential slabs (from tneb.json) reused across primitive tests.
const TNEB_SLABS = [
  { minUnits: 0, maxUnits: 100, ratePerUnit: 2.25 },
  { minUnits: 101, maxUnits: 200, ratePerUnit: 3.5 },
  { minUnits: 201, maxUnits: 500, ratePerUnit: 4.8 },
  { minUnits: 501, maxUnits: null, ratePerUnit: 6.4 },
]

describe('calculateSlabCharges (telescopic)', () => {
  it('splits 250 units across the first three slabs', () => {
    const r = calculateSlabCharges(250, TNEB_SLABS)
    expect(r.lines.map((l) => l.unitsInSlab)).toEqual([100, 100, 50, 0])
    // 100*2.25 + 100*3.5 + 50*4.8 = 225 + 350 + 240
    expect(r.subtotal).toBe(815)
  })

  it('handles 0 units', () => {
    const r = calculateSlabCharges(0, TNEB_SLABS)
    expect(r.subtotal).toBe(0)
    expect(r.lines.every((l) => l.unitsInSlab === 0)).toBe(true)
  })

  it('bills the open-ended top slab above 500', () => {
    const r = calculateSlabCharges(600, TNEB_SLABS)
    expect(r.lines[3].unitsInSlab).toBe(100) // 501..600
    expect(r.lines[3].charge).toBe(640)
  })
})

describe('applySubsidy', () => {
  it('values 100 free units at the true first-slab rate (₹2.25)', () => {
    const slab = calculateSlabCharges(250, TNEB_SLABS)
    const r = applySubsidy(
      250,
      slab,
      [
        {
          schemeName: '100 Units Free',
          minUnits: 0,
          maxUnits: 100,
          discountType: 'free',
          discountValue: 100,
          eligibility: 'eligible/BPL domestic',
        },
      ],
      'eligible/BPL domestic',
    )
    expect(r.subsidyAmount).toBe(225) // 100 × 2.25, NOT a blended average
    expect(r.adjustedCharge).toBe(590) // 815 − 225
    expect(r.appliedSchemes).toEqual(['100 Units Free'])
  })

  it('applies nothing when the consumer is not eligible', () => {
    const slab = calculateSlabCharges(250, TNEB_SLABS)
    const r = applySubsidy(
      250,
      slab,
      [
        {
          schemeName: '100 Units Free',
          minUnits: 0,
          maxUnits: 100,
          discountType: 'free',
          discountValue: 100,
          eligibility: 'eligible/BPL domestic',
        },
      ],
      undefined,
    )
    expect(r.subsidyAmount).toBe(0)
    expect(r.adjustedCharge).toBe(815)
  })
})

describe('calculateFullBill — TNEB residential (bi-monthly)', () => {
  it('250-unit bill with 100 free units', () => {
    const bill = calculateFullBill({
      discomCode: 'TNEB',
      connectionType: 'residential',
      unitsConsumed: 250,
      phase: 'single',
      eligibility: 'eligible/BPL domestic',
    })

    expect(bill.energyChargeGross).toBe(815)
    expect(bill.subsidy.subsidyAmount).toBe(225)
    expect(bill.energyChargeNet).toBe(590)
    expect(bill.fuelCostAdjustment.amount).toBe(87.5) // 0.35 × 250
    expect(bill.fixedCharge.amount).toBe(100) // single-phase
    expect(bill.electricityDuty.amount).toBe(0)
    expect(bill.total).toBe(777.5) // 590 + 87.5 + 100

    // Bi-monthly clarity: monthly-equivalent must be exposed.
    expect(bill.monthlyEquivalent).toEqual({ total: 388.75, units: 125 })
    expect(bill.notes.join(' ')).toMatch(/bi-monthly/i)
  })

  it('500-unit edge case sits exactly on the subsidy/slab boundary', () => {
    const bill = calculateFullBill({
      discomCode: 'TNEB',
      connectionType: 'residential',
      unitsConsumed: 500,
      phase: 'single',
      eligibility: 'eligible/BPL domestic',
    })

    // 500 is the inclusive top of the 201–500 slab: the 501+ slab stays empty.
    expect(bill.slab.lines[2].unitsInSlab).toBe(300)
    expect(bill.slab.lines[3].unitsInSlab).toBe(0)
    // 225 + 350 + 1440 = 2015 gross; free-100 subsidy = 225
    expect(bill.energyChargeGross).toBe(2015)
    expect(bill.subsidy.subsidyAmount).toBe(225)
    expect(bill.energyChargeNet).toBe(1790)
    expect(bill.total).toBe(2065) // 1790 + 175 (FCA) + 100 (fixed)
    expect(bill.monthlyEquivalent).toEqual({ total: 1032.5, units: 250 })
  })
})

describe('computeBill — commercial connection (no subsidy)', () => {
  // tneb.json only defines residential, so this test injects a commercial
  // fixture directly into the pure core — demonstrating the framework/data
  // decoupling the engine is designed for.
  const commercialTariff: TariffFile = {
    discomCode: 'TEST-COM',
    discomName: 'Test Commercial DISCOM',
    state: 'Testland',
    billingCycle: 'monthly',
    connectionTypes: [
      {
        connectionType: 'commercial',
        slabs: [
          { minUnits: 0, maxUnits: 100, ratePerUnit: 6.0 },
          { minUnits: 101, maxUnits: null, ratePerUnit: 8.0 },
        ],
        fixedCharge: { basis: 'perLoad', perKW: 50 },
        meterRent: 20,
      },
    ],
    fuelCostAdjustment: 0.5,
    electricityDutyPercent: 5,
    subsidySchemes: [],
    effectiveFrom: '2026-04-01',
    sourceUrl: 'https://example.com/test-order',
    lastVerified: '2026-08-29',
    verifiedBy: 'test fixture',
  }

  it('300-unit commercial bill: slabs + FCA + perLoad fixed + duty + meter rent, no subsidy', () => {
    const bill = computeBill(commercialTariff, {
      connectionType: 'commercial',
      unitsConsumed: 300,
      sanctionedLoad: 5,
      phase: 'three',
    })

    expect(bill.energyChargeGross).toBe(2200) // 100*6 + 200*8
    expect(bill.subsidy.subsidyAmount).toBe(0)
    expect(bill.subsidy.appliedSchemes).toEqual([])
    expect(bill.fuelCostAdjustment.amount).toBe(150) // 0.5 × 300
    expect(bill.fixedCharge.amount).toBe(250) // ₹50/kW × 5 kW
    expect(bill.electricityDuty.amount).toBe(110) // 5% of 2200
    expect(bill.meterRent).toBe(20)
    expect(bill.total).toBe(2730) // 2200 + 150 + 250 + 110 + 20

    // Monthly DISCOM → no monthly-equivalent split.
    expect(bill.monthlyEquivalent).toBeNull()
  })
})

describe('findMaxUnitsForBudget', () => {
  const tneb = getTariff('TNEB')

  it('finds units whose bill sits at or just under the budget', () => {
    const { maxUnits, bill } = findMaxUnitsForBudget(tneb, 777.5, {
      connectionType: 'residential',
      phase: 'single',
      eligibility: 'eligible/BPL domestic',
    })
    // 250 units is the known TNEB worked example at exactly ₹777.50.
    expect(maxUnits).toBe(250)
    expect(bill.total).toBeLessThanOrEqual(777.5)
  })

  it('one more unit would exceed the budget', () => {
    const { maxUnits } = findMaxUnitsForBudget(tneb, 777.5, {
      connectionType: 'residential',
      phase: 'single',
      eligibility: 'eligible/BPL domestic',
    })
    const oneMore = computeBill(tneb, {
      connectionType: 'residential',
      unitsConsumed: maxUnits + 1,
      phase: 'single',
      eligibility: 'eligible/BPL domestic',
    })
    expect(oneMore.total).toBeGreaterThan(777.5)
  })

  it('returns 0 units for a budget below the fixed charge', () => {
    const { maxUnits } = findMaxUnitsForBudget(tneb, 5, {
      connectionType: 'residential',
      phase: 'single',
    })
    expect(maxUnits).toBe(0)
  })
})
