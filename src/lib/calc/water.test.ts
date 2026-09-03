import { describe, expect, it } from 'vitest'
import {
  calculateFullWaterBill,
  calculateWaterBill,
  computeWaterBill,
  getConnectionTariff,
  getWaterTariff,
} from './water'

describe('calculateWaterBill', () => {
  it('computes total as volumetric + fixed charge', () => {
    const r = calculateWaterBill({ consumptionKl: 10, ratePerKl: 20, fixedChargePerMonth: 50 })
    expect(r.volumetricCharge).toBeCloseTo(200, 1)
    expect(r.total).toBeCloseTo(250, 1)
  })

  it('works with zero fixed charge', () => {
    const r = calculateWaterBill({ consumptionKl: 10, ratePerKl: 20 })
    expect(r.fixedCharge).toBe(0)
    expect(r.total).toBeCloseTo(200, 1)
  })

  it('rejects invalid inputs', () => {
    expect(() => calculateWaterBill({ consumptionKl: -1, ratePerKl: 20 })).toThrow()
    expect(() => calculateWaterBill({ consumptionKl: 10, ratePerKl: -1 })).toThrow()
  })
})

describe('computeWaterBill / calculateFullWaterBill (DJB all-or-nothing rule)', () => {
  it('waives the entire water charge at or below the 20 KL free threshold', () => {
    const tariff = getWaterTariff('DJB')
    const bill = computeWaterBill(tariff, { consumptionKl: 20 })
    expect(bill.freeAllowanceApplied).toBe(true)
    expect(bill.waterCharge).toBe(0)
    expect(bill.sewerageCharge).toBe(0)
    // Fixed charge still applies even when the free threshold isn't crossed.
    expect(bill.total).toBe(bill.fixedCharge)
  })

  it('bills the FULL consumption (not just the excess) once the threshold is crossed by even 1 KL', () => {
    const tariff = getWaterTariff('DJB')
    const bill = computeWaterBill(tariff, { consumptionKl: 21 })
    expect(bill.freeAllowanceApplied).toBe(false)
    // All 21 KL priced via the slabs, not just 1 KL above the threshold.
    expect(bill.slab.lines.reduce((sum, l) => sum + l.klInSlab, 0)).toBe(21)
    expect(bill.waterCharge).toBeGreaterThan(0)
    expect(bill.total).toBeGreaterThan(bill.fixedCharge)
  })

  it('a bill just over the threshold costs dramatically more than a bill just under it', () => {
    const under = calculateFullWaterBill({ boardCode: 'DJB', consumptionKl: 20 })
    const over = calculateFullWaterBill({ boardCode: 'DJB', consumptionKl: 21 })
    expect(over.total).toBeGreaterThan(under.total * 2)
  })

  it('applies sewerage charge as a percentage of the water charge', () => {
    const tariff = getWaterTariff('DJB')
    const bill = computeWaterBill(tariff, { consumptionKl: 30 })
    expect(bill.sewerageCharge).toBeCloseTo(bill.waterCharge * (getConnectionTariff(tariff).sewerageChargePercent / 100), 2)
  })

  it('throws for an unregistered board code', () => {
    expect(() => getWaterTariff('NOPE')).toThrow()
  })

  it('19 KL is still within the free threshold, 21 KL is not', () => {
    const tariff = getWaterTariff('DJB')
    const at19 = computeWaterBill(tariff, { consumptionKl: 19 })
    const at20 = computeWaterBill(tariff, { consumptionKl: 20 })
    const at21 = computeWaterBill(tariff, { consumptionKl: 21 })
    expect(at19.freeAllowanceApplied).toBe(true)
    expect(at20.freeAllowanceApplied).toBe(true)
    expect(at21.freeAllowanceApplied).toBe(false)
    expect(at19.waterCharge).toBe(0)
    expect(at20.waterCharge).toBe(0)
    expect(at21.waterCharge).toBeGreaterThan(0)
  })

  it('has a real, sourced commercial connection type alongside domestic', () => {
    const tariff = getWaterTariff('DJB')
    const commercial = getConnectionTariff(tariff, 'commercial')
    expect(commercial.connectionType).toBe('commercial')
    expect(commercial.slabs[0].ratePerKL).toBeGreaterThan(getConnectionTariff(tariff, 'domestic').slabs[0].ratePerKL)
  })
})

describe('computeWaterBill (PCMC — straightforward telescopic slabs, no all-or-nothing rule)', () => {
  it('the first 6 KL band is priced at ₹0, not exempted via a free-allowance flag', () => {
    const tariff = getWaterTariff('PCMC')
    const bill = computeWaterBill(tariff, { consumptionKl: 6 })
    expect(bill.freeAllowanceApplied).toBe(false)
    expect(bill.waterCharge).toBe(0)
  })

  it('consumption above 6 KL is priced at the next slab, only for the excess', () => {
    const bill = calculateFullWaterBill({ boardCode: 'PCMC', consumptionKl: 10 })
    expect(bill.waterCharge).toBeGreaterThan(0)
  })

  it('billing scales smoothly across the 6 KL band boundary (no cliff-edge jump)', () => {
    const at7 = calculateFullWaterBill({ boardCode: 'PCMC', consumptionKl: 7 })
    const at8 = calculateFullWaterBill({ boardCode: 'PCMC', consumptionKl: 8 })
    // No all-or-nothing rule here — one additional KL costs exactly one
    // slab-rate's worth (₹5.10), not a multi-fold cliff-edge jump like DJB's.
    expect(at8.waterCharge - at7.waterCharge).toBeCloseTo(5.1, 1)
  })
})
