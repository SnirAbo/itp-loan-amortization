import { useEffect, useRef, useState } from 'react'
import { ValidationResult } from '@/lib/validation'

interface Props {
  values: { principal: string; apr: string; termYears: string; startDate: string }
  onChange: {
    setPrincipal: (v: string) => void
    setApr: (v: string) => void
    setTermYears: (v: string) => void
    setStartDate: (v: string) => void
  }
  validation: ValidationResult
}

export function LoanInputForm({ values, onChange, validation }: Props) {
  const [local, setLocal] = useState(values)
  const t = useRef<number | null>(null)

  // Debounce 250ms then propagate to parent
  useEffect(() => {
    if (t.current) window.clearTimeout(t.current)
    t.current = window.setTimeout(() => {
      onChange.setPrincipal(local.principal)
      onChange.setApr(local.apr)
      onChange.setTermYears(local.termYears)
      onChange.setStartDate(local.startDate)
    }, 250)
    return () => {
      if (t.current) window.clearTimeout(t.current)
    }
  }, [local])

  useEffect(() => setLocal(values), [values.principal, values.apr, values.termYears, values.startDate])

  const e = validation.errors

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={(ev) => ev.preventDefault()}>
      <FormField label="Principal" hint="Loan amount" error={e.principal}>
        <input
          inputMode="decimal"
          value={local.principal}
          onChange={(ev) => setLocal((s) => ({ ...s, principal: ev.target.value.replace(/[^\d.]/g, '') }))}
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          aria-invalid={!!e.principal}
        />
      </FormField>
      <FormField label="APR %" hint="Annual interest" error={e.apr}>
        <input
          inputMode="decimal"
          value={local.apr}
          onChange={(ev) => setLocal((s) => ({ ...s, apr: ev.target.value.replace(/[^\d.]/g, '') }))}
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          aria-invalid={!!e.apr}
        />
      </FormField>
      <FormField label="Term (years)" hint="1–50" error={e.termYears}>
        <input
          inputMode="numeric"
          value={local.termYears}
          onChange={(ev) => setLocal((s) => ({ ...s, termYears: ev.target.value.replace(/[^\d]/g, '') }))}
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          aria-invalid={!!e.termYears}
        />
      </FormField>
      <FormField label="Start date" hint="optional" error={e.startDate}>
        <input
          type="date"
          value={local.startDate}
          onChange={(ev) => setLocal((s) => ({ ...s, startDate: ev.target.value }))}
          className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          aria-invalid={!!e.startDate}
        />
      </FormField>
    </form>
  )
}

function FormField({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  const id = label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs opacity-60">{hint}</span>}
      </div>
      <div className="mt-1" id={`${id}-control`}>
        {children}
      </div>
      <div role="alert" aria-live="polite" className="min-h-[1.25rem] mt-1 text-xs text-red-600">
        {error || ''}
      </div>
    </label>
  )
}
