'use client'

import { useMemo, useState } from 'react'
import { comparePngVsLpg } from '@/lib/calc/gas'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, SliderField } from './CalculatorShell'

/** Genuine numeric PNG-vs-LPG comparison — priced at the real CGD tariff
 *  against the user's own LPG cylinder price, not a qualitative claim. */
export default function PngVsLpgComparison({ cgdCode }: { cgdCode: string }) {
  const [scm, setScm] = useState(40)
  const [cylinderPrice, setCylinderPrice] = useState(900)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: comparePngVsLpg({
          scmConsumedPerCycle: scm,
          cgdCode,
          lpgCylinderPrice: cylinderPrice,
          cycleDays: 60,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Calculation error' }
    }
  }, [scm, cylinderPrice, cgdCode])

  return (
    <CalculatorCard>
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="pnglpg-scm"
          label="Your PNG consumption per cycle (~60 days)"
          value={scm}
          onChange={setScm}
          min={5}
          max={200}
          unit="SCM"
        />
        <SliderField
          id="pnglpg-cylinder"
          label="Your local 14.2kg LPG cylinder price"
          value={cylinderPrice}
          onChange={setCylinderPrice}
          min={500}
          max={1500}
          step={10}
          unit="₹"
          hint="Use today's real price for your area — this varies by state and subsidy status."
        />
        <CalculatorCta label="Compare PNG vs LPG" tone="gas" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-gas/15 bg-hub-gas/5 p-5 dark:border-hub-gas/20 dark:bg-hub-gas/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
                  PNG cost
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-hub-gas">
                  {formatINR(result.pngCost)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-ash/50 uppercase dark:text-gazette-cream/40">
                  Equivalent LPG cost
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-ink-navy dark:text-gazette-cream">
                  {formatINR(result.lpgEquivalentCost)}
                </p>
                <p className="mt-0.5 text-xs text-ash/50 dark:text-gazette-cream/40">
                  ≈ {result.lpgEquivalentCylinders} cylinders
                </p>
              </div>
            </div>
            <p className="text-sm text-ash/80 dark:text-gazette-cream/70">
              {result.cheaperOption === 'equal' ? (
                'At these numbers, PNG and LPG cost about the same.'
              ) : (
                <>
                  <strong className="text-spark-teal">
                    {result.cheaperOption === 'png' ? 'PNG' : 'LPG'}
                  </strong>{' '}
                  is cheaper here by about{' '}
                  <strong className="text-spark-teal">{formatINR(result.savingsAmount)}</strong>{' '}
                  per cycle.
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
