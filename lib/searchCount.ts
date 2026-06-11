import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR  = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'searches.json')

// Module-level cache — one read per process start, then in-memory
let cache: Record<string, number> | null = null

function load(): Record<string, number> {
  if (cache) return cache
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    cache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    cache = {}
  }
  return cache!
}

function persist(counts: Record<string, number>) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(counts, null, 2))
  } catch (e) {
    console.warn('[searchCount] could not persist counts:', e)
  }
}

/** Increment the count for a job ID and return the new total. */
export function incrementCount(jobId: string): number {
  const counts = load()
  counts[jobId] = (counts[jobId] ?? 0) + 1
  persist(counts)
  return counts[jobId]
}

/** Read the current count without incrementing. */
export function getCount(jobId: string): number {
  return load()[jobId] ?? 0
}
