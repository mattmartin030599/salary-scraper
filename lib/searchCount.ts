import { currentFYStart } from './financialYear'

function kvKey(): string {
  return `counts_fy${currentFYStart()}`
}

// ─── KV abstraction ─────────────────────────────────────────────────────────
// Uses @vercel/kv when KV_REST_API_URL is set (Vercel deployment).
// Falls back to an in-process Map for local dev.

const _mem = new Map<string, unknown>()

async function kvGet<T>(key: string): Promise<T | null> {
  if (!process.env.KV_REST_API_URL) {
    return (_mem.get(key) ?? null) as T | null
  }
  const { kv } = await import('@vercel/kv')
  return kv.get<T>(key)
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (!process.env.KV_REST_API_URL) {
    _mem.set(key, value)
    return
  }
  const { kv } = await import('@vercel/kv')
  await kv.set(key, value)
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Increment the count for a job ID and return the new total. */
export async function incrementCount(jobId: string): Promise<number> {
  const key    = kvKey()
  const counts = (await kvGet<Record<string, number>>(key)) ?? {}
  counts[jobId] = (counts[jobId] ?? 0) + 1
  await kvSet(key, counts)
  return counts[jobId]
}

/** Read the current count without incrementing. */
export async function getCount(jobId: string): Promise<number> {
  const counts = (await kvGet<Record<string, number>>(kvKey())) ?? {}
  return counts[jobId] ?? 0
}
