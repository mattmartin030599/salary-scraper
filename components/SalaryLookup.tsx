'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import ResultCard from './ResultCard'
import AppStoreBadges from './AppStoreBadges'
import AdUnit from './AdUnit'
import { saveMyLookup } from './YourRecentLookups'

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'loading' | 'done' | 'error'

interface ProgressState {
  message: string
  percent: number
  testing?: number
  phase?: 'min' | 'max'
}

interface JobResult {
  jobId: string
  title: string
  company: string
  location: string
  salaryMin: number
  salaryMax: number
  currency: string
  searchCount: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isSeekUrl(value: string) {
  return /seek\.com(\.au)?\/job\/\d+/.test(value)
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SalaryLookup() {
  const [url, setUrl]         = useState('')
  const [phase, setPhase]     = useState<Phase>('idle')
  const [progress, setProgress] = useState<ProgressState>({ message: '', percent: 0 })
  const [jobMeta, setJobMeta] = useState<{ title: string; company: string; location: string } | null>(null)
  const [result, setResult]   = useState<JobResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const [animPlaceholder, setAnimPlaceholder] = useState('')

  // Typing animation — runs only while the input is empty
  useEffect(() => {
    if (url) {
      setAnimPlaceholder('')
      return
    }

    const TEXTS = [
      'https://au.seek.com/job/92600609',
      'https://nz.seek.com/job/92194920',
    ]
    let textIdx = 0
    let charIdx = 0
    let phase: 'typing' | 'pause' | 'deleting' | 'wait' = 'typing'
    let timer: ReturnType<typeof setTimeout>

    function step() {
      const text = TEXTS[textIdx]

      if (phase === 'typing') {
        charIdx++
        setAnimPlaceholder(text.slice(0, charIdx))
        timer = charIdx >= text.length
          ? setTimeout(() => { phase = 'pause'; step() }, 1400)
          : setTimeout(step, 48)

      } else if (phase === 'pause') {
        phase = 'deleting'
        timer = setTimeout(step, 28)

      } else if (phase === 'deleting') {
        charIdx--
        setAnimPlaceholder(text.slice(0, charIdx))
        if (charIdx <= 0) {
          textIdx = (textIdx + 1) % TEXTS.length
          phase = 'wait'
          timer = setTimeout(step, 550)
        } else {
          timer = setTimeout(step, 22)
        }

      } else {
        phase = 'typing'
        charIdx = 0
        timer = setTimeout(step, 28)
      }
    }

    timer = setTimeout(step, 700) // initial delay before first character
    return () => clearTimeout(timer)
  }, [url])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const trimmed = url.trim()
    if (!trimmed) return
    if (!isSeekUrl(trimmed)) {
      setErrorMsg('Paste a Seek job URL — e.g. https://www.seek.com.au/job/12345678')
      return
    }

    // Reset state
    setPhase('loading')
    setErrorMsg('')
    setResult(null)
    setJobMeta(null)
    setProgress({ message: 'Starting…', percent: 0 })

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
        signal: ac.signal,
      })

      if (!res.body) throw new Error('No response stream')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            handleEvent(event)
          } catch {
            // skip malformed line
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setPhase('error')
      setErrorMsg('Network error — please check your connection and try again.')
    }
  }

  function handleEvent(event: Record<string, unknown>) {
    switch (event.type) {
      case 'progress':
        setProgress({
          message: event.message as string,
          percent: event.percent as number,
          testing: event.testing as number | undefined,
          phase:   event.phase   as 'min' | 'max' | undefined,
        })
        break

      case 'jobFound':
        setJobMeta({
          title:    event.title    as string,
          company:  event.company  as string,
          location: event.location as string,
        })
        setProgress(p => ({ ...p, percent: event.percent as number }))
        break

      case 'result': {
        const r = event as unknown as JobResult
        setResult(r)
        setPhase('done')
        setProgress({ message: 'Done', percent: 100 })
        // Persist to this visitor's personal history
        saveMyLookup({
          jobId:     r.jobId,
          title:     r.title,
          company:   r.company,
          location:  r.location,
          salaryMin: r.salaryMin,
          salaryMax: r.salaryMax,
          timestamp: Date.now(),
        })
        // Tell YourRecentLookups to refresh
        window.dispatchEvent(new Event('my-lookup-saved'))
        break
      }

      case 'error':
        setPhase('error')
        setErrorMsg(event.message as string)
        break
    }
  }

  function handleReset() {
    abortRef.current?.abort()
    setPhase('idle')
    setUrl('')
    setResult(null)
    setJobMeta(null)
    setErrorMsg('')
    setProgress({ message: '', percent: 0 })
  }

  return (
    <div className="w-full max-w-xl mx-auto">

      {/* Search form — always visible unless showing result */}
      {phase !== 'done' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setErrorMsg('') }}
              placeholder={animPlaceholder || ' '}
              disabled={phase === 'loading'}
              autoComplete="off"
              spellCheck={false}
              className={[
                'w-full rounded-xl border px-4 py-3.5 text-base sm:text-sm text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none transition-all',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                errorMsg
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:bg-red-950/30 dark:border-red-800'
                  : 'border-gray-300 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 focus:border-brand-500 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900',
              ].join(' ')}
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 -mt-1 px-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={phase === 'loading' || !url.trim()}
            className={[
              'w-full rounded-xl py-3.5 text-sm font-semibold transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm',
            ].join(' ')}
          >
            {phase === 'loading' ? 'Scanning…' : 'Reveal Salary'}
          </button>

          <AppStoreBadges />
        </form>
      )}

      {/* Loading state */}
      {phase === 'loading' && (
        <div className="mt-8">
          {/* Job meta preview */}
          {jobMeta && (
            <div className="mb-5 animate-fadeIn">
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{jobMeta.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {[jobMeta.company, jobMeta.location].filter(Boolean).join(' · ')}
              </p>
            </div>
          )}

          {/* Progress bar */}
          <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-2 bg-brand-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.percent}%` }}
            />
            {/* Shimmer */}
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Status text */}
          <div className="mt-3 flex items-center gap-2">
            <LoadingDots />
            <p className="text-sm text-gray-500 dark:text-gray-400">{progress.message}</p>
          </div>

          {/* Phase indicators */}
          {progress.phase && (
            <div className="mt-3 flex gap-2">
              <PhaseChip label="Min salary" active={progress.phase === 'min'} done={progress.phase === 'max'} />
              <PhaseChip label="Max salary" active={progress.phase === 'max'} done={false} />
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {phase === 'error' && (
        <div className="mt-6 animate-fadeIn">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-5 py-4">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Couldn&rsquo;t find salary</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">{errorMsg}</p>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 text-sm text-brand-600 hover:underline"
          >
            ← Try another URL
          </button>
        </div>
      )}

      {/* Result */}
      {phase === 'done' && result && (
        <div className="animate-fadeIn">
          <ResultCard {...result} />
          {/* Ad — shown after the user gets their result */}
          <AdUnit slot="1234567890" format="auto" className="mt-6 min-h-[100px]" />
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-brand-600 transition-colors"
            >
              ← Look up another job
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Small sub-components ─────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <span className="flex gap-0.5 items-center shrink-0">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-brand-500 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  )
}

function PhaseChip({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <span
      className={[
        'text-xs px-2.5 py-1 rounded-full border font-medium transition-all',
        active
          ? 'bg-brand-50 border-brand-200 text-brand-700'
          : done
          ? 'bg-gray-50 border-gray-200 text-gray-400 line-through'
          : 'bg-gray-50 border-gray-200 text-gray-400',
      ].join(' ')}
    >
      {done ? '✓ ' : ''}{label}
    </span>
  )
}
