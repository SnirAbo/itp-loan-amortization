import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark' || matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      aria-pressed={dark}
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center gap-2 rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-900"
    >
      <span className="i">{dark ? '🌙' : '☀️'}</span>
      <span>{dark ? 'Dark' : 'Light'}</span>
    </button>
  )
}
