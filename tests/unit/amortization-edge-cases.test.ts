import { describe, it, expect } from 'vitest'
import { compute } from '@/lib/amortization'

describe('amortization engine - schedule shape', () => {
  it('produces one row per month for the full term', () => {
    const res = compute({ principal: 50_000, apr: 4, termYears: 5 })
    expect(res.schedule).toHaveLength(5 * 12)
    expect(res.schedule[0].month).toBe(1)
    expect(res.schedule.at(-1)?.month).toBe(60)
  })

  it('keeps the payment amount constant across all but possibly the last row', () => {
    const res = compute({ principal: 80_000, apr: 3.75, termYears: 15 })
    const payments = new Set(res.schedule.map(r => r.payment))
    expect(payments.size).toBe(1)
    expect(res.schedule.every(r => r.payment === res.monthlyPayment)).toBe(true)
  })

  it('drives the balance to exactly zero on the final payment', () => {
    const res = compute({ principal: 15_000, apr: 7.25, termYears: 3 })
    expect(res.schedule.at(-1)?.balance).toBe(0)
  })

  it('reduces the balance monotonically', () => {
    const res = compute({ principal: 200_000, apr: 5.25, termYears: 20 })
    for (let i = 1; i < res.schedule.length; i++) {
      expect(res.schedule[i].balance).toBeLessThanOrEqual(res.schedule[i - 1].balance)
    }
  })

  it('splits each payment into interest + principal equal to the payment (except the final row)', () => {
    const res = compute({ principal: 60_000, apr: 6, termYears: 10 })
    for (const row of res.schedule.slice(0, -1)) {
      expect(row.interest + row.principal).toBeCloseTo(row.payment, 2)
    }
  })

  it('computes total interest as the sum of all per-row interest amounts', () => {
    const res = compute({ principal: 45_000, apr: 4.5, termYears: 6 })
    const summed = res.schedule.reduce((s, r) => s + r.interest, 0)
    expect(res.totalInterest).toBeCloseTo(summed, 2)
  })

  it('advances the schedule date by one month per row when a startDate is given', () => {
    const res = compute({ principal: 10_000, apr: 3, termYears: 1, startDate: '2024-01-15' })
    expect(res.schedule[0].date).toBe('2024-01-15')
    expect(res.schedule[1].date).toBe('2024-02-15')
    expect(res.schedule.at(-1)?.date).toBe('2024-12-15')
  })

  it('handles a single-year term', () => {
    const res = compute({ principal: 12_000, apr: 0, termYears: 1 })
    expect(res.schedule).toHaveLength(12)
    expect(res.monthlyPayment).toBeCloseTo(1000, 2)
    expect(res.schedule.at(-1)?.balance).toBe(0)
  })

  it('handles high interest rates without producing negative balances', () => {
    const res = compute({ principal: 25_000, apr: 29.99, termYears: 4 })
    expect(res.schedule.every(r => r.balance >= 0)).toBe(true)
    expect(res.totalInterest).toBeGreaterThan(0)
  })
})
