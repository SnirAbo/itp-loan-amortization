export function formatCurrency(v: number, currency = 'USD', locale = undefined as string | undefined) {
  return new Intl.NumberFormat(locale ?? undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(v)
}
export function formatPercent(v: number, locale = undefined as string | undefined) {
  return new Intl.NumberFormat(locale ?? undefined, { style: 'percent', maximumFractionDigits: 2 }).format(v)
}
export function formatDate(iso: string, locale = undefined as string | undefined) {
  return new Intl.DateTimeFormat(locale ?? undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(iso))
}
