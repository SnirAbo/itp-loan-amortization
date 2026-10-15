import { encodeQuery } from '@/lib/url'

export function CopyLinkButton() {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      alert('Link copied!')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = location.href
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      alert('Link copied!')
    }
  }

  return (
    <button onClick={onCopy} className="inline-flex items-center gap-2 rounded border border-slate-300 dark:border-slate-700 px-3 py-1 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">
      🔗 Copy Link
    </button>
  )
}
