'use client'

import { useMemo, useState } from 'react'
import { calculateSip } from '@/lib/calc/financial'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

export default function SipCalculator() {
  const [monthly, setMonthly] = useState(10000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const result = useMemo(() => calculateSip(monthly, rate, years), [monthly, rate, years])

  const maxValue = Math.max(...result.yearly.map((p) => p.value), 1)

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="📈"
        title="SIP Calculator"
        subtitle="Project your mutual fund SIP maturity value"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="sip-monthly"
            className="mb-1.5 block text-sm font-medium text-ash"
          >
            Monthly investment (₹)
          </label>
          <input
            id="sip-monthly"
            type="number"
            min={0}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value) || 0)}
            className="w-full rounded-lg border border-hairline px-3 py-2.5 text-lg tabular-nums outline-none focus:border-hub-financial focus:ring-2 focus:ring-hub-financial/30"
          />
        </div>

        <SliderField
          id="sip-rate"
          label="Expected annual return"
          value={rate}
          onChange={setRate}
          min={1}
          max={30}
          unit="%"
        />

        <SliderField
          id="sip-years"
          label="Duration"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          unit="yrs"
        />

        <CalculatorCta label="Calculate SIP Returns" tone="financial" />
      </form>

      <div className="mt-6 rounded-xl border border-hairline bg-paper p-5">
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-ash/60">
              Maturity value
            </p>
            <p className="font-display text-4xl font-bold tabular-nums text-ink-navy">
              {formatINR(result.maturityValue)}
            </p>
            <p className="text-sm text-ash/60">
              Invested {formatINR(result.invested)} · Gains{' '}
              <span className="text-spark-teal">{formatINR(result.gains)}</span>
            </p>
          </div>

          {/* Simple stacked growth chart: invested (base) + gains (top) */}
          <div>
            <div className="flex h-40 items-end gap-1" aria-hidden>
              {result.yearly.map((p) => {
                const totalH = (p.value / maxValue) * 100
                const investedH = (p.invested / maxValue) * 100
                return (
                  <div
                    key={p.year}
                    className="flex-1"
                    title={`Year ${p.year}: ${formatINR(p.value)}`}
                  >
                    <div
                      className="relative w-full rounded-t bg-spark-teal/40"
                      style={{ height: `${totalH}%` }}
                    >
                      <div
                        className="absolute bottom-0 w-full rounded-t bg-brass"
                        style={{ height: `${(investedH / totalH) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex gap-4 text-xs text-ash/60">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm bg-brass" />
                Invested
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-sm bg-spark-teal/40" />
                Gains
              </span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  )
}
