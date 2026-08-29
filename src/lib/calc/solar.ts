/**
 * bijlicalc — rooftop solar ROI engine.
 *
 * PURE, framework-agnostic TypeScript. Reuses the electricity engine to value
 * the "before solar" bill against the DISCOM's real telescopic tariff, so
 * savings are computed on the expensive top slabs solar actually offsets — not
 * a flat blended rate.
 *
 * Money is ₹ (INR). Energy is kWh ("units").
 */

import { computeBill, getTariff } from './electricity'

// Tunable national assumptions (indicative, not guarantees).
const DAILY_GEN_PER_KW = 4 // units generated per kW per day (India avg ~4–4.5)
const DAYS_PER_MONTH = 30
const SYSTEM_LIFE_YEARS = 25

export interface SolarInput {
  discomCode: string
  /** Household's average monthly consumption in units (kWh). */
  monthlyUnits: number
  /** Proposed rooftop system size in kW. */
  systemSizeKw: number
}

export interface SolarResult {
  systemSizeKw: number
  systemCost: number
  subsidy: number
  netCost: number
  monthlyGeneration: number
  annualGeneration: number
  monthlySavings: number
  annualSavings: number
  /** Payback in years, or null if the system does not save money. */
  paybackYears: number | null
  lifetimeSavings: number
  currency: 'INR'
  notes: string[]
}

/**
 * PM Surya Ghar: Muft Bijli Yojana central subsidy.
 * ₹30,000/kW for the first 2 kW, ₹18,000 for the 3rd kW, capped at ₹78,000.
 * → 1 kW = ₹30k, 2 kW = ₹60k, 3 kW and above = ₹78k.
 */
export function pmSuryaGharSubsidy(systemSizeKw: number): number {
  if (systemSizeKw <= 0) return 0
  const firstTwo = Math.min(systemSizeKw, 2) * 30000
  const thirdKw = Math.min(Math.max(systemSizeKw - 2, 0), 1) * 18000
  return Math.min(Math.round(firstTwo + thirdKw), 78000)
}

/**
 * Indicative installed cost using a per-kW benchmark that tapers with size.
 * Real quotes vary by location, panel type and installer.
 */
export function estimateSystemCost(systemSizeKw: number): number {
  const perKw =
    systemSizeKw <= 1
      ? 65000
      : systemSizeKw <= 2
        ? 60000
        : systemSizeKw <= 3
          ? 55000
          : 50000
  return Math.round(systemSizeKw * perKw)
}

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/**
 * Full ROI. Uses the DISCOM's real tariff (via the electricity engine) to value
 * the units solar offsets, respecting the billing cycle and telescopic slabs.
 */
export function calculateSolarRoi(input: SolarInput): SolarResult {
  const { discomCode, monthlyUnits, systemSizeKw } = input
  if (monthlyUnits < 0) throw new Error('monthlyUnits must be >= 0')
  if (systemSizeKw <= 0) throw new Error('systemSizeKw must be > 0')

  const tariff = getTariff(discomCode)
  const PERIOD_MONTHS: Record<string, number> = {
    monthly: 1,
    bimonthly: 2,
    quarterly: 3,
  }
  const periodMonths = PERIOD_MONTHS[tariff.billingCycle] ?? 1
  const periodsPerYear = 12 / periodMonths

  const monthlyGeneration = systemSizeKw * DAILY_GEN_PER_KW * DAYS_PER_MONTH
  const annualGeneration = systemSizeKw * DAILY_GEN_PER_KW * 365

  // Value the offset against the real tariff: bill(before) − bill(after solar),
  // computed per billing period then annualised. Fixed charges cancel out.
  const unitsBeforePeriod = monthlyUnits * periodMonths
  const generationPeriod = monthlyGeneration * periodMonths
  const unitsAfterPeriod = Math.max(0, unitsBeforePeriod - generationPeriod)

  const billOpts = {
    connectionType: 'residential' as const,
    phase: 'single' as const,
    sanctionedLoad: 3, // cancels in the difference; needed for perLoad tariffs
  }
  const billBefore = computeBill(tariff, {
    ...billOpts,
    unitsConsumed: unitsBeforePeriod,
  }).total
  const billAfter = computeBill(tariff, {
    ...billOpts,
    unitsConsumed: unitsAfterPeriod,
  }).total

  const savingsPerPeriod = Math.max(0, billBefore - billAfter)
  const annualSavings = savingsPerPeriod * periodsPerYear
  const monthlySavings = annualSavings / 12

  const systemCost = estimateSystemCost(systemSizeKw)
  const subsidy = pmSuryaGharSubsidy(systemSizeKw)
  const netCost = Math.max(0, systemCost - subsidy)

  const paybackYears =
    annualSavings > 0 ? round2(netCost / annualSavings) : null
  const lifetimeSavings = annualSavings * SYSTEM_LIFE_YEARS - netCost

  const notes: string[] = [
    `Assumes ~${DAILY_GEN_PER_KW} units/kW/day generation and ${tariff.discomName} tariff; actual output varies with location, shading and panel quality.`,
  ]
  if (generationPeriod > unitsBeforePeriod) {
    notes.push(
      'Your system generates more than you consume — savings shown are capped at your current bill (excess export value depends on your state net-metering rate, not modelled here).',
    )
  }

  return {
    systemSizeKw,
    systemCost: round2(systemCost),
    subsidy: round2(subsidy),
    netCost: round2(netCost),
    monthlyGeneration: round2(monthlyGeneration),
    annualGeneration: round2(annualGeneration),
    monthlySavings: round2(monthlySavings),
    annualSavings: round2(annualSavings),
    paybackYears,
    lifetimeSavings: round2(lifetimeSavings),
    currency: 'INR',
    notes,
  }
}
