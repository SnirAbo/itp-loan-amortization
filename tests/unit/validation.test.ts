import { describe, it, expect } from 'vitest'
import { validateAll } from '@/lib/validation'

describe('validation', () => {
  it('accepts valid', () => {
    const r = validateAll({ principal: '1000', apr: '5', termYears: '10', startDate: '' })
    expect(r.ok).toBe(true)
  })
  it('rejects invalid', () => {
    const r = validateAll({ principal: '-1', apr: '101', termYears: '0', startDate: 'bad' })
    expect(r.ok).toBe(false)
  })
})
