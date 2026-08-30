'use client'

import { useMemo, useState } from 'react'
import { compareRegimes } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader } from './CalculatorShell'

export default function TaxRegimeCalculator() {
  const [income, setIncome] = useState(1500000)
  const [deductions, setDeductions] = useState(150000)

  const result = useMemo(
    () => compareRegimes(Math.max(0, income), Math.max(0, deductions)),
    [income, deductions],
  )

  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2.5 tabular-nums outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🏦"
        title="New vs Old Tax Regime"
        subtitle="Compare your income tax for FY 2026-27"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="tax-income"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            Gross annual income (₹)
          </label>
          <input
            id="tax-income"
            type="number"
            min={0}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
            className={`${fieldCls} text-lg`}
          />
        </div>
        <div>
          <label
            htmlFor="tax-deductions"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            Old-regime deductions (80C, 80D, HRA…)
          </label>
          <input
            id="tax-deductions"
            type="number"
            min={0}
            value={deductions}
            onChange={(e) => setDeductions(Number(e.target.value) || 0)}
            className={fieldCls}
          />
          <p className="mt-1 text-xs text-ash/50 dark:text-gazette-cream/40">
            Only the old regime allows most deductions. Standard deduction is
            applied automatically for both.
          </p>
        </div>

        <CalculatorCta label="Compare Tax Regimes" />
      </form>

      <div className="mt-6 rounded-xl bg-gazette-cream p-5 dark:bg-slate-800/60">
        <div className="grid gap-4">
          <div
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              result.recommended === 'either'
                ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                : 'bg-spark-teal/15 text-spark-teal'
            }`}
          >
            {result.recommended === 'either'
              ? 'Both regimes cost the same for you.'
              : `The ${result.recommended} regime saves you ${formatINR(result.saving)}.`}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ash/60 dark:text-gazette-cream/50">
                <th className="py-1 font-medium"></th>
                <th className="py-1 text-right font-medium">New</th>
                <th className="py-1 text-right font-medium">Old</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
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
                <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
                  Rebate 87A
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatINR(result.newRegime.rebate87A)}
                </td>
                <td className="py-1.5 text-right tabular-nums">
                  {formatINR(result.oldRegime.rebate87A)}
                </td>
              </tr>
              <tr className="text-base font-bold text-ink-navy dark:text-white">
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
          <p className="text-xs text-ash/40 dark:text-gazette-cream/30">
            FY 2026-27 (AY 2027-28), incl. 4% cess. Surcharge (income &gt; ₹50L)
            and marginal relief not included.
          </p>
        </div>
      </div>
    </CalculatorCard>
  )
}
