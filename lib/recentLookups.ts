import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR  = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'recent.json')
const MAX       = 20

export interface RecentLookup {
  jobId:     string
  title:     string
  company:   string
  location:  string
  salaryMin: number
  salaryMax: number
  timestamp: number   // ms since epoch
}

let cache: RecentLookup[] | null = null

function load(): RecentLookup[] {
  if (cache) return cache
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    cache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    cache = []
  }
  return cache!
}

function persist(list: RecentLookup[]) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2))
  } catch (e) {
    console.warn('[recentLookups] persist failed:', e)
  }
}

export function addLookup(entry: Omit<RecentLookup, 'timestamp'>): void {
  const list = load()
  // Remove any existing entry for this job so it bubbles to top
  const filtered = list.filter(l => l.jobId !== entry.jobId)
  const updated  = [{ ...entry, timestamp: Date.now() }, ...filtered].slice(0, MAX)
  cache = updated
  persist(updated)
}

export function getRecent(): RecentLookup[] {
  return load()
}
