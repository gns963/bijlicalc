import Link from 'next/link'
import type { ConnectionCategory, FixedCharge, TariffFile } from '@/data/tariffs/_schema'
import { cycleLabel, formatIsoDate } from '@/lib/format'

function fixedChargeLabel(fc: FixedCharge): string {
  switch (fc.basis) {
    case 'perPhase':
      return `₹${fc.singlePhase} / ₹${fc.threePhase}`
    case 'perLoad':
      return `₹${fc.perKW}/kW`
    case 'flat':
      return `₹${fc.flat}`
  }
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ash/60 dark:text-gazette-cream/50">{label}</dt>
      <dd className="text-right font-medium text-ink-navy dark:text-gazette-cream">
        {value}
      </dd>
    </div>
  )
}

export default function TariffSidebar({
  tariff,
  connectionType = 'residential',
}: {
  tariff: TariffFile
  connectionType?: ConnectionCategory
}) {
  const ct =
    tariff.connectionTypes.find((c) => c.connectionType === connectionType) ??
    tariff.connectionTypes[0]
  const maxRate = Math.max(...ct.slabs.map((s) => s.ratePerUnit), 0.01)

  return (
    <aside className="grid gap-4 lg:sticky lg:top-20 lg:self-start">
      {/* Tariff snapshot — visual slab bars */}
      <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-navy dark:text-gazette-cream">
            Tariff Snapshot
          </h3>
          <span className="rounded-full bg-spark-teal/15 px-2 py-0.5 text-[10px] font-semibold text-spark-teal">
            {tariff.discomCode}
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {ct.slabs.map((s, i) => {
            const pct = Math.max((s.ratePerUnit / maxRate) * 100, 8)
            return (
              <div key={i}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-ash/60 dark:text-gazette-cream/50">
                    {s.minUnits}–{s.maxUnits ?? '∞'} units
                  </span>
                  <span className="font-display font-bold tabular-nums text-ink-navy dark:text-gazette-cream">
                    ₹{s.ratePerUnit.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-mist dark:bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-brass"
                    style={{ width: `${pct}%`, opacity: 0.4 + (pct / 100) * 0.6 }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <dl className="mt-4 space-y-1.5 border-t border-hairline pt-3 text-xs dark:border-white/10">
          <Fact label="Fixed charge" value={fixedChargeLabel(ct.fixedCharge)} />
          {tariff.fuelCostAdjustment > 0 && (
            <Fact label="FCA" value={`₹${tariff.fuelCostAdjustment}/unit`} />
          )}
          {tariff.electricityDutyPercent > 0 && (
            <Fact label="Duty" value={`${tariff.electricityDutyPercent}%`} />
          )}
        </dl>
      </div>

      {/* Key facts */}
      <div className="rounded-xl border border-hairline bg-paper p-5 dark:border-white/10 dark:bg-slate-900">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-navy dark:text-gazette-cream">
          Key Facts
        </h3>
        <dl className="mt-3 space-y-2 text-xs">
          <Fact label="DISCOM" value={tariff.discomCode} />
          <Fact label="State" value={tariff.state} />
          <Fact label="Billing cycle" value={cycleLabel(tariff.billingCycle)} />
          <Fact label="Effective from" value={formatIsoDate(tariff.effectiveFrom)} />
        </dl>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-seal-red/30 px-2.5 py-1.5 text-[11px] font-semibold text-seal-red">
          <span aria-hidden>⦿</span> Verified {formatIsoDate(tariff.lastVerified)}
        </div>
      </div>

      {/* Solar mini cross-sell — opaque card (not a translucent tint) so it
          stays readable regardless of what page background sits behind the
          sidebar; spark-teal signals savings, brass signals the action link */}
      <Link
        href="/solar/roi-calculator"
        className="block rounded-xl border border-spark-teal/25 bg-paper p-5 transition hover:border-spark-teal/50 hover:shadow-sm dark:bg-slate-900"
      >
        <span className="text-xl" aria-hidden>
          ☀️
        </span>
        <p className="mt-2 text-sm font-semibold text-ink-navy dark:text-gazette-cream">
          See what solar could save you in {tariff.state}
        </p>
        <p className="mt-1 text-xs font-semibold text-brass">
          Check payback &amp; subsidy →
        </p>
      </Link>
    </aside>
  )
}
