// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportCSV } from '@/lib/csv'
import type { ComputeResult } from '@/lib/amortization'

const sampleResult: ComputeResult = {
  monthlyPayment: 1000,
  totalInterest: 2000,
  totalPaid: 12000,
  apr: 5,
  startDate: '2024-01-01',
  schedule: [
    { month: 1, date: '2024-01-01', payment: 1000, interest: 100, principal: 900, balance: 9100 },
    { month: 2, date: '2024-02-01', payment: 1000, interest: 90, principal: 910, balance: 8190 },
  ],
}

describe('exportCSV', () => {
  let createObjectURLSpy: ReturnType<typeof vi.fn>
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>
  let clickSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    createObjectURLSpy = vi.fn(() => 'blob:mock-url')
    revokeObjectURLSpy = vi.fn()
    // jsdom does not implement createObjectURL/revokeObjectURL
    // @ts-expect-error -- stubbing for test environment
    URL.createObjectURL = createObjectURLSpy
    // @ts-expect-error -- stubbing for test environment
    URL.revokeObjectURL = revokeObjectURLSpy
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a CSV blob and triggers a download via an anchor click', () => {
    exportCSV(sampleResult, new Date('2024-03-15T00:00:00Z'))

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1)
    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob
    expect(blobArg.type).toBe('text/csv;charset=utf-8;')

    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')
  })

  it('names the downloaded file using the provided date', () => {
    const createElementSpy = vi.spyOn(document, 'createElement')

    exportCSV(sampleResult, new Date('2024-03-05T00:00:00Z'))

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement
    expect(anchor.download).toBe('loan-amortization-20240305.csv')
  })

  it('pads single-digit month and day values in the filename', () => {
    const createElementSpy = vi.spyOn(document, 'createElement')

    exportCSV(sampleResult, new Date('2024-01-02T00:00:00Z'))

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement
    expect(anchor.download).toBe('loan-amortization-20240102.csv')
  })

  it('produces properly quoted CSV content with a header row and formatted numbers', async () => {
    exportCSV(sampleResult, new Date('2024-01-01T00:00:00Z'))

    const blobArg = createObjectURLSpy.mock.calls[0][0] as Blob
    const text = await blobArg.text()
    const lines = text.split('\n')

    expect(lines[0]).toBe('"#","Date","Payment","Interest","Principal","Balance"')
    expect(lines[1]).toBe('"1","2024-01-01","1000.00","100.00","900.00","9100.00"')
    expect(lines[2]).toBe('"2","2024-02-01","1000.00","90.00","910.00","8190.00"')
    expect(lines).toHaveLength(3)
  })
})
