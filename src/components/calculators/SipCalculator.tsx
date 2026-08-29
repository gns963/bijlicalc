'use client'

import { useMemo, useState } from 'react'
import { calculateSip } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

export default function SipCalculator() {
  const [monthlyStr, setMonthlyStr] = useState('10000')
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const { result, error } = useMemo(() => {
    const monthly = Number(monthlyStr)
    if (!Number.isFinite(monthly) || monthly < 0)
      return { result: null, error: 'Enter a valid monthly amount.' }
    return {
      result: calculateSip(monthly, rate, years),
      error: null as string | null,
    }
  }, [monthlyStr, rate, years])

  const maxValue = result
    ? Math.max(...result.yearly.map((p) => p.value), 1)
    : 1

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="sip-monthly" className={labelCls}>
            Monthly investment (₹)
          </label>
          <input
            id="sip-monthly"
            type="number"
            min={0}
            value={monthlyStr}
            onChange={(e) => setMonthlyStr(e.target.value)}
            className={`${fieldCls} text-lg`}
          />
        </div>
        <div>
          <label htmlFor="sip-rate" className={labelCls}>
            Expected annual return: {rate}%
          </label>
          <input
            id="sip-rate"
            type="range"
            min={1}
            max={30}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="sip-years" className={labelCls}>
            Duration: {years} years
          </label>
          <input
            id="sip-years"
            type="range"
            min={1}
            max={40}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
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
                Maturity value
              </p>
              <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatINR(result.maturityValue)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Invested {formatINR(result.invested)} · Gains{' '}
                <span className="text-emerald-600 dark:text-emerald-400">
                  {formatINR(result.gains)}
                </span>
              </p>
            </div>

            {/* Simple stacked growth chart: invested (base) + gains (top) */}
            <div>
              <div className="flex h-40 items-end gap-1" aria-hidden>
                {result.yearly.map((p) => {
                  const totalH = (p.value / maxValue) * 100
                  const investedH = (p.invested / maxValue) * 100
                  return (
                    <div
                      key={p.year}
                      className="flex-1"
                      title={`Year ${p.year}: ${formatINR(p.value)}`}
                    >
                      <div
                        className="relative w-full rounded-t bg-emerald-300 dark:bg-emerald-600"
                        style={{ height: `${totalH}%` }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t bg-indigo-400 dark:bg-indigo-500"
                          style={{ height: `${(investedH / totalH) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-indigo-400" />
                  Invested
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-emerald-300" />
                  Gains
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
