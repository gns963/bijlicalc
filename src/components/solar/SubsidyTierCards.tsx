import Link from 'next/link'
import { calculateSolarRoi, estimateSystemCost, pmSuryaGharSubsidy, ROOF_SQFT_PER_KW } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

const TIERS = [1, 2, 3, 5]
/** Monthly usage assumed "matched" to a system size, for the illustrative payback figure only. */
const MATCHED_UNITS_PER_KW = 120

export default function SubsidyTierCards({ discomCode }: { discomCode: string }) {
  const rows = TIERS.map((kw) => {
    const subsidy = pmSuryaGharSubsidy(kw)
    const systemCost = estimateSystemCost(kw)
    const netCost = Math.max(0, systemCost - subsidy)
    const roofAreaSqFt = kw * ROOF_SQFT_PER_KW
    const roi = calculateSolarRoi({
      discomCode,
      monthlyUnits: kw * MATCHED_UNITS_PER_KW,
      systemSizeKw: kw,
    })
    return { kw, subsidy, systemCost, netCost, roofAreaSqFt, paybackYears: roi.paybackYears }
  })

  return (
    <section aria-labelledby="subsidy-tiers" className="mb-10">
      <h2 id="subsidy-tiers" className="font-display mb-2 text-2xl font-semibold">
        PM Surya Ghar Subsidy at a Glance
      </h2>
      <p className="mb-4 text-ash/70 dark:text-gazette-cream/60">
        The central subsidy amount is fixed by system size — here&apos;s what
        it looks like at common sizes.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <div
            key={r.kw}
            className="rounded-xl border border-hub-solar/20 bg-hub-solar/5 p-5 dark:border-hub-solar/20 dark:bg-hub-solar/10"
          >
            <p className="font-display text-2xl font-bold text-hub-solar">{r.kw} kW</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ash/60 dark:text-gazette-cream/50">Subsidy</dt>
                <dd className="font-semibold text-spark-teal">{formatINR(r.subsidy)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ash/60 dark:text-gazette-cream/50">System cost</dt>
                <dd>{formatINR(r.systemCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ash/60 dark:text-gazette-cream/50">Net cost</dt>
                <dd className="font-semibold text-ink-navy dark:text-gazette-cream">
                  {formatINR(r.netCost)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ash/60 dark:text-gazette-cream/50">Roof area</dt>
                <dd>{r.roofAreaSqFt} sq ft</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ash/60 dark:text-gazette-cream/50">Payback*</dt>
                <dd>{r.paybackYears ?? '—'} yrs</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ash/50 dark:text-gazette-cream/40">
        *Illustrative payback assumes monthly usage roughly matched to the
        system size (~{MATCHED_UNITS_PER_KW} units/kW/month) on your
        DISCOM&apos;s tariff — use the{' '}
        <Link href="/solar/roi-calculator" className="text-brass underline">
          ROI calculator
        </Link>{' '}
        for your own numbers.
      </p>
    </section>
  )
}
