// ATO individual income tax — update thresholds each July if brackets change

/** Start year of the current Australian FY (e.g. 2025 for FY2025-26) */
function currentFYStart(): number {
  const now = new Date()
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
}

/** Super guarantee rate — legislated schedule */
export function superRate(): number {
  const fy = currentFYStart()
  if (fy >= 2025) return 0.12    // FY2025-26 onward: 12%
  if (fy === 2024) return 0.115  // FY2024-25: 11.5%
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

// Low Income Tax Offset
function calcLITO(income: number): number {
  if (income <= 37_500) return 700
  if (income <= 45_000) return 700 - (income - 37_500) * 0.05
  if (income <= 66_667) return 325 - (income - 45_000) * 0.015
  return 0
}

function calcMedicare(income: number): number {
  if (income <= 26_000) return 0
  if (income <= 32_500) return (income - 26_000) * 0.1  // phase-in
  return income * 0.02
}

/** HECS/HELP repayment — applied to entire income once threshold is crossed */
export function calcHECS(income: number): number {
  const bands = [
    [54_435,  0.010],
    [62_851,  0.020],
    [66_621,  0.025],
    [70_619,  0.030],
    [74_56,  0.035],
    [79_347,  0.040],
    [84_108,  0.045],
    [89_155,  0.050],
    [94_504,  0.055],
    [100_175, 0.060],
    [106_186, 0.065],
    [112_557, 0.070],
    [119_310, 0.075],
    [126_468, 0.080],
    [134_057, 0.085],
    [142_100, 0.090],
    [150_626, 0.095],
  ]
  for (const [threshold, rate] of bands) {
    if (income < threshold) return Math.round(income * rate)
  }
  return Math.round(income * 0.10)
}

export type TakeHomeResult = {
  gross:         number
  base:          number
  tax:           number
  medicare:      number
  hecs:          number
  super:         number
  net:           number
  effectiveRate: number
}

export type TakeHomeOptions = {
  includingSuper: boolean
  includeHECS:   boolean
}

export function calcTakeHome(grossSalary: number, opts: TakeHomeOptions): TakeHomeResult {
  const rate = superRate()
  const base     = opts.includingSuper ? Math.round(grossSalary / (1 + rate)) : grossSalary
  const superAmt = opts.includingSuper ? grossSalary - base : Math.round(base * rate)
  const tax      = Math.max(0, Math.round(calcIncomeTax(base) - calcLITO(base)))
  const medicare = Math.round(calcMedicare(base))
  const hecs     = opts.includeHECS ? calcHECS(base) : 0
  const net      = base - tax - medicare - hecs
  const totalDeductions = tax + medicare + hecs
  const effectiveRate = base > 0 ? Math.round((totalDeductions / base) * 1000) / 10 : 0
  return { gross: grossSalary, base, tax, medicare, hecs, super: superAmt, net, effectiveRate }
}
