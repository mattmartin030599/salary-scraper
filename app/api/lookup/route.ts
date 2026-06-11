import { NextRequest } from 'next/server'
import { incrementCount } from '@/lib/searchCount'
import { addLookup }     from '@/lib/recentLookups'

// Seek's internal GraphQL endpoint — confirmed working without auth
const SEEK_GRAPHQL_URL = 'https://au.seek.com/graphql'

// Seek's internal salary bracket values (mirrors their UI filter options)
const SALARY_BRACKETS = [
  50000, 60000, 70000, 80000, 100000,
  120000, 150000, 200000, 250000, 300000, 400000, 500000,
]

const SEEK_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json, */*',
  'Accept-Language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'Origin': 'https://au.seek.com',
  'Referer': 'https://au.seek.com/',
  'Seek-Request-Brand': 'seek',
  'Seek-Request-Country': 'AU',
  'X-Seek-Site': 'chalice',
  'X-Custom-Features': 'application/features.seek.all+json',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
}

const JOB_SEARCH_QUERY = `
  query JobSearchV6($params: JobSearchV6QueryInput!) {
    jobSearchV6(params: $params) {
      data {
        id
        title
        companyName
        salaryLabel
        locations { label }
      }
      totalCount
    }
  }
`

interface SeekJob {
  id: string
  title: string
  companyName: string
  salaryLabel: string
  locations: { label: string }[]
}

// Query Seek's search API.
// salaryMin omitted → no salary filter (existence check).
// salaryMin provided → uses Seek bracket format "X-" (job pays at least X).
async function querySeek(
  keywords: string,
  salaryMin?: number,
): Promise<SeekJob[]> {
  // Per-request session IDs (matching what a real browser sends)
  const sessionId = crypto.randomUUID()
  const visitorId = crypto.randomUUID()

  const params: Record<string, unknown> = {
    channel: 'web',
    keywords,
    siteKey: 'AU',
    locale: 'en-AU',
    salaryType: 'annual',
    pageSize: 100,
    page: 1,
    source: 'FE_SERP',
    eventCaptureSessionId: sessionId,
  }

  // Only add salaryRange when we have a valid bracket value.
  // "0-" or "1-" are not valid Seek bracket values and cause a 400.
  if (salaryMin != null && salaryMin > 0) {
    params.salaryRange = `${salaryMin}-`
  }

  const body = {
    operationName: 'JobSearchV6',
    query: JOB_SEARCH_QUERY,
    variables: { params },
  }

  const res = await fetch(SEEK_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      ...SEEK_HEADERS,
      'X-Seek-Ec-Sessionid': sessionId,
      'X-Seek-Ec-Visitorid': visitorId,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '(no body)')
    console.error(`[seek] ${res.status} body:`, errText.slice(0, 800))
    throw new Error(`Seek API returned ${res.status}`)
  }

  const data = await res.json()
  return data?.data?.jobSearchV6?.data ?? []
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function fmt(n: number) {
  return `$${n.toLocaleString('en-AU')}`
}

// Seek's OG/title tags look like:
//   "Corporate Account Manager Job in Flemington, Melbourne VIC | Victoria Racing Club | SEEK"
//   "Project Manager at BaptistCare | Melbourne VIC | SEEK"
// Extract just the job title (everything before " Job in", " at ", " | ", or " - ").
function parseSeekTitle(raw: string): string {
  return raw
    .replace(/\s*[|]\s*SEEK\s*$/i, '')  // strip trailing " | SEEK"
    .split(/\s+Job in\s+/i)[0]           // strip " Job in Location"
    .split(' at ')[0]                    // strip " at Company"
    .split(' | ')[0]                     // strip remaining pipe sections
    .split(' - ')[0]                     // strip " - something"
    .trim()
}

// ─── Main streaming handler ────────────────────────────────────────────────

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
        send({ type: 'progress', message: 'Fetching job details…', percent: 5 })

        // ── Step 2: Scrape job page for title/company/location ──────────────
        // Seek embeds a GraphQL cache blob directly in the HTML (not __NEXT_DATA__).
        // We extract fields via regex from that blob.
        let jobTitle = ''
        let jobCompany = ''
        let jobLocation = ''

        // Try both domain variants
        const seekPageUrls = [
          `https://au.seek.com/job/${jobId}`,
          `https://www.seek.com.au/job/${jobId}`,
        ]

        for (const pageUrl of seekPageUrls) {
          try {
            const pageRes = await fetch(pageUrl, {
              headers: {
                'User-Agent': SEEK_HEADERS['User-Agent'],
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-AU,en;q=0.9',
              },
              signal: AbortSignal.timeout(8000),
            })
            if (!pageRes.ok) continue
            const html = await pageRes.text()

            // ── Strategy 1: OG title tag ─────────────────────────────────────
            // Seek renders: <meta property="og:title" content="Project Manager | SEEK">
            // or "Project Manager at BaptistCare | SEEK" — most reliable source.
            if (!jobTitle || !jobCompany) {
              const ogMatch = html.match(/<meta\s[^>]*property="og:title"\s[^>]*content="([^"]+)"/i)
                           ?? html.match(/<meta\s[^>]*content="([^"]+)"\s[^>]*property="og:title"/i)
              if (ogMatch) {
                const raw = ogMatch[1].replace(/\s*[|]\s*SEEK\s*$/i, '')
                if (!jobTitle) jobTitle = parseSeekTitle(raw)
                // OG format: "Title Job in Location | Company | SEEK" → company is 2nd pipe segment
                if (!jobCompany) {
                  const parts = raw.split(' | ')
                  if (parts.length >= 2) jobCompany = parts[parts.length - 1].trim()
                }
              }
            }

            // ── Strategy 2: <title> tag ──────────────────────────────────────
            if (!jobTitle) {
              const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
              if (titleMatch) {
                jobTitle = parseSeekTitle(titleMatch[1])
                console.log(`[lookup] <title> tag title="${jobTitle}"`)
              }
            }

            // ── Strategy 3: GraphQL blob anchored to this job ID ─────────────
            // The blob has entries like: "id":"92493599","title":"Project Manager"
            // Anchoring to the job ID avoids matching unrelated cached entries.
            if (!jobTitle) {
              const blobMatch = html.match(new RegExp(`"id":"${jobId}"[^}]{0,300}"title":"([^"]+)"`))
                             ?? html.match(new RegExp(`"title":"([^"]+)"[^}]{0,300}"id":"${jobId}"`))
              if (blobMatch) {
                jobTitle = blobMatch[1]
                console.log(`[lookup] blob (anchored) title="${jobTitle}"`)
              }
            }

            // ── Company / location from blob ─────────────────────────────────
            if (!jobCompany) {
              const companyMatch = html.match(/"advertiser"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/)
              if (companyMatch) jobCompany = companyMatch[1]
            }
            if (!jobLocation) {
              const locationMatch = html.match(/"location"\s*:\s*\{[^}]*"label"\s*:\s*"([^"]+)"/)
                                 ?? html.match(/"locationLabel"\s*:\s*"([^"]+)"/)
              if (locationMatch) jobLocation = locationMatch[1]
            }

            if (jobTitle) {
              console.log(`[lookup] scraped: title="${jobTitle}" company="${jobCompany}" location="${jobLocation}"`)
              break
            }
          } catch (e) {
            console.log(`[lookup] page fetch failed for ${pageUrl}:`, e)
          }
        }

        console.log(`[lookup] scraped title="${jobTitle}" company="${jobCompany}" location="${jobLocation}"`)


        send({ type: 'progress', message: 'Confirming listing on Seek…', percent: 10 })
        await sleep(250)

        // ── Step 3: Confirm job exists via GraphQL ──────────────────────────
        // Try keyword combinations (most specific → least specific), no salary filter.
        const candidateKeywords = [
          jobTitle && jobCompany ? `${jobTitle} ${jobCompany}` : null,
          jobTitle || null,
          jobId,
          '',
        ].filter(Boolean) as string[]

        let foundJob: SeekJob | undefined

        for (const kw of candidateKeywords) {
          console.log(`[lookup] initial probe keywords="${kw}"`)
          try {
            const jobs = await querySeek(kw)  // no salary filter for existence check
            console.log(`[lookup] got ${jobs.length} results`)
            foundJob = jobs.find((j) => j.id === jobId)
            if (foundJob) {
              console.log(`[lookup] job found with keywords="${kw}"`)
              break
            }
          } catch (e) {
            console.log(`[lookup] probe failed for kw="${kw}":`, e)
          }
          await sleep(300)
        }

        // Populate details from search result if page scrape missed anything
        if (foundJob) {
          if (!jobTitle)    jobTitle    = foundJob.title ?? ''
          if (!jobCompany)  jobCompany  = foundJob.companyName ?? ''
          if (!jobLocation) jobLocation = foundJob.locations?.[0]?.label ?? ''
        } else {
          console.log(`[lookup] job ${jobId} not found in any initial probe — may have no salary or be expired`)
        }

        // Use most specific keyword combo that worked, or best guess
        const searchKw = jobTitle && jobCompany
          ? `${jobTitle} ${jobCompany}`
          : jobTitle || jobId

        send({
          type: 'jobFound',
          title:    jobTitle    || 'Unknown Position',
          company:  jobCompany  || '',
          location: jobLocation || 'Australia',
          percent: 18,
        })

        await sleep(200)

        // ── Steps 4–5: Salary bracket scan ────────────────────────────────
        // Seek's API ONLY supports minimum-salary filters: salaryRange:"X-"
        // (formats like "0-X" return 400). So we use a single upward scan:
        //
        //   salaryRange:"X-" → Seek returns jobs whose stored salary ≥ X
        //
        // Scan LOW → HIGH. The job appears until X exceeds the stored salary.
        //   • Last bracket where it appears  = salary floor  (salaryMin)
        //   • Next bracket up (first miss)   = salary ceiling (salaryMax)
        //
        // This gives users a bracket range, e.g. "$99k – $120k".

        send({ type: 'progress', message: 'Scanning salary brackets…', percent: 22 })

        let salaryMin = 0
        let salaryMax = 0
        const steps = SALARY_BRACKETS.length

        for (let i = 0; i < steps; i++) {
          const bracket = SALARY_BRACKETS[i]
          const percent = 22 + Math.round((i / steps) * 70)

          send({
            type: 'progress',
            message: `Testing ${fmt(bracket)}…`,
            percent,
            testing: bracket,
            phase: 'scan',
          })

          await sleep(260)

          try {
            const jobs = await querySeek(searchKw, bracket)
            const found = jobs.some((j) => j.id === jobId)
            console.log(`[lookup] probe ${bracket}-: found=${found} (${jobs.length} results, kw="${searchKw}")`)

            if (found) {
              salaryMin = bracket
              // Ceiling = next bracket, or 20% above if this is the last one
              salaryMax = SALARY_BRACKETS[i + 1] ?? Math.round(bracket * 1.2 / 1000) * 1000
            } else {
              break // First miss — all higher brackets will also miss
            }
          } catch (e) {
            console.error(`[lookup] probe error at ${bracket}:`, e)
            break
          }
        }

        // ── Fallback / sanity ───────────────────────────────────────────────
        if (salaryMin === 0) {
          send({
            type: 'error',
            message:
              "Couldn't find a salary for this listing. It may have no salary stored, or the listing has expired.",
          })
          return
        }

        // ── Step 6: Emit result ─────────────────────────────────────────────
        const searchCount = incrementCount(jobId)
        addLookup({ jobId, title: jobTitle || 'Unknown Position', company: jobCompany || '', location: jobLocation || 'Australia', salaryMin, salaryMax })

        send({
          type: 'result',
          jobId,
          title:     jobTitle    || 'Unknown Position',
          company:   jobCompany  || '',
          location:  jobLocation || 'Australia',
          salaryMin,
          salaryMax,
          currency: 'AUD',
          searchCount,
          percent: 100,
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
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
