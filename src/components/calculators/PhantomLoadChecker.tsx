'use client'

import { useMemo, useState } from 'react'
import { marginalRatePerUnit } from '@/lib/calc/ac'
import { formatINR } from '@/lib/format'
import { CalculatorCard, CalculatorCta, CalculatorHeader } from './CalculatorShell'

export interface DiscomOption {
  code: string
  state: string
}

/** Commonly cited standby/always-on draws for typical Indian households —
 *  indicative planning figures, not measurements of a specific device. */
const STANDBY_DEVICES = [
  { name: 'Wi-Fi router', watts: 8 },
  { name: 'Set-top box (DTH/cable)', watts: 12 },
  { name: 'TV on standby (not switched off at plug)', watts: 3 },
  { name: 'Desktop PC/monitor on standby', watts: 5 },
  { name: 'Microwave (clock/display)', watts: 3 },
  { name: 'Phone/laptop charger left plugged in (no device)', watts: 1 },
  { name: 'Inverter/UPS in standby (not charging)', watts: 10 },
  { name: 'Washing machine on standby', watts: 2 },
]

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

export default function PhantomLoadChecker({ discoms }: { discoms: DiscomOption[] }) {
  const [discomCode, setDiscomCode] = useState(discoms[0]?.code ?? '')
  const [checked, setChecked] = useState<Set<string>>(
    new Set(['Wi-Fi router', 'Set-top box (DTH/cable)', 'TV on standby (not switched off at plug)']),
  )

  function toggle(name: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const result = useMemo(() => {
    const rate = marginalRatePerUnit(discomCode)
    const activeDevices = STANDBY_DEVICES.filter((d) => checked.has(d.name))
    const totalWatts = activeDevices.reduce((sum, d) => sum + d.watts, 0)
    const dailyUnits = (totalWatts * 24) / 1000
    const monthlyUnits = dailyUnits * 30
    const annualUnits = dailyUnits * 365
    return {
      rate,
      totalWatts,
      dailyUnits: round2(dailyUnits),
      monthlyCost: round2(monthlyUnits * rate),
      annualCost: round2(annualUnits * rate),
      count: activeDevices.length,
    }
  }, [discomCode, checked])

  const fieldCls =
    'w-full rounded-lg border border-hairline px-3 py-2.5 outline-none focus:border-brass focus:ring-2 focus:ring-brass/30 dark:border-white/10 dark:bg-slate-800 dark:text-gazette-cream'

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="👻"
        title="Phantom Load / Standby Power Checker"
        subtitle="What always-on devices cost you, even when 'off'"
      />

      <div className="mb-5">
        <label htmlFor="phantom-discom" className="mb-1.5 block text-sm font-medium text-ash dark:text-gazette-cream/80">
          DISCOM / state
        </label>
        <select
          id="phantom-discom"
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

      <fieldset className="mb-5">
        <legend className="mb-2 block text-sm font-medium text-ash dark:text-gazette-cream/80">
          Which of these stay plugged in 24/7 at your place?
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {STANDBY_DEVICES.map((d) => (
            <label
              key={d.name}
              className="flex items-center gap-2.5 rounded-lg border border-hairline px-3 py-2.5 text-sm dark:border-white/10"
            >
              <input
                type="checkbox"
                checked={checked.has(d.name)}
                onChange={() => toggle(d.name)}
                className="accent-brass"
              />
              <span className="flex-1 text-ash dark:text-gazette-cream/80">{d.name}</span>
              <span className="shrink-0 tabular-nums text-ash/50 dark:text-gazette-cream/40">
                {d.watts}W
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <CalculatorCta label="Calculate Standby Cost" tone="appliance" />

      <div className="mt-6 rounded-xl border border-hub-appliance/15 bg-hub-appliance/5 p-5 dark:border-hub-appliance/20 dark:bg-hub-appliance/10">
        <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
          {result.count} device{result.count === 1 ? '' : 's'} · {result.totalWatts}W continuous · {result.dailyUnits} units/day
        </p>
        <p className="font-display text-4xl font-bold tabular-nums text-hub-appliance">
          {formatINR(result.monthlyCost)}
          <span className="ml-1 text-sm font-normal text-ash/50 dark:text-gazette-cream/40">/month</span>
        </p>
        <p className="mt-1 text-sm text-ash/60 dark:text-gazette-cream/50">
          ≈ {formatINR(result.annualCost)}/year, just from devices that never actually switch off.
        </p>
      </div>
    </CalculatorCard>
  )
}
