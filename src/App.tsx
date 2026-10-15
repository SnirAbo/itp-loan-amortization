import { useEffect, useMemo, useState } from 'react'
import { DarkModeToggle } from '@/components/DarkModeToggle'
import { LoanInputForm } from '@/components/LoanInputForm'
import { ResultsPanel } from '@/components/ResultsPanel'
import { AmortizationTable } from '@/components/AmortizationTable'
import { ChartsPanel } from '@/components/ChartsPanel'
import { CopyLinkButton } from '@/components/CopyLinkButton'
import { compute } from '@/lib/amortization'
import { encodeQuery, decodeQuery } from '@/lib/url'
import { validateAll } from '@/lib/validation'

export default function App() {
  const [principal, setPrincipal] = useState<string>('300000')
  const [apr, setApr] = useState<string>('6.5')
  const [termYears, setTermYears] = useState<string>('30')
  const [startDate, setStartDate] = useState<string>('')

  // On load, decode query if present
  useEffect(() => {
    const decoded = decodeQuery(new URLSearchParams(location.search))
    if (decoded.ok && decoded.parsed) {
      const p = decoded.parsed
      setPrincipal(String(p.principal))
      setApr(String(p.apr))
      setTermYears(String(p.termYears))
      setStartDate(p.startDate ?? '')
    }
  }, [])

  // Sync to URL on change (debounced via LoanInputForm)
  useEffect(() => {
    const qp = encodeQuery({ principal, apr, termYears, startDate })
    const url = `${location.pathname}?${qp}`
    window.history.replaceState({}, '', url)
  }, [principal, apr, termYears, startDate])

  const validation = useMemo(
    () => validateAll({ principal, apr, termYears, startDate }),
    [principal, apr, termYears, startDate]
  )

  const result = useMemo(() => {
    if (!validation.ok) return null
    return compute({
      principal: validation.parsed!.principal,
      apr: validation.parsed!.apr,
      termYears: validation.parsed!.termYears,
      startDate: validation.parsed!.startDate ?? undefined,
    })
  }, [validation])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <h1 className="text-lg font-semibold">Amortization Calculator</h1>
          <span className="text-xs opacity-60">v0.1.0</span>
          <div className="ml-auto flex items-center gap-2">
            <CopyLinkButton />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 flex flex-col gap-6">
        <LoanInputForm
          values={{ principal, apr, termYears, startDate }}
          onChange={{ setPrincipal, setApr, setTermYears, setStartDate }}
          validation={validation}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <ResultsPanel validation={validation} result={result} />
          </div>
          <div className="lg:col-span-2">
            <ChartsPanel result={result} />
          </div>
        </div>

        <AmortizationTable result={result} />
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm opacity-70">
        Built with React + Vite + Tailwind. ITP Project.
      </footer>
    </div>
  )
}
