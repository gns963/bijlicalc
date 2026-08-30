'use client'

import { useMemo, useState } from 'react'
import { calculateGratuity } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function GratuityCalculator() {
  const [salary, setSalary] = useState(50000)
  const [years, setYears] = useState(10)

  const result = useMemo(
    () => calculateGratuity(Math.max(0, salary), Math.max(0, years)),
    [salary, years],
  )

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="💼"
        title="Gratuity Calculator"
        subtitle="What you're owed under the Payment of Gratuity Act"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="grat-salary"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            Last drawn monthly salary — Basic + DA (₹)
          </label>
          <input
            id="grat-salary"
            type="number"
            min={0}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-lg tabular-nums outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <SliderField
          id="grat-years"
          label="Years of service"
          value={years}
          onChange={setYears}
          min={0}
          max={40}
          unit="yrs"
          hint="A part-year over 6 months counts as a full year."
        />

        <CalculatorCta label="Calculate Gratuity" />
      </form>

      <div className="mt-6 rounded-xl bg-gazette-cream p-5 dark:bg-slate-800/60">
        <div className="grid gap-3">
          <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
            Gratuity payable
          </p>
          <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-white">
            {formatINR(result.gratuity)}
          </p>
          {result.eligible ? (
            <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
              Based on {result.roundedYears} years of service (15/26 formula).
            </p>
          ) : (
            <p className="rounded-lg bg-brass/10 px-3 py-2 text-sm text-brass">
              Not eligible — gratuity requires at least 5 years of continuous
              service under the Payment of Gratuity Act.
            </p>
          )}
          {result.capped && (
            <p className="text-xs text-brass">
              Capped at the statutory ceiling of ₹20,00,000.
            </p>
          )}
        </div>
      </div>
    </CalculatorCard>
  )
}
