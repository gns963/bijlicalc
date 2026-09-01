import { z } from 'zod'

/**
 * Real per-board municipal water tariff data model, modeled on
 * src/data/tariffs/_schema.ts (electricity) and src/data/gas-tariffs/_schema.ts
 * (gas), adapted for KL-based water billing.
 *
 * Money is ₹ (INR). Volume is KL (kilolitre = 1,000 litres).
 */

const IsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected an ISO date in YYYY-MM-DD form')

const NonNegative = z.number().nonnegative()

export const WaterBillingCycle = z.enum(['monthly', 'bimonthly'])
export type WaterBillingCycle = z.infer<typeof WaterBillingCycle>

export const WaterSlabSchema = z.object({
  minKL: NonNegative,
  maxKL: NonNegative.nullable(),
  ratePerKL: NonNegative,
})
export type WaterSlab = z.infer<typeof WaterSlabSchema>

const WaterSlabList = z
  .array(WaterSlabSchema)
  .min(1)
  .superRefine((slabs, ctx) => {
    slabs.forEach((slab, i) => {
      const isLast = i === slabs.length - 1
      if (slab.maxKL === null && !isLast) {
        ctx.addIssue({
          code: 'custom',
          message: `Only the final slab may be open-ended (maxKL: null); slab ${i} is not last`,
          path: [i, 'maxKL'],
        })
      }
      if (slab.maxKL !== null && slab.maxKL < slab.minKL) {
        ctx.addIssue({
          code: 'custom',
          message: `maxKL (${slab.maxKL}) must be >= minKL (${slab.minKL})`,
          path: [i, 'maxKL'],
        })
      }
      if (i > 0) {
        const prev = slabs[i - 1]
        if (prev.maxKL !== null && slab.minKL <= prev.maxKL) {
          ctx.addIssue({
            code: 'custom',
            message: `Slab ${i} minKL (${slab.minKL}) must be greater than previous slab maxKL (${prev.maxKL})`,
            path: [i, 'minKL'],
          })
        }
      }
    })
  })

export const AdditionalFeeSchema = z.object({
  name: z.string().min(1),
  amount: NonNegative,
  appliesWhen: z.string().min(1),
})
export type AdditionalFee = z.infer<typeof AdditionalFeeSchema>

export const WaterTariffFileSchema = z.object({
  boardCode: z.string().min(1),
  boardName: z.string().min(1),
  citiesServed: z.array(z.string().min(1)).min(1),
  billingCycle: WaterBillingCycle,
  slabs: WaterSlabList,
  /**
   * Free-consumption scheme, if any. Two real patterns exist in Indian
   * water billing:
   *  - "trueAllowance": the first freeAllowanceKL are free, the REST is
   *    billed normally at slab rates (like electricity's free-unit subsidy).
   *  - "allOrNothing": consumption at or below freeAllowanceKL is free;
   *    crossing it by even 1 litre makes the ENTIRE consumption billable
   *    at slab rates, not just the excess. Delhi's domestic scheme works
   *    this way and is a common point of confusion — model it faithfully
   *    rather than simplifying it into a true allowance.
   */
  freeAllowance: z
    .object({
      kl: NonNegative,
      type: z.enum(['trueAllowance', 'allOrNothing']),
    })
    .optional(),
  /** Sewerage charge as a percentage of the water (volumetric) charge. */
  sewerageChargePercent: NonNegative,
  /** Flat fixed charge per billing cycle, keyed by meter size (e.g. "15mm"). */
  fixedChargeByMeterSize: z.record(z.string(), NonNegative),
  additionalFees: z.array(AdditionalFeeSchema).optional(),
  effectiveFrom: IsoDate,
  /** Link to the board's official tariff notification / gazette order. */
  sourceUrl: z.url(),
  lastVerified: IsoDate,
  verifiedBy: z.string().min(1),
})

export type WaterTariffFile = z.infer<typeof WaterTariffFileSchema>

export function parseWaterTariffFile(data: unknown): WaterTariffFile {
  return WaterTariffFileSchema.parse(data)
}

export function safeParseWaterTariffFile(data: unknown) {
  return WaterTariffFileSchema.safeParse(data)
}
