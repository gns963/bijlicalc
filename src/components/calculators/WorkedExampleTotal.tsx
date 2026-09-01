'use client'

import { useEffect, useState } from 'react'
import { Drum } from '@/components/DigitDrum'

/**
 * The hero worked-example total, rendered as rolling odometer drums — the
 * one signature animation on a DISCOM page. Plays once on mount, then
 * settles; respects prefers-reduced-motion via the shared .drum-strip rule
 * in globals.css, which disables the CSS transition outright, so a
 * reduced-motion user simply sees the final digits with no roll.
 */
export default function WorkedExampleTotal({ amount }: { amount: number }) {
  const whole = Math.max(0, Math.round(amount))
  const target = String(whole).padStart(3, '0')
  const [display, setDisplay] = useState(() => '0'.repeat(target.length))

  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplay(target))
    return () => cancelAnimationFrame(id)
  }, [target])

  return (
    <span
      className="inline-flex items-center gap-0.5 align-middle"
      aria-label={`₹${whole}`}
    >
      <span className="mr-0.5 font-display text-2xl font-bold text-ink-navy sm:text-3xl">
        ₹
      </span>
      {display.split('').map((d, i) => (
        <Drum key={i} digit={d} className="h-8 w-5 text-lg sm:h-9 sm:w-6 sm:text-xl" />
      ))}
    </span>
  )
}
