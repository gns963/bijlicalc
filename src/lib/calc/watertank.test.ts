import { describe, expect, it } from 'vitest'
import { estimateTankFillTime } from './watertank'

describe('estimateTankFillTime', () => {
  it('computes minutes as volume / flow rate', () => {
    const r = estimateTankFillTime({ capacityLiters: 1000, flowRateLpm: 50 })
    expect(r.minutes).toBeCloseTo(20, 5)
    expect(r.hours).toBeCloseTo(20 / 60, 1)
  })

  it('a faster pump fills the same tank quicker', () => {
    const slow = estimateTankFillTime({ capacityLiters: 1000, flowRateLpm: 25 })
    const fast = estimateTankFillTime({ capacityLiters: 1000, flowRateLpm: 100 })
    expect(fast.minutes).toBeLessThan(slow.minutes)
  })

  it('rejects invalid inputs', () => {
    expect(() => estimateTankFillTime({ capacityLiters: 0, flowRateLpm: 50 })).toThrow()
    expect(() => estimateTankFillTime({ capacityLiters: 1000, flowRateLpm: 0 })).toThrow()
  })
})
