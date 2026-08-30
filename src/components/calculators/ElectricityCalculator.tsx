'use client'

import { useMemo, useRef, useState } from 'react'
import type {
  ConnectionCategory,
  TariffFile,
} from '@/data/tariffs/_schema'
import { computeBill } from '@/lib/calc/electricity'
import { cycleLabel, formatINR } from '@/lib/format'
import {
  CalculatorCard,
  CalculatorCta,
  CalculatorHeader,
  OptionCardGroup,
  SliderField,
} from './CalculatorShell'

export interface ElectricityCalculatorProps {
  /** Any DISCOM tariff file. Swap this prop to reuse the widget for another DISCOM. */
  tariff: TariffFile
  defaultUnits?: number
}

const CATEGORY_OPTIONS: { value: ConnectionCategory; label: string; icon: string }[] = [
  { value: 'residential', label: 'Residential', icon: '🏠' },
  { value: 'commercial', label: 'Commercial', icon: '🏢' },
  { value: 'industrial', label: 'Industrial', icon: '🏭' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
]

export default function ElectricityCalculator({
  tariff,
  defaultUnits = 250,
}: ElectricityCalculatorProps) {
  const categories = tariff.connectionTypes.map((c) => c.connectionType)
  const options = CATEGORY_OPTIONS.filter((o) => categories.includes(o.value))

  const [connectionType, setConnectionType] = useState<ConnectionCategory>(
    categories[0],
  )
  const [unitsStr, setUnitsStr] = useState(String(defaultUnits))
  const [phase, setPhase] = useState<'single' | 'three'>('single')
  const [load, setLoad] = useState(3)
  const [eligible, setEligible] = useState(true)
  const resultRef = useRef<HTMLDivElement>(null)

  const selected = tariff.connectionTypes.find(
    (c) => c.connectionType === connectionType,
  )
  const needsLoad = selected?.fixedCharge.basis === 'perLoad'
  const subsidyScheme = tariff.subsidySchemes[0]
  const cycleWord = tariff.billingCycle
  const isMultiMonth = cycleWord !== 'monthly'

  const { bill, error } = useMemo(() => {
    const units = Number(unitsStr)
    if (!Number.isFinite(units) || units < 0) {
      return { bill: null, error: 'Enter a valid number of units.' }
    }
    try {
      const b = computeBill(tariff, {
        connectionType,
        unitsConsumed: units,
        phase,
        sanctionedLoad: needsLoad ? load : undefined,
        eligibility: eligible ? subsidyScheme?.eligibility : undefined,
      })
      return { bill: b, error: null as string | null }
    } catch (e) {
      return {
        bill: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [
    tariff,
    connectionType,
    unitsStr,
    phase,
    load,
    eligible,
    needsLoad,
    subsidyScheme,
  ])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="⚡"
        title="Electricity Bill Calculator"
        subtitle={`Accurate estimates for ${tariff.state} · ${tariff.discomCode}`}
      />

      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        <OptionCardGroup
          legend="Connection type"
          options={options}
          value={connectionType}
          onChange={setConnectionType}
        />

        {selected?.fixedCharge.basis === 'perPhase' && (
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80">
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
                      ? 'border-brass bg-brass/10 font-semibold text-ink-navy dark:text-gazette-cream'
                      : 'border-slate-200 text-ash/70 hover:border-slate-300 dark:border-slate-700 dark:text-gazette-cream/60'
                  }`}
                >
                  {p}-phase
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {needsLoad && (
          <SliderField
            id="load"
            label="Sanctioned load"
            value={load}
            onChange={setLoad}
            min={0.5}
            max={20}
            step={0.5}
            unit="kW"
          />
        )}

        <div>
          <label
            htmlFor="units"
            className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80"
          >
            Units consumed (kWh)
            {isMultiMonth && (
              <span className="font-normal text-ash/50 dark:text-gazette-cream/40">
                {' '}
                — for the {cycleLabel(cycleWord)} cycle
              </span>
            )}
          </label>
          <div className="relative">
            <input
              id="units"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="e.g. 250"
              value={unitsStr}
              onChange={(e) => setUnitsStr(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-14 text-lg tabular-nums outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ash/40 dark:text-gazette-cream/40">
              kWh
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gazette-cream px-3 py-2 text-xs text-ash/70 dark:bg-slate-800 dark:text-gazette-cream/60">
          <span>Billing period</span>
          <span className="font-semibold capitalize text-ink-navy dark:text-gazette-cream">
            {cycleLabel(cycleWord)}
          </span>
        </div>

        {subsidyScheme && (
          <label className="flex items-start gap-3 rounded-lg bg-gazette-cream p-3 text-sm dark:bg-slate-800">
            <input
              type="checkbox"
              checked={eligible}
              onChange={(e) => setEligible(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brass focus:ring-brass"
            />
            <span className="text-ash dark:text-gazette-cream/80">
              Eligible for <strong>{subsidyScheme.schemeName}</strong>
              <span className="block text-xs text-ash/50 dark:text-gazette-cream/40">
                {subsidyScheme.eligibility}
              </span>
            </span>
          </label>
        )}

        <CalculatorCta label="Calculate My Bill" />
      </form>

      {/* ---- Result ---- */}
      <div ref={resultRef} className="mt-6 rounded-xl bg-gazette-cream p-5 dark:bg-slate-800/60">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        {bill && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                Estimated {cycleLabel(cycleWord)} bill
              </p>
              <p className="font-display text-4xl font-bold tabular-nums text-ink-navy dark:text-white">
                {formatINR(bill.total)}
              </p>
              {bill.monthlyEquivalent && (
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  ≈ {formatINR(bill.monthlyEquivalent.total)} / month (
                  {bill.monthlyEquivalent.units} units)
                </p>
              )}
            </div>

            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {bill.slab.lines
                  .filter((l) => l.unitsInSlab > 0)
                  .map((l, i) => (
                    <tr key={i}>
                      <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
                        {l.fromUnit + 1}–{l.toUnit ?? '∞'} @ ₹{l.ratePerUnit} ×{' '}
                        {l.unitsInSlab}
                      </td>
                      <td className="py-1.5 text-right tabular-nums text-ash dark:text-gazette-cream/90">
                        {formatINR(l.charge)}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td className="py-1.5 font-medium text-ash dark:text-gazette-cream/80">
                    Energy charge
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(bill.energyChargeGross)}
                  </td>
                </tr>
                {bill.subsidy.subsidyAmount > 0 && (
                  <tr className="text-spark-teal">
                    <td className="py-1.5">Subsidy applied</td>
                    <td className="py-1.5 text-right tabular-nums">
                      −{formatINR(bill.subsidy.subsidyAmount)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
                    Fuel cost adjustment (₹{bill.fuelCostAdjustment.ratePerUnit}
                    /unit)
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(bill.fuelCostAdjustment.amount)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
                    Fixed charge ({bill.fixedCharge.detail})
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(bill.fixedCharge.amount)}
                  </td>
                </tr>
                {bill.electricityDuty.amount > 0 && (
                  <tr>
                    <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
                      Electricity duty ({bill.electricityDuty.percent}%)
                    </td>
                    <td className="py-1.5 text-right tabular-nums">
                      {formatINR(bill.electricityDuty.amount)}
                    </td>
                  </tr>
                )}
                {bill.meterRent > 0 && (
                  <tr>
                    <td className="py-1.5 text-ash/70 dark:text-gazette-cream/60">
                      Meter rent
                    </td>
                    <td className="py-1.5 text-right tabular-nums">
                      {formatINR(bill.meterRent)}
                    </td>
                  </tr>
                )}
                <tr className="text-base font-bold text-ink-navy dark:text-white">
                  <td className="pt-2">Total</td>
                  <td className="pt-2 text-right tabular-nums">
                    {formatINR(bill.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
