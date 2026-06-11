'use client'

import { useEffect, useState } from 'react'

const LS_KEY    = 'ssnoop_my_lookups'
const MAX_ITEMS = 10

export interface MyLookup {
  jobId:     string
  title:     string
  company:   string
  location:  string
  salaryMin: number
  salaryMax: number
  timestamp: number
}

/** Call this from SalaryLookup when a result arrives — persists to localStorage */
export function saveMyLookup(entry: MyLookup) {
  try {
    const existing: MyLookup[] = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
    const deduped = existing.filter(e => e.jobId !== entry.jobId)
    const next = [entry, ...deduped].slice(0, MAX_ITEMS)
    localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch {}
}

function fmt(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`
}

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 60)  return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function YourRecentLookups() {
  const [items, setItems]   = useState<MyLookup[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    function load() {
      try {
        const stored = localStorage.getItem(LS_KEY)
        setItems(stored ? JSON.parse(stored) : [])
      } catch {}
    }
    load()
    setMounted(true)

    // Refresh whenever another tab writes to localStorage
    window.addEventListener('storage', load)
    return () => window.removeEventListener('storage', load)
  }, [])

  // Expose a refresh function via a custom event so SalaryLookup can trigger it
  useEffect(() => {
    function onSaved() {
      try {
        const stored = localStorage.getItem(LS_KEY)
        setItems(stored ? JSON.parse(stored) : [])
      } catch {}
    }
    window.addEventListener('my-lookup-saved', onSaved)
    return () => window.removeEventListener('my-lookup-saved', onSaved)
  }, [])

  if (!mounted || items.length === 0) return null

  return (
    <div className="w-full mt-16">
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Your recent lookups
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <a
            key={item.jobId}
            href={`https://www.seek.com.au/job/${item.jobId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl px-4 py-3 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all group"
          >
            {/* Left: title + meta */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                {[item.company, item.location].filter(Boolean).join(' · ')}
              </p>
            </div>

            {/* Right: salary + time */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                {fmt(item.salaryMin)}
                {item.salaryMax !== item.salaryMin && (
                  <><span className="font-normal text-gray-300 dark:text-gray-600 mx-1">–</span>{fmt(item.salaryMax)}</>
                )}
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{timeAgo(item.timestamp)}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
