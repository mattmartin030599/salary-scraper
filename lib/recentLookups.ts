import { currentFYStart } from './financialYear'

export interface RecentLookup {
  jobId:     string
  title:     string
  company:   string
  location:  string
  salaryMin: number
  salaryMax: number
  timestamp: number   // ms since epoch
}

const MAX = 20

function kvKey(): string {
  return `recent_fy${currentFYStart()}`
}

// ─── KV abstraction ─────────────────────────────────────────────────────────
// Uses @vercel/kv when KV_REST_API_URL is set (Vercel deployment).
// Falls back to an in-process Map for local dev — data is per-instance
// but that's fine for development.

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

export async function addLookup(entry: Omit<RecentLookup, 'timestamp'>): Promise<void> {
  const key      = kvKey()
  const list     = (await kvGet<RecentLookup[]>(key)) ?? []
  const filtered = list.filter(l => l.jobId !== entry.jobId)
  const updated  = [{ ...entry, timestamp: Date.now() }, ...filtered].slice(0, MAX)
  await kvSet(key, updated)
}

export async function getRecent(): Promise<RecentLookup[]> {
  return (await kvGet<RecentLookup[]>(kvKey())) ?? []
}
