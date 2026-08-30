'use client'

import { useMemo, useState } from 'react'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import {
  CalculatorCard,
  CalculatorCta,
  CalculatorHeader,
  OptionCardGroup,
  SliderField,
} from './CalculatorShell'

export interface AcDiscomOption {
  code: string
  state: string
}

const TON_OPTIONS = [
  { value: '0.8', label: '0.8 Ton', icon: '🧊' },
  { value: '1', label: '1 Ton', icon: '❄️' },
  { value: '1.5', label: '1.5 Ton', icon: '❄️' },
  { value: '2', label: '2 Ton', icon: '🥶' },
]
const STAR_OPTIONS = [
  { value: '3', label: '3 Star', icon: '⭐⭐⭐' },
  { value: '4', label: '4 Star', icon: '⭐⭐⭐⭐' },
  { value: '5', label: '5 Star', icon: '⭐⭐⭐⭐⭐' },
]

export default function AcBillCalculator({
  discoms,
}: {
  discoms: AcDiscomOption[]
}) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [tonnage, setTonnage] = useState('1.5')
  const [starRating, setStarRating] = useState('3')
  const [hours, setHours] = useState(8)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateAcCost({
          discomCode,
          tonnage: Number(tonnage),
          starRating: Number(starRating),
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

  const fieldCls =
    'w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="❄️"
        title="AC Running Cost Calculator"
        subtitle="Estimate your air conditioner's electricity cost"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="ac-discom"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
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

        <OptionCardGroup
          legend="Tonnage"
          options={TON_OPTIONS}
          value={tonnage}
          onChange={setTonnage}
        />

        <OptionCardGroup
          legend="Star rating"
          options={STAR_OPTIONS}
          value={starRating}
          onChange={setStarRating}
          columns={3}
        />

        <SliderField
          id="ac-hours"
          label="Daily usage"
          value={hours}
          onChange={setHours}
          min={1}
          max={24}
          unit="hrs/day"
        />

        <CalculatorCta label="Calculate Running Cost" />
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
                Estimated monthly running cost
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-white">
                {formatINR(result.monthlyCost)}
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                ≈ {formatINR(result.annualCost)}/year ·{' '}
                {result.monthlyUnits} units/month
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Input power
              </dt>
              <dd className="text-right tabular-nums">{result.inputKw} kW</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">ISEER</dt>
              <dd className="text-right tabular-nums">{result.iseer}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Units per day
              </dt>
              <dd className="text-right tabular-nums">{result.dailyUnits}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Billed at (top slab)
              </dt>
              <dd className="text-right tabular-nums">
                {formatINR(result.effectiveRatePerUnit)}/unit
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
