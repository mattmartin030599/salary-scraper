/**
 * Australian Financial Year helpers.
 * FY2025-26 = July 1 2025 → June 30 2026  → startYear = 2025
 */

/** Start year of the current Australian FY. */
export function currentFYStart(): number {
  const now = new Date()
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
}

/** Human-readable label, e.g. "2025–26" */
export function fyLabel(): string {
  const s = currentFYStart()
  return `${s}–${(s + 1).toString().slice(2)}`
}
