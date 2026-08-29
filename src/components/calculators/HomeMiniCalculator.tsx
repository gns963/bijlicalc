'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { cycleLabel, formatINR } from '@/lib/format'

export interface HomeMiniState {
  name: string
  available: boolean
  /** DISCOM code for available states (used to resolve the tariff). */
  discomCode?: string
  /** Full-calculator route for available states. */
  href?: string
}

export interface HomeMiniCalculatorProps {
  states: HomeMiniState[]
}

export default function HomeMiniCalculator({ states }: HomeMiniCalculatorProps) {
  const firstAvailable = states.find((s) => s.available)?.name ?? states[0]?.name
  const [stateName, setStateName] = useState(firstAvailable)
  const [unitsStr, setUnitsStr] = useState('250')

  const selected = states.find((s) => s.name === stateName)

  const result = useMemo(() => {
    if (!selected?.available || !selected.discomCode) return null
    const units = Number(unitsStr)
    if (!Number.isFinite(units) || units < 0) return null
    try {
      const tariff = getTariff(selected.discomCode)
      const bill = computeBill(tariff, {
        connectionType: 'residential',
        unitsConsumed: units,
        phase: 'single',
        sanctionedLoad: 3, // used only if the DISCOM bills fixed charge per kW
      })
      return { bill, href: selected.href ?? '/' }
    } catch {
      return null
    }
  }, [selected, unitsStr])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="mini-state"
            className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            State
          </label>
          <select
            id="mini-state"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {states.map((s) => (
              <option key={s.name} value={s.name} disabled={!s.available}>
                {s.name}
                {s.available ? '' : ' — coming soon'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="mini-units"
            className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            Units (per billing cycle)
          </label>
          <input
            id="mini-units"
            type="number"
            min={0}
            inputMode="numeric"
            value={unitsStr}
            onChange={(e) => setUnitsStr(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
        {result ? (
          <>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimated {cycleLabel(result.bill.billingCycle)} bill (before
                subsidy)
              </p>
              <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatINR(result.bill.total)}
                {result.bill.monthlyEquivalent && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    (≈ {formatINR(result.bill.monthlyEquivalent.total)}/mo)
                  </span>
                )}
              </p>
            </div>
            <Link
              href={result.href}
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Full calculator →
            </Link>
          </>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {selected?.available
              ? 'Enter your units to see an estimate.'
              : `${stateName} is coming soon — pick an available state to try it.`}
          </p>
        )}
      </div>
    </div>
  )
}
