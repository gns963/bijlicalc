'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { formatINR } from '@/lib/format'

export interface QuickEstimateDiscom {
  code: string
  state: string
  href: string
}

const PRESETS = [100, 200, 300, 500]

/**
 * Hero widget: a genuinely live estimate, not a decorative mockup — reuses
 * the same computeBill engine as the full calculators, just for a single
 * residential/single-phase/no-subsidy scenario.
 */
export interface QuickBillEstimateLabels {
  title: string
  badge: string
  discomSrLabel: string
  unitsSrLabel: string
  unitsPlaceholder: string
  estimatedBillFor: string
  enterUnitsPrompt: string
  fullBreakdownPrefix: string
  fullBreakdownSuffix: string
}

const DEFAULT_LABELS: QuickBillEstimateLabels = {
  title: 'Quick Bill Estimate',
  badge: '2026 tariff',
  discomSrLabel: 'Your DISCOM / state',
  unitsSrLabel: 'Units consumed (kWh)',
  unitsPlaceholder: 'Units (kWh)',
  estimatedBillFor: 'Estimated bill for',
  enterUnitsPrompt: 'Enter units to see an instant estimate',
  fullBreakdownPrefix: 'Full',
  fullBreakdownSuffix: 'breakdown →',
}

export default function QuickBillEstimate({
  discoms,
  labels = DEFAULT_LABELS,
}: {
  discoms: QuickEstimateDiscom[]
  labels?: QuickBillEstimateLabels
}) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [units, setUnits] = useState(200)

  const selected = discoms.find((d) => d.code === discomCode) ?? discoms[0]

  const result = useMemo(() => {
    if (!discomCode) return null
    try {
      const tariff = getTariff(discomCode)
      const res =
        tariff.connectionTypes.find((c) => c.connectionType === 'residential') ??
        tariff.connectionTypes[0]
      return computeBill(tariff, {
        connectionType: res.connectionType,
        unitsConsumed: units,
        phase: 'single',
        sanctionedLoad: res.fixedCharge.basis === 'perLoad' ? 3 : undefined,
      })
    } catch {
      return null
    }
  }, [discomCode, units])

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <span aria-hidden>⚡</span> {labels.title}
        </p>
        <span className="text-[11px] font-medium text-white/40">{labels.badge}</span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="sr-only">{labels.discomSrLabel}</span>
          <select
            value={discomCode}
            onChange={(e) => setDiscomCode(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 text-sm text-white outline-none focus:border-brass focus:ring-2 focus:ring-brass/40"
          >
            {discoms.map((d) => (
              <option key={d.code} value={d.code} className="text-ash">
                {d.state} ({d.code})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="sr-only">{labels.unitsSrLabel}</span>
          <input
            type="number"
            min={0}
            value={units}
            onChange={(e) => setUnits(Math.max(0, Number(e.target.value) || 0))}
            placeholder={labels.unitsPlaceholder}
            className="w-full rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-brass focus:ring-2 focus:ring-brass/40"
          />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setUnits(p)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              units === p
                ? 'border-brass bg-brass text-white'
                : 'border-white/15 text-white/70 hover:border-white/35'
            }`}
          >
            {p}u
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-baseline justify-between border-t border-white/15 pt-2">
        {result ? (
          <>
            <p className="text-xs text-white/50">
              {labels.estimatedBillFor} {selected?.state}
            </p>
            <p className="font-display text-2xl font-extrabold tabular-nums text-brass">
              {formatINR(result.total)}
            </p>
          </>
        ) : (
          <p className="text-sm text-white/50">{labels.enterUnitsPrompt}</p>
        )}
      </div>

      {selected && (
        <Link
          href={selected.href}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brass px-4 py-2 text-sm font-semibold text-white transition hover:bg-brass/90"
        >
          {labels.fullBreakdownPrefix} {selected.state} {labels.fullBreakdownSuffix}
        </Link>
      )}
    </div>
  )
}
