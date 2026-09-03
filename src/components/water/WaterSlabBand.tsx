'use client'

import { useState } from 'react'
import type { WaterSlab } from '@/data/water-tariffs/_schema'

/** Increasing-intensity aqua shades — darker segment reads as "pricier", so
 *  the visual encodes the telescoping rate structure without a legend. */
const INTENSITY = [
  { bg: 'bg-hub-water/20', text: 'text-ink-navy' },
  { bg: 'bg-hub-water/45', text: 'text-ink-navy' },
  { bg: 'bg-hub-water/70', text: 'text-white' },
  { bg: 'bg-hub-water/90', text: 'text-white' },
  { bg: 'bg-hub-water', text: 'text-white' },
]

function slabLabel(s: WaterSlab) {
  return s.maxKL === null ? `${s.minKL}+ KL` : `${s.minKL}–${s.maxKL} KL`
}

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
  const activeSlab = active !== null ? slabs[active] : null

  return (
    <div>
      <div
        className="flex h-16 w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-hairline"
        role="group"
        aria-label="Tariff slabs by KL range"
      >
        {slabs.map((s, i) => {
          const pct = (widths[i] / totalWidth) * 100
          const tone = INTENSITY[Math.min(i, INTENSITY.length - 1)]
          const isActive = active === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(isActive ? null : i)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              style={{ width: `${pct}%` }}
              aria-pressed={isActive}
              aria-label={`${slabLabel(s)}: ₹${s.ratePerKL.toFixed(2)} per KL`}
              className={`group relative flex flex-col items-center justify-center gap-0.5 px-1 transition-[filter] ${tone.bg} ${tone.text} ${
                isActive ? 'brightness-110' : 'hover:brightness-105'
              } ${i > 0 ? 'border-l border-paper/50' : ''}`}
            >
              {isActive && (
                <span className="absolute inset-x-0 -top-0.5 h-0.5 bg-brass" aria-hidden />
              )}
              {pct > 16 && (
                <span className="hidden text-[10px] font-medium tracking-wide opacity-80 sm:inline">
                  {slabLabel(s)}
                </span>
              )}
              {pct > 8 && (
                <span className="font-display text-sm font-bold tabular-nums sm:text-base">
                  ₹{s.ratePerKL.toFixed(2)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-2.5 flex min-h-[1.5rem] items-center text-sm">
        {activeSlab ? (
          <p className="text-ash/80">
            <span className="font-semibold text-ink-navy">{slabLabel(activeSlab)}</span>
            <span className="mx-1.5 text-ash/40">·</span>
            <span className="tabular-nums">₹{activeSlab.ratePerKL.toFixed(2)}/KL</span>
          </p>
        ) : (
          <p className="text-xs text-ash/50">Tap or hover a segment for its exact rate.</p>
        )}
      </div>
    </div>
  )
}
