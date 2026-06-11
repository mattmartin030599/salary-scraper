import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Helpful Links — Salary Scraper',
  description: 'Salary guides, job hunting resources, and tax calculators for Australia and New Zealand.',
}

const SECTIONS = [
  {
    title: 'Salary guides',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.75 16.82A7.462 7.462 0 0 1 10 17c-.34 0-.674-.024-1-.068v-1.615a5.98 5.98 0 0 0 2 .335V17Zm1.5-.387a7.5 7.5 0 0 0 .85-.48v-1.787a5.98 5.98 0 0 1-1.35.627v1.64Zm2.15-1.466a7.5 7.5 0 0 0 .65-.73V12.81a5.97 5.97 0 0 1-.65.733v2.164Zm1.4-2.28a7.5 7.5 0 0 0 .4-.94v-2.04a5.96 5.96 0 0 1-.4.94v2.04Zm.65-3.39A7.5 7.5 0 0 0 16.5 10a7.5 7.5 0 0 0-.05-.78v-1.59a5.95 5.95 0 0 1 .05.78 5.97 5.97 0 0 1-.05.78v-.85Zm-.05-2.86a7.5 7.5 0 0 0-.35-.93v-1.97c.14.3.26.61.35.93v1.97ZM15.6 4.45a7.5 7.5 0 0 0-.6-.71V1.934a7.48 7.48 0 0 1 .6.71v1.806ZM14.25 3.2A7.483 7.483 0 0 0 10 2a7.5 7.5 0 0 0-7.5 7.5c0 2.3 1.04 4.36 2.68 5.74L3.84 16.576a9 9 0 1 1 12.32 0l-1.34-1.336A7.46 7.46 0 0 0 17.5 9.5c0-1.78-.62-3.41-1.65-4.7L14.25 3.2Z"/>
      </svg>
    ),
    links: [
      {
        name: 'Seek AU Salary Insights',
        url:  'https://www.seek.com.au/career-advice/article/seek-salary-insights',
        desc: "Seek's annual report on Australian salary trends, hiring intentions, and industry benchmarks.",
        badge: 'AU',
      },
      {
        name: 'Seek NZ Salary Guide',
        url:  'https://www.seek.co.nz/career-advice/article/seek-salary-insights',
        desc: 'New Zealand equivalent — salary benchmarks and workforce insights by industry.',
        badge: 'NZ',
      },
      {
        name: 'Michael Page AU Salary Guide',
        url:  'https://www.michaelpage.com.au/salary-guide',
        desc: 'Detailed salary ranges for finance, technology, legal, and executive roles.',
        badge: 'AU',
      },
      {
        name: 'Hays AU Salary Guide',
        url:  'https://www.hays.com.au/salary-guide',
        desc: 'Industry-specific salary data across accountancy, construction, HR, IT, and more.',
        badge: 'AU',
      },
      {
        name: 'Hays NZ Salary Guide',
        url:  'https://www.hays.net.nz/salary-guide',
        desc: "New Zealand salary guide across Hays' specialist sectors.",
        badge: 'NZ',
      },
    ],
  },
  {
    title: 'Salary comparison tools',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 9.5 6ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 3.5 10Z"/>
      </svg>
    ),
    links: [
      {
        name: 'Glassdoor AU',
        url:  'https://www.glassdoor.com.au/Salaries/index.htm',
        desc: 'Employee-reported salaries, company reviews, and interview insights.',
        badge: 'AU',
      },
      {
        name: 'LinkedIn Salary',
        url:  'https://www.linkedin.com/salary/',
        desc: 'Salary data based on LinkedIn member profiles — great for tech and white-collar roles.',
        badge: 'AU/NZ',
      },
      {
        name: 'Payscale AU',
        url:  'https://www.payscale.com/research/AU/Country=Australia/Salary',
        desc: 'Search specific job titles and see percentile salary distributions.',
        badge: 'AU',
      },
      {
        name: 'What\'s The Salary (NZ)',
        url:  'https://www.whatsthesalary.com',
        desc: 'NZ-focused salary discovery tool, similar to Salary Scraper.',
        badge: 'NZ',
      },
    ],
  },
  {
    title: 'Job hunting resources',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 0 1 8.75 1h2.5A2.75 2.75 0 0 1 14 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 0 1 6 4.193V3.75Zm6.5 0v.325a41.622 41.622 0 0 0-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25ZM10 10a1 1 0 0 0-1 1v.01a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1H10Z" clipRule="evenodd"/>
        <path d="M3 15.055v-.684c.516.228 1.066.418 1.637.565A9.448 9.448 0 0 0 10 16c1.766 0 3.42-.389 4.363-.937l.017-.01c.576-.148 1.125-.337 1.64-.565v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 0 1-6.294 0C4.985 17.585 3 16.402 3 15.055Z"/>
      </svg>
    ),
    links: [
      {
        name: 'Seek Job Search Toolkit',
        url:  'https://www.seek.com.au/career-advice',
        desc: 'CV tips, cover letter guides, interview preparation, and career development articles.',
        badge: 'AU',
      },
      {
        name: 'Seek NZ Career Advice',
        url:  'https://www.seek.co.nz/career-advice',
        desc: "New Zealand version of Seek's job hunting and career advice hub.",
        badge: 'NZ',
      },
      {
        name: 'The STAR Technique',
        url:  'https://www.seek.com.au/career-advice/article/how-to-answer-interview-questions-using-the-star-method',
        desc: 'Situation, Task, Action, Result — the go-to framework for behavioural interview questions.',
        badge: 'AU/NZ',
      },
      {
        name: 'Tahatū (NZ) Career Tools',
        url:  'https://www.tahatu.govt.nz',
        desc: "New Zealand's government careers platform — CV builder, career explorer, and labour market info.",
        badge: 'NZ',
      },
      {
        name: 'LinkedIn Resume Builder',
        url:  'https://www.linkedin.com/resume-builder/',
        desc: 'Generate a polished resume from your LinkedIn profile in one click.',
        badge: 'AU/NZ',
      },
    ],
  },
  {
    title: 'Tax calculators',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd"/>
      </svg>
    ),
    links: [
      {
        name: 'ATO Tax Withheld Calculator (AU)',
        url:  'https://www.ato.gov.au/calculators-and-tools/tax-withheld-calculator/',
        desc: "Australia's Tax Office tax withheld calculator — estimate your PAYG tax for any income.",
        badge: 'AU',
      },
      {
        name: 'ATO Individual Income Tax Rates (AU)',
        url:  'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-for-individuals',
        desc: 'Current Australian income tax rate tables — useful for manual calculations.',
        badge: 'AU',
      },
      {
        name: 'IRD PAYE Calculator (NZ)',
        url:  'https://www.ird.govt.nz/income-tax/income-tax-for-individuals/paye-tax-rates-codes-and-tax-tables/using-the-paye-tables',
        desc: "New Zealand's Inland Revenue PAYE tax tables.",
        badge: 'NZ',
      },
      {
        name: 'NZ Income Tax Calculator (paye.net.nz)',
        url:  'https://www.paye.net.nz',
        desc: 'Simple NZ take-home pay calculator — enter a salary and see your net pay after tax and ACC.',
        badge: 'NZ',
      },
      {
        name: 'PayCalculator.com.au',
        url:  'https://paycalculator.com.au',
        desc: 'Australian take-home pay calculator — includes Medicare Levy, LITO, and HECS estimates.',
        badge: 'AU',
      },
    ],
  },
]

const BADGE_STYLE: Record<string, string> = {
  'AU':    'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
  'NZ':    'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  'AU/NZ': 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400',
}

export default function HelpfulLinksPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Helpful links
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            Resources for job seekers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Salary guides, comparison tools, job hunting advice, and tax calculators
            for Australia and New Zealand.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {SECTIONS.map(section => (
            <section key={section.title}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-brand-600 dark:text-brand-400">{section.icon}</span>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {section.title}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                {section.links.map(link => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {link.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${BADGE_STYLE[link.badge]}`}>
                          {link.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                        {link.desc}
                      </p>
                    </div>
                    <svg viewBox="0 0 20 20" fill="currentColor"
                      className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700 group-hover:text-brand-400 shrink-0 mt-0.5 transition-colors">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5ZM10 2.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V4.56l-5.47 5.47a.75.75 0 0 1-1.06-1.06l5.47-5.47h-4.69a.75.75 0 0 1-.75-.75Z" clipRule="evenodd"/>
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-14 text-xs text-center text-gray-400 dark:text-gray-600">
          Links open in a new tab. Salary Scraper is not affiliated with any of the above services.
        </p>

      </div>
    </main>
  )
}
