import type { ComputeResult } from '@/lib/amortization'
import { exportCSV } from '@/lib/csv'
import { exportPDF } from '@/lib/pdf'

export function ExportButtons({ result }: { result: ComputeResult | null }) {
  const disabled = !result
  return (
    <div className="flex gap-2">
      <button
        disabled={disabled}
        onClick={() => result && exportCSV(result)}
        className="inline-flex items-center gap-2 rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50"
      >
        ⬇️ Export CSV
      </button>
      <button
        disabled={disabled}
        onClick={() => result && exportPDF(result)}
        className="inline-flex items-center gap-2 rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50"
      >
        🖨️ Export PDF
      </button>
    </div>
  )
}
