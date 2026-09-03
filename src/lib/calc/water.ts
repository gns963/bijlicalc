/**
 * DesiMetrics — water bill engine.
 *
 * Unlike electricity DISCOMs, India's municipal/board water tariffs are not
 * centrally published in a form we can verify and cite per board — billing
 * basis varies widely (flat rate, metered volumetric, or tied to property
 * tax) by city and even by connection type within a city. Rather than
 * fabricate slab numbers we can't source, this uses the consumer's own real
 * rate (from their bill or board's published tariff), the same "give us your
 * real number" pattern used for generator fuel and net-metering export rates.
 */

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

export interface WaterBillInput {
  consumptionKl: number
  ratePerKl: number
  fixedChargePerMonth?: number
}

export interface WaterBillResult {
  volumetricCharge: number
  fixedCharge: number
  total: number
}

export function calculateWaterBill(input: WaterBillInput): WaterBillResult {
  const { consumptionKl, ratePerKl, fixedChargePerMonth = 0 } = input
  if (consumptionKl < 0) throw new Error('consumptionKl must be >= 0')
  if (ratePerKl < 0) throw new Error('ratePerKl must be >= 0')
  if (fixedChargePerMonth < 0) throw new Error('fixedChargePerMonth must be >= 0')

  const volumetricCharge = consumptionKl * ratePerKl

  return {
    volumetricCharge: round2(volumetricCharge),
    fixedCharge: round2(fixedChargePerMonth),
    total: round2(volumetricCharge + fixedChargePerMonth),
  }
}

// ---------------------------------------------------------------------------
// Real per-board tariff engine — for boards with a populated, verified (or
// honestly-flagged-unverified) tariff file in src/data/water-tariffs/.
// ---------------------------------------------------------------------------

import type { WaterConnectionType, WaterSlab, WaterTariffFile } from '../../data/water-tariffs/_schema'
import { getConnectionTariff, parseWaterTariffFile } from '../../data/water-tariffs/_schema'
import djbJson from '../../data/water-tariffs/djb.json'
import cmwssbJson from '../../data/water-tariffs/cmwssb.json'
import pcmcJson from '../../data/water-tariffs/pcmc.json'

export type { WaterConnectionType } from '../../data/water-tariffs/_schema'
export { getConnectionTariff } from '../../data/water-tariffs/_schema'

/** Which connection types a board has real, sourced data for — drives
 *  whether the UI shows tabs at all (most boards are domestic-only today). */
export function availableConnectionTypes(tariff: WaterTariffFile): WaterConnectionType[] {
  return tariff.connectionTypes.map((c) => c.connectionType)
}

export interface WaterSlabLine {
  fromKL: number
  toKL: number | null
  ratePerKL: number
  klInSlab: number
  charge: number
}

export interface WaterSlabResult {
  lines: WaterSlabLine[]
  subtotal: number
}

export function calculateWaterSlabCharges(consumptionKl: number, slabs: WaterSlab[]): WaterSlabResult {
  if (consumptionKl < 0) throw new Error('consumptionKl must be >= 0')
  if (slabs.length === 0) throw new Error('at least one slab is required')

  const lines: WaterSlabLine[] = []
  let lowerBound = 0
  for (const slab of slabs) {
    const upper = slab.maxKL ?? Number.POSITIVE_INFINITY
    const klInSlab = Math.max(0, Math.min(consumptionKl, upper) - lowerBound)
    lines.push({
      fromKL: lowerBound,
      toKL: slab.maxKL,
      ratePerKL: slab.ratePerKL,
      klInSlab,
      charge: klInSlab * slab.ratePerKL,
    })
    lowerBound = upper
  }
  return { lines, subtotal: lines.reduce((sum, l) => sum + l.charge, 0) }
}

export interface RealWaterBillBreakdown {
  boardCode: string
  boardName: string
  billingCycle: WaterTariffFile['billingCycle']
  connectionType: WaterConnectionType
  consumptionKl: number
  meterSize: string

  /** True when an all-or-nothing free allowance applied and consumption stayed within it. */
  freeAllowanceApplied: boolean
  slab: WaterSlabResult
  waterCharge: number
  sewerageCharge: number
  fixedCharge: number
  additionalFeesTotal: number

  total: number
  monthlyEquivalent: { total: number; consumptionKl: number } | null

  currency: 'INR'
  notes: string[]
}

export interface RealWaterBillInput {
  boardCode: string
  consumptionKl: number
  /** Defaults to the first meter size listed in the tariff file. */
  meterSize?: string
  /** Defaults to 'domestic' — falls back to the first available type if a
   *  board has no domestic entry (shouldn't happen in practice). */
  connectionType?: WaterConnectionType
}

export function computeWaterBill(
  tariff: WaterTariffFile,
  input: Omit<RealWaterBillInput, 'boardCode'>,
): RealWaterBillBreakdown {
  const { consumptionKl } = input
  if (consumptionKl < 0) throw new Error('consumptionKl must be >= 0')

  const connection = getConnectionTariff(tariff, input.connectionType)

  const meterSize = input.meterSize ?? Object.keys(connection.fixedChargeByMeterSize)[0]
  const fixedCharge = connection.fixedChargeByMeterSize[meterSize]
  if (fixedCharge === undefined) {
    throw new Error(
      `Unknown meter size "${meterSize}" for ${tariff.boardCode} (${connection.connectionType}). Available: ${Object.keys(connection.fixedChargeByMeterSize).join(', ')}`,
    )
  }

  const notes: string[] = []
  let freeAllowanceApplied = false
  let slab: WaterSlabResult

  if (
    connection.freeAllowance?.type === 'allOrNothing' &&
    consumptionKl <= connection.freeAllowance.kl
  ) {
    // Within the free threshold — the whole water charge is waived.
    freeAllowanceApplied = true
    slab = { lines: [], subtotal: 0 }
    notes.push(
      `Consumption is at or below the ${connection.freeAllowance.kl} KL free threshold, so the entire water charge is waived — but crossing it by even 1 litre would make the FULL consumption billable, not just the excess.`,
    )
  } else {
    // Either no free allowance, a true allowance, or an all-or-nothing
    // threshold that's been crossed (billing the FULL consumption).
    slab = calculateWaterSlabCharges(consumptionKl, connection.slabs)
    if (connection.freeAllowance?.type === 'allOrNothing') {
      notes.push(
        `Consumption exceeded the ${connection.freeAllowance.kl} KL free threshold, so the ENTIRE consumption is billed at slab rates — not just the amount above the threshold.`,
      )
    } else if (connection.freeAllowance?.type === 'trueAllowance') {
      const freeKl = Math.min(connection.freeAllowance.kl, consumptionKl)
      const freeValue = calculateWaterSlabCharges(freeKl, connection.slabs).subtotal
      slab = { lines: slab.lines, subtotal: Math.max(0, slab.subtotal - freeValue) }
    }
  }

  const waterCharge = slab.subtotal
  const sewerageCharge = waterCharge * (connection.sewerageChargePercent / 100)
  const additionalFeesTotal = (connection.additionalFees ?? []).reduce((sum, f) => sum + f.amount, 0)

  const total = waterCharge + sewerageCharge + fixedCharge + additionalFeesTotal
  const periodMonths = tariff.billingCycle === 'bimonthly' ? 2 : 1

  if (periodMonths > 1) {
    notes.push(
      `${tariff.boardCode} bills bi-monthly: this consumption and total are for a ~60-day period. See monthlyEquivalent for the per-month figure.`,
    )
  }

  return {
    boardCode: tariff.boardCode,
    boardName: tariff.boardName,
    billingCycle: tariff.billingCycle,
    connectionType: connection.connectionType,
    consumptionKl,
    meterSize,

    freeAllowanceApplied,
    slab: {
      lines: slab.lines.map((l) => ({ ...l, charge: round2(l.charge) })),
      subtotal: round2(slab.subtotal),
    },
    waterCharge: round2(waterCharge),
    sewerageCharge: round2(sewerageCharge),
    fixedCharge: round2(fixedCharge),
    additionalFeesTotal: round2(additionalFeesTotal),

    total: round2(total),
    monthlyEquivalent:
      periodMonths > 1
        ? { total: round2(total / periodMonths), consumptionKl: round2(consumptionKl / periodMonths) }
        : null,

    currency: 'INR',
    notes,
  }
}

/** Bundled real-tariff boards, validated at load time. Add new boards here. */
export const waterTariffRegistry: Record<string, WaterTariffFile> = {
  DJB: parseWaterTariffFile(djbJson),
  CMWSSB: parseWaterTariffFile(cmwssbJson),
  PCMC: parseWaterTariffFile(pcmcJson),
}

export function getWaterTariff(boardCode: string): WaterTariffFile {
  const tariff = waterTariffRegistry[boardCode]
  if (!tariff) {
    throw new Error(
      `No water tariff loaded for board "${boardCode}". Available: ${Object.keys(waterTariffRegistry).join(', ')}`,
    )
  }
  return tariff
}

export function calculateFullWaterBill(input: RealWaterBillInput): RealWaterBillBreakdown {
  const tariff = getWaterTariff(input.boardCode)
  return computeWaterBill(tariff, input)
}

export interface BudgetToKlResult {
  maxKl: number
  bill: RealWaterBillBreakdown
}

/** Reverse calculator: binary-searches computeWaterBill() for the maximum KL
 *  that stays within a target budget — same algorithm as electricity's
 *  findMaxUnitsForBudget, adapted for KL instead of units. */
export function findMaxKlForBudget(
  tariff: WaterTariffFile,
  budget: number,
  input: Omit<RealWaterBillInput, 'boardCode' | 'consumptionKl'>,
): BudgetToKlResult {
  if (budget <= 0) {
    const bill = computeWaterBill(tariff, { ...input, consumptionKl: 0 })
    return { maxKl: 0, bill }
  }

  let lo = 0
  let hi = 1000
  while (computeWaterBill(tariff, { ...input, consumptionKl: hi }).total <= budget && hi < 1_000_000) {
    hi *= 2
  }
  while (lo < hi) {
    const mid = Math.ceil((lo + hi + 1) / 2)
    const total = computeWaterBill(tariff, { ...input, consumptionKl: mid }).total
    if (total <= budget) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }
  return { maxKl: lo, bill: computeWaterBill(tariff, { ...input, consumptionKl: lo }) }
}
