import { describe, expect, it } from 'vitest'
import { estimateCoolingTime } from './cooling'

describe('estimateCoolingTime', () => {
  it('takes longer for a bigger temperature drop', () => {
    const small = estimateCoolingTime({ areaSqFt: 150, ceilingHeightFt: 9, dropTempC: 3, acTon: 1.5 })
    const big = estimateCoolingTime({ areaSqFt: 150, ceilingHeightFt: 9, dropTempC: 9, acTon: 1.5 })
    expect(big.minutesToCoolAirOnly).toBeGreaterThan(small.minutesToCoolAirOnly)
  })

  it('a bigger AC cools the same room faster', () => {
    const small = estimateCoolingTime({ areaSqFt: 150, ceilingHeightFt: 9, dropTempC: 5, acTon: 1.0 })
    const big = estimateCoolingTime({ areaSqFt: 150, ceilingHeightFt: 9, dropTempC: 5, acTon: 2.0 })
    expect(big.minutesToCoolAirOnly).toBeLessThan(small.minutesToCoolAirOnly)
  })

  it('rejects invalid inputs', () => {
    expect(() =>
      estimateCoolingTime({ areaSqFt: 150, ceilingHeightFt: 9, dropTempC: 0, acTon: 1.5 }),
    ).toThrow()
    expect(() =>
      estimateCoolingTime({ areaSqFt: 0, ceilingHeightFt: 9, dropTempC: 5, acTon: 1.5 }),
    ).toThrow()
  })
})
