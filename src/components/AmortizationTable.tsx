import { useMemo } from 'react'
import type { ComputeResult } from '@/lib/amortization'
import { useVirtualizer } from '@tanstack/react-virtual'
import { formatCurrency, formatDate } from '@/lib/format'

export function AmortizationTable({ result }: { result: ComputeResult | null }) {
  const rows = result?.schedule ?? []

  const parentRef = useMemo(() => ({ current: null as null | HTMLDivElement }), [])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 10,
  })

  return (
    <section className="rounded border border-slate-200 dark:border-slate-800">
      <div className="sticky top-[52px] bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-6 gap-2 px-3 py-2 text-xs font-semibold">
          <div>#</div>
          <div>Date</div>
          <div className="text-right">Payment</div>
          <div className="text-right">Interest</div>
          <div className="text-right">Principal</div>
          <div className="text-right">Balance</div>
        </div>
      </div>
      <div ref={parentRef as any} className="h-[400px] overflow-auto">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((vi) => {
            const row = rows[vi.index]
            return (
              <div
                key={vi.key}
                className={`grid grid-cols-6 gap-2 px-3 py-2 text-sm ${vi.index % 2 ? 'bg-slate-50 dark:bg-slate-900' : ''}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${vi.start}px)` }}
              >
                <div>{row.month}</div>
                <div>{formatDate(row.date)}</div>
                <div className="text-right">{formatCurrency(row.payment)}</div>
                <div className="text-right">{formatCurrency(row.interest)}</div>
                <div className="text-right">{formatCurrency(row.principal)}</div>
                <div className="text-right">{formatCurrency(row.balance)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
