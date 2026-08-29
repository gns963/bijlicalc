import { describe, expect, it } from 'vitest'
import {
  calculateGratuity,
  calculateGst,
  calculateSip,
  compareRegimes,
  computeRegimeTax,
} from './financial'

describe('calculateGst', () => {
  it('adds GST in exclusive mode', () => {
    const r = calculateGst(1000, 18, 'exclusive')
    expect(r.base).toBe(1000)
    expect(r.gstAmount).toBe(180)
    expect(r.total).toBe(1180)
    expect(r.cgst).toBe(90)
  })
  it('backs out GST in inclusive mode', () => {
    const r = calculateGst(1180, 18, 'inclusive')
    expect(r.base).toBe(1000)
    expect(r.gstAmount).toBe(180)
    expect(r.total).toBe(1180)
  })
})

describe('calculateSip', () => {
  it('sums invested and grows with returns', () => {
    const r = calculateSip(10000, 12, 10)
    expect(r.invested).toBe(10000 * 120) // 12,00,000
    expect(r.maturityValue).toBeGreaterThan(r.invested)
    // ~₹23L for 10k/mo @12% over 10y (annuity-due)
    expect(r.maturityValue).toBeGreaterThan(2200000)
    expect(r.maturityValue).toBeLessThan(2400000)
    expect(r.yearly).toHaveLength(10)
  })
  it('with 0% return equals amount invested', () => {
    const r = calculateSip(5000, 0, 2)
    expect(r.maturityValue).toBe(5000 * 24)
    expect(r.gains).toBe(0)
  })
})

describe('computeRegimeTax (FY 2026-27)', () => {
  it('new regime: zero tax at ₹12L taxable (₹12.75L gross) via 87A', () => {
    const r = computeRegimeTax(1275000, 'new')
    expect(r.taxableIncome).toBe(1200000)
    expect(r.rebate87A).toBe(60000)
    expect(r.totalTax).toBe(0)
  })
  it('new regime: ₹20L gross computes slab tax + cess', () => {
    const r = computeRegimeTax(2000000, 'new')
    // taxable 19.25L: 20k + 40k + 60k + (325000*20%)=65000 = 185000; cess 4%
    expect(r.taxableIncome).toBe(1925000)
    expect(r.taxBeforeRebate).toBe(185000)
    expect(r.rebate87A).toBe(0)
    expect(r.totalTax).toBe(round2(185000 * 1.04))
  })
  it('old regime: applies 80C-style deductions', () => {
    const r = computeRegimeTax(1000000, 'old', 150000)
    // taxable = 10L - 50k std - 1.5L = 8L
    expect(r.taxableIncome).toBe(800000)
  })
})

describe('compareRegimes', () => {
  it('recommends the lower-tax regime', () => {
    const c = compareRegimes(1500000, 0)
    expect(['new', 'old', 'either']).toContain(c.recommended)
    expect(c.saving).toBeGreaterThanOrEqual(0)
    // With no deductions, new regime should win at ₹15L
    expect(c.recommended).toBe('new')
  })
})

describe('calculateGratuity', () => {
  it('applies 15/26 formula and rounds service years', () => {
    const r = calculateGratuity(50000, 10.7) // 10.7y → 11 years
    expect(r.roundedYears).toBe(11)
    expect(r.gratuity).toBe(round2((15 / 26) * 50000 * 11))
    expect(r.eligible).toBe(true)
  })
  it('is ineligible below 5 years', () => {
    const r = calculateGratuity(50000, 4)
    expect(r.eligible).toBe(false)
    expect(r.gratuity).toBe(0)
  })
  it('caps at ₹20,00,000', () => {
    const r = calculateGratuity(500000, 30)
    expect(r.gratuity).toBe(2000000)
    expect(r.capped).toBe(true)
  })
})

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
