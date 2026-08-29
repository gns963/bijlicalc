'use client'

import { useMemo, useState } from 'react'
import { calculateGratuity } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

export default function GratuityCalculator() {
  const [salaryStr, setSalaryStr] = useState('50000')
  const [yearsStr, setYearsStr] = useState('10')

  const { result, error } = useMemo(() => {
    const salary = Number(salaryStr)
    const years = Number(yearsStr)
    if (!Number.isFinite(salary) || salary < 0)
      return { result: null, error: 'Enter a valid salary.' }
    if (!Number.isFinite(years) || years < 0)
      return { result: null, error: 'Enter valid years of service.' }
    return { result: calculateGratuity(salary, years), error: null as string | null }
  }, [salaryStr, yearsStr])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="grat-salary" className={labelCls}>
            Last drawn monthly salary — Basic + DA (₹)
          </label>
          <input
            id="grat-salary"
            type="number"
            min={0}
            value={salaryStr}
            onChange={(e) => setSalaryStr(e.target.value)}
            className={`${fieldCls} text-lg`}
          />
        </div>
        <div>
          <label htmlFor="grat-years" className={labelCls}>
            Years of service
          </label>
          <input
            id="grat-years"
            type="number"
            min={0}
            step="0.1"
            value={yearsStr}
            onChange={(e) => setYearsStr(e.target.value)}
            className={fieldCls}
          />
          <p className="mt-1 text-xs text-slate-400">
            A part-year over 6 months counts as a full year.
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
          <div className="grid gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gratuity payable
            </p>
            <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
              {formatINR(result.gratuity)}
            </p>
            {result.eligible ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Based on {result.roundedYears} years of service (15/26 formula).
              </p>
            ) : (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Not eligible — gratuity requires at least 5 years of continuous
                service under the Payment of Gratuity Act.
              </p>
            )}
            {result.capped && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Capped at the statutory ceiling of ₹20,00,000.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
