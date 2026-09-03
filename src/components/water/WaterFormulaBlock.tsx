import { computeWaterBill, getWaterTariff } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'

/**
 * Renders the water billing formula by actually calling computeWaterBill()
 * on a real tariff — never restate the maths by hand, so the displayed
 * methodology can never drift from what the calculator really computes.
 */
export default function WaterFormulaBlock({ boardCode = 'DJB' }: { boardCode?: string }) {
  const tariff = getWaterTariff(boardCode)
  const exampleKl = 25
  const example = computeWaterBill(tariff, { consumptionKl: exampleKl })
  const defaultMeter = Object.keys(tariff.fixedChargeByMeterSize)[0]

  return (
    <div className="rounded-xl border border-hairline bg-paper p-5">
      <p className="font-display text-sm font-semibold tracking-wide text-hub-water uppercase">
        The formula, in full
      </p>
      <div className="mt-3 space-y-2 font-mono text-sm">
        <p className="rounded-lg bg-mist px-3 py-2">
          Water charge = KL consumed × slab rate per KL
        </p>
        <p className="rounded-lg bg-mist px-3 py-2">
          + Sewerage charge ({tariff.sewerageChargePercent}% of water charge)
        </p>
        <p className="rounded-lg bg-mist px-3 py-2">
          + Fixed charge ({formatINR(tariff.fixedChargeByMeterSize[defaultMeter])}/cycle)
        </p>
        <p className="rounded-lg bg-mist px-3 py-2">= Total bill</p>
      </div>
      <p className="mt-3 text-sm text-ash/70">
        Worked at <strong>{tariff.boardCode}</strong>&apos;s real slab rates:{' '}
        {exampleKl} KL priced through the slabs ={' '}
        {formatINR(example.waterCharge)} water charge,{' '}
        + {formatINR(example.sewerageCharge)} sewerage,{' '}
        + {formatINR(example.fixedCharge)} fixed ={' '}
        <strong className="text-hub-water">{formatINR(example.total)}</strong>.
      </p>
      <p className="mt-3 text-xs text-ash/50">
        This is the exact function and tariff our calculator uses for{' '}
        {tariff.boardCode} — not a simplified restatement. Water slabs are
        telescopic like electricity, unless a free-allowance threshold
        applies (see the free-rule section above, where relevant).
      </p>
    </div>
  )
}
