'use client'

import { useMemo, useState } from 'react'
import type { WaterConnectionType, WaterTariffFile } from '@/data/water-tariffs/_schema'
import { findMaxKlForBudget, getConnectionTariff } from '@/lib/calc/water'
import { formatINR } from '@/lib/format'
import { CalculatorHeader, OptionCardGroup } from '../calculators/CalculatorShell'

const CONNECTION_OPTIONS: { value: WaterConnectionType; label: string; icon: string }[] = [
  { value: 'domestic', label: 'Domestic', icon: '🏠' },
  { value: 'commercial', label: 'Commercial', icon: '🏢' },
  { value: 'industrial', label: 'Industrial', icon: '🏭' },
]

const cycleLabel = (cycle: WaterTariffFile['billingCycle']) =>
  cycle === 'bimonthly' ? 'bi-monthly' : 'monthly'

/**
 * Reverse calculator: enter a target bill amount, get the maximum KL that
 * stays within it. Mirrors BudgetToUnitsCalculator's exact structure and
 * interaction pattern — the underlying findMaxKlForBudget binary-searches
 * computeWaterBill(), so it's exact for whatever board tariff is passed in.
 */
export default function BudgetToKlCalculator({
  tariff,
  defaultBudget = 300,
}: {
  tariff: WaterTariffFile
  defaultBudget?: number
}) {
  const types = tariff.connectionTypes.map((c) => c.connectionType)
  const options = CONNECTION_OPTIONS.filter((o) => types.includes(o.value))

  const [connectionType, setConnectionType] = useState<WaterConnectionType>(types[0])
  const [budget, setBudget] = useState(defaultBudget)

  const connection = getConnectionTariff(tariff, connectionType)
  const meterSizes = Object.keys(connection.fixedChargeByMeterSize)
  const [meterSize, setMeterSize] = useState(meterSizes[0])

  const { maxKl, bill, tooLow } = useMemo(() => {
    const result = findMaxKlForBudget(tariff, budget, { connectionType, meterSize })
    return { ...result, tooLow: result.maxKl === 0 && result.bill.total > budget }
  }, [tariff, budget, connectionType, meterSize])

  return (
    // A brass tint (not the hub's aqua) visually separates this reverse
    // calculator as a distinct "tool" from the primary calculator above —
    // matching the exact treatment used on Electricity's budget tool.
    <div className="rounded-xl border border-brass/20 bg-brass/5 p-6 shadow-sm">
      <CalculatorHeader
        icon="🎯"
        title="Budget → KL Calculator"
        subtitle="Tell us your target bill, we'll tell you how many KL that buys"
      />

      <div className="grid gap-5">
        <OptionCardGroup
          legend="Connection type"
          options={options}
          value={connectionType}
          onChange={(v) => {
            setConnectionType(v)
            const nextMeterSizes = Object.keys(getConnectionTariff(tariff, v).fixedChargeByMeterSize)
            if (!nextMeterSizes.includes(meterSize)) setMeterSize(nextMeterSizes[0])
          }}
        />

        {meterSizes.length > 1 && (
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-ash">
              Meter size
            </legend>
            <div className="flex flex-wrap gap-2">
              {meterSizes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMeterSize(m)}
                  aria-pressed={m === meterSize}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition ${
                    m === meterSize
                      ? 'border-brass bg-brass/10 text-ink-navy'
                      : 'border-hairline text-ash/70'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div>
          <label htmlFor="water-budget" className="mb-1.5 block text-sm font-medium text-ash">
            Target bill (₹)
          </label>
          <input
            id="water-budget"
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
            className="w-full rounded-lg border border-hairline px-3 py-2.5 text-lg tabular-nums outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-hairline bg-paper p-5">
        {tooLow ? (
          <p className="text-sm text-ash/70">
            Even 0 KL costs {formatINR(bill.total)} on this tariff (fixed
            charge alone) — your budget of {formatINR(budget)} doesn&apos;t
            cover it.
          </p>
        ) : (
          <>
            <p className="text-sm text-ash/60">You can use up to</p>
            <p className="font-display text-4xl font-bold tabular-nums text-brass">
              {maxKl} KL
            </p>
            <p className="text-sm text-ash/60">
              for a {cycleLabel(tariff.billingCycle)} bill of {formatINR(bill.total)}{' '}
              (within your {formatINR(budget)} budget)
            </p>
          </>
        )}
      </div>
    </div>
  )
}
