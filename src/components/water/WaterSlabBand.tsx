'use client'

import { useState } from 'react'
import type { WaterSlab } from '@/data/water-tariffs/_schema'

/** Increasing-intensity aqua shades — darker segment reads as "pricier",
 *  so the visual encodes the telescoping rate structure without a legend. */
const INTENSITY = ['bg-hub-water/25', 'bg-hub-water/45', 'bg-hub-water/65', 'bg-hub-water/85', 'bg-hub-water']

/**
 * A single horizontal bar sliced into proportional colored segments, one per
 * slab — our own visual metaphor for a telescoping tariff, distinct from a
 * plain two-column rate table. The open-ended top slab is capped to a
 * reasonable visual width (matching the previous slab's width) and labeled
 * "N+ KL" rather than stretching indefinitely.
 */
export default function WaterSlabBand({ slabs }: { slabs: WaterSlab[] }) {
  const [active, setActive] = useState<number | null>(null)

  const widths = slabs.map((s, i) => {
    if (s.maxKL !== null) return s.maxKL - s.minKL
    const prevWidth = i > 0 ? slabs[i - 1].maxKL! - slabs[i - 1].minKL : 10
    return prevWidth
  })
  const totalWidth = widths.reduce((sum, w) => sum + w, 0)

  return (
    <div>
      <div className="flex h-10 w-full overflow-hidden rounded-lg border border-hairline" role="group" aria-label="Tariff slabs by KL range">
        {slabs.map((s, i) => {
          const pct = (widths[i] / totalWidth) * 100
          const color = INTENSITY[Math.min(i, INTENSITY.length - 1)]
          const isActive = active === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(isActive ? null : i)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{ width: `${pct}%` }}
              aria-pressed={isActive}
              className={`relative flex items-center justify-center text-xs font-semibold text-ink-navy transition ${color} ${
                isActive ? 'ring-2 ring-inset ring-brass' : ''
              } ${i > 0 ? 'border-l border-paper/60' : ''}`}
            >
              {pct > 10 && <span className="hidden sm:inline">₹{s.ratePerKL.toFixed(1)}</span>}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {slabs.map((s, i) => {
          const isActive = active === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(isActive ? null : i)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
                isActive ? 'border-brass bg-brass/10' : 'border-hairline bg-paper'
              }`}
            >
              <span className="font-semibold text-ink-navy">
                {s.minKL}–{s.maxKL ?? `${s.minKL}+`} KL
              </span>
              <span className="ml-1.5 tabular-nums text-ash/70">₹{s.ratePerKL.toFixed(2)}/KL</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
