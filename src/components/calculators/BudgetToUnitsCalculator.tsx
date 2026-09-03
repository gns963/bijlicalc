'use client'

import { useMemo, useState } from 'react'
import type { ConnectionCategory, TariffFile } from '@/data/tariffs/_schema'
import { findMaxUnitsForBudget } from '@/lib/calc/electricity'
import { cycleLabel, formatINR } from '@/lib/format'
import { CalculatorHeader, OptionCardGroup } from './CalculatorShell'

const CATEGORY_OPTIONS: { value: ConnectionCategory; label: string; icon: string }[] = [
  { value: 'residential', label: 'Residential', icon: '🏠' },
  { value: 'commercial', label: 'Commercial', icon: '🏢' },
  { value: 'industrial', label: 'Industrial', icon: '🏭' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
]

/**
 * Reverse calculator: enter a target bill amount, get the maximum units that
 * stay within it. Genuinely reusable across every DISCOM — the underlying
 * findMaxUnitsForBudget binary-searches computeBill(), so it's exact for
 * whatever tariff is passed in.
 */
export default function BudgetToUnitsCalculator({
  tariff,
  defaultBudget = 1000,
}: {
  tariff: TariffFile
  defaultBudget?: number
}) {
  const categories = tariff.connectionTypes.map((c) => c.connectionType)
  const options = CATEGORY_OPTIONS.filter((o) => categories.includes(o.value))

  const [connectionType, setConnectionType] = useState<ConnectionCategory>(categories[0])
  const [budget, setBudget] = useState(defaultBudget)
  const [phase, setPhase] = useState<'single' | 'three'>('single')
  const [eligible, setEligible] = useState(true)

  const selected = tariff.connectionTypes.find((c) => c.connectionType === connectionType)
  const subsidyScheme = tariff.subsidySchemes[0]

  const { maxUnits, bill, tooLow } = useMemo(() => {
    const result = findMaxUnitsForBudget(tariff, budget, {
      connectionType,
      phase,
      sanctionedLoad: selected?.fixedCharge.basis === 'perLoad' ? 3 : undefined,
      eligibility: eligible ? subsidyScheme?.eligibility : undefined,
    })
    return { ...result, tooLow: result.maxUnits === 0 && result.bill.total > budget }
  }, [tariff, budget, connectionType, phase, selected, eligible, subsidyScheme])

  return (
    // A brass tint (not plain white) visually separates this reverse
    // calculator as a distinct "tool" from the primary calculator above.
    <div className="rounded-xl border border-brass/20 bg-brass/5 p-6 shadow-sm">
      <CalculatorHeader
        icon="🎯"
        title="Budget → Units Calculator"
        subtitle="Tell us your target bill, we'll tell you how many units that buys"
      />

      <div className="grid gap-5">
        <OptionCardGroup
          legend="Connection type"
          options={options}
          value={connectionType}
          onChange={setConnectionType}
        />

        {selected?.fixedCharge.basis === 'perPhase' && (
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-ash">
              Phase
            </legend>
            <div className="flex gap-2">
              {(['single', 'three'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  aria-pressed={phase === p}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm capitalize transition ${
                    phase === p
                      ? 'border-brass bg-brass/10 font-semibold text-ink-navy'
                      : 'border-hairline text-ash/70'
                  }`}
                >
                  {p}-phase
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div>
          <label
            htmlFor="budget"
            className="mb-1.5 block text-sm font-medium text-ash"
          >
            Target bill (₹)
          </label>
          <input
            id="budget"
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
            className="w-full rounded-lg border border-hairline px-3 py-2.5 text-lg tabular-nums outline-none focus:border-brass focus:ring-2 focus:ring-brass/30"
          />
        </div>

        {subsidyScheme && (
          <label className="flex items-start gap-3 rounded-lg border border-hairline bg-paper p-3 text-sm">
            <input
              type="checkbox"
              checked={eligible}
              onChange={(e) => setEligible(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-hairline text-brass focus:ring-brass"
            />
            <span className="text-ash">
              Eligible for <strong>{subsidyScheme.schemeName}</strong>
            </span>
          </label>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-hairline bg-paper p-5">
        {tooLow ? (
          <p className="text-sm text-ash/70">
            Even 0 units costs {formatINR(bill.total)} on this tariff (fixed
            charge alone) — your budget of {formatINR(budget)} doesn&apos;t
            cover it.
          </p>
        ) : (
          <>
            <p className="text-sm text-ash/60">
              You can use up to
            </p>
            <p className="font-display text-4xl font-bold tabular-nums text-brass">
              {maxUnits} units
            </p>
            <p className="text-sm text-ash/60">
              for a {cycleLabel(tariff.billingCycle)} bill of{' '}
              {formatINR(bill.total)} (within your {formatINR(budget)} budget)
            </p>
          </>
        )}
      </div>
    </div>
  )
}
