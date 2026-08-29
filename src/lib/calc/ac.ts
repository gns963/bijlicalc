/**
 * bijlicalc — air-conditioner running-cost & sizing engine.
 *
 * PURE, framework-agnostic TypeScript. Reuses the DISCOM tariff data so AC
 * running cost is priced at the household's marginal (top-slab) electricity
 * rate + FCA + duty — because AC is incremental load on top of base usage, it
 * is billed at your highest slab, not the average rate.
 *
 * Money is ₹ (INR). Energy is kWh ("units").
 */

import { getTariff } from './electricity'

/** BEE ISEER (seasonal efficiency, W/W) by star rating — indicative 2023 bands. */
export const ISEER_BY_STAR: Record<number, number> = {
  1: 3.1,
  2: 3.3,
  3: 3.55,
  4: 4.1,
  5: 4.7,
}

const COOLING_KW_PER_TON = 3.517 // 1 ton of refrigeration ≈ 3.517 kW cooling
/** Compressor duty factor: cooling hours are rarely full-load, so scale down. */
const LOAD_FACTOR = 0.7

export interface AcCostInput {
  discomCode: string
  tonnage: number
  starRating: number // 1–5
  dailyHours: number
}

export interface AcCostResult {
  tonnage: number
  starRating: number
  iseer: number
  /** Electrical input power in kW at full load. */
  inputKw: number
  dailyUnits: number
  monthlyUnits: number
  annualUnits: number
  effectiveRatePerUnit: number
  monthlyCost: number
  annualCost: number
  currency: 'INR'
  notes: string[]
}

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/** Effective marginal ₹/unit an AC is billed at for a DISCOM (top slab + FCA + duty). */
export function marginalRatePerUnit(discomCode: string): number {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
    tariff.connectionTypes[0]
  const topSlab = res.slabs[res.slabs.length - 1]
  const base = topSlab.ratePerUnit + tariff.fuelCostAdjustment
  return round2(base * (1 + tariff.electricityDutyPercent / 100))
}

/** Daily units an AC consumes — shared with the comparison tool. */
export function acDailyUnits(
  tonnage: number,
  starRating: number,
  dailyHours: number,
): number {
  const iseer = ISEER_BY_STAR[starRating] ?? ISEER_BY_STAR[3]
  const inputKw = (tonnage * COOLING_KW_PER_TON) / iseer
  return inputKw * dailyHours * LOAD_FACTOR
}

export function calculateAcCost(input: AcCostInput): AcCostResult {
  const { discomCode, tonnage, starRating, dailyHours } = input
  if (tonnage <= 0) throw new Error('tonnage must be > 0')
  if (dailyHours < 0) throw new Error('dailyHours must be >= 0')

  const iseer = ISEER_BY_STAR[starRating] ?? ISEER_BY_STAR[3]
  const inputKw = (tonnage * COOLING_KW_PER_TON) / iseer
  const dailyUnits = inputKw * dailyHours * LOAD_FACTOR
  const monthlyUnits = dailyUnits * 30
  const annualUnits = dailyUnits * 365

  const effectiveRatePerUnit = marginalRatePerUnit(discomCode)

  return {
    tonnage,
    starRating,
    iseer,
    inputKw: round2(inputKw),
    dailyUnits: round2(dailyUnits),
    monthlyUnits: round2(monthlyUnits),
    annualUnits: round2(annualUnits),
    effectiveRatePerUnit,
    monthlyCost: round2(monthlyUnits * effectiveRatePerUnit),
    annualCost: round2(annualUnits * effectiveRatePerUnit),
    currency: 'INR',
    notes: [
      `Assumes a ${LOAD_FACTOR * 100}% compressor duty factor and ISEER ${iseer} for a ${starRating}-star unit. Priced at your top electricity slab (₹${effectiveRatePerUnit}/unit incl. FCA & duty).`,
    ],
  }
}

// ---------------------------------------------------------------------------
// Tonnage sizing
// ---------------------------------------------------------------------------

export type SunExposure = 'low' | 'medium' | 'high'
export type FloorLevel = 'top' | 'other'

export interface TonnageInput {
  areaSqFt: number
  sunExposure: SunExposure
  floor: FloorLevel
}

export interface TonnageResult {
  areaSqFt: number
  rawTons: number
  recommendedTon: number
  coolingBtu: number
  notes: string[]
}

const STANDARD_TONNAGES = [0.8, 1.0, 1.5, 2.0]

export function recommendTonnage(input: TonnageInput): TonnageResult {
  const { areaSqFt, sunExposure, floor } = input
  if (areaSqFt <= 0) throw new Error('areaSqFt must be > 0')

  const sunFactor = sunExposure === 'high' ? 1.2 : sunExposure === 'medium' ? 1.1 : 1.0
  const floorFactor = floor === 'top' ? 1.1 : 1.0

  // ~1 ton per 140 sq ft baseline, adjusted for heat gain.
  const rawTons = (areaSqFt / 140) * sunFactor * floorFactor
  const recommendedTon =
    STANDARD_TONNAGES.find((t) => t >= rawTons) ?? STANDARD_TONNAGES.at(-1)!

  const notes: string[] = []
  if (rawTons > 2.0) {
    notes.push(
      'Your room is large — consider a 2 ton unit plus a ceiling fan, or two smaller units for even cooling.',
    )
  }

  return {
    areaSqFt,
    rawTons: round2(rawTons),
    recommendedTon,
    coolingBtu: Math.round(rawTons * 12000),
    notes,
  }
}
