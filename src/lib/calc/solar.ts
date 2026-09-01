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
export const DAILY_GEN_PER_KW = 4 // units generated per kW per day (India avg ~4–4.5)
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

// ---------------------------------------------------------------------------
// Panel / system size recommendation
// ---------------------------------------------------------------------------

/** Commonly cited planning figure for shadow-free roof space per kW installed. */
export const ROOF_SQFT_PER_KW = 100

export interface SystemSizeInput {
  monthlyUnits: number
  /** How much of the monthly bill to offset, 1–150% (>100% for a surplus-export system). */
  offsetPercent: number
}

export interface SystemSizeResult {
  recommendedKw: number
  monthlyGeneration: number
  roofAreaSqFt: number
  notes: string[]
}

export function recommendSystemSize(input: SystemSizeInput): SystemSizeResult {
  const { monthlyUnits, offsetPercent } = input
  if (monthlyUnits <= 0) throw new Error('monthlyUnits must be > 0')
  if (offsetPercent <= 0 || offsetPercent > 150) {
    throw new Error('offsetPercent must be between 0 and 150')
  }

  const targetMonthlyGeneration = monthlyUnits * (offsetPercent / 100)
  const rawKw = targetMonthlyGeneration / (DAILY_GEN_PER_KW * DAYS_PER_MONTH)
  const recommendedKw = Math.round(rawKw * 2) / 2
  const monthlyGeneration = recommendedKw * DAILY_GEN_PER_KW * DAYS_PER_MONTH
  const roofAreaSqFt = recommendedKw * ROOF_SQFT_PER_KW

  return {
    recommendedKw,
    monthlyGeneration: round2(monthlyGeneration),
    roofAreaSqFt: Math.round(roofAreaSqFt),
    notes: [
      `Assumes ~${DAILY_GEN_PER_KW} units/kW/day generation and ~${ROOF_SQFT_PER_KW} sq ft of shadow-free roof per kW — actual space needed varies by panel efficiency, spacing and roof layout.`,
    ],
  }
}

// ---------------------------------------------------------------------------
// Solar battery backup sizing
// ---------------------------------------------------------------------------

export type BatteryChemistry = 'lead-acid' | 'lithium'

const DOD_BY_CHEMISTRY: Record<BatteryChemistry, number> = {
  'lead-acid': 0.5,
  lithium: 0.9,
}
const SOLAR_BATTERY_EFFICIENCY = 0.9

export interface SolarBatterySizingInput {
  dailyLoadKwh: number
  daysOfAutonomy: number
  chemistry: BatteryChemistry
}

export interface SolarBatterySizingResult {
  recommendedCapacityKwh: number
  dod: number
  notes: string[]
}

export function sizeSolarBattery(input: SolarBatterySizingInput): SolarBatterySizingResult {
  const { dailyLoadKwh, daysOfAutonomy, chemistry } = input
  if (dailyLoadKwh <= 0) throw new Error('dailyLoadKwh must be > 0')
  if (daysOfAutonomy <= 0) throw new Error('daysOfAutonomy must be > 0')

  const dod = DOD_BY_CHEMISTRY[chemistry]
  const rawKwh = (dailyLoadKwh * daysOfAutonomy) / (dod * SOLAR_BATTERY_EFFICIENCY)
  const recommendedCapacityKwh = Math.ceil(rawKwh * 2) / 2

  return {
    recommendedCapacityKwh,
    dod,
    notes: [
      `Assumes a ${Math.round(dod * 100)}% usable depth of discharge for ${chemistry === 'lead-acid' ? 'lead-acid' : 'lithium'} batteries and ${Math.round(SOLAR_BATTERY_EFFICIENCY * 100)}% round-trip efficiency.`,
    ],
  }
}

// ---------------------------------------------------------------------------
// Net metering export earnings
// ---------------------------------------------------------------------------

export interface NetMeteringInput {
  monthlyGenerationUnits: number
  monthlyConsumptionUnits: number
  /** Your DISCOM's export credit rate, ₹/unit — this varies by state net-metering policy. */
  exportRatePerUnit: number
}

export interface NetMeteringResult {
  exportedUnits: number
  importedUnits: number
  monthlyExportCredit: number
  annualExportCredit: number
}

export function estimateNetMeteringEarnings(input: NetMeteringInput): NetMeteringResult {
  const { monthlyGenerationUnits, monthlyConsumptionUnits, exportRatePerUnit } = input
  if (monthlyGenerationUnits < 0) throw new Error('monthlyGenerationUnits must be >= 0')
  if (monthlyConsumptionUnits < 0) throw new Error('monthlyConsumptionUnits must be >= 0')
  if (exportRatePerUnit < 0) throw new Error('exportRatePerUnit must be >= 0')

  const exportedUnits = Math.max(0, monthlyGenerationUnits - monthlyConsumptionUnits)
  const importedUnits = Math.max(0, monthlyConsumptionUnits - monthlyGenerationUnits)
  const monthlyExportCredit = exportedUnits * exportRatePerUnit

  return {
    exportedUnits: round2(exportedUnits),
    importedUnits: round2(importedUnits),
    monthlyExportCredit: round2(monthlyExportCredit),
    annualExportCredit: round2(monthlyExportCredit * 12),
  }
}

// ---------------------------------------------------------------------------
// 25-year cost comparison with tariff escalation
// ---------------------------------------------------------------------------

export type TariffEscalationScenario = 'conservative' | 'base' | 'optimistic'

/** Annual electricity-tariff escalation assumption by scenario — indicative,
 *  not a forecast. Real tariff revisions are set by each state's SERC and
 *  don't move on a fixed schedule. */
export const ESCALATION_RATE_BY_SCENARIO: Record<TariffEscalationScenario, number> = {
  conservative: 0.04,
  base: 0.06,
  optimistic: 0.09,
}

export interface CostComparisonYear {
  year: number
  gridCostThatYear: number
  cumulativeGridCost: number
  cumulativeSolarCost: number
  cumulativeSavings: number
}

export interface CostComparisonInput {
  discomCode: string
  monthlyUnits: number
  systemSizeKw: number
  scenario: TariffEscalationScenario
  years?: number
}

export interface CostComparisonResult {
  scenario: TariffEscalationScenario
  escalationRate: number
  netCost: number
  rows: CostComparisonYear[]
  notes: string[]
}

/**
 * Projects cumulative grid-only cost vs. cumulative solar cost (net upfront
 * cost + residual grid bill) year by year, escalating the tariff at the
 * chosen scenario's rate. Generation is held flat — real panels degrade
 * gradually (~0.5%/year), which would modestly reduce real-world savings
 * versus this projection.
 */
export function projectSolarCostComparison(
  input: CostComparisonInput,
): CostComparisonResult {
  const { discomCode, monthlyUnits, systemSizeKw, scenario, years = SYSTEM_LIFE_YEARS } = input
  if (monthlyUnits < 0) throw new Error('monthlyUnits must be >= 0')
  if (systemSizeKw <= 0) throw new Error('systemSizeKw must be > 0')
  if (years <= 0) throw new Error('years must be > 0')

  const escalationRate = ESCALATION_RATE_BY_SCENARIO[scenario]
  const tariff = getTariff(discomCode)
  const PERIOD_MONTHS: Record<string, number> = { monthly: 1, bimonthly: 2, quarterly: 3 }
  const periodMonths = PERIOD_MONTHS[tariff.billingCycle] ?? 1
  const periodsPerYear = 12 / periodMonths
  const unitsBeforePeriod = monthlyUnits * periodMonths

  const billBeforePeriod = computeBill(tariff, {
    connectionType: 'residential',
    phase: 'single',
    sanctionedLoad: 3,
    unitsConsumed: unitsBeforePeriod,
  }).total
  const year1GridCost = billBeforePeriod * periodsPerYear

  const roi = calculateSolarRoi({ discomCode, monthlyUnits, systemSizeKw })
  const year1ResidualCost = Math.max(0, year1GridCost - roi.annualSavings)

  const rows: CostComparisonYear[] = []
  let cumulativeGridCost = 0
  let cumulativeSolarCost = roi.netCost
  for (let y = 1; y <= years; y++) {
    const escalationFactor = Math.pow(1 + escalationRate, y - 1)
    const gridCostThatYear = year1GridCost * escalationFactor
    const solarResidualThatYear = year1ResidualCost * escalationFactor
    cumulativeGridCost += gridCostThatYear
    cumulativeSolarCost += solarResidualThatYear
    rows.push({
      year: y,
      gridCostThatYear: round2(gridCostThatYear),
      cumulativeGridCost: round2(cumulativeGridCost),
      cumulativeSolarCost: round2(cumulativeSolarCost),
      cumulativeSavings: round2(cumulativeGridCost - cumulativeSolarCost),
    })
  }

  return {
    scenario,
    escalationRate,
    netCost: roi.netCost,
    rows,
    notes: [
      `Assumes your electricity tariff rises ${Math.round(escalationRate * 100)}%/year (${scenario} scenario) and solar generation stays constant. Real panels degrade gradually (commonly cited at ~0.5%/year), which would modestly reduce real-world savings versus this projection.`,
    ],
  }
}

// ---------------------------------------------------------------------------
// Environmental impact
// ---------------------------------------------------------------------------

/** India's indicative national grid emission factor (CEA CO2 Baseline Database; varies by report year). */
const GRID_EMISSION_FACTOR_KG_PER_KWH = 0.82
/** Commonly cited average CO2 absorbed by one mature tree per year, kg. */
const CO2_KG_PER_TREE_PER_YEAR = 21

export interface CarbonOffsetInput {
  annualGenerationKwh: number
}

export interface CarbonOffsetResult {
  annualCo2OffsetKg: number
  treeEquivalent: number
  notes: string[]
}

export function estimateCarbonOffset(input: CarbonOffsetInput): CarbonOffsetResult {
  const { annualGenerationKwh } = input
  if (annualGenerationKwh <= 0) throw new Error('annualGenerationKwh must be > 0')

  const annualCo2OffsetKg = annualGenerationKwh * GRID_EMISSION_FACTOR_KG_PER_KWH
  const treeEquivalent = Math.round(annualCo2OffsetKg / CO2_KG_PER_TREE_PER_YEAR)

  return {
    annualCo2OffsetKg: round2(annualCo2OffsetKg),
    treeEquivalent,
    notes: [
      `Based on India's indicative national grid emission factor (~${GRID_EMISSION_FACTOR_KG_PER_KWH} kg CO2/kWh, CEA CO2 Baseline Database) and a commonly cited average of ~${CO2_KG_PER_TREE_PER_YEAR} kg CO2 absorbed per mature tree per year. Actual figures vary by report year, grid mix and tree species.`,
    ],
  }
}
