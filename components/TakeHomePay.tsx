'use client'

import { useState } from 'react'

function currentFYLabel(): string {
  const now = new Date()
  const s = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
  return `${s}–${(s + 1).toString().slice(2)}`
}

function currentFYStart(): number {
  const now = new Date()
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
}

/** Super guarantee rate — legislated schedule */
function superRate(): number {
  const fy = currentFYStart()
  if (fy >= 2025) return 0.12   // FY2025-26+: 12%
  if (fy === 2024) return 0.115 // FY2024-25: 11.5%
  return 0.11
}

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

// HECS/HELP repayment bands (ATO 2024-25)
// Each [threshold, rate] means: income below this threshold uses this rate.
// The leading [54_435, 0] ensures incomes below the minimum threshold pay nothing.
function calcHECS(income: number): number {
  const bands: [number, number][] = [
    [54_435,   0],      // below minimum threshold → nil
    [62_851,   0.010],
    [66_621,   0.020],
    [70_619,   0.025],
    [74_856,   0.030],
    [79_347,   0.035],
    [84_108,   0.040],
    [89_155,   0.045],
    [94_504,   0.050],
    [100_175,  0.055],
    [106_186,  0.060],
    [112_557,  0.065],
    [119_310,  0.070],
    [126_468,  0.075],
    [134_057,  0.080],
    [142_100,  0.085],
    [150_626,  0.090],
    [159_664,  0.095],
    [Infinity, 0.100],
  ]
  for (const [threshold, rate] of bands) {
    if (income < threshold) return Math.round(income * rate)
  }
  return Math.round(income * 0.10)
}

interface CalcResult {
  gross:    number
  base:     number
  superAmt: number
  tax:      number
  medicare: number
  hecs:     number
  net:      number
}

function calcTakeHome(gross: number, includingSuper: boolean, includeHECS: boolean): CalcResult {
  const rate     = superRate()
  const base     = includingSuper ? Math.round(gross / (1 + rate)) : gross
  const superAmt = includingSuper ? gross - base : Math.round(base * rate)
  const tax      = Math.max(0, Math.round(calcIncomeTax(base) - calcLITO(base)))
  const medicare = Math.round(calcMedicare(base))
  const hecs     = includeHECS ? calcHECS(base) : 0
  const net      = base - tax - medicare - hecs
  return { gross, base, superAmt, tax, medicare, hecs, net }
}

function fmtAUD(n: number): string {
  return n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
}

interface Props {
  salaryMin: number
  salaryMax: number
}

export default function TakeHomePay({ salaryMin, salaryMax }: Props) {
  const [open, setOpen]                = useState(false)
  const [includingSuper, setIncSuper]  = useState(false)
  const [includeHECS, setIncHECS]      = useState(false)

  const midpoint = Math.round((salaryMin + salaryMax) / 2 / 1000) * 1000
  const result   = calcTakeHome(midpoint, includingSuper, includeHECS)

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
          <span className="text-xs text-gray-400 dark:text-gray-500 font-normal hidden sm:inline">(midpoint · ATO {currentFYLabel()})</span>
        </span>
        <svg
          viewBox="0 0 20 20" fill="currentColor"
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 animate-fadeIn">
          {/* Toggles */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Toggle
              label="Salary includes super"
              hint={`${Math.round(superRate() * 100)}% SG`}
              checked={includingSuper}
              onChange={setIncSuper}
            />
            <Toggle
              label="Has HECS/HELP debt"
              checked={includeHECS}
              onChange={setIncHECS}
            />
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Based on {fmtAUD(midpoint)} salary midpoint. Estimate only — does not account for salary packaging or other offsets.
          </p>

          {/* Breakdown table */}
          <div className="space-y-2">
            <Row label="Gross salary" value={result.gross} />
            {includingSuper && (
              <>
                <Row label={`Super (${Math.round(superRate() * 100)}% SG)`} value={-result.superAmt} negative note="paid to fund" />
                <Row label="Base salary (excl. super)" value={result.base} />
              </>
            )}
            <Row label="Income tax" value={-result.tax} negative />
            <Row label="Medicare levy" value={-result.medicare} negative />
            {includeHECS && result.hecs > 0 && (
              <Row label="HECS/HELP repayment" value={-result.hecs} negative />
            )}
            {includeHECS && result.hecs === 0 && (
              <Row label="HECS/HELP" value={0} note="below threshold" />
            )}
          </div>

          <div className="mt-3 h-px bg-gray-100 dark:bg-gray-800" />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Annual take-home</span>
            <span className="text-base font-bold text-brand-600 dark:text-brand-400">{fmtAUD(result.net)}</span>
          </div>

          {/* Frequency chips */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Chip label="Monthly"     value={result.net / 12} />
            <Chip label="Fortnightly" value={result.net / 26} />
            <Chip label="Weekly"      value={result.net / 52} />
            <Chip label="Daily"       value={result.net / 261} />
          </div>
        </div>
      )}
    </div>
  )
}

function Toggle({
  label, hint, checked, onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        checked
          ? 'bg-brand-50 dark:bg-brand-950 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
      }`}
    >
      <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
        checked ? 'bg-brand-500 border-brand-500' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      {label}
      {hint && <span className="text-gray-400 dark:text-gray-500">· {hint}</span>}
    </button>
  )
}

function Row({
  label, value, negative, note,
}: {
  label: string
  value: number
  negative?: boolean
  note?: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">
        {label}
        {note && <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">({note})</span>}
      </span>
      <span className={negative && value !== 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}>
        {negative && value !== 0 ? '−' : ''}{Math.abs(value).toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })}
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
