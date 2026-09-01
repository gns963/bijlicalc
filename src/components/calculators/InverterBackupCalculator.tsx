'use client'

import { useMemo, useState } from 'react'
import { estimateBackupTime, type BatteryVoltage } from '@/lib/calc/inverter'
import { CalculatorCard, CalculatorCta, CalculatorHeader, OptionCardGroup, SliderField } from './CalculatorShell'

const VOLTAGE_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: '12', label: '12V (1 battery)', icon: '🔋' },
  { value: '24', label: '24V (2 batteries)', icon: '🔋🔋' },
  { value: '48', label: '48V (4 batteries)', icon: '🔋🔋🔋' },
]

export default function InverterBackupCalculator() {
  const [batteryAh, setBatteryAh] = useState(150)
  const [voltage, setVoltage] = useState('12')
  const [loadWatts, setLoadWatts] = useState(400)

  const { result, error } = useMemo(() => {
    try {
      return {
        result: estimateBackupTime({
          batteryAh,
          batteryVoltage: Number(voltage) as BatteryVoltage,
          loadWatts,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [batteryAh, voltage, loadWatts])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔋"
        title="Inverter Battery Backup Calculator"
        subtitle="How long your battery will actually last"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="backup-ah"
          label="Battery capacity"
          value={batteryAh}
          onChange={setBatteryAh}
          min={20}
          max={300}
          step={5}
          unit="Ah"
          hint="Printed on the battery's nameplate, e.g. '150 Ah'."
        />

        <OptionCardGroup
          legend="Battery bank voltage"
          options={VOLTAGE_OPTIONS}
          value={voltage}
          onChange={setVoltage}
          columns={3}
        />

        <SliderField
          id="backup-load"
          label="Connected load"
          value={loadWatts}
          onChange={setLoadWatts}
          min={50}
          max={2000}
          step={25}
          unit="W"
        />

        <CalculatorCta label="Calculate Backup Time" tone="appliance" />
      </form>

      <div className="mt-6 rounded-xl border border-hub-appliance/15 bg-hub-appliance/5 p-5 dark:border-hub-appliance/20 dark:bg-hub-appliance/10">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
        {result && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Safe backup time
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-appliance">
                  {result.safeCapacityHours} hrs
                </p>
                <p className="text-xs text-ash/50 dark:text-gazette-cream/40">
                  50% depth of discharge
                </p>
              </div>
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Full-capacity time
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-ink-navy dark:text-gazette-cream">
                  {result.fullCapacityHours} hrs
                </p>
                <p className="text-xs text-ash/50 dark:text-gazette-cream/40">
                  fully drained
                </p>
              </div>
            </div>
            <p className="text-xs text-ash/50 dark:text-gazette-cream/40">
              {result.notes[0]}
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  )
}
