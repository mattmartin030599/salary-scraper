import { NextRequest } from 'next/server'
import { incrementCount } from '@/lib/searchCount'
import { addLookup }     from '@/lib/recentLookups'

// Seek's internal GraphQL endpoint
const SEEK_GRAPHQL_URL = 'https://au.seek.com/graphql'

const SEEK_HEADERS: Record<string, string> = {
  'Content-Type':          'application/json',
  'Accept':                'application/json, */*',
  'Accept-Language':       'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'Origin':                'https://au.seek.com',
  'Referer':               'https://au.seek.com/',
  'Seek-Request-Brand':    'seek',
  'Seek-Request-Country':  'AU',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
}

// jobDetails returns salary label + metadata in a single call — no session cookies needed.
const JOB_DETAILS_QUERY = `
  query GetJobDetails($id: ID!) {
    jobDetails(id: $id) {
      job {
        id
        title
        salary { label }
        advertiser { name(locale: "en-AU") }
        location { label(locale: "en-AU") }
      }
    }
  }
`

// ─── Salary label parser ──────────────────────────────────────────────────────
// Seek stores salary as a human-readable label, e.g.:
//   "$90,000 – $120,000 per year"
//   "$110,000 – $120,000 per year"
//   "$60 – $80 per hour"
//   "$120,000+"
//   "$100k – $130k per year"
// We parse it into integer min/max annual figures.

// Anything that annualises to less than this is almost certainly an unlabelled
// hourly/daily rate — we can't safely convert it without knowing the period.
const MIN_ANNUAL = 15_000

function parseSalaryLabel(label: string | null | undefined): { min: number; max: number } | null {
  if (!label) return null

  // Determine period multiplier
  let mult = 1
  if      (/per\s+hour/i.test(label))                    mult = 38 * 52  // ~1,976 hrs/yr
  else if (/per\s+day/i.test(label))                     mult = 5  * 52  // 5-day week
  else if (/per\s+(fortnight|two\s+weeks)/i.test(label)) mult = 26
  else if (/per\s+week/i.test(label))                    mult = 52
  else if (/per\s+month/i.test(label))                   mult = 12
  // "per year" or no period → mult stays 1

  // Normalise: strip commas, expand "k" suffix (e.g. "120k" → "120000")
  const norm = label
    .replace(/,/g, '')
    .replace(/(\d+\.?\d*)k\b/gi, (_, n) => String(Math.round(parseFloat(n) * 1000)))

  // Range: "$90000 – $120000" or "$90000 - $120000"
  // parseFloat handles decimal rates like "$54.88 – $60.00 per hour"
  const rangeMatch = norm.match(/\$(\d+\.?\d*)\s*[–\-]+\s*\$(\d+\.?\d*)/)
  if (rangeMatch) {
    const min = Math.round(parseFloat(rangeMatch[1]) * mult)
    const max = Math.round(parseFloat(rangeMatch[2]) * mult)
    if (min >= MIN_ANNUAL && max >= MIN_ANNUAL) return { min, max }
  }

  // Lower-bound only: "$120000+"
  const plusMatch = norm.match(/\$(\d+\.?\d*)\s*\+/)
  if (plusMatch) {
    const min = Math.round(parseFloat(plusMatch[1]) * mult)
    if (min >= MIN_ANNUAL) return { min, max: Math.round(min * 1.25 / 1000) * 1000 }
  }

  // Single value: "$120000 per year"
  const singleMatch = norm.match(/\$(\d+\.?\d*)/)
  if (singleMatch) {
    const val = Math.round(parseFloat(singleMatch[1]) * mult)
    if (val >= MIN_ANNUAL) {
      return {
        min: Math.round(val * 0.9 / 1000) * 1000,
        max: Math.round(val * 1.1 / 1000) * 1000,
      }
    }
  }

  return null
}

// ─── Main streaming handler ───────────────────────────────────────────────────// ─── Main streaming handler ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const body = await req.json()
        const url: string = body?.url?.trim() ?? ''

        if (!url) {
          send({ type: 'error', message: 'Please enter a Seek job URL.' })
          return
        }

        // ── Step 1: Extract job ID ──────────────────────────────────────────
        const idMatch = url.match(/\/job\/(\d+)/)
        if (!idMatch) {
          send({
            type: 'error',
            message:
              'Not a valid Seek job URL. Expected format: https://www.seek.com.au/job/12345678',
          })
          return
        }
        const jobId = idMatch[1]

        send({ type: 'progress', message: 'Fetching job details…', percent: 25 })

        // ── Step 2: Fetch job details via Seek GraphQL ──────────────────────
        // jobDetails(id) returns title, company, location and salary label
        // in a single call — no session cookies or tracking IDs required.
        const res = await fetch(SEEK_GRAPHQL_URL, {
          method: 'POST',
          headers: SEEK_HEADERS,
          body: JSON.stringify({
            operationName: 'GetJobDetails',
            query: JOB_DETAILS_QUERY,
            variables: { id: jobId },
          }),
          signal: AbortSignal.timeout(12000),
        })

        if (!res.ok) {
          const errText = await res.text().catch(() => '(no body)')
          console.error(`[lookup] Seek API ${res.status}:`, errText.slice(0, 400))
          throw new Error(`Seek API returned ${res.status}`)
        }

        const data = await res.json()

        if (data?.errors?.length) {
          console.error('[lookup] GraphQL errors:', JSON.stringify(data.errors).slice(0, 400))
        }

        const job = data?.data?.jobDetails?.job

        // ── Step 3: Check the listing exists ───────────────────────────────
        if (!job) {
          send({
            type: 'error',
            message: "Couldn't find this listing. It may have expired or the URL is incorrect.",
          })
          return
        }

        const jobTitle    = job.title                  ?? ''
        const jobCompany  = job.advertiser?.name       ?? ''
        const jobLocation = job.location?.label        ?? 'Australia'
        const salaryLabel = job.salary?.label          ?? null

        send({
          type:     'jobFound',
          title:    jobTitle    || 'Unknown Position',
          company:  jobCompany  || '',
          location: jobLocation,
          percent:  65,
        })

        // ── Step 4: Parse salary label ──────────────────────────────────────
        const salary = parseSalaryLabel(salaryLabel)

        if (!salary) {
          send({
            type: 'error',
            message:
              "Couldn't find a salary for this listing. The employer hasn't disclosed salary details on Seek.",
          })
          return
        }

        send({ type: 'progress', message: 'Calculating…', percent: 90 })

        // ── Step 5: Record and emit result ──────────────────────────────────
        const searchCount = incrementCount(jobId)
        addLookup({
          jobId,
          title:     jobTitle    || 'Unknown Position',
          company:   jobCompany  || '',
          location:  jobLocation,
          salaryMin: salary.min,
          salaryMax: salary.max,
        })

        send({
          type:        'result',
          jobId,
          title:       jobTitle    || 'Unknown Position',
          company:     jobCompany  || '',
          location:    jobLocation,
          salaryMin:   salary.min,
          salaryMax:   salary.max,
          salaryLabel: salaryLabel ?? undefined,
          currency:    'AUD',
          searchCount,
          percent:     100,
        })
      } catch (err) {
        console.error('[lookup]', err)
        send({ type: 'error', message: 'Something went wrong. Please try again.' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  })
}
