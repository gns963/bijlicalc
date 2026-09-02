/**
 * DesiMetrics — personal-finance calculators (GST, SIP, income tax, gratuity).
 *
 * PURE, framework-agnostic TypeScript. All money in ₹ (INR).
 *
 * Income-tax slabs are for FY 2026-27 (AY 2027-28). Budget 2026 left the FY
 * 2025-26 structure unchanged. Surcharge (income > ₹50L) and marginal relief
 * are NOT modelled — see notes.
 */

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

// ---------------------------------------------------------------------------
// GST
// ---------------------------------------------------------------------------

export interface GstResult {
  base: number
  gstAmount: number
  cgst: number
  sgst: number
  total: number
  ratePercent: number
}

/**
 * `exclusive`: `amount` is pre-GST, GST is added.
 * `inclusive`: `amount` already contains GST, it is backed out.
 */
export function calculateGst(
  amount: number,
  ratePercent: number,
  mode: 'inclusive' | 'exclusive',
): GstResult {
  if (amount < 0 || ratePercent < 0) throw new Error('amount and rate must be >= 0')
  let base: number
  let total: number
  if (mode === 'exclusive') {
    base = amount
    total = amount * (1 + ratePercent / 100)
  } else {
    total = amount
    base = (amount * 100) / (100 + ratePercent)
  }
  const gstAmount = total - base
  return {
    base: round2(base),
    gstAmount: round2(gstAmount),
    cgst: round2(gstAmount / 2),
    sgst: round2(gstAmount / 2),
    total: round2(total),
    ratePercent,
  }
}

// ---------------------------------------------------------------------------
// SIP
// ---------------------------------------------------------------------------

export interface SipPoint {
  year: number
  invested: number
  value: number
}

export interface SipResult {
  invested: number
  maturityValue: number
  gains: number
  yearly: SipPoint[]
}

/** Future value of a monthly SIP (annuity-due: invested at start of month). */
function sipFutureValue(
  monthly: number,
  monthlyRate: number,
  months: number,
): number {
  if (months <= 0) return 0
  if (monthlyRate === 0) return monthly * months
  return (
    monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
  )
}

export function calculateSip(
  monthlyInvestment: number,
  annualRatePercent: number,
  years: number,
): SipResult {
  if (monthlyInvestment < 0 || years < 0) throw new Error('inputs must be >= 0')
  const i = annualRatePercent / 100 / 12
  const totalMonths = Math.round(years * 12)

  const maturityValue = sipFutureValue(monthlyInvestment, i, totalMonths)
  const invested = monthlyInvestment * totalMonths

  const yearly: SipPoint[] = []
  for (let y = 1; y <= Math.floor(years); y++) {
    const months = y * 12
    yearly.push({
      year: y,
      invested: round2(monthlyInvestment * months),
      value: round2(sipFutureValue(monthlyInvestment, i, months)),
    })
  }

  return {
    invested: round2(invested),
    maturityValue: round2(maturityValue),
    gains: round2(maturityValue - invested),
    yearly,
  }
}

// ---------------------------------------------------------------------------
// Income tax — FY 2026-27 (AY 2027-28)
// ---------------------------------------------------------------------------

interface Slab {
  upTo: number | null // null = no upper bound
  rate: number // percent
}

const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: null, rate: 30 },
]

const OLD_REGIME_SLABS: Slab[] = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 5 },
  { upTo: 1000000, rate: 20 },
  { upTo: null, rate: 30 },
]

function taxFromSlabs(taxable: number, slabs: Slab[]): number {
  let tax = 0
  let lower = 0
  for (const slab of slabs) {
    const upper = slab.upTo ?? Infinity
    if (taxable > lower) {
      const inBand = Math.min(taxable, upper) - lower
      tax += (inBand * slab.rate) / 100
    }
    lower = upper
    if (taxable <= upper) break
  }
  return tax
}

export interface RegimeTaxResult {
  regime: 'new' | 'old'
  grossIncome: number
  standardDeduction: number
  otherDeductions: number
  taxableIncome: number
  taxBeforeRebate: number
  rebate87A: number
  cess: number
  totalTax: number
}

export function computeRegimeTax(
  grossIncome: number,
  regime: 'new' | 'old',
  otherDeductions = 0,
): RegimeTaxResult {
  const isNew = regime === 'new'
  const standardDeduction = isNew ? 75000 : 50000
  const slabs = isNew ? NEW_REGIME_SLABS : OLD_REGIME_SLABS
  const deductions = isNew ? 0 : otherDeductions // 80C etc. only in old regime

  const taxableIncome = Math.max(
    0,
    grossIncome - standardDeduction - deductions,
  )
  const taxBeforeRebate = taxFromSlabs(taxableIncome, slabs)

  // Section 87A rebate.
  const rebate87A = isNew
    ? taxableIncome <= 1200000
      ? Math.min(taxBeforeRebate, 60000)
      : 0
    : taxableIncome <= 500000
      ? Math.min(taxBeforeRebate, 12500)
      : 0

  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87A)
  const cess = taxAfterRebate * 0.04

  return {
    regime,
    grossIncome,
    standardDeduction,
    otherDeductions: deductions,
    taxableIncome: round2(taxableIncome),
    taxBeforeRebate: round2(taxBeforeRebate),
    rebate87A: round2(rebate87A),
    cess: round2(cess),
    totalTax: round2(taxAfterRebate + cess),
  }
}

export interface RegimeComparison {
  newRegime: RegimeTaxResult
  oldRegime: RegimeTaxResult
  recommended: 'new' | 'old' | 'either'
  saving: number
}

export function compareRegimes(
  grossIncome: number,
  oldRegimeDeductions = 0,
): RegimeComparison {
  const newRegime = computeRegimeTax(grossIncome, 'new')
  const oldRegime = computeRegimeTax(grossIncome, 'old', oldRegimeDeductions)
  const diff = round2(oldRegime.totalTax - newRegime.totalTax)
  return {
    newRegime,
    oldRegime,
    recommended:
      diff > 0 ? 'new' : diff < 0 ? 'old' : 'either',
    saving: Math.abs(diff),
  }
}

// ---------------------------------------------------------------------------
// Gratuity (Payment of Gratuity Act, 1972)
// ---------------------------------------------------------------------------

export interface GratuityResult {
  eligible: boolean
  roundedYears: number
  gratuity: number
  capped: boolean
}

/** lastSalary = last drawn monthly Basic + DA. Cap ₹20,00,000. */
export function calculateGratuity(
  lastSalary: number,
  yearsOfService: number,
): GratuityResult {
  if (lastSalary < 0 || yearsOfService < 0)
    throw new Error('inputs must be >= 0')
  const eligible = yearsOfService >= 5
  // A part-year over 6 months counts as a full year.
  const whole = Math.floor(yearsOfService)
  const roundedYears = yearsOfService - whole > 0.5 ? whole + 1 : whole
  const raw = (15 / 26) * lastSalary * roundedYears
  const gratuity = eligible ? Math.min(raw, 2000000) : 0
  return {
    eligible,
    roundedYears,
    gratuity: round2(gratuity),
    capped: eligible && raw > 2000000,
  }
}
