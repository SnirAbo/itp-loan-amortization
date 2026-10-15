import { z } from 'zod'

const schema = z.object({
  principal: z.coerce.number().gt(0, 'Principal must be > 0').lte(100_000_000, 'Principal must be ≤ 100,000,000'),
  apr: z.coerce.number().min(0, 'APR must be ≥ 0').max(100, 'APR must be ≤ 100'),
  termYears: z.coerce.number().int().min(1, 'Term must be ≥ 1').max(50, 'Term must be ≤ 50'),
  startDate: z.string().date().optional().or(z.literal('')),
})

export type ValidationResult = {
  ok: boolean
  errors: Partial<Record<'principal' | 'apr' | 'termYears' | 'startDate', string>>
  parsed?: { principal: number; apr: number; termYears: number; startDate?: string }
}

export function validateAll(input: { principal: string; apr: string; termYears: string; startDate: string }): ValidationResult {
  const res = schema.safeParse(input)
  if (res.success) {
    return { ok: true, errors: {}, parsed: { ...res.data, startDate: res.data.startDate || undefined } }
    }
  const errors: ValidationResult['errors'] = {}
  for (const e of res.error.issues) {
    const k = e.path[0] as keyof ValidationResult['errors']
    errors[k] = e.message
  }
  return { ok: false, errors }
}
