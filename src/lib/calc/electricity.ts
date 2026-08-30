/**
 * bijlicalc — electricity bill calculation engine.
 *
 * PURE, framework-agnostic TypeScript. No React, no Next.js, no DOM, no I/O in
 * the core functions. Intended to be lifted verbatim into a React Native app or
 * a white-label HTTP API. The only module-level side effect is building a
 * tariff registry from bundled JSON (see `tariffRegistry` at the bottom); the
 * core math functions never touch it — pass tariffs in explicitly.
 *
 * Money is ₹ (INR), rounded to 2 dp on output only (never mid-calculation).
 * Energy is kWh ("units").
 */

import type {
  ConnectionCategory,
  FixedCharge,
  Slab,
  SubsidyScheme,
  TariffFile,
} from '../../data/tariffs/_schema'
import { parseTariffFile } from '../../data/tariffs/_schema'
import tnebJson from '../../data/tariffs/tneb.json'
import msedclJson from '../../data/tariffs/msedcl.json'
import uppclJson from '../../data/tariffs/uppcl.json'
import bescomJson from '../../data/tariffs/bescom.json'
import ksebJson from '../../data/tariffs/kseb.json'
import wbsedclJson from '../../data/tariffs/wbsedcl.json'
import mgvclJson from '../../data/tariffs/mgvcl.json'
import jvvnlJson from '../../data/tariffs/jvvnl.json'
import pspclJson from '../../data/tariffs/pspcl.json'
import brplJson from '../../data/tariffs/brpl.json'
import tsspdclJson from '../../data/tariffs/tsspdcl.json'
import apspdclJson from '../../data/tariffs/apspdcl.json'
import mpczJson from '../../data/tariffs/mpcz.json'
import uhbvnJson from '../../data/tariffs/uhbvn.json'
import hpseblJson from '../../data/tariffs/hpsebl.json'
import upclJson from '../../data/tariffs/upcl.json'
import gedJson from '../../data/tariffs/ged.json'
import sbpdclJson from '../../data/tariffs/sbpdcl.json'
import tpcodlJson from '../../data/tariffs/tpcodl.json'
import apdclJson from '../../data/tariffs/apdcl.json'
import jbvnlJson from '../../data/tariffs/jbvnl.json'
import cspdclJson from '../../data/tariffs/cspdcl.json'
import cedJson from '../../data/tariffs/ced.json'
import pedpyJson from '../../data/tariffs/ped-py.json'
import jpdclJson from '../../data/tariffs/jpdcl.json'
import tseclJson from '../../data/tariffs/tsecl.json'
import epdskJson from '../../data/tariffs/epd-sk.json'
import mepdclJson from '../../data/tariffs/mepdcl.json'
import mspdclJson from '../../data/tariffs/mspdcl.json'
import apdopJson from '../../data/tariffs/apdop.json'
import pedmzJson from '../../data/tariffs/ped-mz.json'
import dopnJson from '../../data/tariffs/dopn.json'
import anedJson from '../../data/tariffs/aned.json'
import dnhpdclJson from '../../data/tariffs/dnhpdcl.json'
import ledJson from '../../data/tariffs/led.json'
import lpddJson from '../../data/tariffs/lpdd.json'

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface SlabLine {
  /** Lower threshold of the slab (units already consumed below this line). */
  fromUnit: number
  /** Upper threshold, or null for the open-ended top slab. */
  toUnit: number | null
  ratePerUnit: number
  /** Units of consumption that actually fell into this slab. */
  unitsInSlab: number
  /** unitsInSlab × ratePerUnit. */
  charge: number
}

export interface SlabResult {
  lines: SlabLine[]
  /** Sum of every line's charge — the gross energy charge before subsidy. */
  subtotal: number
  totalUnits: number
}

export interface SubsidyResult {
  subsidyAmount: number
  /** Gross energy charge minus subsidy (never below 0). */
  adjustedCharge: number
  appliedSchemes: string[]
}

export interface BillBreakdown {
  discomCode: string
  discomName: string
  state: string
  connectionType: ConnectionCategory
  billingCycle: TariffFile['billingCycle']
  unitsConsumed: number

  slab: SlabResult
  energyChargeGross: number
  subsidy: SubsidyResult
  energyChargeNet: number

  fuelCostAdjustment: { ratePerUnit: number; amount: number }
  fixedCharge: { basis: FixedCharge['basis']; amount: number; detail: string }
  electricityDuty: { percent: number; amount: number }
  meterRent: number

  total: number
  /**
   * For DISCOMs that bill bi-monthly (e.g. TANGEDCO), the inputs represent a
   * ~60-day period. This exposes the per-month equivalents so users aren't
   * confused into thinking the bi-monthly figure is a monthly bill.
   * `null` for monthly DISCOMs.
   */
  monthlyEquivalent: { total: number; units: number } | null

  currency: 'INR'
  notes: string[]
}

export interface BillInput {
  discomCode: string
  connectionType: ConnectionCategory
  /** Units for the DISCOM's full billing period (60 days if bi-monthly). */
  unitsConsumed: number
  /** Sanctioned load in kW — required only for `perLoad` fixed charges. */
  sanctionedLoad?: number
  phase?: 'single' | 'three'
  /** Optional sanity assertion against the tariff's own billingCycle. */
  billingPeriod?: TariffFile['billingCycle']
  /**
   * Consumer eligibility token for subsidy matching, e.g. "BPL",
   * "eligible/BPL domestic". Omit to apply only universal ("all domestic")
   * schemes.
   */
  eligibility?: string
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/**
 * Cost of the first `n` units of consumption, priced across the given slab
 * lines in ascending order. Used to value "free unit" and range-restricted
 * subsidies at the correct slab rates rather than a blended average.
 */
function valueOfFirstUnits(lines: SlabLine[], n: number): number {
  let remaining = n
  let cost = 0
  for (const line of lines) {
    if (remaining <= 0) break
    const take = Math.min(remaining, line.unitsInSlab)
    cost += take * line.ratePerUnit
    remaining -= take
  }
  return cost
}

/** Charge attributable to consumption in the unit interval (from, to]. */
function chargeInRange(lines: SlabLine[], from: number, to: number): number {
  return valueOfFirstUnits(lines, to) - valueOfFirstUnits(lines, from)
}

/** Loose eligibility match: universal schemes always apply; otherwise token overlap. */
function schemeApplies(scheme: SubsidyScheme, eligibility?: string): boolean {
  const target = scheme.eligibility.toLowerCase()
  if (target.includes('all')) return true
  if (!eligibility) return false
  const e = eligibility.toLowerCase()
  if (target.includes(e) || e.includes(target)) return true
  const targetTokens = target.split(/[^a-z]+/).filter(Boolean)
  const consumerTokens = e.split(/[^a-z]+/).filter(Boolean)
  return consumerTokens.some((t) => targetTokens.includes(t))
}

// ---------------------------------------------------------------------------
// 1. Slab charges — telescopic / progressive
// ---------------------------------------------------------------------------

/**
 * Telescopic slab calculation. Each slab is charged only for the units that
 * fall inside its band. Bands are derived from cumulative thresholds: the first
 * slab covers (0, maxUnits], the next (prevMax, maxUnits], and so on. The last
 * slab may have `maxUnits: null` (open-ended). `minUnits` in the data is a
 * display convention (prevMax + 1); bands are computed from `maxUnits` so an
 * off-by-one in the source data can't corrupt the math.
 */
export function calculateSlabCharges(
  unitsConsumed: number,
  slabs: Slab[],
): SlabResult {
  if (unitsConsumed < 0) throw new Error('unitsConsumed must be >= 0')
  if (slabs.length === 0) throw new Error('at least one slab is required')

  const lines: SlabLine[] = []
  let lowerBound = 0

  for (const slab of slabs) {
    const upper = slab.maxUnits ?? Number.POSITIVE_INFINITY
    const unitsInSlab = Math.max(
      0,
      Math.min(unitsConsumed, upper) - lowerBound,
    )
    const charge = unitsInSlab * slab.ratePerUnit
    lines.push({
      fromUnit: lowerBound,
      toUnit: slab.maxUnits,
      ratePerUnit: slab.ratePerUnit,
      unitsInSlab,
      charge,
    })
    lowerBound = upper
  }

  const subtotal = lines.reduce((sum, l) => sum + l.charge, 0)
  return { lines, subtotal, totalUnits: unitsConsumed }
}

// ---------------------------------------------------------------------------
// 2. Subsidy
// ---------------------------------------------------------------------------

/**
 * Applies every eligible subsidy scheme to the gross energy charge.
 *
 * NOTE: deviates from the literal `(unitsConsumed, energyCharge, ...)` spec —
 * it takes the full `SlabResult` instead of a bare `energyCharge: number`,
 * because a "free units" subsidy must be valued at the actual slab rates of the
 * freed units, which a single total cannot express.
 *
 *  - "free"    → the first `discountValue` units within the scheme's range are
 *                billed at ₹0, valued at their true slab rates.
 *  - "percent" → `discountValue`% off the energy charge for units in range.
 *  - "flat"    → a flat ₹ reduction (capped at the remaining charge).
 */
export function applySubsidy(
  unitsConsumed: number,
  slab: SlabResult,
  subsidySchemes: SubsidyScheme[],
  eligibility?: string,
): SubsidyResult {
  let subsidyAmount = 0
  const appliedSchemes: string[] = []

  for (const scheme of subsidySchemes) {
    if (!schemeApplies(scheme, eligibility)) continue

    let amount = 0
    switch (scheme.discountType) {
      case 'free': {
        const freeUnits = Math.min(
          scheme.discountValue,
          scheme.maxUnits - scheme.minUnits,
          Math.max(0, unitsConsumed - scheme.minUnits),
        )
        amount = chargeInRange(
          slab.lines,
          scheme.minUnits,
          scheme.minUnits + freeUnits,
        )
        break
      }
      case 'percent': {
        const rangeCharge = chargeInRange(
          slab.lines,
          scheme.minUnits,
          scheme.maxUnits,
        )
        amount = (rangeCharge * scheme.discountValue) / 100
        break
      }
      case 'flat': {
        amount = scheme.discountValue
        break
      }
    }

    if (amount > 0) {
      subsidyAmount += amount
      appliedSchemes.push(scheme.schemeName)
    }
  }

  subsidyAmount = Math.min(subsidyAmount, slab.subtotal)
  return {
    subsidyAmount,
    adjustedCharge: Math.max(0, slab.subtotal - subsidyAmount),
    appliedSchemes,
  }
}

// ---------------------------------------------------------------------------
// 3. Fixed charge
// ---------------------------------------------------------------------------

function computeFixedCharge(
  fc: FixedCharge,
  phase: 'single' | 'three',
  sanctionedLoad?: number,
): { amount: number; detail: string } {
  switch (fc.basis) {
    case 'perPhase':
      return phase === 'three'
        ? { amount: fc.threePhase ?? 0, detail: 'three-phase' }
        : { amount: fc.singlePhase ?? 0, detail: 'single-phase' }
    case 'perLoad': {
      if (sanctionedLoad == null) {
        throw new Error('sanctionedLoad is required for a perLoad fixed charge')
      }
      return {
        amount: (fc.perKW ?? 0) * sanctionedLoad,
        detail: `₹${fc.perKW}/kW × ${sanctionedLoad} kW`,
      }
    }
    case 'flat':
      return { amount: fc.flat ?? 0, detail: 'flat' }
  }
}

// ---------------------------------------------------------------------------
// 4. Full bill — pure core (tariff injected)
// ---------------------------------------------------------------------------

/**
 * Pure bill builder. Takes an explicit tariff object so it has zero dependency
 * on the bundled data — this is the function the mobile app / API should call.
 */
export function computeBill(
  tariff: TariffFile,
  input: Omit<BillInput, 'discomCode'>,
): BillBreakdown {
  const {
    connectionType,
    unitsConsumed,
    sanctionedLoad,
    phase = 'single',
    billingPeriod,
    eligibility,
  } = input

  if (billingPeriod && billingPeriod !== tariff.billingCycle) {
    throw new Error(
      `billingPeriod "${billingPeriod}" does not match ${tariff.discomCode}'s billingCycle "${tariff.billingCycle}"`,
    )
  }

  const ct = tariff.connectionTypes.find(
    (c) => c.connectionType === connectionType,
  )
  if (!ct) {
    throw new Error(
      `Connection type "${connectionType}" is not defined for ${tariff.discomCode}`,
    )
  }

  const slab = calculateSlabCharges(unitsConsumed, ct.slabs)
  const subsidy = applySubsidy(
    unitsConsumed,
    slab,
    tariff.subsidySchemes,
    eligibility,
  )

  const fcaAmount = tariff.fuelCostAdjustment * unitsConsumed
  const fixed = computeFixedCharge(ct.fixedCharge, phase, sanctionedLoad)
  const dutyAmount =
    (subsidy.adjustedCharge * tariff.electricityDutyPercent) / 100
  const meterRent = ct.meterRent ?? 0

  const total =
    subsidy.adjustedCharge + fcaAmount + fixed.amount + dutyAmount + meterRent

  // How many months each billing cycle spans — drives the monthly-equivalent.
  const PERIOD_MONTHS: Record<TariffFile['billingCycle'], number> = {
    monthly: 1,
    bimonthly: 2,
    quarterly: 3,
  }
  const periodMonths = PERIOD_MONTHS[tariff.billingCycle]
  const CYCLE_DAYS: Record<TariffFile['billingCycle'], string> = {
    monthly: '~30-day',
    bimonthly: '~60-day',
    quarterly: '~90-day',
  }
  const CYCLE_LABEL: Record<TariffFile['billingCycle'], string> = {
    monthly: 'monthly',
    bimonthly: 'bi-monthly',
    quarterly: 'quarterly',
  }

  const notes: string[] = []
  if (periodMonths > 1) {
    notes.push(
      `This DISCOM bills ${CYCLE_LABEL[tariff.billingCycle]}: the units and total are for a ${CYCLE_DAYS[tariff.billingCycle]} period. See monthlyEquivalent for the per-month figure.`,
    )
  }

  return {
    discomCode: tariff.discomCode,
    discomName: tariff.discomName,
    state: tariff.state,
    connectionType,
    billingCycle: tariff.billingCycle,
    unitsConsumed,

    slab: {
      lines: slab.lines.map((l) => ({ ...l, charge: round2(l.charge) })),
      subtotal: round2(slab.subtotal),
      totalUnits: slab.totalUnits,
    },
    energyChargeGross: round2(slab.subtotal),
    subsidy: {
      subsidyAmount: round2(subsidy.subsidyAmount),
      adjustedCharge: round2(subsidy.adjustedCharge),
      appliedSchemes: subsidy.appliedSchemes,
    },
    energyChargeNet: round2(subsidy.adjustedCharge),

    fuelCostAdjustment: {
      ratePerUnit: tariff.fuelCostAdjustment,
      amount: round2(fcaAmount),
    },
    fixedCharge: {
      basis: ct.fixedCharge.basis,
      amount: round2(fixed.amount),
      detail: fixed.detail,
    },
    electricityDuty: {
      percent: tariff.electricityDutyPercent,
      amount: round2(dutyAmount),
    },
    meterRent: round2(meterRent),

    total: round2(total),
    monthlyEquivalent:
      periodMonths > 1
        ? {
            total: round2(total / periodMonths),
            units: round2(unitsConsumed / periodMonths),
          }
        : null,

    currency: 'INR',
    notes,
  }
}

// ---------------------------------------------------------------------------
// 5. Reverse calculator — budget in, max units out
// ---------------------------------------------------------------------------

export interface BudgetToUnitsResult {
  maxUnits: number
  bill: BillBreakdown
}

/**
 * Binary-searches for the highest whole-unit consumption whose bill does not
 * exceed `budget`. Total bill is monotonic non-decreasing in units (subsidies
 * are bounded rebates, never a growing discount), so binary search is valid.
 */
export function findMaxUnitsForBudget(
  tariff: TariffFile,
  budget: number,
  input: Omit<BillInput, 'discomCode' | 'unitsConsumed'>,
): BudgetToUnitsResult {
  if (budget <= 0) {
    const bill = computeBill(tariff, { ...input, unitsConsumed: 0 })
    return { maxUnits: 0, bill }
  }

  let lo = 0
  let hi = 100000
  // Widen the upper bound if even the ceiling is affordable (rare, cheap tariffs).
  while (computeBill(tariff, { ...input, unitsConsumed: hi }).total <= budget && hi < 10_000_000) {
    hi *= 2
  }

  while (lo < hi) {
    const mid = Math.ceil((lo + hi + 1) / 2)
    const total = computeBill(tariff, { ...input, unitsConsumed: mid }).total
    if (total <= budget) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }

  return { maxUnits: lo, bill: computeBill(tariff, { ...input, unitsConsumed: lo }) }
}

// ---------------------------------------------------------------------------
// 6. Full bill — registry wrapper (resolves discomCode)
// ---------------------------------------------------------------------------

/** Bundled tariffs, validated at load time. Add new DISCOMs here. */
export const tariffRegistry: Record<string, TariffFile> = {
  TNEB: parseTariffFile(tnebJson),
  MSEDCL: parseTariffFile(msedclJson),
  UPPCL: parseTariffFile(uppclJson),
  BESCOM: parseTariffFile(bescomJson),
  KSEB: parseTariffFile(ksebJson),
  WBSEDCL: parseTariffFile(wbsedclJson),
  'MGVCL': parseTariffFile(mgvclJson),
  'JVVNL': parseTariffFile(jvvnlJson),
  'PSPCL': parseTariffFile(pspclJson),
  'BRPL': parseTariffFile(brplJson),
  'TSSPDCL': parseTariffFile(tsspdclJson),
  'APSPDCL': parseTariffFile(apspdclJson),
  'MPCZ': parseTariffFile(mpczJson),
  'UHBVN': parseTariffFile(uhbvnJson),
  'HPSEBL': parseTariffFile(hpseblJson),
  'UPCL': parseTariffFile(upclJson),
  'GED': parseTariffFile(gedJson),
  'SBPDCL': parseTariffFile(sbpdclJson),
  'TPCODL': parseTariffFile(tpcodlJson),
  'APDCL': parseTariffFile(apdclJson),
  'JBVNL': parseTariffFile(jbvnlJson),
  'CSPDCL': parseTariffFile(cspdclJson),
  'CED': parseTariffFile(cedJson),
  'PED-PY': parseTariffFile(pedpyJson),
  'JPDCL': parseTariffFile(jpdclJson),
  'TSECL': parseTariffFile(tseclJson),
  'EPD-SK': parseTariffFile(epdskJson),
  'MePDCL': parseTariffFile(mepdclJson),
  'MSPDCL': parseTariffFile(mspdclJson),
  'APDOP': parseTariffFile(apdopJson),
  'PED-MZ': parseTariffFile(pedmzJson),
  'DOPN': parseTariffFile(dopnJson),
  'ANED': parseTariffFile(anedJson),
  'DNHPDCL': parseTariffFile(dnhpdclJson),
  'LED': parseTariffFile(ledJson),
  'LPDD': parseTariffFile(lpddJson),
}

export function getTariff(discomCode: string): TariffFile {
  const tariff = tariffRegistry[discomCode]
  if (!tariff) {
    throw new Error(
      `No tariff loaded for DISCOM "${discomCode}". Available: ${Object.keys(tariffRegistry).join(', ')}`,
    )
  }
  return tariff
}

/**
 * Convenience orchestrator matching the product spec's signature. Resolves the
 * DISCOM from the bundled registry, then delegates to the pure `computeBill`.
 */
export function calculateFullBill(input: BillInput): BillBreakdown {
  const tariff = getTariff(input.discomCode)
  return computeBill(tariff, input)
}
