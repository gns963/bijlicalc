import { z } from 'zod'

/**
 * Tariff data model for DesiMetrics.
 *
 * One JSON file per DISCOM lives alongside this schema in `src/data/tariffs/`.
 * Every file is validated against `TariffFileSchema` at load/build time so a
 * malformed tariff can never reach the calculator.
 *
 * Money is always ₹ (INR). Energy is always kWh ("units").
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** ISO calendar date, `YYYY-MM-DD`. Kept as a string so JSON stays portable. */
const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected an ISO date in YYYY-MM-DD form')

const NonNegative = z.number().nonnegative()

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const BillingCycle = z.enum(['monthly', 'bimonthly', 'quarterly'])
export type BillingCycle = z.infer<typeof BillingCycle>

export const ConnectionCategory = z.enum([
  'residential',
  'commercial',
  'industrial',
  'agriculture',
])
export type ConnectionCategory = z.infer<typeof ConnectionCategory>

export const DiscountType = z.enum(['free', 'percent', 'flat'])
export type DiscountType = z.infer<typeof DiscountType>

// ---------------------------------------------------------------------------
// Slabs
// ---------------------------------------------------------------------------

/**
 * A single consumption slab. `maxUnits` is nullable to represent the open-ended
 * top slab ("501 and above"). Bounds are inclusive: 0–100 then 101–200, etc.
 */
export const SlabSchema = z.object({
  minUnits: NonNegative,
  maxUnits: NonNegative.nullable(),
  ratePerUnit: NonNegative,
})
export type Slab = z.infer<typeof SlabSchema>

/**
 * Ordered slab list. Enforces:
 *  - at least one slab
 *  - only the final slab may be open-ended (maxUnits === null)
 *  - each slab starts where the previous one ended
 */
const SlabList = z
  .array(SlabSchema)
  .min(1)
  .superRefine((slabs, ctx) => {
    slabs.forEach((slab, i) => {
      const isLast = i === slabs.length - 1
      if (slab.maxUnits === null && !isLast) {
        ctx.addIssue({
          code: 'custom',
          message: `Only the final slab may be open-ended (maxUnits: null); slab ${i} is not last`,
          path: [i, 'maxUnits'],
        })
      }
      if (slab.maxUnits !== null && slab.maxUnits < slab.minUnits) {
        ctx.addIssue({
          code: 'custom',
          message: `maxUnits (${slab.maxUnits}) must be >= minUnits (${slab.minUnits})`,
          path: [i, 'maxUnits'],
        })
      }
      if (i > 0) {
        const prev = slabs[i - 1]
        if (prev.maxUnits !== null && slab.minUnits <= prev.maxUnits) {
          ctx.addIssue({
            code: 'custom',
            message: `Slab ${i} minUnits (${slab.minUnits}) must be greater than previous slab maxUnits (${prev.maxUnits})`,
            path: [i, 'minUnits'],
          })
        }
      }
    })
  })

// ---------------------------------------------------------------------------
// Fixed charge
// ---------------------------------------------------------------------------

/**
 * Fixed / demand charge. DISCOMs bill this differently:
 *  - `perPhase` — flat amount per single- vs three-phase service (e.g. TANGEDCO)
 *  - `perLoad`  — amount per sanctioned kW
 *  - `flat`     — a single amount regardless of phase or load
 */
export const FixedChargeSchema = z
  .object({
    basis: z.enum(['perPhase', 'perLoad', 'flat']),
    singlePhase: NonNegative.optional(),
    threePhase: NonNegative.optional(),
    perKW: NonNegative.optional(),
    flat: NonNegative.optional(),
  })
  .superRefine((fc, ctx) => {
    const require = (field: keyof typeof fc, label: string) => {
      if (fc[field] === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: `fixedCharge.${String(field)} is required when basis is "${label}"`,
          path: [field],
        })
      }
    }
    if (fc.basis === 'perPhase') require('singlePhase', 'perPhase')
    if (fc.basis === 'perLoad') require('perKW', 'perLoad')
    if (fc.basis === 'flat') require('flat', 'flat')
  })
export type FixedCharge = z.infer<typeof FixedChargeSchema>

// ---------------------------------------------------------------------------
// Connection type (one per category the DISCOM serves)
// ---------------------------------------------------------------------------

export const ConnectionTypeSchema = z.object({
  connectionType: ConnectionCategory,
  slabs: SlabList,
  fixedCharge: FixedChargeSchema,
  meterRent: NonNegative.optional(),
})
export type ConnectionType = z.infer<typeof ConnectionTypeSchema>

// ---------------------------------------------------------------------------
// Subsidy schemes
// ---------------------------------------------------------------------------

export const SubsidySchemeSchema = z.object({
  schemeName: z.string().min(1),
  minUnits: NonNegative,
  maxUnits: NonNegative,
  /**
   * Interpretation depends on discountType:
   *  - "free"    → number of free units within [minUnits, maxUnits]
   *  - "percent" → percentage off the energy charge for that range (0–100)
   *  - "flat"    → flat ₹ reduction on the bill
   */
  discountType: DiscountType,
  discountValue: NonNegative,
  eligibility: z.string().min(1),
})
export type SubsidyScheme = z.infer<typeof SubsidySchemeSchema>

// ---------------------------------------------------------------------------
// Top-level tariff file
// ---------------------------------------------------------------------------

export const TariffFileSchema = z.object({
  discomCode: z.string().min(1),
  discomName: z.string().min(1),
  state: z.string().min(1),
  billingCycle: BillingCycle,
  connectionTypes: z.array(ConnectionTypeSchema).min(1),
  /** Per-unit fuel & purchase cost adjustment surcharge, ₹/kWh. */
  fuelCostAdjustment: z.number(),
  /** Electricity duty / tax as a percentage of the energy charge. */
  electricityDutyPercent: NonNegative,
  subsidySchemes: z.array(SubsidySchemeSchema),
  effectiveFrom: IsoDate,
  /** Link to the SERC tariff order PDF / gazette notification. */
  sourceUrl: z.url(),
  lastVerified: IsoDate,
  verifiedBy: z.string().min(1),
})

export type TariffFile = z.infer<typeof TariffFileSchema>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse + validate an unknown value (e.g. imported JSON). Throws on failure. */
export function parseTariffFile(data: unknown): TariffFile {
  return TariffFileSchema.parse(data)
}

/** Safe variant — returns Zod's discriminated result instead of throwing. */
export function safeParseTariffFile(data: unknown) {
  return TariffFileSchema.safeParse(data)
}
