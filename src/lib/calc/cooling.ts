/**
 * bijlicalc — room air pull-down time engine.
 *
 * Real thermodynamics, explicitly scoped: this computes how long an AC
 * would take to remove the heat already held in the room's AIR ONLY,
 * using the standard sensible-heat formula Q = mass × specific-heat × ΔT
 * with textbook constants for air density and specific heat. It is a
 * theoretical floor, not a real-world prediction — real rooms keep gaining
 * heat through walls, windows, the roof and occupants while the AC runs,
 * which is why actual pull-down always takes longer. We say this plainly
 * in the result rather than inventing a multiplier to "correct" it.
 */

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/** Air density at typical room conditions, lb/ft³. */
const AIR_DENSITY_LB_PER_FT3 = 0.075
/** Specific heat of air, BTU per lb per °F. */
const AIR_SPECIFIC_HEAT_BTU_PER_LB_F = 0.24
/** Fraction of an AC's rated capacity going to sensible (temperature) cooling
 *  rather than latent (dehumidification) cooling — typical for split ACs. */
const DEFAULT_SENSIBLE_HEAT_RATIO = 0.75
const BTU_PER_TON = 12000

export interface CoolingTimeInput {
  areaSqFt: number
  ceilingHeightFt: number
  /** How many °C the room needs to drop by. */
  dropTempC: number
  acTon: number
  sensibleHeatRatio?: number
}

export interface CoolingTimeResult {
  volumeCuFt: number
  dropTempC: number
  heatToRemoveBtu: number
  effectiveCoolingBtuPerHour: number
  minutesToCoolAirOnly: number
  notes: string[]
}

export function estimateCoolingTime(input: CoolingTimeInput): CoolingTimeResult {
  const {
    areaSqFt,
    ceilingHeightFt,
    dropTempC,
    acTon,
    sensibleHeatRatio = DEFAULT_SENSIBLE_HEAT_RATIO,
  } = input
  if (areaSqFt <= 0) throw new Error('areaSqFt must be > 0')
  if (ceilingHeightFt <= 0) throw new Error('ceilingHeightFt must be > 0')
  if (dropTempC <= 0) throw new Error('dropTempC must be > 0')
  if (acTon <= 0) throw new Error('acTon must be > 0')

  const volumeCuFt = areaSqFt * ceilingHeightFt
  const dropTempF = dropTempC * 1.8 // a temperature DIFFERENCE converts with no +32 offset
  const heatToRemoveBtu =
    volumeCuFt * AIR_DENSITY_LB_PER_FT3 * AIR_SPECIFIC_HEAT_BTU_PER_LB_F * dropTempF

  const acBtuPerHour = acTon * BTU_PER_TON
  const effectiveCoolingBtuPerHour = acBtuPerHour * sensibleHeatRatio
  const minutesToCoolAirOnly = (heatToRemoveBtu / effectiveCoolingBtuPerHour) * 60

  return {
    volumeCuFt: round2(volumeCuFt),
    dropTempC,
    heatToRemoveBtu: Math.round(heatToRemoveBtu),
    effectiveCoolingBtuPerHour: Math.round(effectiveCoolingBtuPerHour),
    minutesToCoolAirOnly: round2(minutesToCoolAirOnly),
    notes: [
      `This is a theoretical minimum — how fast the AC could remove the heat already in the room's air, assuming no new heat enters. Real rooms keep gaining heat through walls, windows, the roof and occupants while the AC runs, so actual pull-down time is longer than this figure, sometimes by a wide margin on a hot day.`,
      `Assumes ${Math.round(sensibleHeatRatio * 100)}% of the AC's rated capacity goes to sensible (temperature) cooling rather than dehumidification — a typical split-AC figure.`,
    ],
  }
}
