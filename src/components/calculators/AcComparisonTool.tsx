'use client'

import { useMemo, useState } from 'react'
import { calculateAcCost } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, OptionCardGroup, SliderField } from './CalculatorShell'

export interface AcCompareDiscom {
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

function AcSideConfig({
  label,
  tonnage,
  setTonnage,
  starRating,
  setStarRating,
}: {
  label: string
  tonnage: string
  setTonnage: (v: string) => void
  starRating: string
  setStarRating: (v: string) => void
}) {
  return (
    <div className="rounded-xl border border-hairline p-4 dark:border-white/10">
      <p className="mb-3 text-xs font-semibold tracking-wide text-ash/60 uppercase dark:text-gazette-cream/50">
        {label}
      </p>
      <div className="grid gap-4">
        <OptionCardGroup legend="Tonnage" options={TON_OPTIONS} value={tonnage} onChange={setTonnage} />
        <OptionCardGroup
          legend="Star rating"
          options={STAR_OPTIONS}
          value={starRating}
          onChange={setStarRating}
          columns={3}
        />
      </div>
    </div>
  )
}

export default function AcComparisonTool({ discoms }: { discoms: AcCompareDiscom[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [hours, setHours] = useState(8)
  const [tonnageA, setTonnageA] = useState('1')
  const [starA, setStarA] = useState('5')
  const [tonnageB, setTonnageB] = useState('1.5')
  const [starB, setStarB] = useState('3')

  const { resultA, resultB, error } = useMemo(() => {
    try {
      return {
        resultA: calculateAcCost({
          discomCode,
          tonnage: Number(tonnageA),
          starRating: Number(starA),
          dailyHours: hours,
        }),
        resultB: calculateAcCost({
          discomCode,
          tonnage: Number(tonnageB),
          starRating: Number(starB),
          dailyHours: hours,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        resultA: null,
        resultB: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [discomCode, hours, tonnageA, starA, tonnageB, starB])

  const diff = resultA && resultB ? resultA.annualCost - resultB.annualCost : null

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="⚖️"
        title="AC Comparison Tool"
        subtitle="Compare any two AC configurations side by side"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="cmp-tool-discom"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            DISCOM / state
          </label>
          <select
            id="cmp-tool-discom"
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

        <SliderField
          id="cmp-tool-hours"
          label="Daily usage (both units)"
          value={hours}
          onChange={setHours}
          min={1}
          max={24}
          unit="hrs/day"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AcSideConfig
            label="Option A"
            tonnage={tonnageA}
            setTonnage={setTonnageA}
            starRating={starA}
            setStarRating={setStarA}
          />
          <AcSideConfig
            label="Option B"
            tonnage={tonnageB}
            setTonnage={setTonnageB}
            starRating={starB}
            setStarRating={setStarB}
          />
        </div>

        <CalculatorCta label="Compare These Two ACs" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-ac/15 bg-hub-ac/5 p-5 dark:border-hub-ac/20 dark:bg-hub-ac/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {resultA && resultB && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Option A · {tonnageA}T {starA}★
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-hub-ac">
                  {formatINR(resultA.annualCost)}/yr
                </p>
              </div>
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Option B · {tonnageB}T {starB}★
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-hub-ac">
                  {formatINR(resultB.annualCost)}/yr
                </p>
              </div>
            </div>
            {diff != null && diff !== 0 && (
              <p className="rounded-lg bg-spark-teal/10 px-3 py-2 text-sm font-semibold text-spark-teal">
                {diff > 0
                  ? `Option B saves ${formatINR(Math.abs(diff))}/year`
                  : `Option A saves ${formatINR(Math.abs(diff))}/year`}
              </p>
            )}
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
