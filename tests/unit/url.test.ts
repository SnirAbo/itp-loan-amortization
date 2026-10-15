import { describe, it, expect } from 'vitest'
import { encodeQuery, decodeQuery } from '@/lib/url'

describe('encodeQuery', () => {
  it('encodes all provided fields under their short keys', () => {
    const qs = encodeQuery({ principal: '100000', apr: '5.5', termYears: '30', startDate: '2024-01-01' })
    const sp = new URLSearchParams(qs)
    expect(sp.get('p')).toBe('100000')
    expect(sp.get('r')).toBe('5.5')
    expect(sp.get('t')).toBe('30')
    expect(sp.get('start')).toBe('2024-01-01')
  })

  it('omits the start date when not provided', () => {
    const qs = encodeQuery({ principal: '100000', apr: '5.5', termYears: '30' })
    const sp = new URLSearchParams(qs)
    expect(sp.has('start')).toBe(false)
  })

  it('omits empty string fields', () => {
    const qs = encodeQuery({ principal: '', apr: '', termYears: '', startDate: '' })
    expect(qs).toBe('')
  })
})

describe('decodeQuery', () => {
  it('parses valid query params', () => {
    const sp = new URLSearchParams('p=200000&r=4.5&t=15&start=2023-06-01')
    const res = decodeQuery(sp)
    expect(res.ok).toBe(true)
    expect(res.parsed).toEqual({ principal: 200000, apr: 4.5, termYears: 15, startDate: '2023-06-01' })
  })

  it('works without an optional start date', () => {
    const sp = new URLSearchParams('p=200000&r=4.5&t=15')
    const res = decodeQuery(sp)
    expect(res.ok).toBe(true)
    expect(res.parsed?.startDate).toBeUndefined()
  })

  it('rejects a non-positive or missing principal', () => {
    expect(decodeQuery(new URLSearchParams('p=0&r=4.5&t=15')).ok).toBe(false)
    expect(decodeQuery(new URLSearchParams('r=4.5&t=15')).ok).toBe(false)
  })

  it('rejects an APR outside the 0-100 range', () => {
    expect(decodeQuery(new URLSearchParams('p=100000&r=150&t=15')).ok).toBe(false)
    expect(decodeQuery(new URLSearchParams('p=100000&r=-1&t=15')).ok).toBe(false)
  })

  it('rejects a non-integer or out-of-range term', () => {
    expect(decodeQuery(new URLSearchParams('p=100000&r=5&t=0')).ok).toBe(false)
    expect(decodeQuery(new URLSearchParams('p=100000&r=5&t=51')).ok).toBe(false)
    expect(decodeQuery(new URLSearchParams('p=100000&r=5&t=10.5')).ok).toBe(false)
  })

  it('rejects a malformed start date', () => {
    const sp = new URLSearchParams('p=100000&r=5&t=10&start=06-01-2023')
    expect(decodeQuery(sp).ok).toBe(false)
  })

  it('round-trips with encodeQuery', () => {
    const qs = encodeQuery({ principal: '150000', apr: '3.25', termYears: '20', startDate: '2022-12-01' })
    const res = decodeQuery(new URLSearchParams(qs))
    expect(res.ok).toBe(true)
    expect(res.parsed).toEqual({ principal: 150000, apr: 3.25, termYears: 20, startDate: '2022-12-01' })
  })
})
