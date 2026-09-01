/**
 * bijlicalc — multi-appliance household bill builder.
 *
 * The differentiator: appliances are summed and priced through the real
 * per-DISCOM PROGRESSIVE slab tariff (src/lib/calc/electricity.ts), not a
 * flat assumed rate — so the builder can show exactly when adding an
 * appliance pushes the household's total consumption into a more
 * expensive tariff slab.
 */

import { calculateSlabCharges, computeBill, getTariff } from './electricity'
import type { BillBreakdown } from './electricity'

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

export interface BuilderApplianceItem {
  id: string
  name: string
  watts: number
  hoursPerDay: number
}

export function applianceMonthlyUnits(item: Pick<BuilderApplianceItem, 'watts' | 'hoursPerDay'>): number {
  return round2((item.watts * item.hoursPerDay * 30) / 1000)
}

export interface SlabTier {
  ratePerUnit: number
  fromUnit: number
  toUnit: number | null
}

/** Which slab tier a given total monthly consumption falls into, for this DISCOM. */
export function slabForUnits(units: number, discomCode: string): SlabTier | null {
  if (units <= 0) return null
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ?? tariff.connectionTypes[0]
  const slab = calculateSlabCharges(units, res.slabs)
  const line = [...slab.lines].reverse().find((l) => l.unitsInSlab > 0)
  if (!line) return null
  return { ratePerUnit: line.ratePerUnit, fromUnit: line.fromUnit, toUnit: line.toUnit }
}

export interface BuilderItemResult extends BuilderApplianceItem {
  monthlyUnits: number
  cumulativeUnitsAfter: number
  slabBefore: SlabTier | null
  slabAfter: SlabTier | null
  /** True when adding this appliance pushed the household total into a higher-rate slab. */
  slabCrossed: boolean
}

export interface ApplianceBuilderResult {
  items: BuilderItemResult[]
  totalMonthlyUnits: number
  bill: BillBreakdown
}

export function computeApplianceBuilder(
  discomCode: string,
  items: BuilderApplianceItem[],
): ApplianceBuilderResult {
  const tariff = getTariff(discomCode)
  const res =
    tariff.connectionTypes.find((c) => c.connectionType === 'residential') ?? tariff.connectionTypes[0]

  let cumulative = 0
  const enriched: BuilderItemResult[] = items.map((item) => {
    const monthlyUnits = applianceMonthlyUnits(item)
    const slabBefore = slabForUnits(cumulative, discomCode)
    cumulative = round2(cumulative + monthlyUnits)
    const slabAfter = slabForUnits(cumulative, discomCode)
    const slabCrossed = Boolean(
      slabAfter && (!slabBefore || slabAfter.ratePerUnit !== slabBefore.ratePerUnit),
    )
    return { ...item, monthlyUnits, cumulativeUnitsAfter: cumulative, slabBefore, slabAfter, slabCrossed }
  })

  const bill = computeBill(tariff, {
    connectionType: res.connectionType,
    unitsConsumed: cumulative,
    phase: 'single',
    // A handful of DISCOMs bill the fixed charge per kW of sanctioned load
    // rather than a flat/per-phase amount — 3kW is the same representative
    // default used elsewhere on the site (e.g. DiscomCalculatorPage) for a
    // typical single-phase residential connection.
    sanctionedLoad: res.fixedCharge.basis === 'perLoad' ? 3 : undefined,
  })

  return { items: enriched, totalMonthlyUnits: cumulative, bill }
}
