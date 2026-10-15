import { formatCurrency, formatPercent, formatDate } from '@/lib/format'
import type { ComputeResult } from '@/lib/amortization'
import type { ValidationResult } from '@/lib/validation'

export function ResultsPanel({ validation, result }: { validation: ValidationResult; result: ComputeResult | null }) {
  const live = !validation.ok ? 'Enter valid values to see results' :
    result ? `Monthly ${formatCurrency(result.monthlyPayment)}; total interest ${formatCurrency(result.totalInterest)}` : 'Calculating…'

  const payoff = () => {
    if (!result) return null
    if (!result.startDate) return null
    const last = result.schedule[result.schedule.length - 1]
    return (
      <div className="text-sm opacity-80">Payoff date: {formatDate(last.date)}</div>
    )
  }

  return (
    <section aria-live="polite" className="rounded border border-slate-200 dark:border-slate-800 p-4">
      <h2 className="font-semibold mb-2">Results</h2>
      {!result && <p className="text-sm opacity-80">{live}</p>}
      {result && (
        <div className="space-y-1">
          <div className="text-lg">Monthly Payment: <strong>{formatCurrency(result.monthlyPayment)}</strong></div>
          <div className="text-sm">Total Paid: {formatCurrency(result.totalPaid)}</div>
          <div className="text-sm">Total Interest: {formatCurrency(result.totalInterest)} ({formatPercent(result.apr/100)})</div>
          {payoff()}
        </div>
      )}
    </section>
  )
}
