'use client'

import { useId, useMemo, useState } from 'react'
import { APPLIANCE_CATEGORIES, findAppliance } from '@/data/appliances'
import { computeApplianceBuilder, type BuilderApplianceItem } from '@/lib/calc/applianceBuilder'
import { computeBill, getTariff } from '@/lib/calc/electricity'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader } from './CalculatorShell'

export interface DiscomOption {
  code: string
  state: string
}

let nextId = 1

export default function ApplianceBuilder({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [mode, setMode] = useState<'appliances' | 'meter'>('appliances')
  const [items, setItems] = useState<BuilderApplianceItem[]>([])
  const [pendingAppliance, setPendingAppliance] = useState(
    APPLIANCE_CATEGORIES[0]?.appliances[0]?.name ?? '',
  )
  const [meterUnits, setMeterUnits] = useState(300)
  const selectId = useId()

  const { result, error } = useMemo(() => {
    try {
      return { result: computeApplianceBuilder(discomCode, items), error: null as string | null }
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Calculation error' }
    }
  }, [discomCode, items])

  const meterBill = useMemo(() => {
    try {
      const tariff = getTariff(discomCode)
      const res =
        tariff.connectionTypes.find((c) => c.connectionType === 'residential') ?? tariff.connectionTypes[0]
      return computeBill(tariff, {
        connectionType: res.connectionType,
        unitsConsumed: meterUnits,
        phase: 'single',
        sanctionedLoad: res.fixedCharge.basis === 'perLoad' ? 3 : undefined,
      })
    } catch {
      return null
    }
  }, [discomCode, meterUnits])

  function addAppliance() {
    const ref = findAppliance(pendingAppliance)
    if (!ref) return
    setItems((prev) => [
      ...prev,
      { id: String(nextId++), name: ref.name, watts: ref.watts, hoursPerDay: ref.typicalHoursPerDay },
    ])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateHours(id: string, hoursPerDay: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, hoursPerDay } : i)))
  }

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🏠"
        title="Household Bill Builder"
        subtitle="Add your appliances, priced through your real DISCOM slab tariff"
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${selectId}-discom`} className="mb-1.5 block text-sm font-medium text-ash">
            DISCOM / state
          </label>
          <select
            id={`${selectId}-discom`}
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
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ash">
            Input method
          </span>
          <div className="flex gap-2">
            {(
              [
                ['appliances', 'I know my appliances'],
                ['meter', 'I have my meter reading'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setMode(val)}
                aria-pressed={mode === val}
                className={`flex-1 rounded-lg border-2 px-3 py-2 text-xs font-semibold transition ${
                  mode === val
                    ? 'border-brass bg-brass/10 text-ink-navy'
                    : 'border-hairline text-ash/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'meter' ? (
        <div className="grid gap-5">
          <div>
            <label htmlFor={`${selectId}-meter`} className="mb-1.5 flex items-center justify-between text-sm font-medium text-ash">
              <span>Monthly units (from your meter/bill)</span>
              <span className="tabular-nums text-ink-navy">{meterUnits}</span>
            </label>
            <input
              id={`${selectId}-meter`}
              type="range"
              min={0}
              max={1500}
              step={10}
              value={meterUnits}
              onChange={(e) => setMeterUnits(Number(e.target.value))}
              className="w-full accent-brass"
            />
          </div>
          {meterBill && (
            <div className="rounded-xl border border-hub-electricity/15 bg-hub-electricity/5 p-5">
              <p className="text-sm text-ash/60">Estimated bill</p>
              <p className="font-display text-4xl font-bold tabular-nums text-hub-electricity">
                {formatINR(meterBill.total)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <select
              value={pendingAppliance}
              onChange={(e) => setPendingAppliance(e.target.value)}
              className={fieldCls}
            >
              {APPLIANCE_CATEGORIES.map((cat) => (
                <optgroup key={cat.category} label={cat.category}>
                  {cat.appliances.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.watts}W)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              type="button"
              onClick={addAppliance}
              className="shrink-0 rounded-lg bg-brass px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brass/90"
            >
              + Add appliance
            </button>
          </div>

          {items.length === 0 ? (
            <p className="mb-5 rounded-xl border border-dashed border-hairline p-6 text-center text-sm text-ash/60">
              Add appliances one at a time to build your household total.
            </p>
          ) : (
            <div className="mb-5 space-y-3">
              {result?.items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-3 rounded-xl border border-hairline bg-paper p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink-navy">
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="range"
                          min={0.1}
                          max={24}
                          step={0.1}
                          value={item.hoursPerDay}
                          onChange={(e) => updateHours(item.id, Number(e.target.value))}
                          className="w-full accent-brass"
                          aria-label={`${item.name} daily hours`}
                        />
                        <span className="w-16 shrink-0 text-right text-xs tabular-nums text-ash/60">
                          {item.hoursPerDay.toFixed(1)} hrs/day
                        </span>
                      </div>
                    </div>
                    <p className="shrink-0 text-right text-sm font-semibold tabular-nums text-hub-electricity">
                      {item.monthlyUnits} u/mo
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 rounded-lg px-2 py-1 text-ash/40 transition hover:bg-red-50 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                  {item.slabCrossed && item.slabAfter && (
                    <p className="mt-1 rounded-lg bg-caution-amber/10 px-3 py-1.5 text-xs font-medium text-caution-amber">
                      ⚠ Adding this pushes your total to {item.cumulativeUnitsAfter} units — into the{' '}
                      {formatINR(item.slabAfter.ratePerUnit)}/unit slab.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <CalculatorCta label="Calculate Household Total" tone="brass" />

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {result && items.length > 0 && (
            <div className="mt-4 grid gap-4 rounded-xl border border-hub-electricity/15 bg-hub-electricity/5 p-5">
              <div>
                <p className="text-sm text-ash/60">
                  Combined household bill ({result.totalMonthlyUnits} units)
                </p>
                <p className="font-display text-4xl font-bold tabular-nums text-hub-electricity">
                  {formatINR(result.bill.total)}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-ash/60">Energy charge</dt>
                <dd className="text-right tabular-nums">{formatINR(result.bill.energyChargeGross)}</dd>
                <dt className="text-ash/60">Fixed charge</dt>
                <dd className="text-right tabular-nums">{formatINR(result.bill.fixedCharge.amount)}</dd>
              </dl>
            </div>
          )}
        </>
      )}
    </CalculatorCard>
  )
}
