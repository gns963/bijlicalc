'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Drum } from '@/components/DigitDrum'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { cycleLabel, formatINR } from '@/lib/format'

export interface MeterState {
  name: string
  available: boolean
  discomCode?: string
  href?: string
}

export default function MeterDial({ states }: { states: MeterState[] }) {
  const firstAvailable =
    states.find((s) => s.available)?.name ?? states[0]?.name
  const [stateName, setStateName] = useState(firstAvailable)
  const [units, setUnits] = useState(250)

  const selected = states.find((s) => s.name === stateName)

  const bill = useMemo(() => {
    if (!selected?.available || !selected.discomCode) return null
    try {
      return computeBill(getTariff(selected.discomCode), {
        connectionType: 'residential',
        unitsConsumed: units,
        phase: 'single',
        sanctionedLoad: 3,
      })
    } catch {
      return null
    }
  }, [selected, units])

  const total = bill?.total ?? 0
  // 5-drum odometer of whole rupees, like a real kWh meter.
  const drums = String(Math.min(99999, Math.round(total))).padStart(5, '0')
  // Disc spins faster with higher consumption (bounded).
  const spin = Math.max(0.5, Math.min(6, 700 / Math.max(units, 1)))

  return (
    <div className="rounded-3xl border-4 border-brass/50 bg-ink-navy p-5 shadow-2xl">
      {/* housing header */}
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-brass/80">
        <span>live meter</span>
        <span className="flex items-center gap-1.5 text-spark-teal">
          <span className="h-2 w-2 rounded-full bg-spark-teal" /> live
        </span>
      </div>

      {/* glass window with rolling drums */}
      <div className="mt-3 rounded-xl bg-gradient-to-b from-white/90 to-gazette-cream p-3 shadow-inner">
        <div className="flex items-center justify-center gap-1">
          <span className="mr-1 font-display text-2xl font-bold text-ash">₹</span>
          {drums.split('').map((d, i) => (
            <Drum key={i} digit={d} />
          ))}
        </div>
        <p className="mt-2 text-center font-sans text-xs text-ash/70">
          {selected?.available
            ? `${formatINR(total)} · per ${cycleLabel(bill?.billingCycle ?? 'monthly')}`
            : `${stateName} — coming soon`}
        </p>
      </div>

      {/* spinning aluminium disc */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <div
            className="meter-disc h-12 w-12 rounded-full border border-white/20 bg-[conic-gradient(from_0deg,#e7e2d6,#9a958a,#e7e2d6,#9a958a,#e7e2d6)]"
            style={{ animation: `meter-spin ${spin}s linear infinite` }}
          >
            <span className="absolute left-1/2 top-0 h-1/2 w-0.5 -translate-x-1/2 bg-ash" />
          </div>
        </div>
        <div className="text-xs text-gazette-cream/70">
          <p className="font-semibold text-gazette-cream">Consumption</p>
          <p className="tabular-nums">{units} units</p>
        </div>
      </div>

      {/* controls */}
      <div className="mt-4 grid gap-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gazette-cream/60">
            State
          </span>
          <select
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            aria-label="State"
            className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-gazette-cream outline-none focus:border-brass focus:ring-2 focus:ring-brass/40"
          >
            {states.map((s) => (
              <option
                key={s.name}
                value={s.name}
                disabled={!s.available}
                className="text-ash"
              >
                {s.name}
                {s.available ? '' : ' — soon'}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-gazette-cream/60">
            <span>Units consumed</span>
            <span className="tabular-nums text-gazette-cream">{units}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            aria-label="Units consumed"
            className="w-full accent-brass"
          />
        </label>
      </div>

      {selected?.available && selected.href && (
        <Link
          href={selected.href}
          className="mt-4 block rounded-lg bg-brass px-4 py-2.5 text-center text-sm font-semibold text-ink-navy transition hover:bg-brass/90"
        >
          Full {stateName} calculator →
        </Link>
      )}
    </div>
  )
}
