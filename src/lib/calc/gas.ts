/**
 * DesiMetrics — piped natural gas (PNG) bill calculation engine.
 *
 * PURE, framework-agnostic TypeScript, mirroring the structure of
 * src/lib/calc/electricity.ts. Volume is SCM (Standard Cubic Metre) —
 * PNG's equivalent of electricity's "units". Money is ₹ (INR).
 */

import type { GasSlab, GasTariffFile } from '../../data/gas-tariffs/_schema'
import { parseGasTariffFile } from '../../data/gas-tariffs/_schema'
import iglJson from '../../data/gas-tariffs/igl.json'

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface GasSlabLine {
  fromSCM: number
  toSCM: number | null
  ratePerSCM: number
  scmInSlab: number
  charge: number
}

export interface GasSlabResult {
  lines: GasSlabLine[]
  subtotal: number
  totalSCM: number
}

export interface GasBillBreakdown {
  cgdCode: string
  cgdName: string
  billingCycle: GasTariffFile['billingCycle']
  scmConsumed: number

  slab: GasSlabResult
  gasChargeGross: number
  calorificAdjustment: { amount: number } | null
  fixedCharge: number

  total: number
  /** Non-null for bimonthly CGDs, so a 60-day figure isn't mistaken for a monthly one. */
  monthlyEquivalent: { total: number; scm: number } | null

  currency: 'INR'
  notes: string[]
}

export interface GasBillInput {
  cgdCode: string
  scmConsumed: number
}

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

// ---------------------------------------------------------------------------
// 1. Slab charges
// ---------------------------------------------------------------------------

export function calculateGasSlabCharges(
  scmConsumed: number,
  slabs: GasSlab[],
): GasSlabResult {
  if (scmConsumed < 0) throw new Error('scmConsumed must be >= 0')
  if (slabs.length === 0) throw new Error('at least one slab is required')

  const lines: GasSlabLine[] = []
  let lowerBound = 0

  for (const slab of slabs) {
    const upper = slab.maxSCM ?? Number.POSITIVE_INFINITY
    const scmInSlab = Math.max(0, Math.min(scmConsumed, upper) - lowerBound)
    const charge = scmInSlab * slab.ratePerSCM
    lines.push({
      fromSCM: lowerBound,
      toSCM: slab.maxSCM,
      ratePerSCM: slab.ratePerSCM,
      scmInSlab,
      charge,
    })
    lowerBound = upper
  }

  const subtotal = lines.reduce((sum, l) => sum + l.charge, 0)
  return { lines, subtotal, totalSCM: scmConsumed }
}

// ---------------------------------------------------------------------------
// 2. Full bill — pure core (tariff injected)
// ---------------------------------------------------------------------------

export function computeGasBill(
  tariff: GasTariffFile,
  input: Omit<GasBillInput, 'cgdCode'>,
): GasBillBreakdown {
  const { scmConsumed } = input

  const slab = calculateGasSlabCharges(scmConsumed, tariff.slabs)

  const calorificAdjustment =
    tariff.calorificValueAdjustment != null
      ? { amount: round2(slab.subtotal * (tariff.calorificValueAdjustment / 100)) }
      : null

  const total =
    slab.subtotal + (calorificAdjustment?.amount ?? 0) + tariff.fixedCharge

  const periodMonths = tariff.billingCycle === 'bimonthly' ? 2 : 1

  const notes: string[] = []
  if (periodMonths > 1) {
    notes.push(
      `${tariff.cgdCode} bills bi-monthly: this consumption and total are for a ~60-day period. See monthlyEquivalent for the per-month figure.`,
    )
  }

  return {
    cgdCode: tariff.cgdCode,
    cgdName: tariff.cgdName,
    billingCycle: tariff.billingCycle,
    scmConsumed,

    slab: {
      lines: slab.lines.map((l) => ({ ...l, charge: round2(l.charge) })),
      subtotal: round2(slab.subtotal),
      totalSCM: slab.totalSCM,
    },
    gasChargeGross: round2(slab.subtotal),
    calorificAdjustment,
    fixedCharge: round2(tariff.fixedCharge),

    total: round2(total),
    monthlyEquivalent:
      periodMonths > 1
        ? { total: round2(total / periodMonths), scm: round2(scmConsumed / periodMonths) }
        : null,

    currency: 'INR',
    notes,
  }
}

// ---------------------------------------------------------------------------
// 2b. Self-rate calculator — honest fallback for CGDs without a real tariff
// file yet (used by the generic GasBillCalculator on /gas and CGD pages
// that don't have a populated gas-tariffs/*.json entry).
// ---------------------------------------------------------------------------

export interface SelfRateGasBillInput {
  consumptionScm: number
  ratePerScm: number
  fixedChargePerMonth: number
}

export interface SelfRateGasBillResult {
  volumetricCharge: number
  fixedCharge: number
  total: number
}

export function calculateGasBill(input: SelfRateGasBillInput): SelfRateGasBillResult {
  const { consumptionScm, ratePerScm, fixedChargePerMonth } = input
  if (consumptionScm < 0) throw new Error('consumptionScm must be >= 0')
  if (ratePerScm < 0) throw new Error('ratePerScm must be >= 0')
  if (fixedChargePerMonth < 0) throw new Error('fixedChargePerMonth must be >= 0')

  const volumetricCharge = consumptionScm * ratePerScm
  return {
    volumetricCharge: round2(volumetricCharge),
    fixedCharge: round2(fixedChargePerMonth),
    total: round2(volumetricCharge + fixedChargePerMonth),
  }
}

// ---------------------------------------------------------------------------
// 3. Registry wrapper (resolves cgdCode)
// ---------------------------------------------------------------------------

/** Bundled real-tariff CGDs, validated at load time. Add new CGDs here. */
export const gasTariffRegistry: Record<string, GasTariffFile> = {
  IGL: parseGasTariffFile(iglJson),
}

export function getGasTariff(cgdCode: string): GasTariffFile {
  const tariff = gasTariffRegistry[cgdCode]
  if (!tariff) {
    throw new Error(
      `No gas tariff loaded for CGD "${cgdCode}". Available: ${Object.keys(gasTariffRegistry).join(', ')}`,
    )
  }
  return tariff
}

export function calculateFullGasBill(input: GasBillInput): GasBillBreakdown {
  const tariff = getGasTariff(input.cgdCode)
  return computeGasBill(tariff, input)
}

// ---------------------------------------------------------------------------
// 4. PNG vs LPG comparison
// ---------------------------------------------------------------------------

/** A 14.2kg domestic LPG cylinder is a widely-used reference size in India. */
const LPG_CYLINDER_KG = 14.2
/**
 * Rough calorific equivalence: 1 kg of LPG ≈ 1.33 SCM of PNG in delivered
 * cooking energy — a commonly used approximation, not a precise thermodynamic
 * conversion (real equivalence depends on the specific gas composition/CV of
 * each connection). Treat this as a planning approximation only.
 */
const SCM_PER_KG_LPG_EQUIVALENT = 1.33

export interface PngVsLpgComparisonInput {
  scmConsumedPerCycle: number
  cgdCode: string
  /** ₹ price of one 14.2kg domestic LPG cylinder — user's own real, current price. */
  lpgCylinderPrice: number
  /** Days in the billing cycle being compared (60 for bimonthly PNG, else 30). */
  cycleDays: number
}

export interface PngVsLpgComparisonResult {
  pngCost: number
  lpgEquivalentCylinders: number
  lpgEquivalentCost: number
  cheaperOption: 'png' | 'lpg' | 'equal'
  savingsAmount: number
}

/** Shared LPG-equivalence math — takes a PNG cost figure already computed
 *  (either from a real tariff or a self-entered rate) and compares it
 *  against the equivalent LPG cylinder cost. */
function comparePngCostVsLpg(
  pngCost: number,
  scmConsumedPerCycle: number,
  lpgCylinderPrice: number,
): Omit<PngVsLpgComparisonResult, 'pngCost'> {
  const lpgKgEquivalent = scmConsumedPerCycle / SCM_PER_KG_LPG_EQUIVALENT
  const lpgEquivalentCylinders = lpgKgEquivalent / LPG_CYLINDER_KG
  const lpgEquivalentCost = lpgEquivalentCylinders * lpgCylinderPrice

  const diff = round2(lpgEquivalentCost - pngCost)
  const cheaperOption = diff > 0.5 ? 'png' : diff < -0.5 ? 'lpg' : 'equal'

  return {
    lpgEquivalentCylinders: round2(lpgEquivalentCylinders),
    lpgEquivalentCost: round2(lpgEquivalentCost),
    cheaperOption,
    savingsAmount: Math.abs(diff),
  }
}

export function comparePngVsLpg(input: PngVsLpgComparisonInput): PngVsLpgComparisonResult {
  const { scmConsumedPerCycle, cgdCode, lpgCylinderPrice } = input
  const tariff = getGasTariff(cgdCode)
  const pngBill = computeGasBill(tariff, { scmConsumed: scmConsumedPerCycle })

  return {
    pngCost: pngBill.total,
    ...comparePngCostVsLpg(pngBill.total, scmConsumedPerCycle, lpgCylinderPrice),
  }
}

export interface PngVsLpgSelfRateComparisonInput {
  scmConsumedPerCycle: number
  /** User's own PNG rate from their bill, ₹/SCM. */
  ratePerScm: number
  fixedCharge: number
  /** ₹ price of one 14.2kg domestic LPG cylinder — user's own real, current price. */
  lpgCylinderPrice: number
}

/** Same comparison for the ~20 providers without a real tariff file yet —
 *  works from the user's own entered rate instead of a looked-up tariff. */
export function comparePngVsLpgSelfRate(
  input: PngVsLpgSelfRateComparisonInput,
): PngVsLpgComparisonResult {
  const { scmConsumedPerCycle, ratePerScm, fixedCharge, lpgCylinderPrice } = input
  const pngBill = calculateGasBill({
    consumptionScm: scmConsumedPerCycle,
    ratePerScm,
    fixedChargePerMonth: fixedCharge,
  })

  return {
    pngCost: pngBill.total,
    ...comparePngCostVsLpg(pngBill.total, scmConsumedPerCycle, lpgCylinderPrice),
  }
}
