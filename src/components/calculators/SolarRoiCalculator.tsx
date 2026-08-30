'use client'

import { useMemo, useState } from 'react'
import { calculateSolarRoi } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export interface SolarDiscomOption {
  code: string
  state: string
}

export default function SolarRoiCalculator({
  discoms,
}: {
  discoms: SolarDiscomOption[]
}) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [units, setUnits] = useState(300)
  const [kw, setKw] = useState(3)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateSolarRoi({
          discomCode,
          monthlyUnits: units,
          systemSizeKw: kw,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, units, kw])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="☀️"
        title="Solar ROI Calculator"
        subtitle="Payback period and savings from a rooftop system"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="solar-discom"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            Your DISCOM / state
          </label>
          <select
            id="solar-discom"
            value={discomCode}
            onChange={(e) => setDiscomCode(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {discoms.map((d) => (
              <option key={d.code} value={d.code}>
                {d.state} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <SliderField
          id="solar-units"
          label="Average monthly consumption"
          value={units}
          onChange={setUnits}
          min={0}
          max={1500}
          step={10}
          unit="units"
        />

        <SliderField
          id="solar-kw"
          label="System size"
          value={kw}
          onChange={setKw}
          min={0.5}
          max={10}
          step={0.5}
          unit="kW"
          hint="Tip: ~1 kW per 100–150 monthly units is a common starting point."
        />

        <CalculatorCta label="Calculate Solar Savings" />
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
                Payback period
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-white">
                {result.paybackYears != null
                  ? `${result.paybackYears} yrs`
                  : '—'}
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                then ~{formatINR(result.annualSavings)}/year saved
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                System cost
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.systemCost)}
              </dd>
              <dt className="text-spark-teal">PM Surya Ghar subsidy</dt>
              <dd className="text-right tabular-nums text-spark-teal">
                −{formatINR(result.subsidy)}
              </dd>
              <dt className="font-medium text-ash dark:text-gazette-cream/80">
                Net cost
              </dt>
              <dd className="text-right font-medium tabular-nums">
                {formatINR(result.netCost)}
              </dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Annual generation
              </dt>
              <dd className="text-right tabular-nums">
                {Math.round(result.annualGeneration)} units
              </dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Monthly savings
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.monthlySavings)}
              </dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                25-year net savings
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.lifetimeSavings)}
              </dd>
            </dl>

            <p className="text-xs text-ash/40 dark:text-gazette-cream/30">
              {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
