/**
 * DesiMetrics — home UPS / inverter sizing & battery backup-time engine.
 *
 * Standard electrical formulas, no fabricated stats:
 *   VA = Watts / power factor, with a headroom margin
 *   Battery Ah = (Watts × hours) / (voltage × round-trip efficiency)
 * These are textbook relationships; only the power-factor, headroom and
 * efficiency constants are assumptions, and each is stated in the result.
 */

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

/** Typical rated power factor for a home inverter/UPS. */
const POWER_FACTOR = 0.8
/** Recommended headroom over the calculated load, so the inverter isn't run at its ceiling. */
const HEADROOM = 1.25
/** Round-trip efficiency of inverter conversion + battery charge/discharge losses. */
const DEFAULT_EFFICIENCY = 0.8
/** Depth of discharge commonly recommended for longer lead-acid battery life. */
const SAFE_DEPTH_OF_DISCHARGE = 0.5

export type BatteryVoltage = 12 | 24 | 48

export interface InverterSizingInput {
  totalLoadWatts: number
  backupHours: number
  batteryVoltage: BatteryVoltage
  systemEfficiency?: number
}

export interface InverterSizingResult {
  totalLoadWatts: number
  backupHours: number
  batteryVoltage: BatteryVoltage
  recommendedVA: number
  recommendedBatteryAh: number
  notes: string[]
}

export function sizeInverter(input: InverterSizingInput): InverterSizingResult {
  const {
    totalLoadWatts,
    backupHours,
    batteryVoltage,
    systemEfficiency = DEFAULT_EFFICIENCY,
  } = input
  if (totalLoadWatts <= 0) throw new Error('totalLoadWatts must be > 0')
  if (backupHours <= 0) throw new Error('backupHours must be > 0')

  const rawVA = (totalLoadWatts / POWER_FACTOR) * HEADROOM
  const recommendedVA = Math.ceil(rawVA / 50) * 50

  const wattHoursNeeded = totalLoadWatts * backupHours
  const rawAh = wattHoursNeeded / (batteryVoltage * systemEfficiency)
  const recommendedBatteryAh = Math.ceil(rawAh / 5) * 5

  return {
    totalLoadWatts,
    backupHours,
    batteryVoltage,
    recommendedVA,
    recommendedBatteryAh,
    notes: [
      `Assumes a ${POWER_FACTOR} power factor with ${Math.round((HEADROOM - 1) * 100)}% headroom for VA sizing, and ${Math.round(systemEfficiency * 100)}% round-trip efficiency for battery Ah. A larger surge load (e.g. a motor's starting current) may need more VA than the running-load figure alone.`,
    ],
  }
}

export interface BackupTimeInput {
  batteryAh: number
  batteryVoltage: BatteryVoltage
  loadWatts: number
  systemEfficiency?: number
}

export interface BackupTimeResult {
  batteryAh: number
  batteryVoltage: BatteryVoltage
  loadWatts: number
  fullCapacityHours: number
  safeCapacityHours: number
  notes: string[]
}

export function estimateBackupTime(input: BackupTimeInput): BackupTimeResult {
  const { batteryAh, batteryVoltage, loadWatts, systemEfficiency = DEFAULT_EFFICIENCY } = input
  if (batteryAh <= 0) throw new Error('batteryAh must be > 0')
  if (loadWatts <= 0) throw new Error('loadWatts must be > 0')

  const totalWh = batteryAh * batteryVoltage * systemEfficiency
  const fullCapacityHours = totalWh / loadWatts
  const safeCapacityHours = fullCapacityHours * SAFE_DEPTH_OF_DISCHARGE

  return {
    batteryAh,
    batteryVoltage,
    loadWatts,
    fullCapacityHours: round2(fullCapacityHours),
    safeCapacityHours: round2(safeCapacityHours),
    notes: [
      `The full-capacity figure assumes the battery drains completely — repeatedly deep-cycling a lead-acid battery this far shortens its life. The safe figure uses a ${Math.round(SAFE_DEPTH_OF_DISCHARGE * 100)}% depth of discharge, a commonly recommended limit for longer battery lifespan.`,
    ],
  }
}
