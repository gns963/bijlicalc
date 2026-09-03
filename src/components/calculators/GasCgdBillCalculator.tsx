'use client'

import { useMemo, useState } from 'react'
import { calculateFullGasBill } from '@/lib/calc/gas'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

/** Real-tariff PNG bill calculator for a CGD with a populated tariff file —
 *  no rate input needed, since the tariff itself is real and dated. */
export default function GasCgdBillCalculator({
  cgdCode,
  cgdName,
}: {
  cgdCode: string
  cgdName: string
}) {
  const [scm, setScm] = useState(40)

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateFullGasBill({ cgdCode, scmConsumed: scm }), error: null as string | null }
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Calculation error' }
    }
  }, [cgdCode, scm])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔥"
        title={`${cgdName} Bill Calculator`}
        subtitle={`Priced at ${cgdCode}'s real domestic tariff`}
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="gas-cgd-consumption"
          label={`Consumption per ${result?.billingCycle === 'bimonthly' ? 'billing cycle (~60 days)' : 'month'}`}
          value={scm}
          onChange={setScm}
          min={1}
          max={200}
          unit="SCM"
          hint="Check your meter or last bill — SCM = standard cubic metre."
        />

        <CalculatorCta label="Calculate Gas Bill" tone="gas" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-gas/15 bg-hub-gas/5 p-5">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60">
                Estimated bill
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-gas">
                {formatINR(result.total)}
              </p>
              {result.monthlyEquivalent && (
                <p className="mt-1 text-xs text-ash/50">
                  ≈ {formatINR(result.monthlyEquivalent.total)}/month equivalent
                </p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60">Gas charge</dt>
              <dd className="text-right tabular-nums">{formatINR(result.gasChargeGross)}</dd>
              <dt className="text-ash/60">Fixed charge</dt>
              <dd className="text-right tabular-nums">{formatINR(result.fixedCharge)}</dd>
            </dl>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
