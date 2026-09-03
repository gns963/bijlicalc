import type { WaterTariffFile } from '@/data/water-tariffs/_schema'
import { computeWaterBill } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'

const SAMPLE_KL = [10, 15, 20, 25, 30, 40]

/** A scannable card grid of pre-computed KL examples, each linking back to
 *  the calculator with the exact KL value to enter — an honest alternative
 *  to a fake "auto-fills the form" claim, since the calculator doesn't take
 *  a URL param (yet). */
export default function WaterSampleCalculations({ tariff }: { tariff: WaterTariffFile }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SAMPLE_KL.map((kl) => {
        const bill = computeWaterBill(tariff, { consumptionKl: kl })
        return (
          <div key={kl} className="rounded-xl border border-hairline bg-paper p-5">
            <p className="text-sm font-semibold text-ink-navy">
              What is the {tariff.boardCode} water bill for {kl} KL?
            </p>
            <p className="font-display mt-2 text-2xl font-bold tabular-nums text-hub-water">
              {formatINR(bill.total)}
            </p>
            <dl className="mt-3 space-y-1 text-xs text-ash/60">
              <div className="flex justify-between">
                <dt>Water charge</dt>
                <dd className="tabular-nums">{formatINR(bill.waterCharge)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Sewerage charge</dt>
                <dd className="tabular-nums">{formatINR(bill.sewerageCharge)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Fixed charge</dt>
                <dd className="tabular-nums">{formatINR(bill.fixedCharge)}</dd>
              </div>
            </dl>
            <a
              href="#calculator"
              className="mt-3 block rounded-lg bg-hub-water/10 px-3 py-2 text-center text-xs font-semibold text-hub-water hover:bg-hub-water/20"
            >
              Open calculator, enter {kl} KL →
            </a>
          </div>
        )
      })}
    </div>
  )
}
