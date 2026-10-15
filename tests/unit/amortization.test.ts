import { describe, it, expect } from 'vitest'
import { compute } from '@/lib/amortization'

describe('amortization engine', () => {
  it('typical values', () => {
    const res = compute({ principal: 300_000, apr: 6.5, termYears: 30 })
    expect(res.monthlyPayment).toBeGreaterThan(0)
    const sumPrincipal = res.schedule.reduce((s, r) => s + r.principal, 0)
    expect(Math.abs(sumPrincipal - 300_000)).toBeLessThanOrEqual(0.01)
    expect(res.schedule.at(-1)?.balance).toBeCloseTo(0, 2)
  })

  it('zero interest', () => {
    const res = compute({ principal: 120_000, apr: 0, termYears: 10 })
    expect(res.totalInterest).toBeCloseTo(0, 2)
    expect(res.monthlyPayment).toBeCloseTo(1000, 2)
  })
})
