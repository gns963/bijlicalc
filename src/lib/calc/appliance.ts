/**
 * bijlicalc — generic appliance running-cost engine.
 *
 * Same marginal-rate pricing logic as AC: an appliance's units are extra
 * load on top of base household usage, so they're priced at the DISCOM's
 * top tariff slab (+ FCA + duty) via `marginalRatePerUnit`, not a flat
 * average rate.
 */

import { marginalRatePerUnit } from './ac'

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

export interface SimpleApplianceCostInput {
  discomCode: string
  wattage: number
  hoursPerDay: number
}

export interface SimpleApplianceCostResult {
  wattage: number
  hoursPerDay: number
  dailyUnits: number
  monthlyUnits: number
  annualUnits: number
  effectiveRatePerUnit: number
  monthlyCost: number
  annualCost: number
}

/** Wattage × hours/day appliances — fans, bulbs, chargers, TVs, etc. */
export function simpleApplianceCost(
  input: SimpleApplianceCostInput,
): SimpleApplianceCostResult {
  const { discomCode, wattage, hoursPerDay } = input
  if (wattage <= 0) throw new Error('wattage must be > 0')
  if (hoursPerDay < 0 || hoursPerDay > 24) {
    throw new Error('hoursPerDay must be between 0 and 24')
  }

  const dailyUnits = (wattage * hoursPerDay) / 1000
  const monthlyUnits = dailyUnits * 30
  const annualUnits = dailyUnits * 365
  const effectiveRatePerUnit = marginalRatePerUnit(discomCode)

  return {
    wattage,
    hoursPerDay,
    dailyUnits: round2(dailyUnits),
    monthlyUnits: round2(monthlyUnits),
    annualUnits: round2(annualUnits),
    effectiveRatePerUnit,
    monthlyCost: round2(monthlyUnits * effectiveRatePerUnit),
    annualCost: round2(annualUnits * effectiveRatePerUnit),
  }
}

export interface FridgeCostInput {
  discomCode: string
  /** Annual energy consumption in kWh/year — printed on every Indian
   *  fridge's mandatory BEE star label. This is the real, model-specific
   *  figure, not an estimate. */
  annualUnitsFromLabel: number
}

export interface FridgeCostResult {
  annualUnitsFromLabel: number
  dailyUnits: number
  monthlyUnits: number
  effectiveRatePerUnit: number
  monthlyCost: number
  annualCost: number
}

/** Fridges run continuously with a variable duty cycle that's hard to model
 *  generically — so instead of guessing wattage, this uses the annual kWh
 *  figure already printed on the appliance's own BEE label. */
export function fridgeCost(input: FridgeCostInput): FridgeCostResult {
  const { discomCode, annualUnitsFromLabel } = input
  if (annualUnitsFromLabel <= 0) {
    throw new Error('annualUnitsFromLabel must be > 0')
  }

  const dailyUnits = annualUnitsFromLabel / 365
  const monthlyUnits = annualUnitsFromLabel / 12
  const effectiveRatePerUnit = marginalRatePerUnit(discomCode)

  return {
    annualUnitsFromLabel,
    dailyUnits: round2(dailyUnits),
    monthlyUnits: round2(monthlyUnits),
    effectiveRatePerUnit,
    monthlyCost: round2(monthlyUnits * effectiveRatePerUnit),
    annualCost: round2(annualUnitsFromLabel * effectiveRatePerUnit),
  }
}
