'use client'

import { useMemo, useState } from 'react'
import { compareRegimes } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'

export default function TaxRegimeCalculator() {
  const [incomeStr, setIncomeStr] = useState('1500000')
  const [deductionsStr, setDeductionsStr] = useState('150000')

  const { result, error } = useMemo(() => {
    const income = Number(incomeStr)
    const deductions = Number(deductionsStr) || 0
    if (!Number.isFinite(income) || income < 0)
      return { result: null, error: 'Enter a valid annual income.' }
    return {
      result: compareRegimes(income, deductions),
      error: null as string | null,
    }
  }, [incomeStr, deductionsStr])

  const labelCls = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200'
  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="tax-income" className={labelCls}>
            Gross annual income (₹)
          </label>
          <input
            id="tax-income"
            type="number"
            min={0}
            value={incomeStr}
            onChange={(e) => setIncomeStr(e.target.value)}
            className={`${fieldCls} text-lg`}
          />
        </div>
        <div>
          <label htmlFor="tax-deductions" className={labelCls}>
            Old-regime deductions (80C, 80D, HRA…)
          </label>
          <input
            id="tax-deductions"
            type="number"
            min={0}
            value={deductionsStr}
            onChange={(e) => setDeductionsStr(e.target.value)}
            className={fieldCls}
          />
          <p className="mt-1 text-xs text-slate-400">
            Only the old regime allows most deductions. Standard deduction is
            applied automatically for both.
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
            <div
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                result.recommended === 'either'
                  ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
              }`}
            >
              {result.recommended === 'either'
                ? 'Both regimes cost the same for you.'
                : `The ${result.recommended} regime saves you ${formatINR(result.saving)}.`}
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 dark:text-slate-400">
                  <th className="py-1 font-medium"></th>
                  <th className="py-1 text-right font-medium">New</th>
                  <th className="py-1 text-right font-medium">Old</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr>
                  <td className="py-1.5 text-slate-600 dark:text-slate-300">
                    Taxable income
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(result.newRegime.taxableIncome)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(result.oldRegime.taxableIncome)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-600 dark:text-slate-300">
                    Rebate 87A
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(result.newRegime.rebate87A)}
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(result.oldRegime.rebate87A)}
                  </td>
                </tr>
                <tr className="font-bold text-slate-900 dark:text-white">
                  <td className="py-2">Total tax</td>
                  <td className="py-2 text-right tabular-nums">
                    {formatINR(result.newRegime.totalTax)}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {formatINR(result.oldRegime.totalTax)}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-slate-400">
              FY 2026-27 (AY 2027-28), incl. 4% cess. Surcharge (income &gt; ₹50L)
              and marginal relief not included.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
