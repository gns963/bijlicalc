'use client'

import { useMemo, useState } from 'react'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

export interface AcDiscomOption {
  code: string
  state: string
}

const TONNAGES = [0.8, 1.0, 1.5, 2.0]
const STARS = [1, 2, 3, 4, 5]

export default function AcBillCalculator({
  discoms,
}: {
  discoms: AcDiscomOption[]
}) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [tonnage, setTonnage] = useState(1.5)
  const [starRating, setStarRating] = useState(3)
  const [hours, setHours] = useState(8)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateAcCost({
          discomCode,
          tonnage,
          starRating,
          dailyHours: hours,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, tonnage, starRating, hours])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="ac-discom" className={labelCls}>
            DISCOM / state
          </label>
          <select
            id="ac-discom"
            value={discomCode}
            onChange={(e) => setDiscomCode(e.target.value)}
            className={fieldCls}
          >
            {discoms.map((d) => (
              <option key={d.code} value={d.code}>
                {d.state} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ac-ton" className={labelCls}>
              Tonnage
            </label>
            <select
              id="ac-ton"
              value={tonnage}
              onChange={(e) => setTonnage(Number(e.target.value))}
              className={fieldCls}
            >
              {TONNAGES.map((t) => (
                <option key={t} value={t}>
                  {t} ton
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ac-star" className={labelCls}>
              Star rating
            </label>
            <select
              id="ac-star"
              value={starRating}
              onChange={(e) => setStarRating(Number(e.target.value))}
              className={fieldCls}
            >
              {STARS.map((s) => (
                <option key={s} value={s}>
                  {s} star
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="ac-hours" className={labelCls}>
            Daily usage: {hours} hours
          </label>
          <input
            id="ac-hours"
            type="range"
            min={1}
            max={24}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
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
                Estimated monthly running cost
              </p>
              <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatINR(result.monthlyCost)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ≈ {formatINR(result.annualCost)}/year ·{' '}
                {result.monthlyUnits} units/month
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-500 dark:text-slate-400">Input power</dt>
              <dd className="text-right tabular-nums">{result.inputKw} kW</dd>
              <dt className="text-slate-500 dark:text-slate-400">ISEER</dt>
              <dd className="text-right tabular-nums">{result.iseer}</dd>
              <dt className="text-slate-500 dark:text-slate-400">
                Units per day
              </dt>
              <dd className="text-right tabular-nums">{result.dailyUnits}</dd>
              <dt className="text-slate-500 dark:text-slate-400">
                Billed at (top slab)
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.effectiveRatePerUnit)}/unit
              </dd>
            </dl>
            <p className="text-xs text-slate-400">{result.notes[0]}</p>
          </div>
        )}
      </div>
    </div>
  )
}
