'use client'

import { useMemo, useState } from 'react'
import { calculateGst } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader } from './CalculatorShell'

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

  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <CalculatorCard>
      <CalculatorHeader icon="🧾" title="GST Calculator" subtitle="Add or remove GST from any amount" />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="gst-amount"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
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
          <label
            htmlFor="gst-rate"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
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
          <legend className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80">
            Amount is
          </legend>
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
                aria-pressed={mode === val}
                className={`flex-1 rounded-lg border-2 px-3 py-2 text-xs transition ${
                  mode === val
                    ? 'border-brass bg-brass/10 font-semibold text-ink-navy dark:text-gazette-cream'
                    : 'border-slate-200 text-ash/70 dark:border-slate-700 dark:text-gazette-cream/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <CalculatorCta label="Calculate GST" />
      </form>

      <div className="mt-6 rounded-xl bg-gazette-cream p-5 dark:bg-slate-800/60">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Total {mode === 'inclusive' ? '(incl. GST)' : 'payable'}
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-white">
                {formatINR(result.total)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Base amount
              </dt>
              <dd className="text-right tabular-nums">{formatINR(result.base)}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                GST @ {result.ratePercent}%
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.gstAmount)}
              </dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">CGST</dt>
              <dd className="text-right tabular-nums">{formatINR(result.cgst)}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">SGST</dt>
              <dd className="text-right tabular-nums">{formatINR(result.sgst)}</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
