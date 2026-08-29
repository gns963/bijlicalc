'use client'

import { useMemo, useState } from 'react'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'

export interface SolarDiscomOption {
  code: string
  state: string
}

export default function SolarRoiCalculator({
  discoms,
}: {
  discoms: SolarDiscomOption[]
}) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [unitsStr, setUnitsStr] = useState('300')
  const [kwStr, setKwStr] = useState('3')

  const { result, error } = useMemo(() => {
    const monthlyUnits = Number(unitsStr)
    const systemSizeKw = Number(kwStr)
    if (!Number.isFinite(monthlyUnits) || monthlyUnits < 0)
      return { result: null, error: 'Enter valid monthly units.' }
    if (!Number.isFinite(systemSizeKw) || systemSizeKw <= 0)
      return { result: null, error: 'Enter a valid system size in kW.' }
    try {
      return {
        result: calculateSolarRoi({ discomCode, monthlyUnits, systemSizeKw }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, unitsStr, kwStr])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const inputCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="solar-discom" className={labelCls}>
            Your DISCOM / state
          </label>
          <select
            id="solar-discom"
            value={discomCode}
            onChange={(e) => setDiscomCode(e.target.value)}
            className={inputCls}
          >
            {discoms.map((d) => (
              <option key={d.code} value={d.code}>
                {d.state} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="solar-units" className={labelCls}>
            Average monthly consumption (units)
          </label>
          <input
            id="solar-units"
            type="number"
            min={0}
            value={unitsStr}
            onChange={(e) => setUnitsStr(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="solar-kw" className={labelCls}>
            System size (kW)
          </label>
          <input
            id="solar-kw"
            type="number"
            min={0}
            step="0.5"
            value={kwStr}
            onChange={(e) => setKwStr(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-slate-400">
            Tip: ~1 kW per 100–150 monthly units is a common starting point.
          </p>
        </div>
      </form>

      <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Payback period
              </p>
              <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                {result.paybackYears != null
                  ? `${result.paybackYears} yrs`
                  : '—'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                then ~{formatINR(result.annualSavings)}/year saved
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-500 dark:text-slate-400">System cost</dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.systemCost)}
              </dd>
              <dt className="text-emerald-700 dark:text-emerald-400">
                PM Surya Ghar subsidy
              </dt>
              <dd className="text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                −{formatINR(result.subsidy)}
              </dd>
              <dt className="font-medium text-slate-700 dark:text-slate-200">
                Net cost
              </dt>
              <dd className="text-right font-medium tabular-nums">
                {formatINR(result.netCost)}
              </dd>
              <dt className="text-slate-500 dark:text-slate-400">
                Annual generation
              </dt>
              <dd className="text-right tabular-nums">
                {Math.round(result.annualGeneration)} units
              </dd>
              <dt className="text-slate-500 dark:text-slate-400">
                Monthly savings
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.monthlySavings)}
              </dd>
              <dt className="text-slate-500 dark:text-slate-400">
                25-year net savings
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.lifetimeSavings)}
              </dd>
            </dl>

            <p className="text-xs text-slate-400">{result.notes[0]}</p>
          </div>
        )}
      </div>
    </div>
  )
}
