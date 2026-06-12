import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — How to Find Hidden Salaries on Seek',
  description:
    'Answers to common questions about finding hidden salaries on Seek: why employers hide pay, how to reveal it, how accurate the results are, and whether it\'s legal.',
  alternates: { canonical: 'https://salaryscraper.com/faq' },
  openGraph: {
    title: 'FAQ — How to Find Hidden Salaries on Seek',
    description: 'Everything you wanted to know about revealing hidden Seek salaries.',
    url: 'https://salaryscraper.com/faq',
  },
}

const FAQS = [
  {
    category: 'About Seek Salaries',
    items: [
      {
        q: 'Why does Seek hide salaries on job listings?',
        a: 'Seek requires employers to enter a salary when they post a job — it\'s needed to power Seek\'s own salary-filter feature. But displaying it on the listing page is optional. Most employers choose to hide the salary to maintain negotiating leverage and avoid deterring applicants who might otherwise self-select out. The result: the salary exists in Seek\'s database, it\'s just not shown to you by default.',
      },
      {
        q: 'How does Salary Scraper reveal the hidden salary?',
        a: 'Seek\'s search engine lets you filter jobs by minimum salary. Salary Scraper exploits this by running a binary search: it asks Seek "does this job appear when filtering for $50k minimum?" then $100k, then narrows down from there. After around 12 requests it pinpoints the salary bracket. This is the same number the employer entered when posting the job — we\'re just surfacing it.',
      },
      {
        q: 'Does Seek always have the salary stored for every listing?',
        a: 'No. Around 10–20% of listings have no salary stored. This typically happens with commission-only roles, very senior executive positions, listings that ask candidates to "negotiate", or old listings where data has expired. In these cases Salary Scraper will tell you clearly that no salary was found rather than guessing.',
      },
      {
        q: 'Is the salary I see the exact amount the employer will offer?',
        a: 'It\'s the salary bracket the employer entered into Seek when posting the job. Because Seek\'s filter uses increments of $10k–$30k, results appear as a range (e.g. "$100k – $120k") rather than a single number. That bracket directly corresponds to the employer\'s target salary. The final offer will depend on your experience and negotiation, but at least you know the ballpark before applying.',
      },
    ],
  },
  {
    category: 'Using Salary Scraper',
    items: [
      {
        q: 'How do I use Salary Scraper?',
        a: 'Go to the homepage, paste any au.seek.com.au or nz.seek.com.au job URL into the input field, and click "Reveal Salary". It takes 5–15 seconds. You\'ll see the salary range, an estimated take-home figure, and the listing is saved to your personal history so you can refer back to it.',
      },
      {
        q: 'Is Salary Scraper free?',
        a: 'Yes, completely free. No account required, no usage limits.',
      },
      {
        q: 'Does it work for New Zealand Seek listings?',
        a: 'Yes. Both au.seek.com.au and nz.seek.com.au listings are supported. Just paste the URL as normal.',
      },
      {
        q: 'What if the job listing has already closed or expired?',
        a: 'Once a Seek listing expires, the job data is no longer returned by Seek\'s API, so Salary Scraper can\'t retrieve the salary. You\'ll see a "listing not found" error. This is expected — there\'s nothing we can do once Seek removes the listing.',
      },
      {
        q: 'How accurate is the salary result?',
        a: 'Very accurate within a salary bracket. Because Seek\'s salary filter works in increments, you\'ll always see a range (e.g. "$100k – $120k") rather than a single number. The result is derived from the exact figure the employer entered, so it\'s as accurate as what the employer chose to put in Seek. In practice the actual offer is almost always within the displayed bracket.',
      },
    ],
  },
  {
    category: 'Is It Legal?',
    items: [
      {
        q: 'Is it legal to use Salary Scraper?',
        a: 'Yes. Salary Scraper only reads data that your browser already accesses when you visit Seek normally. We query Seek\'s public job search API — the same one your browser calls every time you use Seek\'s salary filter. We don\'t bypass any login, don\'t scrape private data, and don\'t violate any payment wall. The salary information was always accessible via Seek\'s own search features; we simply automate finding it.',
      },
      {
        q: 'Is Salary Scraper affiliated with Seek?',
        a: 'No. Salary Scraper is an independent tool and is not affiliated with, endorsed by, or connected to Seek Limited in any way. "Seek" is a registered trademark of Seek Limited.',
      },
    ],
  },
  {
    category: 'Salary Data & Take-Home Pay',
    items: [
      {
        q: 'How is the take-home pay estimate calculated?',
        a: 'We apply ATO 2024–25 individual income tax rates and the 2% Medicare levy to the revealed salary. The Low Income Tax Offset (LITO) is also factored in. The estimate assumes no salary packaging, no HECS/HELP repayment and no private health insurance rebate. It\'s a rough guide — use the ATO\'s tax withheld calculator for a precise figure.',
      },
      {
        q: 'Where does the industry salary data on the Explore page come from?',
        a: 'The Explore page shows broad market ranges aggregated from publicly available sources including ABS earnings data, LinkedIn Salary Insights, and SEEK\'s own salary insights tool. These ranges are updated periodically and are meant as general benchmarks — not a substitute for verifying a specific listing with Salary Scraper.',
      },
      {
        q: 'Why is there a difference between the industry guide and what I see on a specific listing?',
        a: 'Industry guides show broad market ranges across all employers, locations, and experience levels. A specific listing on Seek may pay more (top-tier employer, Sydney, specialist skills) or less (regional, entry-level, small business). Always verify the specific listing rather than relying solely on benchmarks.',
      },
    ],
  },
]

export default function FaqPage() {
  const allFaqs = FAQS.flatMap(section =>
    section.items.map(item => ({ q: item.q, a: item.a }))
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Everything about finding hidden salaries on Seek, how Salary Scraper works, and what the results mean.
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {FAQS.map(section => (
            <section key={section.category}>
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map(item => (
                  <div
                    key={item.q}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.q}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Ready to reveal a salary?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"/>
            </svg>
            Try it now — it&rsquo;s free
          </Link>
        </div>

      </div>
    </main>
  )
}
