'use client'

import { useMemo, useState } from 'react'
import {
  recommendTonnage,
  type FloorLevel,
  type SunExposure,
} from '@/lib/calc/ac'

export default function AcTonnageCalculator() {
  const [areaStr, setAreaStr] = useState('150')
  const [sun, setSun] = useState<SunExposure>('medium')
  const [floor, setFloor] = useState<FloorLevel>('other')

  const { result, error } = useMemo(() => {
    const areaSqFt = Number(areaStr)
    if (!Number.isFinite(areaSqFt) || areaSqFt <= 0)
      return { result: null, error: 'Enter a valid room area in sq ft.' }
    return {
      result: recommendTonnage({ areaSqFt, sunExposure: sun, floor }),
      error: null as string | null,
    }
  }, [areaStr, sun, floor])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="ton-area" className={labelCls}>
            Room area (sq ft)
          </label>
          <input
            id="ton-area"
            type="number"
            min={0}
            value={areaStr}
            onChange={(e) => setAreaStr(e.target.value)}
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="ton-sun" className={labelCls}>
            Sun exposure
          </label>
          <select
            id="ton-sun"
            value={sun}
            onChange={(e) => setSun(e.target.value as SunExposure)}
            className={fieldCls}
          >
            <option value="low">Low (shaded / north-facing)</option>
            <option value="medium">Medium</option>
            <option value="high">High (direct sun / west-facing)</option>
          </select>
        </div>
        <div>
          <label htmlFor="ton-floor" className={labelCls}>
            Floor level
          </label>
          <select
            id="ton-floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value as FloorLevel)}
            className={fieldCls}
          >
            <option value="other">Not top floor</option>
            <option value="top">Top floor (roof heat)</option>
          </select>
        </div>
      </form>

      <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Recommended AC size
            </p>
            <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
              {result.recommendedTon} ton
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Estimated cooling load: {result.coolingBtu.toLocaleString('en-IN')}{' '}
              BTU ({result.rawTons} ton raw)
            </p>
            {result.notes[0] && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {result.notes[0]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
