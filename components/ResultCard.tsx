'use client'

import TakeHomePay from './TakeHomePay'

interface ResultCardProps {
  title: string
  company: string
  location: string
  salaryMin: number
  salaryMax: number
  currency: string
  jobId: string
  searchCount: number
}

function fmt(n: number) {
  return n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
}

export default function ResultCard({
  title,
  company,
  location,
  salaryMin,
  salaryMax,
  jobId,
  searchCount,
}: ResultCardProps) {
  const midpoint = Math.round((salaryMin + salaryMax) / 2 / 1000) * 1000
  const same = salaryMin === salaryMax

  // Position the midpoint tick as a % across the range bar
  // We extend the bar 20% on either side for visual padding
  const barMin = salaryMin * 0.85
  const barMax = salaryMax * 1.15
  const span   = barMax - barMin
  const minPct = ((salaryMin  - barMin) / span) * 100
  const maxPct = ((salaryMax  - barMin) / span) * 100
  const midPct = ((midpoint   - barMin) / span) * 100

  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-fadeIn">
      {/* Job info */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-snug min-w-0">{title}</h2>
          {searchCount > 0 && (
            <span
              title={`This job has been looked up ${searchCount} time${searchCount === 1 ? '' : 's'}`}
              className="shrink-0 mt-0.5 inline-flex items-center gap-1 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 opacity-70">
                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Z"/>
                <path d="M8 5a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5H4.75a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 5Z"/>
              </svg>
              {searchCount.toLocaleString()} {searchCount === 1 ? 'search' : 'searches'}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
          {company && <span>{company}</span>}
          {company && location && <span className="text-gray-300">·</span>}
          {location && <span>{location}</span>}
          <span className="text-gray-300">·</span>
          <a
            href={`https://www.seek.com.au/job/${jobId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            View on Seek ↗
          </a>
        </div>
      </div>

      {/* Salary range card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        {/* Range label */}
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Estimated salary range
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">AUD / year</span>
        </div>

        {same ? (
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{fmt(salaryMin)}</p>
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">
            {fmt(salaryMin)}
            <span className="text-gray-300 dark:text-gray-700 font-light mx-1.5 sm:mx-2">–</span>
            {fmt(salaryMax)}
          </p>
        )}

        {/* Visual range bar */}
        {!same && (
          <div className="mt-5 mb-4">
            <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-visible">
              {/* Filled segment */}
              <div
                className="absolute top-0 h-2.5 bg-brand-500 rounded-full"
                style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
              />
              {/* Midpoint tick */}
              <div
                className="absolute -top-0.5 w-0.5 h-3.5 bg-brand-700 rounded-full"
                style={{ left: `${midPct}%`, transform: 'translateX(-50%)' }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
              <span>{fmt(salaryMin)}</span>
              <span className="font-medium text-brand-600 dark:text-brand-400">
                mid {fmt(midpoint)}
              </span>
              <span>{fmt(salaryMax)}</span>
            </div>
          </div>
        )}

        {/* Midpoint callout */}
        {!same && (
          <div className="mt-4 flex items-center gap-2 bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 rounded-xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
            <p className="text-sm text-brand-800 dark:text-brand-300">
              Midpoint is <strong>{fmt(midpoint)}</strong> — a useful anchor for salary negotiations.
            </p>
          </div>
        )}

        <TakeHomePay salaryMin={salaryMin} salaryMax={salaryMax} />

        <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
          Based on Seek&rsquo;s internal salary filter. Range reflects stored brackets, not the exact figure entered by the employer.
        </p>
      </div>
    </div>
  )
}
