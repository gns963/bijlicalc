/**
 * bijlicalc — water tank filling time engine.
 *
 * Pure flow-rate arithmetic: time = volume ÷ flow rate. The only real-world
 * caveat (stated in the result, not silently ignored) is that a pump's
 * nameplate flow rate is usually measured at zero head, so actual flow once
 * water is being lifted to an overhead tank is often lower.
 */

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100

export interface TankFillInput {
  capacityLiters: number
  flowRateLpm: number
}

export interface TankFillResult {
  capacityLiters: number
  flowRateLpm: number
  minutes: number
  hours: number
  notes: string[]
}

export function estimateTankFillTime(input: TankFillInput): TankFillResult {
  const { capacityLiters, flowRateLpm } = input
  if (capacityLiters <= 0) throw new Error('capacityLiters must be > 0')
  if (flowRateLpm <= 0) throw new Error('flowRateLpm must be > 0')

  const minutes = capacityLiters / flowRateLpm

  return {
    capacityLiters,
    flowRateLpm,
    minutes: round2(minutes),
    hours: round2(minutes / 60),
    notes: [
      "A pump's rated flow (LPM) is usually measured at zero head. Lifting water to an overhead or rooftop tank adds resistance that lowers real flow — so actual fill time is often somewhat longer than this figure, more so for taller lifts or narrower pipework.",
    ],
  }
}
