'use client'

import { useMemo, useState } from 'react'
import { pmSuryaGharSubsidy } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

const CRITERIA: { key: string; label: string }[] = [
  { key: 'residential', label: 'This is a residential (household) connection' },
  { key: 'ownRoof', label: 'I own the house / have rights to the roof' },
  { key: 'gridConnected', label: 'The home has a valid grid electricity connection' },
  { key: 'notAvailed', label: 'I have not already claimed a rooftop solar subsidy' },
]

export default function SolarSubsidyCalculator() {
  const [kwStr, setKwStr] = useState('3')
  const [checks, setChecks] = useState<Record<string, boolean>>({
    residential: true,
    ownRoof: true,
    gridConnected: true,
    notAvailed: true,
  })

  const kw = Number(kwStr)
  const validKw = Number.isFinite(kw) && kw > 0
  const subsidy = useMemo(
    () => (validKw ? pmSuryaGharSubsidy(kw) : 0),
    [kw, validKw],
  )
  const eligible = CRITERIA.every((c) => checks[c.key])

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-5">
        <div>
          <label
            htmlFor="subsidy-kw"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Planned system size (kW)
          </label>
          <input
            id="subsidy-kw"
            type="number"
            min={0}
            step="0.5"
            value={kwStr}
            onChange={(e) => setKwStr(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            Eligibility
          </legend>
          {CRITERIA.map((c) => (
            <label key={c.key} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={checks[c.key]}
                onChange={(e) =>
                  setChecks((prev) => ({ ...prev, [c.key]: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-700 dark:text-slate-200">
                {c.label}
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Estimated PM Surya Ghar subsidy
        </p>
        <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
          {validKw ? formatINR(subsidy) : '—'}
        </p>

        <div
          className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${
            eligible
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
          }`}
        >
          {eligible
            ? '✅ You appear eligible for PM Surya Ghar.'
            : '⚠️ Tick all criteria above to qualify for the subsidy.'}
        </div>

        <ul className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <li>• ₹30,000/kW for the first 2 kW</li>
          <li>• ₹18,000 for the 3rd kW</li>
          <li>• Capped at ₹78,000 (systems of 3 kW and above)</li>
        </ul>
        {validKw && kw > 3 && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Systems above 3 kW still receive the same ₹78,000 cap.
          </p>
        )}
      </div>
    </div>
  )
}
