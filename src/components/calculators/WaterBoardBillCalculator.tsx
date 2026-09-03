'use client'

import { useMemo, useState } from 'react'
import {
  availableConnectionTypes,
  calculateFullWaterBill,
  getConnectionTariff,
  getWaterTariff,
  type WaterConnectionType,
} from '@/lib/calc/water'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader, SliderField } from './CalculatorShell'

const COMPOSITION_COLORS = {
  water: 'bg-hub-water',
  sewerage: 'bg-caution-amber',
  fixed: 'bg-ash/40',
} as const

const CONNECTION_LABELS: Record<WaterConnectionType, string> = {
  domestic: 'Domestic',
  commercial: 'Commercial',
  industrial: 'Industrial',
}

/** Real-tariff water bill calculator for a board with a populated tariff
 *  file — no rate input needed, since the tariff itself is real and dated. */
export default function WaterBoardBillCalculator({
  boardCode,
  boardName,
}: {
  boardCode: string
  boardName: string
}) {
  const tariff = getWaterTariff(boardCode)
  const connectionTypes = availableConnectionTypes(tariff)
  const [connectionType, setConnectionType] = useState<WaterConnectionType>(connectionTypes[0])
  const connection = getConnectionTariff(tariff, connectionType)
  const meterSizes = Object.keys(connection.fixedChargeByMeterSize)
  const [kl, setKl] = useState(15)
  const [meterSize, setMeterSize] = useState(meterSizes[0])

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateFullWaterBill({ boardCode, consumptionKl: kl, meterSize, connectionType }),
        error: null as string | null,
      }
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : 'Calculation error' }
    }
  }, [boardCode, kl, meterSize, connectionType])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="💧"
        title={`${boardName} Bill Calculator`}
        subtitle={`Priced at ${boardCode}'s real ${CONNECTION_LABELS[connectionType].toLowerCase()} tariff`}
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        {connectionTypes.length > 1 && (
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ash">
              Connection type
            </span>
            <div className="flex flex-wrap gap-2">
              {connectionTypes.map((ct) => (
                <button
                  key={ct}
                  type="button"
                  onClick={() => {
                    setConnectionType(ct)
                    const nextMeterSizes = Object.keys(getConnectionTariff(tariff, ct).fixedChargeByMeterSize)
                    if (!nextMeterSizes.includes(meterSize)) setMeterSize(nextMeterSizes[0])
                  }}
                  aria-pressed={ct === connectionType}
                  className={`rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition ${
                    ct === connectionType
                      ? 'border-hub-water bg-hub-water/10 text-ink-navy'
                      : 'border-hairline text-ash/70 hover:border-hub-water/40'
                  }`}
                >
                  {CONNECTION_LABELS[ct]}
                </button>
              ))}
            </div>
          </div>
        )}

        <SliderField
          id="water-board-consumption"
          label={`Consumption per ${result?.billingCycle === 'bimonthly' ? 'billing cycle (~60 days)' : 'month'}`}
          value={kl}
          onChange={setKl}
          min={1}
          max={60}
          unit="KL"
          hint="1 KL = 1,000 litres. Check your meter or last bill."
        />

        {meterSizes.length > 1 && (
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ash">
              Meter size
            </span>
            <div className="flex flex-wrap gap-2">
              {meterSizes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMeterSize(m)}
                  aria-pressed={m === meterSize}
                  className={`rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition ${
                    m === meterSize
                      ? 'border-hub-water bg-hub-water/10 text-ink-navy'
                      : 'border-hairline text-ash/70 hover:border-hub-water/40'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        <CalculatorCta label="Calculate Water Bill" tone="water" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-water/15 bg-hub-water/5 p-5">
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
              <p className="font-display text-4xl font-bold tabular-nums text-hub-water">
                {formatINR(result.total)}
              </p>
              {result.monthlyEquivalent && (
                <p className="mt-1 text-xs text-ash/50">
                  ≈ {formatINR(result.monthlyEquivalent.total)}/month equivalent
                </p>
              )}
              {result.freeAllowanceApplied && (
                <p className="mt-2 rounded-lg bg-spark-teal/10 px-2.5 py-1.5 text-xs font-semibold text-spark-teal">
                  ✓ Within the free allowance — water charge waived
                </p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-ash/60">Water charge</dt>
              <dd className="text-right tabular-nums">{formatINR(result.waterCharge)}</dd>
              <dt className="text-ash/60">Sewerage charge</dt>
              <dd className="text-right tabular-nums">{formatINR(result.sewerageCharge)}</dd>
              <dt className="text-ash/60">Fixed charge</dt>
              <dd className="text-right tabular-nums">{formatINR(result.fixedCharge)}</dd>
            </dl>

            {result.total > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-ash/60">Cost composition</p>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-mist">
                  {(
                    [
                      ['water', result.waterCharge],
                      ['sewerage', result.sewerageCharge],
                      ['fixed', result.fixedCharge],
                    ] as const
                  ).map(([key, amount]) =>
                    amount > 0 ? (
                      <div
                        key={key}
                        className={COMPOSITION_COLORS[key]}
                        style={{ width: `${(amount / result.total) * 100}%` }}
                        title={`${key}: ${formatINR(amount)}`}
                      />
                    ) : null,
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ash/50">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-hub-water" aria-hidden /> Water
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-caution-amber" aria-hidden /> Sewerage
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-ash/40" aria-hidden /> Fixed
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 border-t border-hairline pt-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-hairline px-3 py-1.5 text-xs font-semibold text-ash hover:border-hub-water/40"
              >
                🖨️ Print bill
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${boardName} water bill estimate`,
                      text: `My estimated ${boardCode} water bill: ${formatINR(result.total)}`,
                      url: window.location.href,
                    }).catch(() => {})
                  } else {
                    navigator.clipboard?.writeText(window.location.href)
                  }
                }}
                className="rounded-lg border border-hairline px-3 py-1.5 text-xs font-semibold text-ash hover:border-hub-water/40"
              >
                🔗 Share
              </button>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="rounded-lg border border-hairline px-3 py-1.5 text-xs font-semibold text-ash hover:border-hub-water/40"
              >
                📋 Copy link
              </button>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
