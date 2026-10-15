import { describe, it, expect, beforeAll } from 'vitest'
import { formatCurrency, formatPercent, formatDate } from '@/lib/format'

describe('formatCurrency', () => {
  it('formats USD by default style with cents', () => {
    expect(formatCurrency(1234.5, 'USD', 'en-US')).toBe('$1,234.50')
  })

  it('formats other currencies using the given locale', () => {
    expect(formatCurrency(1000, 'EUR', 'en-US')).toBe('€1,000.00')
  })

  it('rounds to at most 2 decimal places', () => {
    expect(formatCurrency(1234.567, 'USD', 'en-US')).toBe('$1,234.57')
  })

  it('formats zero', () => {
    expect(formatCurrency(0, 'USD', 'en-US')).toBe('$0.00')
  })
})

describe('formatPercent', () => {
  it('formats a decimal fraction as a percentage', () => {
    expect(formatPercent(0.065, 'en-US')).toBe('6.5%')
  })

  it('formats zero', () => {
    expect(formatPercent(0, 'en-US')).toBe('0%')
  })

  it('rounds to at most 2 decimal places', () => {
    expect(formatPercent(0.123456, 'en-US')).toBe('12.35%')
  })
})

describe('formatDate', () => {
  beforeAll(() => {
    // Pin the timezone so date formatting is deterministic across CI environments.
    process.env.TZ = 'UTC'
  })

  it('formats an ISO date string', () => {
    expect(formatDate('2024-03-15', 'en-US')).toBe('Mar 15, 2024')
  })

  it('formats dates at year boundaries correctly', () => {
    expect(formatDate('2023-12-31', 'en-US')).toBe('Dec 31, 2023')
    expect(formatDate('2024-01-01', 'en-US')).toBe('Jan 01, 2024')
  })
})
