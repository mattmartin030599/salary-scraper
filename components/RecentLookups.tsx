'use client'

import { useEffect, useRef, useState } from 'react'

interface Lookup {
  jobId:     string
  title:     string
  company:   string
  location:  string
  salaryMin: number
  salaryMax: number
  timestamp: number
}

const SLOT_COUNT = 5
const SPEED_PX_S = 80   // pixels per second — tweak to taste

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 60)  return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function fmt(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`
}

function SkeletonCard({ index }: { index: number }) {
  const titleW   = ['w-3/4', 'w-2/3', 'w-4/5', 'w-1/2', 'w-3/5'][index % 5]
  const companyW = ['w-1/2', 'w-2/5', 'w-3/5', 'w-1/3', 'w-2/3'][index % 5]
  const salaryW  = ['w-1/3', 'w-2/5', 'w-1/4', 'w-2/5', 'w-1/3'][index % 5]
  const locW     = ['w-2/5', 'w-1/3', 'w-1/2', 'w-2/5', 'w-1/4'][index % 5]
  return (
    <div className="shrink-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl p-4">
      <div className={`h-3.5 ${titleW} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative`}>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
      </div>
      <div className={`mt-2 h-2.5 ${companyW} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative`}>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" style={{ animationDelay: '0.15s' }} />
      </div>
      <div className={`mt-4 h-4 ${salaryW} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative`}>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" style={{ animationDelay: '0.3s' }} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className={`h-2 ${locW} bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative`}>
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" style={{ animationDelay: '0.45s' }} />
        </div>
        <div className="h-2 w-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative ml-2">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </div>
  )
}

function RealCard({ item }: { item: Lookup }) {
  return (
    <a
      href={`https://www.seek.com.au/job/${item.jobId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all"
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">{item.title}</p>
      {item.company && (
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.company}</p>
      )}
      <p className="mt-3 text-base font-bold text-brand-600 dark:text-brand-400">
        {fmt(item.salaryMin)}
        {item.salaryMax !== item.salaryMin && (
          <><span className="font-normal text-gray-300 dark:text-gray-600 mx-1">–</span>{fmt(item.salaryMax)}</>
        )}
      </p>
      <div className="flex items-center justify-between mt-2">
        {item.location && <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex-1">{item.location}</p>}
        <p className="text-xs text-gray-300 dark:text-gray-600 shrink-0 ml-2">{timeAgo(item.timestamp)}</p>
      </div>
    </a>
  )
}

export default function RecentLookups() {
  const [items, setItems]   = useState<Lookup[]>([])
  const [loaded, setLoaded] = useState(false)

  // Refs so the rAF loop can read these without triggering re-renders
  const trackRef   = useRef<HTMLDivElement>(null)
  const posRef     = useRef(0)          // current scroll offset in px
  const pausedRef  = useRef(false)      // mouse hover pause
  const rafRef     = useRef(0)
  const lastTsRef  = useRef(0)

  async function fetchData() {
    try {
      const res = await fetch('/api/recent', { cache: 'no-store' })
      if (res.ok) setItems(await res.json())
    } catch {}
    setLoaded(true)
  }

  useEffect(() => {
    fetchData()
    const t = setInterval(fetchData, 30_000)
    return () => clearInterval(t)
  }, [])

  // rAF scroll loop — restarts whenever loaded state changes so we
  // re-measure the track width after cards render
  useEffect(() => {
    lastTsRef.current = 0

    function step(ts: number) {
      const dt = lastTsRef.current ? ts - lastTsRef.current : 0
      lastTsRef.current = ts

      const track = trackRef.current
      if (track && !pausedRef.current) {
        posRef.current += (SPEED_PX_S * dt) / 1000

        // Reset precisely at the halfway point (= one copy's width)
        const halfW = track.scrollWidth / 2
        if (halfW > 0 && posRef.current >= halfW) {
          posRef.current -= halfW   // jump is invisible — same visual position
        }

        track.style.transform = `translateX(-${posRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [loaded])

  const skeletonCount = Math.max(0, SLOT_COUNT - items.length)
  const cards = [
    ...items.map(item => <RealCard key={item.jobId} item={item} />),
    ...((!loaded || skeletonCount > 0)
      ? Array.from({ length: loaded ? skeletonCount : SLOT_COUNT }, (_, i) => (
          <SkeletonCard key={`sk-${i}`} index={i} />
        ))
      : []),
  ]

  return (
    <div className="w-full mt-20">
      <div className="text-center mb-5">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Recent lookups
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
          {items.length === 0 ? 'Be the first to look one up' : `${items.length} lookup${items.length === 1 ? '' : 's'} so far`}
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10" />

        {/*
          Two identical copies of the cards.
          pr-3 on each copy adds a trailing 12 px gap so the visual
          spacing at the seam matches the internal gap-3 spacing.
          The rAF loop resets posRef when it reaches scrollWidth / 2,
          which is the exact start of the second copy — no visual jump.
        */}
        <div ref={trackRef} className="flex pb-2 will-change-transform">
          <div className="flex gap-3 pr-3 shrink-0">{cards}</div>
          <div className="flex gap-3 pr-3 shrink-0" aria-hidden="true">{cards}</div>
        </div>
      </div>
    </div>
  )
}
