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

import type { WaterSlab, WaterTariffFile } from '../../data/water-tariffs/_schema'
import { parseWaterTariffFile } from '../../data/water-tariffs/_schema'
import djbJson from '../../data/water-tariffs/djb.json'

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
}

export function computeWaterBill(
  tariff: WaterTariffFile,
  input: Omit<RealWaterBillInput, 'boardCode'>,
): RealWaterBillBreakdown {
  const { consumptionKl } = input
  if (consumptionKl < 0) throw new Error('consumptionKl must be >= 0')

  const meterSize = input.meterSize ?? Object.keys(tariff.fixedChargeByMeterSize)[0]
  const fixedCharge = tariff.fixedChargeByMeterSize[meterSize]
  if (fixedCharge === undefined) {
    throw new Error(
      `Unknown meter size "${meterSize}" for ${tariff.boardCode}. Available: ${Object.keys(tariff.fixedChargeByMeterSize).join(', ')}`,
    )
  }

  const notes: string[] = []
  let freeAllowanceApplied = false
  let slab: WaterSlabResult

  if (
    tariff.freeAllowance?.type === 'allOrNothing' &&
    consumptionKl <= tariff.freeAllowance.kl
  ) {
    // Within the free threshold — the whole water charge is waived.
    freeAllowanceApplied = true
    slab = { lines: [], subtotal: 0 }
    notes.push(
      `Consumption is at or below the ${tariff.freeAllowance.kl} KL free threshold, so the entire water charge is waived — but crossing it by even 1 litre would make the FULL consumption billable, not just the excess.`,
    )
  } else {
    // Either no free allowance, a true allowance, or an all-or-nothing
    // threshold that's been crossed (billing the FULL consumption).
    slab = calculateWaterSlabCharges(consumptionKl, tariff.slabs)
    if (tariff.freeAllowance?.type === 'allOrNothing') {
      notes.push(
        `Consumption exceeded the ${tariff.freeAllowance.kl} KL free threshold, so the ENTIRE consumption is billed at slab rates — not just the amount above the threshold.`,
      )
    } else if (tariff.freeAllowance?.type === 'trueAllowance') {
      const freeKl = Math.min(tariff.freeAllowance.kl, consumptionKl)
      const freeValue = calculateWaterSlabCharges(freeKl, tariff.slabs).subtotal
      slab = { lines: slab.lines, subtotal: Math.max(0, slab.subtotal - freeValue) }
    }
  }

  const waterCharge = slab.subtotal
  const sewerageCharge = waterCharge * (tariff.sewerageChargePercent / 100)
  const additionalFeesTotal = (tariff.additionalFees ?? []).reduce((sum, f) => sum + f.amount, 0)

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
