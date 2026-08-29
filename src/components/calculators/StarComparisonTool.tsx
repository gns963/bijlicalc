'use client'

import { useMemo, useState } from 'react'
import { acDailyUnits, marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'

export interface StarCompareDiscom {
  code: string
  state: string
}

const TONNAGES = [1.0, 1.5, 2.0]

export default function StarComparisonTool({
  discoms,
}: {
  discoms: StarCompareDiscom[]
}) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [tonnage, setTonnage] = useState(1.5)
  const [hours, setHours] = useState(8)

  const data = useMemo(() => {
    let rate = 0
    try {
      rate = marginalRatePerUnit(discomCode)
    } catch {
      return null
    }
    const units3 = acDailyUnits(tonnage, 3, hours) * 365
    const units5 = acDailyUnits(tonnage, 5, hours) * 365
    const cost3 = units3 * rate
    const cost5 = units5 * rate
    return {
      rate,
      cost3: Math.round(cost3),
      cost5: Math.round(cost5),
      annualSaving: Math.round(cost3 - cost5),
      tenYearSaving: Math.round((cost3 - cost5) * 10),
    }
  }, [discomCode, tonnage, hours])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  const max = data ? Math.max(data.cost3, data.cost5, 1) : 1

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="cmp-discom" className={labelCls}>
            DISCOM / state
          </label>
          <select
            id="cmp-discom"
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
        <div>
          <label htmlFor="cmp-ton" className={labelCls}>
            Tonnage
          </label>
          <select
            id="cmp-ton"
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
          <label htmlFor="cmp-hours" className={labelCls}>
            Daily usage: {hours}h
          </label>
          <input
            id="cmp-hours"
            type="range"
            min={1}
            max={24}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      {data && (
        <div className="mt-6 grid gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">3-star annual cost</span>
                <span className="tabular-nums">{formatINR(data.cost3)}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-3 rounded-full bg-rose-400"
                  style={{ width: `${(data.cost3 / max) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">5-star annual cost</span>
                <span className="tabular-nums">{formatINR(data.cost5)}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-3 rounded-full bg-emerald-400"
                  style={{ width: `${(data.cost5 / max) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              A 5-star saves you
            </p>
            <p className="text-3xl font-bold tabular-nums text-emerald-800 dark:text-emerald-200">
              {formatINR(data.annualSaving)}/year
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              ≈ {formatINR(data.tenYearSaving)} over 10 years (at{' '}
              {formatINR(data.rate)}/unit)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
