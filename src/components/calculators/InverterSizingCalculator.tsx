'use client'

import { useMemo, useState } from 'react'
import { sizeInverter, type BatteryVoltage } from '@/lib/calc/inverter'
import { CalculatorCard, CalculatorCta, CalculatorHeader, OptionCardGroup, SliderField } from './CalculatorShell'

const VOLTAGE_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: '12', label: '12V (1 battery)', icon: '🔋' },
  { value: '24', label: '24V (2 batteries)', icon: '🔋🔋' },
  { value: '48', label: '48V (4 batteries)', icon: '🔋🔋🔋' },
]

export default function InverterSizingCalculator() {
  const [loadWatts, setLoadWatts] = useState(600)
  const [backupHours, setBackupHours] = useState(4)
  const [voltage, setVoltage] = useState('12')

  const { result, error } = useMemo(() => {
    try {
      return {
        result: sizeInverter({
          totalLoadWatts: loadWatts,
          backupHours,
          batteryVoltage: Number(voltage) as BatteryVoltage,
        }),
        error: null as string | null,
      }
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : 'Calculation error',
      }
    }
  }, [loadWatts, backupHours, voltage])

  return (
    <CalculatorCard>
      <CalculatorHeader
        icon="🔌"
        title="Home UPS / Inverter Sizing Calculator"
        subtitle="What VA inverter and battery Ah you need"
      />

      <form className="grid gap-5" onSubmit={(e) => e.preventDefault()}>
        <SliderField
          id="inv-load"
          label="Total load to back up"
          value={loadWatts}
          onChange={setLoadWatts}
          min={100}
          max={3000}
          step={50}
          unit="W"
          hint="Add up the wattage of everything you want running during a power cut — fans, lights, fridge, TV, router."
        />

        <SliderField
          id="inv-hours"
          label="Backup duration needed"
          value={backupHours}
          onChange={setBackupHours}
          min={1}
          max={12}
          unit="hrs"
        />

        <OptionCardGroup
          legend="Battery bank voltage"
          options={VOLTAGE_OPTIONS}
          value={voltage}
          onChange={setVoltage}
          columns={3}
        />

        <CalculatorCta label="Calculate Sizing" tone="appliance" />
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
                  Inverter/UPS size
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-appliance">
                  {result.recommendedVA.toLocaleString('en-IN')} VA
                </p>
              </div>
              <div>
                <p className="text-sm text-ash/60 dark:text-gazette-cream/50">
                  Battery capacity
                </p>
                <p className="font-display text-3xl font-bold tabular-nums text-hub-appliance">
                  {result.recommendedBatteryAh} Ah
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
