import { AC_PRODUCTS } from '@/data/ac-products'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

/**
 * Real-world non-inverter 3-star vs inverter 5-star scenario, same tonnage,
 * priced via calculateAcCost() and using AC_PRODUCTS' indicative price gap
 * for the payback period — no hand-picked numbers.
 */
export default function AcScenarioComparison({
  tonnage = 1.5,
  dailyHours = 8,
  discomCode = 'TNEB',
  discomLabel = 'Tamil Nadu (TNEB)',
}: {
  tonnage?: number
  dailyHours?: number
  discomCode?: string
  discomLabel?: string
}) {
  const nonInverter = calculateAcCost({ discomCode, tonnage, starRating: 3, dailyHours })
  const inverter = calculateAcCost({ discomCode, tonnage, starRating: 5, dailyHours })
  const annualSaving = nonInverter.annualCost - inverter.annualCost

  const threeStarModel = AC_PRODUCTS.find((p) => p.starRating === 3 && p.tonnage === tonnage)
  const fiveStarModel = AC_PRODUCTS.find((p) => p.starRating === 5 && p.tonnage === tonnage)
  const priceDiff =
    threeStarModel && fiveStarModel ? fiveStarModel.price - threeStarModel.price : null
  const paybackYears = priceDiff && annualSaving > 0 ? priceDiff / annualSaving : null

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
            3-star, fixed-speed (non-inverter)
          </p>
          <p className="font-display mt-1 text-2xl font-bold text-ink-navy dark:text-gazette-cream">
            {formatINR(nonInverter.monthlyCost)}/mo
          </p>
          <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
            {formatINR(nonInverter.annualCost)}/year · {tonnage}T at {dailyHours}h/day
          </p>
        </div>
        <div className="rounded-xl border border-spark-teal/25 bg-spark-teal/5 p-5">
          <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
            5-star inverter
          </p>
          <p className="font-display mt-1 text-2xl font-bold text-spark-teal">
            {formatINR(inverter.monthlyCost)}/mo
          </p>
          <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
            {formatINR(inverter.annualCost)}/year · {tonnage}T at {dailyHours}h/day
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-hairline border-l-4 border-l-brass bg-paper p-5 dark:border-white/10 dark:border-l-brass dark:bg-slate-900">
        <p className="text-ash/80 dark:text-gazette-cream/90">
          That&apos;s <strong>{formatINR(annualSaving)}/year</strong> less
          for the inverter unit in {discomLabel}.
          {priceDiff !== null && paybackYears !== null && (
            <>
              {' '}
              At an indicative {formatINR(priceDiff)} price premium, the
              5-star pays for itself in about{' '}
              <strong>{paybackYears.toFixed(1)} years</strong> on running
              cost alone.
            </>
          )}
        </p>
      </div>
      <p className="mt-2 text-xs text-ash/50 dark:text-gazette-cream/40">
        Our engine prices efficiency via ISEER (star rating), not inverter
        technology directly — but in today&apos;s BEE-labelled Indian market,
        3-star split ACs are typically fixed-speed while 5-star models are
        almost always inverter units, so the star-rating comparison closely
        tracks the inverter-vs-non-inverter question in practice.
      </p>
    </div>
  )
}
