import { useMemo } from 'react'
import type { ComputeResult } from '@/lib/amortization'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement, PointElement, CategoryScale, LinearScale, TimeScale, BarElement, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export function ChartsPanel({ result }: { result: ComputeResult | null }) {
  const data = useMemo(() => {
    if (!result) return null
    const labels = result.schedule.map((r) => r.month)
    return {
      balance: {
        labels,
        datasets: [
          { label: 'Balance', data: result.schedule.map((r) => r.balance), borderColor: '#0ea5e9', backgroundColor: 'transparent' }
        ]
      },
      composition: {
        labels,
        datasets: [
          { label: 'Principal', data: result.schedule.map((r) => r.principal), backgroundColor: '#22c55e', stack: 'stack' },
          { label: 'Interest', data: result.schedule.map((r) => r.interest), backgroundColor: '#f59e0b', stack: 'stack' },
        ]
      }
    }
  }, [result])

  if (!data) return (
    <section className="rounded border border-slate-200 dark:border-slate-800 p-4">
      <h2 className="font-semibold mb-2">Charts</h2>
      <p className="text-sm opacity-80">Enter valid values to see charts.</p>
    </section>
  )

  return (
    <section className="rounded border border-slate-200 dark:border-slate-800 p-4 space-y-6">
      <h2 className="font-semibold">Charts</h2>
      <Line data={data.balance} options={{ animation: false, responsive: true, plugins: { legend: { display: true } } }} />
      <Bar data={data.composition} options={{ animation: false, responsive: true, plugins: { legend: { display: true } }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
    </section>
  )
}
