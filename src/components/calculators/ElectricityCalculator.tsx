'use client'

import { useMemo, useState } from 'react'
import type {
  ConnectionCategory,
  TariffFile,
} from '@/data/tariffs/_schema'
import { computeBill } from '@/lib/calc/electricity'
import { cycleLabel, formatINR } from '@/lib/format'

export interface ElectricityCalculatorProps {
  /** Any DISCOM tariff file. Swap this prop to reuse the widget for another DISCOM. */
  tariff: TariffFile
  defaultUnits?: number
}

const CATEGORY_LABEL: Record<ConnectionCategory, string> = {
  residential: 'Residential (Domestic)',
  commercial: 'Commercial',
  industrial: 'Industrial',
  agriculture: 'Agriculture',
}

export default function ElectricityCalculator({
  tariff,
  defaultUnits = 250,
}: ElectricityCalculatorProps) {
  const categories = tariff.connectionTypes.map((c) => c.connectionType)

  const [connectionType, setConnectionType] = useState<ConnectionCategory>(
    categories[0],
  )
  const [unitsStr, setUnitsStr] = useState(String(defaultUnits))
  const [phase, setPhase] = useState<'single' | 'three'>('single')
  const [loadStr, setLoadStr] = useState('2')
  const [eligible, setEligible] = useState(true)

  const selected = tariff.connectionTypes.find(
    (c) => c.connectionType === connectionType,
  )
  const needsLoad = selected?.fixedCharge.basis === 'perLoad'
  const subsidyScheme = tariff.subsidySchemes[0]
  const cycleWord = tariff.billingCycle // 'monthly' | 'bimonthly' | 'quarterly'
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
        sanctionedLoad: needsLoad ? Number(loadStr) || 0 : undefined,
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
    loadStr,
    eligible,
    needsLoad,
    subsidyScheme,
  ])

  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-900">
      {/* ---- Inputs ---- */}
      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="units"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Units consumed{' '}
            {isMultiMonth && (
              <span className="text-slate-400">
                (for the {cycleLabel(cycleWord)} cycle)
              </span>
            )}
          </label>
          <input
            id="units"
            type="number"
            inputMode="numeric"
            min={0}
            value={unitsStr}
            onChange={(e) => setUnitsStr(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-lg tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="connectionType"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Connection type
          </label>
          <select
            id="connectionType"
            value={connectionType}
            onChange={(e) =>
              setConnectionType(e.target.value as ConnectionCategory)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Phase
          </legend>
          <div className="flex gap-2">
            {(['single', 'three'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPhase(p)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                  phase === p
                    ? 'border-indigo-500 bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300'
                }`}
              >
                {p}-phase
              </button>
            ))}
          </div>
        </fieldset>

        {needsLoad && (
          <div>
            <label
              htmlFor="load"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Sanctioned load (kW)
            </label>
            <input
              id="load"
              type="number"
              min={0}
              step="0.5"
              value={loadStr}
              onChange={(e) => setLoadStr(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 tabular-nums outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        {subsidyScheme && (
          <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
            <input
              type="checkbox"
              checked={eligible}
              onChange={(e) => setEligible(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-700 dark:text-slate-200">
              Eligible for <strong>{subsidyScheme.schemeName}</strong>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {subsidyScheme.eligibility}
              </span>
            </span>
          </label>
        )}
      </form>

      {/* ---- Result ---- */}
      <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        {bill && (
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Estimated {cycleLabel(cycleWord)} bill
              </p>
              <p className="text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
                {formatINR(bill.total)}
              </p>
              {bill.monthlyEquivalent && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
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
                      <td className="py-1.5 text-slate-600 dark:text-slate-300">
                        {l.fromUnit + 1}–{l.toUnit ?? '∞'} @ ₹{l.ratePerUnit} ×{' '}
                        {l.unitsInSlab}
                      </td>
                      <td className="py-1.5 text-right tabular-nums text-slate-800 dark:text-slate-100">
                        {formatINR(l.charge)}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td className="py-1.5 font-medium text-slate-700 dark:text-slate-200">
                    Energy charge
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(bill.energyChargeGross)}
                  </td>
                </tr>
                {bill.subsidy.subsidyAmount > 0 && (
                  <tr className="text-emerald-700 dark:text-emerald-400">
                    <td className="py-1.5">Subsidy applied</td>
                    <td className="py-1.5 text-right tabular-nums">
                      −{formatINR(bill.subsidy.subsidyAmount)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-1.5 text-slate-600 dark:text-slate-300">
                    Fuel cost adjustment (₹{bill.fuelCostAdjustment.ratePerUnit}
                    /unit)
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(bill.fuelCostAdjustment.amount)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-600 dark:text-slate-300">
                    Fixed charge ({bill.fixedCharge.detail})
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatINR(bill.fixedCharge.amount)}
                  </td>
                </tr>
                {bill.electricityDuty.amount > 0 && (
                  <tr>
                    <td className="py-1.5 text-slate-600 dark:text-slate-300">
                      Electricity duty ({bill.electricityDuty.percent}%)
                    </td>
                    <td className="py-1.5 text-right tabular-nums">
                      {formatINR(bill.electricityDuty.amount)}
                    </td>
                  </tr>
                )}
                {bill.meterRent > 0 && (
                  <tr>
                    <td className="py-1.5 text-slate-600 dark:text-slate-300">
                      Meter rent
                    </td>
                    <td className="py-1.5 text-right tabular-nums">
                      {formatINR(bill.meterRent)}
                    </td>
                  </tr>
                )}
                <tr className="text-base font-bold text-slate-900 dark:text-white">
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
    </div>
  )
}
