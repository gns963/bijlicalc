import { z } from 'zod'

/**
 * Real per-CGD (City Gas Distribution) PNG tariff data model, modeled
 * closely on src/data/tariffs/_schema.ts (electricity), adapted for
 * SCM-based gas billing. One JSON file per CGD lives alongside this schema
 * in `src/data/gas-tariffs/`, validated at load time so a malformed tariff
 * can never reach the calculator.
 *
 * Money is ₹ (INR). Volume is SCM (Standard Cubic Metre) — PNG's equivalent
 * of electricity's "units".
 */

const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected an ISO date in YYYY-MM-DD form')

const NonNegative = z.number().nonnegative()

export const GasBillingCycle = z.enum(['monthly', 'bimonthly'])
export type GasBillingCycle = z.infer<typeof GasBillingCycle>

/**
 * A single consumption slab. `maxSCM` is nullable to represent the
 * open-ended top slab. Bounds are inclusive.
 */
export const GasSlabSchema = z.object({
  minSCM: NonNegative,
  maxSCM: NonNegative.nullable(),
  ratePerSCM: NonNegative,
})
export type GasSlab = z.infer<typeof GasSlabSchema>

const GasSlabList = z
  .array(GasSlabSchema)
  .min(1)
  .superRefine((slabs, ctx) => {
    slabs.forEach((slab, i) => {
      const isLast = i === slabs.length - 1
      if (slab.maxSCM === null && !isLast) {
        ctx.addIssue({
          code: 'custom',
          message: `Only the final slab may be open-ended (maxSCM: null); slab ${i} is not last`,
          path: [i, 'maxSCM'],
        })
      }
      if (slab.maxSCM !== null && slab.maxSCM < slab.minSCM) {
        ctx.addIssue({
          code: 'custom',
          message: `maxSCM (${slab.maxSCM}) must be >= minSCM (${slab.minSCM})`,
          path: [i, 'maxSCM'],
        })
      }
      if (i > 0) {
        const prev = slabs[i - 1]
        if (prev.maxSCM !== null && slab.minSCM <= prev.maxSCM) {
          ctx.addIssue({
            code: 'custom',
            message: `Slab ${i} minSCM (${slab.minSCM}) must be greater than previous slab maxSCM (${prev.maxSCM})`,
            path: [i, 'minSCM'],
          })
        }
      }
    })
  })

export const GasTariffFileSchema = z.object({
  cgdCode: z.string().min(1),
  cgdName: z.string().min(1),
  citiesServed: z.array(z.string().min(1)).min(1),
  billingCycle: GasBillingCycle,
  slabs: GasSlabList,
  /** Flat fixed/meter charge per billing cycle, INR. */
  fixedCharge: NonNegative,
  /**
   * Some CGDs apply a calorific-value correction factor to metered volume
   * before billing. Omit when the provider bills raw metered SCM directly.
   */
  calorificValueAdjustment: z.number().optional(),
  effectiveFrom: IsoDate,
  /** Link to the CGD's official tariff notification / PNGRB order. */
  sourceUrl: z.url(),
  lastVerified: IsoDate,
  verifiedBy: z.string().min(1),
})

export type GasTariffFile = z.infer<typeof GasTariffFileSchema>

/** Parse + validate an unknown value (e.g. imported JSON). Throws on failure. */
export function parseGasTariffFile(data: unknown): GasTariffFile {
  return GasTariffFileSchema.parse(data)
}

/** Safe variant — returns Zod's discriminated result instead of throwing. */
export function safeParseGasTariffFile(data: unknown) {
  return GasTariffFileSchema.safeParse(data)
}
