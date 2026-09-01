/**
 * bijlicalc — EV home-charging cost engine.
 *
 * Same marginal-rate pricing as AC and other appliances: charging an EV at
 * home is incremental load, priced at the DISCOM's top tariff slab via
 * `marginalRatePerUnit`.
 */

import { marginalRatePerUnit } from './ac'

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/** Typical AC (Level 1/2) home charging loss — some energy is lost as heat during conversion. */
const DEFAULT_CHARGER_EFFICIENCY = 0.9

export interface EvChargingCostInput {
  discomCode: string
  batteryCapacityKwh: number
  chargerEfficiency?: number
  /** Full-charge range in km, optional — enables a ₹/km figure. */
  fullRangeKm?: number
}

export interface EvChargingCostResult {
  unitsNeeded: number
  costToFullCharge: number
  effectiveRatePerUnit: number
  costPerKm: number | null
  notes: string[]
}

export function calculateEvChargingCost(input: EvChargingCostInput): EvChargingCostResult {
  const {
    discomCode,
    batteryCapacityKwh,
    chargerEfficiency = DEFAULT_CHARGER_EFFICIENCY,
    fullRangeKm,
  } = input
  if (batteryCapacityKwh <= 0) throw new Error('batteryCapacityKwh must be > 0')
  if (chargerEfficiency <= 0 || chargerEfficiency > 1) {
    throw new Error('chargerEfficiency must be between 0 and 1')
  }

  const effectiveRatePerUnit = marginalRatePerUnit(discomCode)
  const unitsNeeded = batteryCapacityKwh / chargerEfficiency
  const costToFullCharge = unitsNeeded * effectiveRatePerUnit
  const costPerKm =
    fullRangeKm && fullRangeKm > 0 ? round2(costToFullCharge / fullRangeKm) : null

  return {
    unitsNeeded: round2(unitsNeeded),
    costToFullCharge: round2(costToFullCharge),
    effectiveRatePerUnit,
    costPerKm,
    notes: [
      `Assumes ${Math.round(chargerEfficiency * 100)}% charging efficiency (some energy is lost as heat during AC charging) and prices units at your DISCOM's top tariff slab, since home charging adds to your existing consumption.`,
    ],
  }
}
