import type { ComputeResult } from './amortization'

export function exportCSV(res: ComputeResult, now = new Date()) {
  const headers = ['#','Date','Payment','Interest','Principal','Balance']
  const rows = res.schedule.map(r => [r.month, r.date, f(r.payment), f(r.interest), f(r.principal), f(r.balance)])
  const all = [headers, ...rows]
  const csv = all.map(cols => cols.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  const ymd = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`
  a.href = URL.createObjectURL(blob)
  a.download = `loan-amortization-${ymd}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

function f(n: number) { return n.toFixed(2) }
