export function encodeQuery(params: { principal: string; apr: string; termYears: string; startDate?: string }) {
  const sp = new URLSearchParams()
  if (params.principal) sp.set('p', params.principal)
  if (params.apr) sp.set('r', params.apr)
  if (params.termYears) sp.set('t', params.termYears)
  if (params.startDate) sp.set('start', params.startDate)
  return sp.toString()
}

export function decodeQuery(sp: URLSearchParams): { ok: boolean; parsed?: { principal: number; apr: number; termYears: number; startDate?: string } } {
  const p = sp.get('p')
  const r = sp.get('r')
  const t = sp.get('t')
  const s = sp.get('start')
  const principal = p ? Number(p) : NaN
  const apr = r ? Number(r) : NaN
  const termYears = t ? Number(t) : NaN
  const startDate = s || undefined
  if (!isFinite(principal) || principal <= 0) return { ok: false }
  if (!isFinite(apr) || apr < 0 || apr > 100) return { ok: false }
  if (!Number.isInteger(termYears) || termYears < 1 || termYears > 50) return { ok: false }
  if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return { ok: false }
  return { ok: true, parsed: { principal, apr, termYears, startDate } }
}
