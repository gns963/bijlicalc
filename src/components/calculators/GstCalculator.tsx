'use client'

import { useMemo, useState } from 'react'
import { calculateGst } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

const RATES = [0, 3, 5, 12, 18, 28]

export default function GstCalculator() {
  const [amountStr, setAmountStr] = useState('1000')
  const [rate, setRate] = useState(18)
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive')

  const { result, error } = useMemo(() => {
    const amount = Number(amountStr)
    if (!Number.isFinite(amount) || amount < 0)
      return { result: null, error: 'Enter a valid amount.' }
    return { result: calculateGst(amount, rate, mode), error: null as string | null }
  }, [amountStr, rate, mode])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="gst-amount" className={labelCls}>
            Amount (₹)
          </label>
          <input
            id="gst-amount"
            type="number"
            min={0}
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className={`${fieldCls} text-lg tabular-nums`}
          />
        </div>

        <div>
          <label htmlFor="gst-rate" className={labelCls}>
            GST rate
          </label>
          <select
            id="gst-rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={fieldCls}
          >
            {RATES.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={labelCls}>Amount is</legend>
          <div className="flex gap-2">
            {(
              [
                ['exclusive', 'GST-exclusive (add GST)'],
                ['inclusive', 'GST-inclusive (remove GST)'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setMode(val)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs transition ${
                  mode === val
                    ? 'border-indigo-500 bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200'
                    : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
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
                Total {mode === 'inclusive' ? '(incl. GST)' : 'payable'}
              </p>
              <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatINR(result.total)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-500 dark:text-slate-400">Base amount</dt>
              <dd className="text-right tabular-nums">{formatINR(result.base)}</dd>
              <dt className="text-slate-500 dark:text-slate-400">
                GST @ {result.ratePercent}%
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.gstAmount)}
              </dd>
              <dt className="text-slate-500 dark:text-slate-400">CGST</dt>
              <dd className="text-right tabular-nums">{formatINR(result.cgst)}</dd>
              <dt className="text-slate-500 dark:text-slate-400">SGST</dt>
              <dd className="text-right tabular-nums">{formatINR(result.sgst)}</dd>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
