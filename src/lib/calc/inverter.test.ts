import { describe, expect, it } from 'vitest'
import { estimateBackupTime, sizeInverter } from './inverter'

describe('sizeInverter', () => {
  it('recommends more VA and Ah for a bigger load', () => {
    const small = sizeInverter({ totalLoadWatts: 400, backupHours: 4, batteryVoltage: 12 })
    const big = sizeInverter({ totalLoadWatts: 1200, backupHours: 4, batteryVoltage: 12 })
    expect(big.recommendedVA).toBeGreaterThan(small.recommendedVA)
    expect(big.recommendedBatteryAh).toBeGreaterThan(small.recommendedBatteryAh)
  })

  it('recommends more Ah for a longer backup duration', () => {
    const short = sizeInverter({ totalLoadWatts: 600, backupHours: 2, batteryVoltage: 12 })
    const long = sizeInverter({ totalLoadWatts: 600, backupHours: 8, batteryVoltage: 12 })
    expect(long.recommendedBatteryAh).toBeGreaterThan(short.recommendedBatteryAh)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      sizeInverter({ totalLoadWatts: 0, backupHours: 4, batteryVoltage: 12 }),
    ).toThrow()
  })
})

describe('estimateBackupTime', () => {
  it('safe capacity is half of full capacity', () => {
    const r = estimateBackupTime({ batteryAh: 150, batteryVoltage: 12, loadWatts: 300 })
    expect(r.safeCapacityHours).toBeCloseTo(r.fullCapacityHours * 0.5, 5)
  })

  it('a bigger battery lasts longer for the same load', () => {
    const small = estimateBackupTime({ batteryAh: 100, batteryVoltage: 12, loadWatts: 300 })
    const big = estimateBackupTime({ batteryAh: 200, batteryVoltage: 12, loadWatts: 300 })
    expect(big.fullCapacityHours).toBeGreaterThan(small.fullCapacityHours)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      estimateBackupTime({ batteryAh: 100, batteryVoltage: 12, loadWatts: 0 }),
    ).toThrow()
  })
})
