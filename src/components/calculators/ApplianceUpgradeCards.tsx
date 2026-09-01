import Link from 'next/link'
import appliancesJson from '@/data/appliances.json'
import { acDailyUnits, marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

const lighting = appliancesJson.categories.find((c) => c.category === 'Lighting')!
const cfl = lighting.appliances.find((a) => a.name.startsWith('CFL'))!
const ledBulb = lighting.appliances.find((a) => a.name.startsWith('LED Bulb'))!

/**
 * Two genuine, data-backed upgrade comparisons — not four generic ones.
 * We only include pairs where both the "before" and "after" appliance are
 * real, matched entries in our reference data (same size/class); we do not
 * fabricate a fridge or fan pair we don't have matched wattage for.
 */
export default function ApplianceUpgradeCards({
  discomCode,
  state,
}: {
  discomCode: string
  state: string
}) {
  const rate = marginalRatePerUnit(discomCode)

  // Lighting: CFL (15W) -> LED bulb (9W), typical 6 hrs/day, annualised.
  const cflAnnualUnits = ((cfl.watts * cfl.typicalHoursPerDay) / 1000) * 365
  const ledAnnualUnits = ((ledBulb.watts * ledBulb.typicalHoursPerDay) / 1000) * 365
  const lightingSavings = (cflAnnualUnits - ledAnnualUnits) * rate

  // Cooling: 1.5 ton 3-star vs 5-star AC, same duty cycle as the AC engine.
  const hours = 6
  const units3 = acDailyUnits(1.5, 3, hours) * 365
  const units5 = acDailyUnits(1.5, 5, hours) * 365
  const acSavings = (units3 - units5) * rate

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
        <span className="text-2xl" aria-hidden>
          💡
        </span>
        <h3 className="mt-2 font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
          Swap CFL for LED bulbs
        </h3>
        <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">
          Replacing a 15W CFL with a 9W LED bulb, run {cfl.typicalHoursPerDay}{' '}
          hrs/day, saves about{' '}
          <strong className="text-spark-teal">
            {formatINR(lightingSavings)}/year
          </strong>{' '}
          at {state}&apos;s top slab rate (₹{rate.toFixed(2)}/unit) — per bulb.
        </p>
      </div>

      <Link
        href="/ac/comparisons/3-star-vs-5-star-savings-guide"
        className="rounded-xl border border-brass/30 bg-paper p-5 transition hover:border-brass/60 hover:shadow-sm dark:border-brass/20 dark:bg-slate-900"
      >
        <span className="text-2xl" aria-hidden>
          ❄️
        </span>
        <h3 className="mt-2 font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
          Upgrade to a 5-star AC
        </h3>
        <p className="mt-1 text-sm text-ash/70 dark:text-gazette-cream/60">
          A 1.5 ton 5-star AC vs 3-star, run {hours} hrs/day, saves about{' '}
          <strong className="text-spark-teal">{formatINR(acSavings)}/year</strong>{' '}
          in {state}.
        </p>
        <span className="mt-3 inline-block text-xs font-semibold text-brass">
          See the full comparison →
        </span>
      </Link>
    </div>
  )
}
