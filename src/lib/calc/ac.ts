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

export const COOLING_KW_PER_TON = 3.517 // 1 ton of refrigeration ≈ 3.517 kW cooling
/** Compressor duty factor: cooling hours are rarely full-load, so scale down. */
export const LOAD_FACTOR = 0.7

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

// ---------------------------------------------------------------------------
// Power consumption from nameplate current (an alternative to the
// tonnage/star-rating route, for users who have the AC's rated current)
// ---------------------------------------------------------------------------

export const DEFAULT_AC_POWER_FACTOR = 0.85 // typical for an AC compressor motor
export const DEFAULT_VOLTAGE = 230 // standard Indian single-phase supply

export interface AcPowerConsumptionInput {
  ratedCurrentAmps: number
  hoursPerDay: number
  voltage?: number
  powerFactor?: number
}

export interface AcPowerConsumptionResult {
  inputKw: number
  dailyUnits: number
  monthlyUnits: number
  annualUnits: number
  notes: string[]
}

export function calculateAcPowerConsumption(
  input: AcPowerConsumptionInput,
): AcPowerConsumptionResult {
  const {
    ratedCurrentAmps,
    hoursPerDay,
    voltage = DEFAULT_VOLTAGE,
    powerFactor = DEFAULT_AC_POWER_FACTOR,
  } = input
  if (ratedCurrentAmps <= 0) throw new Error('ratedCurrentAmps must be > 0')
  if (hoursPerDay < 0 || hoursPerDay > 24) {
    throw new Error('hoursPerDay must be between 0 and 24')
  }

  const inputKw = (voltage * ratedCurrentAmps * powerFactor) / 1000
  const dailyUnits = inputKw * hoursPerDay

  return {
    inputKw: round2(inputKw),
    dailyUnits: round2(dailyUnits),
    monthlyUnits: round2(dailyUnits * 30),
    annualUnits: round2(dailyUnits * 365),
    notes: [
      `Power = voltage (${voltage}V) × rated current × ${powerFactor} power factor — a typical figure for an AC compressor motor. Your nameplate's actual power factor may differ slightly.`,
    ],
  }
}

/**
 * Rough nameplate rated-current estimate from tonnage and star rating, for
 * reference tables when a user hasn't measured their own unit's nameplate.
 * Uses full-load input power (no compressor duty-factor derating, since
 * nameplate current is itself a full-load figure) divided by voltage ×
 * power factor — the same relationship calculateAcPowerConsumption() uses
 * in reverse. Actual nameplate current varies by brand and compressor
 * design; this is a planning approximation, not a substitute for reading
 * the unit's own label.
 */
export function estimateAcRatedCurrentAmps(tonnage: number, starRating: number): number {
  const iseer = ISEER_BY_STAR[starRating] ?? ISEER_BY_STAR[3]
  const inputKw = (tonnage * COOLING_KW_PER_TON) / iseer
  return round2((inputKw * 1000) / (DEFAULT_VOLTAGE * DEFAULT_AC_POWER_FACTOR))
}

// ---------------------------------------------------------------------------
// Circuit safety — MCB and wire gauge sizing
// ---------------------------------------------------------------------------

const MCB_STANDARD_SIZES = [6, 10, 16, 20, 25, 32, 40, 50, 63]
/** Commonly used copper-wire safe current-carrying capacities in Indian
 *  residential wiring practice. Always confirm against IS 732 and local
 *  code for the specific run length, ambient temperature and conduit
 *  fill — this is general planning guidance, not a final spec. */
const WIRE_GAUGE_TABLE: { maxAmps: number; sqmm: number }[] = [
  { maxAmps: 12, sqmm: 1.5 },
  { maxAmps: 18, sqmm: 2.5 },
  { maxAmps: 26, sqmm: 4 },
  { maxAmps: 34, sqmm: 6 },
  { maxAmps: 50, sqmm: 10 },
]
/** Headroom over the AC's rated current for MCB/wire sizing — accounts for
 *  compressor starting current and continuous-duty derating. */
const CIRCUIT_SAFETY_MARGIN = 1.25

export interface AcCircuitSafetyInput {
  ratedCurrentAmps: number
}

export interface AcCircuitSafetyResult {
  designCurrentAmps: number
  recommendedMcbAmps: number
  recommendedWireSqmm: number
  notes: string[]
}

export function recommendAcCircuit(input: AcCircuitSafetyInput): AcCircuitSafetyResult {
  const { ratedCurrentAmps } = input
  if (ratedCurrentAmps <= 0) throw new Error('ratedCurrentAmps must be > 0')

  const designCurrent = ratedCurrentAmps * CIRCUIT_SAFETY_MARGIN
  const recommendedMcbAmps =
    MCB_STANDARD_SIZES.find((a) => a >= designCurrent) ?? MCB_STANDARD_SIZES.at(-1)!
  const wireEntry =
    WIRE_GAUGE_TABLE.find((w) => w.maxAmps >= recommendedMcbAmps) ?? WIRE_GAUGE_TABLE.at(-1)!

  return {
    designCurrentAmps: round2(designCurrent),
    recommendedMcbAmps,
    recommendedWireSqmm: wireEntry.sqmm,
    notes: [
      'General planning guidance only — not a substitute for a licensed electrician. Wire run length, ambient temperature, conduit fill and local electrical code (IS 732) all affect the correct final specification for your installation.',
    ],
  }
}
