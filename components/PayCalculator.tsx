'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TaxYear  = '2021-22' | '2022-23' | '2023-24' | '2024-25' | '2025-26'
type PayCycle = 'annual' | 'monthly' | 'fortnightly' | 'weekly' | 'daily' | 'hourly'

// ─── Pay cycle config ─────────────────────────────────────────────────────────

const PAY_CYCLES: { value: PayCycle; label: string; multiplier: number }[] = [
  { value: 'annual',      label: 'Annually',    multiplier: 1       },
  { value: 'monthly',     label: 'Monthly',     multiplier: 12      },
  { value: 'fortnightly', label: 'Fortnightly', multiplier: 26      },
  { value: 'weekly',      label: 'Weekly',      multiplier: 52      },
  { value: 'daily',       label: 'Daily',       multiplier: 261     },
  { value: 'hourly',      label: 'Hourly',      multiplier: 1957.5  }, // 261 days × 7.5 hrs
]

const RESULT_COLS = [
  { label: 'Weekly',      div: 52 },
  { label: 'Fortnightly', div: 26 },
  { label: 'Monthly',     div: 12 },
  { label: 'Annually',    div: 1  },
]

const TAX_YEARS: TaxYear[] = ['2025-26','2024-25','2023-24','2022-23','2021-22']

// ─── Tax calculations ─────────────────────────────────────────────────────────

function calcIncomeTax(income: number, year: TaxYear): number {
  if (year === '2024-25' || year === '2025-26') {
    if (income <= 18_200)  return 0
    if (income <= 45_000)  return (income - 18_200) * 0.16
    if (income <= 135_000) return 4_288 + (income - 45_000) * 0.30
    if (income <= 190_000) return 31_288 + (income - 135_000) * 0.37
    return 51_638 + (income - 190_000) * 0.45
  }
  // 2021-22 to 2023-24 (pre-Stage 3)
  if (income <= 18_200)  return 0
  if (income <= 45_000)  return (income - 18_200) * 0.19
  if (income <= 120_000) return 5_092 + (income - 45_000) * 0.325
  if (income <= 180_000) return 29_467 + (income - 120_000) * 0.37
  return 51_667 + (income - 180_000) * 0.45
}

function calcLITO(income: number): number {
  if (income <= 37_500) return 700
  if (income <= 45_000) return 700 - (income - 37_500) * 0.05
  if (income <= 66_667) return 325 - (income - 45_000) * 0.015
  return 0
}

// LMITO: only applicable in 2021-22 (removed from 2022-23 onwards)
function calcLMITO(income: number, year: TaxYear): number {
  if (year !== '2021-22') return 0
  if (income <= 37_000)  return 255
  if (income <= 48_000)  return 255 + (income - 37_000) * (825 / 11_000)
  if (income <= 90_000)  return 1_080
  if (income <= 126_000) return 1_080 - (income - 90_000) * (1_080 / 36_000)
  return 0
}

function calcMedicare(income: number, year: TaxYear): number {
  let lower: number, upper: number
  switch (year) {
    case '2025-26':
    case '2024-25': lower = 27_222; upper = 34_027; break
    case '2023-24': lower = 26_000; upper = 32_500; break
    case '2022-23': lower = 23_365; upper = 29_207; break
    default:        lower = 23_226; upper = 29_033; break  // 2021-22
  }
  if (income <= lower) return 0
  if (income <= upper) return (income - lower) * 0.1
  return income * 0.02
}

// HECS/HELP — marginal system from 2025-26; flat rate system prior
function calcHECS(income: number, year: TaxYear): number {
  if (year === '2025-26') {
    // ATO marginal system
    if (income <= 67_000)  return 0
    if (income <= 125_000) return Math.round((income - 67_000) * 0.15)
    if (income <= 179_285) return Math.round(8_700 + (income - 125_000) * 0.17)
    return Math.round(income * 0.10)
  }

  // Flat-rate system: % of total income above minimum threshold
  type Band = [number, number] // [min_income, rate]
  const bands: Record<Exclude<TaxYear,'2025-26'>, Band[]> = {
    '2024-25': [
      [54_435,0.01],[62_850,0.02],[66_621,0.025],[70_619,0.03],
      [74_856,0.035],[79_347,0.04],[84_108,0.045],[89_155,0.05],
      [94_504,0.055],[100_175,0.06],[106_186,0.065],[112_557,0.07],
      [119_310,0.075],[126_469,0.08],[134_057,0.085],[142_101,0.09],
      [150_627,0.095],[160_000,0.10],
    ],
    '2023-24': [
      [51_550,0.01],[59_519,0.02],[63_090,0.025],[66_875,0.03],
      [70_888,0.035],[75_141,0.04],[79_650,0.045],[84_429,0.05],
      [89_494,0.055],[94_865,0.06],[100_557,0.065],[106_591,0.07],
      [112_986,0.075],[119_765,0.08],[126_951,0.085],[134_569,0.09],
      [142_643,0.095],[151_201,0.10],
    ],
    '2022-23': [
      [48_361,0.01],[55_837,0.02],[59_187,0.025],[62_739,0.03],
      [66_503,0.035],[70_494,0.04],[74_723,0.045],[79_207,0.05],
      [83_959,0.055],[88_997,0.06],[94_337,0.065],[99_997,0.07],
      [105_997,0.075],[112_356,0.08],[119_098,0.085],[126_244,0.09],
      [133_818,0.095],[141_848,0.10],
    ],
    '2021-22': [
      [47_014,0.01],[54_283,0.02],[57_539,0.025],[60_992,0.03],
      [64_652,0.035],[68_530,0.04],[72_642,0.045],[76_999,0.05],
      [81_619,0.055],[86_516,0.06],[91_707,0.065],[97_209,0.07],
      [103_042,0.075],[109_225,0.08],[115_779,0.085],[122_728,0.09],
      [130_092,0.095],[138_297,0.10],
    ],
  }
  const table = bands[year as Exclude<TaxYear,'2025-26'>]
  let rate = 0
  for (const [min, r] of table) {
    if (income >= min) rate = r
    else break
  }
  return rate > 0 ? Math.round(income * rate) : 0
}

function getSuperRate(year: TaxYear): number {
  switch (year) {
    case '2025-26': return 0.12
    case '2024-25': return 0.115
    case '2023-24': return 0.11
    case '2022-23': return 0.105
    default:        return 0.10  // 2021-22
  }
}

function getMarginalRate(income: number, year: TaxYear): number {
  if (year === '2024-25' || year === '2025-26') {
    if (income <= 18_200) return 0
    if (income <= 45_000) return 0.16
    if (income <= 135_000) return 0.30
    if (income <= 190_000) return 0.37
    return 0.45
  }
  if (income <= 18_200) return 0
  if (income <= 45_000) return 0.19
  if (income <= 120_000) return 0.325
  if (income <= 180_000) return 0.37
  return 0.45
}

// ─── Main calculation ─────────────────────────────────────────────────────────

interface CalcResult {
  annualGross:  number   // base + super (what employer pays total)
  base:         number   // taxable base salary
  superAmt:     number   // super guarantee amount
  rawTax:       number   // income tax before offsets
  lito:         number
  lmito:        number
  tax:          number   // net income tax after offsets
  medicare:     number
  hecs:         number
  net:          number   // annual take-home
  effectiveRate: number  // (tax + medicare) / base
  marginalRate:  number
}

function calculate(
  annualBase: number,
  salaryIncludesSuper: boolean,
  includeHECS: boolean,
  year: TaxYear,
): CalcResult {
  const sg = getSuperRate(year)

  // If salary includes super, back-calculate base
  const base      = salaryIncludesSuper ? Math.round(annualBase / (1 + sg)) : annualBase
  const superAmt  = salaryIncludesSuper ? annualBase - base : Math.round(base * sg)
  const annualGross = base + superAmt

  const rawTax  = calcIncomeTax(base, year)
  const lito    = calcLITO(base)
  const lmito   = calcLMITO(base, year)
  const tax     = Math.max(0, Math.round(rawTax - lito - lmito))
  const medicare = Math.round(calcMedicare(base, year))
  const hecs    = includeHECS ? calcHECS(base, year) : 0
  const net     = base - tax - medicare - hecs

  const effectiveRate = base > 0 ? (tax + medicare) / base : 0
  const marginalRate  = getMarginalRate(base, year)

  return { annualGross, base, superAmt, rawTax, lito, lmito, tax, medicare, hecs, net, effectiveRate, marginalRate }
}

// ─── Income percentile (ATO 2021-22 personal tax statistics) ──────────────────

const PERCENTILE_ANCHORS: Array<[number, number]> = [
  [0, 0], [5_000, 2], [10_000, 6], [15_000, 11], [18_200, 16],
  [20_000, 18], [25_000, 22], [30_000, 27], [35_000, 32], [40_000, 37],
  [45_000, 41], [50_000, 45], [55_000, 49], [60_000, 53], [65_000, 57],
  [70_000, 61], [75_000, 64], [80_000, 67], [85_000, 70], [90_000, 72],
  [95_000, 74], [100_000, 76], [110_000, 80], [120_000, 83], [130_000, 85],
  [140_000, 87], [150_000, 89], [175_000, 91], [200_000, 93], [250_000, 95],
  [300_000, 96.5], [400_000, 97.5], [500_000, 98.5], [1_000_000, 99.5],
]

function getPercentile(income: number): number {
  for (let i = 1; i < PERCENTILE_ANCHORS.length; i++) {
    const [lo, plo] = PERCENTILE_ANCHORS[i - 1]
    const [hi, phi] = PERCENTILE_ANCHORS[i]
    if (income <= hi) {
      const frac = (income - lo) / (hi - lo)
      return Math.round(plo + frac * (phi - plo))
    }
  }
  return 99
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

function fmtAUD(n: number): string {
  return Math.round(Math.abs(n)).toLocaleString('en-AU', {
    style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
  })
}

function fmtRate(r: number): string {
  return `${(r * 100).toFixed(1)}%`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({
  label, hint, checked, onChange,
}: {
  label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
        checked
          ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-brand-500 border-brand-500' : 'border-gray-300 dark:border-gray-600'
      }`}>
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span>{label}</span>
      {hint && <span className="text-xs text-gray-400 dark:text-gray-500">{hint}</span>}
    </button>
  )
}

function ResultRow({
  label, values, highlight, negative, sub,
}: {
  label: string; values: number[]; highlight?: boolean; negative?: boolean; sub?: boolean
}) {
  return (
    <tr className={highlight ? 'bg-brand-50 dark:bg-brand-950/30' : undefined}>
      <td className={`py-2.5 pl-3 pr-2 text-sm ${sub ? 'pl-5 text-gray-400 dark:text-gray-500 text-xs' : highlight ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className={`py-2.5 px-2 text-right text-sm tabular-nums ${
          highlight
            ? 'font-bold text-brand-600 dark:text-brand-400'
            : negative && v !== 0
            ? 'text-red-500 dark:text-red-400'
            : sub
            ? 'text-gray-400 dark:text-gray-500 text-xs'
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {negative && v !== 0 ? '−' : ''}{fmtAUD(v)}
        </td>
      ))}
    </tr>
  )
}

// ─── Tax bracket visualisation ────────────────────────────────────────────────

function TaxBreakdownBar({ base, year }: { base: number; year: TaxYear }) {
  const brackets =
    year === '2024-25' || year === '2025-26'
      ? [
          { label: '0%',  from: 0,       to: 18_200,  rate: 0    },
          { label: '16%', from: 18_200,  to: 45_000,  rate: 0.16 },
          { label: '30%', from: 45_000,  to: 135_000, rate: 0.30 },
          { label: '37%', from: 135_000, to: 190_000, rate: 0.37 },
          { label: '45%', from: 190_000, to: Infinity, rate: 0.45 },
        ]
      : [
          { label: '0%',    from: 0,       to: 18_200,  rate: 0     },
          { label: '19%',   from: 18_200,  to: 45_000,  rate: 0.19  },
          { label: '32.5%', from: 45_000,  to: 120_000, rate: 0.325 },
          { label: '37%',   from: 120_000, to: 180_000, rate: 0.37  },
          { label: '45%',   from: 180_000, to: Infinity, rate: 0.45 },
        ]

  // Only show brackets up to income level
  const cap   = Math.max(base, 1)
  const shown = brackets.filter(b => b.from < cap)

  const colors = ['bg-gray-200 dark:bg-gray-700', 'bg-blue-200 dark:bg-blue-900', 'bg-blue-400 dark:bg-blue-700', 'bg-blue-600 dark:bg-blue-500', 'bg-blue-800 dark:bg-blue-400']
  const textColors = ['text-gray-500','text-blue-700 dark:text-blue-300','text-blue-700 dark:text-blue-200','text-white','text-white']

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tax brackets for {year}</h3>
      <div className="flex rounded-lg overflow-hidden h-8">
        {shown.map((b, i) => {
          const width = (Math.min(cap, b.to === Infinity ? cap : b.to) - b.from) / cap * 100
          return (
            <div
              key={i}
              className={`${colors[i]} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${width}%` }}
              title={`${b.label} on $${b.from.toLocaleString()} – $${b.to === Infinity ? '∞' : b.to.toLocaleString()}`}
            >
              {width > 8 && (
                <span className={`text-xs font-bold ${textColors[i]}`}>{b.label}</span>
              )}
            </div>
          )
        })}
      </div>
      <div className="grid gap-1.5">
        {brackets.map((b, i) => {
          const applies = base > b.from
          const taxable = applies ? Math.max(0, Math.min(base, b.to === Infinity ? base : b.to) - b.from) : 0
          const tax     = Math.round(taxable * b.rate)
          return (
            <div key={i} className={`flex items-center gap-2 text-xs ${applies ? 'opacity-100' : 'opacity-30'}`}>
              <span className={`w-3 h-3 rounded-sm shrink-0 ${colors[i]}`} />
              <span className="text-gray-500 dark:text-gray-400 w-12 shrink-0">{b.label}</span>
              <span className="text-gray-600 dark:text-gray-400 flex-1">
                ${b.from.toLocaleString()} – {b.to === Infinity ? 'above' : `$${b.to.toLocaleString()}`}
              </span>
              {applies && (
                <span className="text-gray-700 dark:text-gray-300 font-medium tabular-nums">
                  {fmtAUD(tax)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Income percentile visualisation ─────────────────────────────────────────

function IncomePercentile({ income }: { income: number }) {
  const pct = getPercentile(income)
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Income range</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        A taxable income of <strong className="text-gray-800 dark:text-gray-200">{fmtAUD(income)}</strong> is higher than approximately{' '}
        <strong className="text-brand-600 dark:text-brand-400">{pct}%</strong> of Australian tax filers.
      </p>
      <div className="relative h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
          style={{ width: `${Math.min(pct, 99)}%` }}
        />
        <div
          className="absolute top-0 w-0.5 h-full bg-brand-700 dark:bg-brand-300"
          style={{ left: `${Math.min(pct, 99)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600">
        <span>0%</span>
        <span className="text-brand-600 dark:text-brand-400 font-medium">{pct}th percentile</span>
        <span>100%</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Source: ATO individual income tax statistics. Data includes all lodged returns.
      </p>
    </div>
  )
}

// ─── HECS repayment calculator ────────────────────────────────────────────────

function HECSRepayment({
  annualRepayment, year,
}: {
  annualRepayment: number; year: TaxYear
}) {
  const [debtStr, setDebtStr]           = useState('30000')
  const [indexation, setIndexation]     = useState(3.5)
  const [wagePct, setWagePct]           = useState(3)
  const [showDetails, setShowDetails]   = useState(false)

  const debt = parseFloat(debtStr.replace(/[^\d.]/g, '')) || 0

  // Project repayment timeline
  const timeline = useMemo(() => {
    if (debt <= 0 || annualRepayment <= 0) return []
    let balance    = debt
    let income     = annualRepayment / (calcHECS(annualRepayment > 0 ? 80_000 : 1, year) / 80_000 || 0.01)
    // Simpler: just use the annual repayment amount provided
    const rows: { year: number; balance: number; repayment: number; interest: number }[] = []
    const MAX_YEARS = 30
    for (let y = 0; y < MAX_YEARS; y++) {
      const interest  = Math.round(balance * (indexation / 100))
      const repayment = Math.min(annualRepayment, balance + interest)
      balance = balance + interest - repayment
      rows.push({ year: new Date().getFullYear() + y, balance: Math.max(0, balance), repayment, interest })
      if (balance <= 0) break
    }
    return rows
  }, [debt, annualRepayment, indexation, year])

  if (annualRepayment <= 0) {
    return (
      <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
        Your income is below the HECS/HELP repayment threshold. No repayments required.
      </div>
    )
  }

  const repaymentYears = timeline.length

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Student loan repayment</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {/* Debt input */}
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Current loan balance</label>
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:border-brand-400 dark:focus-within:border-brand-600 transition-colors">
            <span className="text-sm text-gray-400 mr-1">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={debtStr ? Number(debtStr.replace(/[^\d]/g,'')).toLocaleString('en-AU') : ''}
              onChange={e => setDebtStr(e.target.value.replace(/[^\d]/g,''))}
              className="flex-1 bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 outline-none"
              placeholder="30,000"
            />
          </div>
        </div>

        {/* Indexation */}
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            Debt indexation rate: <strong>{indexation}% p.a.</strong>
          </label>
          <input
            type="range" min={0} max={10} step={0.5}
            value={indexation}
            onChange={e => setIndexation(parseFloat(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600 mt-0.5">
            <span>0%</span><span>5%</span><span>10%</span>
          </div>
        </div>
      </div>

      {debt > 0 && (
        <>
          <div className="rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Annual repayment</p>
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400">{fmtAUD(annualRepayment)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Estimated payoff</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {repaymentYears >= 30 ? '30+ years' : `${repaymentYears} year${repaymentYears !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Monthly repayment</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{fmtAUD(annualRepayment / 12)}</p>
            </div>
          </div>

          {/* Repayment chart (bar) */}
          {timeline.length > 0 && (
            <div>
              <button
                onClick={() => setShowDetails(d => !d)}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline mb-2"
              >
                {showDetails ? 'Hide' : 'Show'} year-by-year breakdown
              </button>
              {showDetails && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                        <th className="pb-1.5 pr-3">Year</th>
                        <th className="pb-1.5 pr-3 text-right">Repayment</th>
                        <th className="pb-1.5 pr-3 text-right">Indexation</th>
                        <th className="pb-1.5 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeline.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                          <td className="py-1.5 pr-3 text-gray-600 dark:text-gray-400">{row.year}</td>
                          <td className="py-1.5 pr-3 text-right text-green-600 dark:text-green-400">−{fmtAUD(row.repayment)}</td>
                          <td className="py-1.5 pr-3 text-right text-red-500 dark:text-red-400">+{fmtAUD(row.interest)}</td>
                          <td className="py-1.5 text-right tabular-nums text-gray-700 dark:text-gray-300 font-medium">{fmtAUD(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Balance bar chart */}
              <div className="mt-3 flex items-end gap-0.5 h-16">
                {timeline.map((row, i) => {
                  const maxDebt = debt
                  const heightPct = (row.balance / maxDebt) * 100
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-brand-200 dark:bg-brand-800 rounded-t transition-all duration-300 hover:bg-brand-400 dark:hover:bg-brand-600 cursor-default"
                      style={{ height: `${Math.max(2, heightPct)}%` }}
                      title={`${row.year}: ${fmtAUD(row.balance)} remaining`}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Debt balance by year (assumes {indexation}% indexation, current income)</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PayCalculator() {
  const [inputStr,   setInputStr]   = useState('85000')
  const [payCycle,   setPayCycle]   = useState<PayCycle>('annual')
  const [taxYear,    setTaxYear]    = useState<TaxYear>('2025-26')
  const [incSuper,   setIncSuper]   = useState(false)
  const [incHECS,    setIncHECS]    = useState(false)
  const [proRata,    setProRata]    = useState(false)
  const [hoursWeek,  setHoursWeek]  = useState(38)
  const [activeTab,  setActiveTab]  = useState<'breakdown' | 'percentile' | 'hecs'>('breakdown')

  // Convert input to annual
  const inputNum = parseFloat(inputStr.replace(/[^\d.]/g, '')) || 0
  const cycleMul = PAY_CYCLES.find(c => c.value === payCycle)!.multiplier
  const annualRaw   = inputNum * cycleMul
  const annualInput = proRata && payCycle !== 'hourly' ? annualRaw * (hoursWeek / 38) : annualRaw

  const result = useMemo(
    () => annualInput > 0 ? calculate(annualInput, incSuper, incHECS, taxYear) : null,
    [annualInput, incSuper, incHECS, taxYear],
  )

  const sg = getSuperRate(taxYear)

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[360px,1fr] gap-6 items-start">

        {/* ── LEFT: Inputs ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Salary input */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Your Salary</h2>

            {/* Amount */}
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-3 focus-within:border-brand-400 dark:focus-within:border-brand-600 transition-colors">
              <span className="text-lg text-gray-400 mr-1.5 shrink-0">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="85,000"
                value={inputStr ? Number(inputStr.replace(/[^\d.]/g,'')).toLocaleString('en-AU', { maximumFractionDigits: 2 }) : ''}
                onChange={e => setInputStr(e.target.value.replace(/[^\d.]/g,''))}
                onFocus={e => e.target.select()}
                className="flex-1 min-w-0 bg-transparent text-xl font-bold text-gray-900 dark:text-gray-100 outline-none"
                aria-label="Salary amount"
              />
            </div>

            {/* Pay cycle */}
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {PAY_CYCLES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setPayCycle(c.value)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    payCycle === c.value
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Tax year */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Tax year</label>
              <div className="flex flex-wrap gap-1.5">
                {TAX_YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => setTaxYear(y)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      taxYear === y
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <Toggle
                label="Salary includes Super"
                hint={`(${Math.round(sg * 100)}% SG)`}
                checked={incSuper}
                onChange={setIncSuper}
              />
              <Toggle
                label="Has HECS / HELP student debt"
                checked={incHECS}
                onChange={v => { setIncHECS(v); if (v) setActiveTab('hecs') }}
              />
              <Toggle
                label="Part-time / Pro-rata"
                checked={proRata}
                onChange={setProRata}
              />
            </div>

            {/* Pro-rata hours */}
            {proRata && payCycle !== 'hourly' && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  Hours per week: <strong className="text-gray-700 dark:text-gray-300">{hoursWeek}</strong>
                </label>
                <input
                  type="range" min={1} max={38} step={1}
                  value={hoursWeek}
                  onChange={e => setHoursWeek(parseInt(e.target.value))}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                  <span>1 hr</span><span>19 hrs</span><span>38 hrs</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick stats */}
          {result && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">At a glance</h2>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Effective tax rate"    value={fmtRate(result.effectiveRate)} />
                <Stat label="Marginal rate"          value={fmtRate(result.marginalRate)} />
                <Stat label="Super (employer)"       value={fmtAUD(result.superAmt)} />
                {incHECS && <Stat label="HECS repayment" value={fmtAUD(result.hecs)} />}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Results ────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Take-home headline */}
          {result ? (
            <div className="bg-brand-600 dark:bg-brand-700 rounded-2xl p-5 text-white shadow-sm">
              <p className="text-sm font-medium opacity-80 mb-1">Annual take-home pay</p>
              <p className="text-4xl font-bold tracking-tight">{fmtAUD(result.net)}</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs opacity-70">Monthly</p>
                  <p className="text-lg font-semibold">{fmtAUD(result.net / 12)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Fortnightly</p>
                  <p className="text-lg font-semibold">{fmtAUD(result.net / 26)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Weekly</p>
                  <p className="text-lg font-semibold">{fmtAUD(result.net / 52)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 text-center">
              <p className="text-gray-400 dark:text-gray-500">Enter a salary above to see your take-home pay</p>
            </div>
          )}

          {/* Breakdown table */}
          {result && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="py-3 pl-3 pr-2 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                        {taxYear}
                      </th>
                      {RESULT_COLS.map(c => (
                        <th key={c.label} className="py-3 px-2 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    <ResultRow
                      label="Take-Home Pay"
                      values={RESULT_COLS.map(c => result.net / c.div)}
                      highlight
                    />
                    <ResultRow
                      label="Gross salary"
                      values={RESULT_COLS.map(c => result.base / c.div)}
                    />
                    <ResultRow
                      label={`Super (${Math.round(sg * 100)}% SG)`}
                      values={RESULT_COLS.map(c => result.superAmt / c.div)}
                    />
                    <ResultRow
                      label="Income tax"
                      values={RESULT_COLS.map(c => result.tax / c.div)}
                      negative
                    />
                    {(result.lito > 0 || result.lmito > 0) && (
                      <ResultRow
                        label={`LITO offset${result.lmito > 0 ? ' + LMITO' : ''}`}
                        values={RESULT_COLS.map(c => (result.lito + result.lmito) / c.div)}
                        sub
                      />
                    )}
                    <ResultRow
                      label="Medicare levy"
                      values={RESULT_COLS.map(c => result.medicare / c.div)}
                      negative
                    />
                    {incHECS && (
                      <ResultRow
                        label="HECS/HELP repayment"
                        values={RESULT_COLS.map(c => result.hecs / c.div)}
                        negative
                      />
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 pl-3 pr-2 text-xs text-gray-400 dark:text-gray-500">
                        Effective rate: <strong>{fmtRate(result.effectiveRate)}</strong>
                        {' · '}Marginal: <strong>{fmtRate(result.marginalRate)}</strong>
                      </td>
                      {RESULT_COLS.map(c => (
                        <td key={c.label} className="py-3 px-2 text-right text-xs text-gray-400 dark:text-gray-600">
                          {fmtAUD(result.net / c.div)}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Detail tabs */}
          {result && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-gray-100 dark:border-gray-800">
                {[
                  { key: 'breakdown',  label: 'Tax brackets' },
                  { key: 'percentile', label: 'Income range' },
                  ...(incHECS ? [{ key: 'hecs', label: 'Student loan' }] : []),
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key as typeof activeTab)}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === t.key
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-5">
                {activeTab === 'breakdown' && (
                  <TaxBreakdownBar base={result.base} year={taxYear} />
                )}
                {activeTab === 'percentile' && (
                  <IncomePercentile income={result.base} />
                )}
                {activeTab === 'hecs' && incHECS && (
                  <HECSRepayment annualRepayment={result.hecs} year={taxYear} />
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {result && (
            <p className="text-xs text-gray-400 dark:text-gray-600 px-1">
              Estimate only for FY{taxYear} — does not include Medicare levy surcharge, private health rebate,
              salary packaging, or other individual circumstances. Verify with the ATO or a registered tax agent.
              HECS rates sourced from{' '}
              <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 dark:hover:text-gray-400">
                ato.gov.au
              </a>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  )
}
