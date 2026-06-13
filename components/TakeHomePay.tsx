'use client'

import { useState } from 'react'

// ATO 2024–25 (Stage 3 tax cuts: 16% / 30%)
function calcIncomeTax(income: number): number {
  if (income <= 18_200)  return 0
  if (income <= 45_000)  return (income - 18_200) * 0.16
  if (income <= 135_000) return 4_288 + (income - 45_000) * 0.30
  if (income <= 190_000) return 31_288 + (income - 135_000) * 0.37
  return 51_638 + (income - 190_000) * 0.45
}

// Low Income Tax Offset (LITO) — reduces to 0 above $66,667
function calcLITO(income: number): number {
  if (income <= 37_500)  return 700
  if (income <= 45_000)  return 700 - (income - 37_500) * 0.05
  if (income <= 66_667)  return 325 - (income - 45_000) * 0.015
  return 0
}

// Medicare Levy: 2% above the low-income threshold
function calcMedicare(income: number): number {
  if (income <= 26_000)  return 0
  if (income <= 32_500)  return (income - 26_000) * 0.1   // phase-in
  return income * 0.02
}

function calcTakeHome(gross: number) {
  const tax      = Math.max(0, calcIncomeTax(gross) - calcLITO(gross))
  const medicare = calcMedicare(gross)
  const net      = gross - tax - medicare
  return { gross, tax, medicare, net }
}

function fmtAUD(n: number): string {
  return n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
}

interface Props {
  salaryMin: number
  salaryMax: number
}

export default function TakeHomePay({ salaryMin, salaryMax }: Props) {
  const [open, setOpen] = useState(false)
  const midpoint = Math.round((salaryMin + salaryMax) / 2 / 1000) * 1000

  const result = calcTakeHome(midpoint)

  return (
    <div className="mt-4 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-500 shrink-0">
            <path d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.658-.204 1.023-.834 1.023-1.18 0-.327-.34-.533-1.02-.836l-.14-.064ZM9.25 12.886V10.27c-.674.26-1 .54-1 .82 0 .346.364.976 1.023 1.18.213.065.434.107.656.132l.32.033v-.52Z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.94 6.907a6.129 6.129 0 0 1 .548-.172 3.64 3.64 0 0 1-.36-.521A6.47 6.47 0 0 0 8 7.38a6.47 6.47 0 0 0-1.5-1.267 6.47 6.47 0 0 0-2.25 3.18 6.47 6.47 0 0 0 1.5.688 6.47 6.47 0 0 0 1.5-1.267 6.47 6.47 0 0 0 1.128-.807ZM10 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" clipRule="evenodd"/>
          </svg>
          Take-home pay estimate
          <span className="text-xs text-gray-400 dark:text-gray-500 font-normal hidden sm:inline">(midpoint · ATO 2024–25)</span>
        </span>
        <svg
          viewBox="0 0 20 20" fill="currentColor"
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 animate-fadeIn">
          {/* Gross input label */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Based on {fmtAUD(midpoint)} salary midpoint. Estimate only — does not include super, HECS, or salary packaging.
          </p>

          {/* Breakdown table */}
          <div className="space-y-2">
            <Row label="Gross salary" value={result.gross} />
            <Row label="Income tax" value={-result.tax} negative />
            <Row label="Medicare levy" value={-result.medicare} negative />
          </div>

          <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Annual take-home</span>
            <span className="text-base font-bold text-brand-600 dark:text-brand-400">{fmtAUD(result.net)}</span>
          </div>

          {/* Frequency chips */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Chip label="Monthly" value={result.net / 12} />
            <Chip label="Fortnightly" value={result.net / 26} />
            <Chip label="Weekly" value={result.net / 52} />
            <Chip label="Daily" value={result.net / 261} />
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, negative }: { label: string; value: number; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={negative ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}>
        {negative ? '−' : ''}{Math.abs(value).toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })}
      </span>
    </div>
  )
}

function Chip({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">
        {Math.round(value).toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })}
      </p>
    </div>
  )
}
