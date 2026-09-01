'use client'

import { useMemo, useState } from 'react'
import { estimateNetMeteringEarnings } from '@/lib/calc/solar'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function NetMeteringCalculator() {
  const [generation, setGeneration] = useState(400)
  const [consumption, setConsumption] = useState(300)
  const [rate, setRate] = useState(4)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: estimateNetMeteringEarnings({
          monthlyGenerationUnits: generation,
          monthlyConsumptionUnits: consumption,
          exportRatePerUnit: rate,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [generation, consumption, rate])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔄"
        title="Net Metering Earnings Calculator"
        subtitle="What your exported solar units are worth"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="nm-generation"
          label="Monthly solar generation"
          value={generation}
          onChange={setGeneration}
          min={50}
          max={1500}
          step={10}
          unit="units"
        />

        <SliderField
          id="nm-consumption"
          label="Monthly consumption"
          value={consumption}
          onChange={setConsumption}
          min={50}
          max={1500}
          step={10}
          unit="units"
        />

        <SliderField
          id="nm-rate"
          label="Export credit rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={10}
          step={0.25}
          unit="₹/unit"
          hint="Check your DISCOM's net-metering policy — export rates vary by state."
        />

        <CalculatorCta label="Calculate Export Credit" tone="brass" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-solar/15 bg-hub-solar/5 p-5 dark:border-hub-solar/20 dark:bg-hub-solar/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Monthly export credit
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-solar">
                {formatINR(result.monthlyExportCredit)}
              </p>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                ≈ {formatINR(result.annualExportCredit)}/year
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Units exported
              </dt>
              <dd className="text-right tabular-nums">{result.exportedUnits}</dd>
              <dt className="text-ash/60 dark:text-gazette-cream/50">
                Units still imported
              </dt>
              <dd className="text-right tabular-nums">{result.importedUnits}</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
