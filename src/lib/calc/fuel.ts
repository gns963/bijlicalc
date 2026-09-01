/**
 * bijlicalc — fuel cost engines: vehicle running cost, LPG cylinder usage,
 * generator running cost.
 *
 * Pure arithmetic on user-supplied real numbers wherever possible (fuel
 * price, vehicle mileage, generator's own rated fuel consumption) rather
 * than us guessing engine-specific constants we can't verify. The one
 * modelled assumption — LPG burner consumption rate — is stated plainly in
 * the result, not asserted as precise fact.
 */

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

// ---------------------------------------------------------------------------
// Vehicle running cost (petrol/diesel/CNG — anything priced per unit fuel)
// ---------------------------------------------------------------------------

export interface VehicleCostInput {
  fuelPricePerLitre: number
  mileageKmPerLitre: number
  monthlyKm: number
}

export interface VehicleCostResult {
  costPerKm: number
  monthlyCost: number
  annualCost: number
  monthlyFuelLitres: number
}

export function vehicleCostPerKm(input: VehicleCostInput): VehicleCostResult {
  const { fuelPricePerLitre, mileageKmPerLitre, monthlyKm } = input
  if (fuelPricePerLitre <= 0) throw new Error('fuelPricePerLitre must be > 0')
  if (mileageKmPerLitre <= 0) throw new Error('mileageKmPerLitre must be > 0')
  if (monthlyKm < 0) throw new Error('monthlyKm must be >= 0')

  const costPerKm = fuelPricePerLitre / mileageKmPerLitre
  const monthlyFuelLitres = monthlyKm / mileageKmPerLitre
  const monthlyCost = monthlyFuelLitres * fuelPricePerLitre

  return {
    costPerKm: round2(costPerKm),
    monthlyCost: round2(monthlyCost),
    annualCost: round2(monthlyCost * 12),
    monthlyFuelLitres: round2(monthlyFuelLitres),
  }
}

// ---------------------------------------------------------------------------
// LPG cylinder usage
// ---------------------------------------------------------------------------

/** Commonly cited domestic LPG burner consumption at a medium-to-full flame. */
const LPG_KG_PER_BURNER_HOUR = 0.25

export interface LpgUsageInput {
  cylinderKg: number
  cylinderPrice: number
  dailyBurnerHours: number
}

export interface LpgUsageResult {
  daysRemaining: number
  dailyCost: number
  monthlyCost: number
  notes: string[]
}

export function estimateLpgUsage(input: LpgUsageInput): LpgUsageResult {
  const { cylinderKg, cylinderPrice, dailyBurnerHours } = input
  if (cylinderKg <= 0) throw new Error('cylinderKg must be > 0')
  if (cylinderPrice <= 0) throw new Error('cylinderPrice must be > 0')
  if (dailyBurnerHours <= 0) throw new Error('dailyBurnerHours must be > 0')

  const dailyKgUsed = dailyBurnerHours * LPG_KG_PER_BURNER_HOUR
  const daysRemaining = cylinderKg / dailyKgUsed
  const dailyCost = cylinderPrice / daysRemaining

  return {
    daysRemaining: round2(daysRemaining),
    dailyCost: round2(dailyCost),
    monthlyCost: round2(dailyCost * 30),
    notes: [
      `Assumes ${LPG_KG_PER_BURNER_HOUR} kg/hour of LPG per burner-hour of active flame — a commonly cited rate for a medium-to-full domestic flame, not a measurement of your specific stove. "Burner-hours" means total active flame time across however many burners you use — two burners run for 30 minutes each counts as 1 burner-hour.`,
    ],
  }
}

// ---------------------------------------------------------------------------
// Generator fuel cost
// ---------------------------------------------------------------------------

export interface GeneratorCostInput {
  /** From the generator's own spec sheet/manual — litres of fuel per hour at typical load. */
  consumptionRateLph: number
  fuelPricePerLitre: number
  hoursRun: number
}

export interface GeneratorCostResult {
  litresUsed: number
  totalCost: number
  costPerHour: number
}

export function estimateGeneratorCost(input: GeneratorCostInput): GeneratorCostResult {
  const { consumptionRateLph, fuelPricePerLitre, hoursRun } = input
  if (consumptionRateLph <= 0) throw new Error('consumptionRateLph must be > 0')
  if (fuelPricePerLitre <= 0) throw new Error('fuelPricePerLitre must be > 0')
  if (hoursRun <= 0) throw new Error('hoursRun must be > 0')

  const litresUsed = consumptionRateLph * hoursRun
  const totalCost = litresUsed * fuelPricePerLitre

  return {
    litresUsed: round2(litresUsed),
    totalCost: round2(totalCost),
    costPerHour: round2(consumptionRateLph * fuelPricePerLitre),
  }
}

// ---------------------------------------------------------------------------
// Generator cost per unit (kWh) vs grid power
// ---------------------------------------------------------------------------

/**
 * Commonly cited diesel-generator electrical output per litre of fuel at
 * typical (not peak) load — varies significantly with genset size, load
 * factor and engine efficiency (roughly 2.5-4.5 units/litre in practice).
 * Treat this as a planning approximation, not a spec-sheet figure for a
 * specific generator.
 */
const TYPICAL_GENERATOR_UNITS_PER_LITRE = 3.2

export interface GeneratorCostPerUnitInput {
  fuelPricePerLitre: number
  /** Optional override if you know your genset's real output per litre. */
  unitsPerLitre?: number
}

export interface GeneratorCostPerUnitResult {
  costPerUnit: number
  unitsPerLitre: number
  notes: string[]
}

export function estimateGeneratorCostPerUnit(
  input: GeneratorCostPerUnitInput,
): GeneratorCostPerUnitResult {
  const { fuelPricePerLitre, unitsPerLitre = TYPICAL_GENERATOR_UNITS_PER_LITRE } = input
  if (fuelPricePerLitre <= 0) throw new Error('fuelPricePerLitre must be > 0')
  if (unitsPerLitre <= 0) throw new Error('unitsPerLitre must be > 0')

  return {
    costPerUnit: round2(fuelPricePerLitre / unitsPerLitre),
    unitsPerLitre,
    notes: [
      `Assumes ~${unitsPerLitre} units (kWh) of electrical output per litre of diesel at typical load — a commonly cited planning figure, not a spec-sheet value for a specific generator; real output varies with genset size, load factor and age.`,
    ],
  }
}
