import { computeGasBill, getGasTariff } from '@/lib/calc/gas'
import { formatINR } from '@/lib/format'

/**
 * Renders the PNG billing formula by actually calling computeGasBill() on a
 * real tariff — never restate the maths by hand, so the displayed
 * methodology can never drift from what the calculator really computes.
 */
export default function GasFormulaBlock({ cgdCode = 'IGL' }: { cgdCode?: string }) {
  const tariff = getGasTariff(cgdCode)
  const example = computeGasBill(tariff, { scmConsumed: 40 })
  const rate = tariff.slabs[0].ratePerSCM

  return (
    <div className="rounded-xl border border-hairline bg-paper p-5">
      <p className="font-display text-sm font-semibold tracking-wide text-hub-gas uppercase">
        The formula, in full
      </p>
      <div className="mt-3 space-y-2 font-mono text-sm">
        <p className="rounded-lg bg-mist px-3 py-2">
          Gas charge = SCM consumed × rate per SCM
        </p>
        {tariff.calorificValueAdjustment != null && (
          <p className="rounded-lg bg-mist px-3 py-2">
            + Calorific value adjustment ({tariff.calorificValueAdjustment}% of gas charge)
          </p>
        )}
        <p className="rounded-lg bg-mist px-3 py-2">
          + Fixed/meter charge ({formatINR(tariff.fixedCharge)}/cycle)
        </p>
        <p className="rounded-lg bg-mist px-3 py-2">= Total bill</p>
      </div>
      <p className="mt-3 text-sm text-ash/70">
        Worked at <strong>{tariff.cgdCode}</strong>&apos;s real rate of{' '}
        <strong>{formatINR(rate)}/SCM</strong>: 40 SCM ×{' '}
        {formatINR(rate)} = {formatINR(example.gasChargeGross)} gas charge,{' '}
        {tariff.calorificValueAdjustment != null && example.calorificAdjustment && (
          <>+ {formatINR(example.calorificAdjustment.amount)} calorific adjustment, </>
        )}
        + {formatINR(example.fixedCharge)} fixed charge ={' '}
        <strong className="text-hub-gas">{formatINR(example.total)}</strong>.
      </p>
      <p className="mt-3 text-xs text-ash/50">
        This is the exact function and tariff our calculator uses for{' '}
        {tariff.cgdCode} — not a simplified restatement. Unlike electricity,
        domestic PNG billing in India generally isn&apos;t telescopic-slabbed —
        every SCM is billed at the same per-unit rate.
      </p>
    </div>
  )
}
