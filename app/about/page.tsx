import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — How Salary Scraper Works',
  description:
    'Learn how Salary Scraper reveals the salary Seek employers hide from job listings, using binary search against Seek\'s own salary filter API.',
  alternates: { canonical: 'https://salaryscraper.com/about' },
  openGraph: {
    title: 'About — How Salary Scraper Works',
    description: 'How we reveal hidden Seek salaries using binary search against Seek\'s internal filter API.',
    url: 'https://salaryscraper.com/about',
  },
}

const HOW_IT_WORKS_STEPS = [
  {
    n: '01',
    title: 'You paste a Seek URL',
    body: "Copy any Seek job listing URL and drop it into the Salary Scraper. It doesn't matter if the listing shows a salary or not.",
  },
  {
    n: '02',
    title: 'We query Seek\'s filter API',
    body: "Seek's search engine lets you filter by minimum salary. We probe it with a binary-search approach — roughly 12 requests — to pinpoint the highest salary filter where the job still appears in results.",
  },
  {
    n: '03',
    title: 'We find the salary bracket',
    body: "The bracket we land on (e.g. \"$100k – $120k\") is the employer's internal salary entry — the same figure Seek uses for their own salary-filter feature, just never shown publicly by default.",
  },
  {
    n: '04',
    title: 'You get the number',
    body: "We show you the salary range, a rough take-home estimate, and add the result to your personal lookup history so you can refer back to it.",
  },
]

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            About
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Salary Scraper"
            className="h-16 w-auto mx-auto mb-4 opacity-90"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            About Salary Scraper
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Salary transparency, one listing at a time.
          </p>
        </div>

        {/* Why it exists */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-7">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Why we built this
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Job hunting is hard enough without playing a guessing game about salary. Employers routinely withhold pay information to maintain negotiating leverage — leaving candidates to waste time on interviews for roles they'd never accept at the offered rate.
              </p>
              <p>
                But here's the thing: Seek <em>already</em> knows the salary for almost every listing. Employers enter it when posting a job so that Seek's salary filter works. They just choose to hide it from the listing page.
              </p>
              <p>
                Salary Scraper reads exactly the same salary data Seek already stores — we just surface it to you before you apply.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 text-center">
            How it works
          </h2>
          <div className="space-y-4">
            {HOW_IT_WORKS_STEPS.map(step => (
              <div
                key={step.n}
                className="flex gap-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-5"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/60 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-700 dark:text-brand-400">{step.n}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{step.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accuracy */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-7">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How accurate is it?
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Very accurate — but expressed as a bracket, not an exact figure. Because Seek's salary filter uses steps of around $10k–$30k, the result looks like <span className="font-medium text-gray-700 dark:text-gray-300">"$100k – $120k"</span> rather than a single number.
              </p>
              <p>
                That said, this bracket is derived from the actual number the employer typed into Seek. It's the same data Seek uses to power its own salary-filter feature.
              </p>
              <p>
                A small percentage of listings have no salary stored at all — usually executive, commission-only, or very senior roles, or listings that have expired. In those cases we'll tell you clearly that no salary was found.
              </p>
            </div>
          </div>
        </section>

        {/* Legal / Disclaimer */}
        <section className="mb-12">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
              </svg>
              Disclaimer
            </h2>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Salary Scraper is an independent tool and is not affiliated with, endorsed by, or connected to Seek Limited in any way. We access only publicly accessible data via the same APIs your browser uses when you visit seek.com.au. Take-home pay estimates are approximate, based on standard ATO 2024–25 individual tax rates, and do not constitute financial or tax advice.
            </p>
          </div>
        </section>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"/>
            </svg>
            Reveal a salary
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"/>
              <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"/>
            </svg>
            Contact us
          </Link>
        </div>

      </div>
    </main>
  )
}
