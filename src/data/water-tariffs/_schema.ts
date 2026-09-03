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

export const WaterConnectionType = z.enum(['domestic', 'commercial', 'industrial'])
export type WaterConnectionType = z.infer<typeof WaterConnectionType>

export const WaterConnectionTariffSchema = z.object({
  connectionType: WaterConnectionType,
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
  /** Per-connection-type note on data confidence, e.g. when a commercial
   *  table is sourced from an older order than the domestic one in the
   *  same file. Omit when it matches the file-level verifiedBy exactly. */
  verifiedByNote: z.string().optional(),
})
export type WaterConnectionTariff = z.infer<typeof WaterConnectionTariffSchema>

export const WaterTariffFileSchema = z.object({
  boardCode: z.string().min(1),
  boardName: z.string().min(1),
  citiesServed: z.array(z.string().min(1)).min(1),
  billingCycle: WaterBillingCycle,
  /** One entry per connection type this board has real, sourced data for.
   *  Most boards only have domestic today — commercial/industrial are
   *  added only once independently verifiable, never guessed. */
  connectionTypes: z.array(WaterConnectionTariffSchema).min(1),
  effectiveFrom: IsoDate,
  /** Link to the board's official tariff notification / gazette order. */
  sourceUrl: z.url(),
  lastVerified: IsoDate,
  verifiedBy: z.string().min(1),
})

export type WaterTariffFile = z.infer<typeof WaterTariffFileSchema>

/** Domestic is always the default/fallback connection type shown across the
 *  site; falls back to the first entry if a board somehow has no domestic
 *  tariff on file (shouldn't happen in practice). */
export function getConnectionTariff(
  tariff: WaterTariffFile,
  connectionType: WaterConnectionType = 'domestic',
): WaterConnectionTariff {
  return (
    tariff.connectionTypes.find((c) => c.connectionType === connectionType) ??
    tariff.connectionTypes[0]
  )
}

export function parseWaterTariffFile(data: unknown): WaterTariffFile {
  return WaterTariffFileSchema.parse(data)
}

export function safeParseWaterTariffFile(data: unknown) {
  return WaterTariffFileSchema.safeParse(data)
}
