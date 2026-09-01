'use client'

import { useMemo, useState } from 'react'
import { recommendAcCircuit } from '@/lib/calc/ac'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function AcCircuitSafetyCalculator() {
  const [current, setCurrent] = useState(6)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: recommendAcCircuit({ ratedCurrentAmps: current }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [current])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🛡️"
        title="AC Circuit Safety Calculator"
        subtitle="MCB rating & wire gauge guidance"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="ac-circuit-current"
          label="AC rated current"
          value={current}
          onChange={setCurrent}
          min={1}
          max={20}
          step={0.5}
          unit="A"
          hint="From the AC's nameplate — usually labelled 'Rated Current' in Amps."
        />

        <CalculatorCta label="Get Circuit Recommendation" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-ac/15 bg-hub-ac/5 p-5 dark:border-hub-ac/20 dark:bg-hub-ac/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Recommended MCB
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-ac">
                  {result.recommendedMcbAmps} A
                </p>
              </div>
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Recommended wire
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-ac">
                  {result.recommendedWireSqmm} sq mm
                </p>
              </div>
            </div>
            <p className="rounded-lg bg-caution-amber/10 px-3 py-2 text-xs font-medium text-caution-amber">
              ⚠ {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
