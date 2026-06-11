import type { Metadata } from 'next'
import AdUnit from '@/components/AdUnit'
import { AD_SLOTS } from '@/lib/adSlots'

export const metadata: Metadata = {
  title: 'Industry Salary Ranges — Australia & New Zealand',
  description:
    'Browse typical salary ranges by industry across Australia and New Zealand. Tech, finance, healthcare, engineering, legal, trades and more.',
  alternates: { canonical: 'https://salaryscraper.com/explore' },
  openGraph: {
    title: 'Industry Salary Ranges — Australia & New Zealand',
    description: 'Typical salary ranges for 40+ roles across 8 industries in AU & NZ.',
    url: 'https://salaryscraper.com/explore',
  },
}

const INDUSTRIES = [
  {
    name: 'Technology & IT',
    icon: '💻',
    roles: [
      { title: 'Software Engineer',          auRange: '$80k – $150k',  nzRange: 'NZD $70k – $130k' },
      { title: 'Senior Software Engineer',   auRange: '$130k – $200k', nzRange: 'NZD $110k – $175k' },
      { title: 'Data Scientist',             auRange: '$100k – $160k', nzRange: 'NZD $90k – $145k' },
      { title: 'Product Manager',            auRange: '$110k – $175k', nzRange: 'NZD $100k – $155k' },
      { title: 'UX Designer',                auRange: '$80k – $130k',  nzRange: 'NZD $70k – $115k' },
      { title: 'DevOps / Cloud Engineer',    auRange: '$110k – $175k', nzRange: 'NZD $100k – $155k' },
    ],
  },
  {
    name: 'Finance & Banking',
    icon: '🏦',
    roles: [
      { title: 'Financial Analyst',          auRange: '$70k – $110k',  nzRange: 'NZD $65k – $100k' },
      { title: 'Accountant',                 auRange: '$65k – $105k',  nzRange: 'NZD $60k – $95k'  },
      { title: 'Investment Banker (Analyst)',auRange: '$90k – $140k',  nzRange: 'NZD $80k – $125k' },
      { title: 'Risk Manager',               auRange: '$110k – $170k', nzRange: 'NZD $100k – $150k'},
      { title: 'CFO',                        auRange: '$200k – $400k+',nzRange: 'NZD $180k – $350k+'},
    ],
  },
  {
    name: 'Healthcare & Medical',
    icon: '🏥',
    roles: [
      { title: 'Registered Nurse (RN)',      auRange: '$70k – $100k',  nzRange: 'NZD $60k – $90k'  },
      { title: 'General Practitioner (GP)',  auRange: '$150k – $280k', nzRange: 'NZD $130k – $250k' },
      { title: 'Pharmacist',                 auRange: '$80k – $120k',  nzRange: 'NZD $75k – $110k' },
      { title: 'Physiotherapist',            auRange: '$70k – $110k',  nzRange: 'NZD $65k – $100k' },
      { title: 'Hospital Administrator',     auRange: '$85k – $135k',  nzRange: 'NZD $80k – $120k' },
    ],
  },
  {
    name: 'Engineering',
    icon: '⚙️',
    roles: [
      { title: 'Civil Engineer',             auRange: '$75k – $130k',  nzRange: 'NZD $70k – $120k' },
      { title: 'Mechanical Engineer',        auRange: '$75k – $130k',  nzRange: 'NZD $70k – $115k' },
      { title: 'Electrical Engineer',        auRange: '$80k – $140k',  nzRange: 'NZD $75k – $125k' },
      { title: 'Project Engineer',           auRange: '$85k – $140k',  nzRange: 'NZD $80k – $125k' },
      { title: 'Structural Engineer',        auRange: '$80k – $135k',  nzRange: 'NZD $75k – $120k' },
    ],
  },
  {
    name: 'Marketing & Communications',
    icon: '📣',
    roles: [
      { title: 'Marketing Manager',          auRange: '$90k – $140k',  nzRange: 'NZD $80k – $125k' },
      { title: 'Digital Marketing Specialist',auRange: '$60k – $95k',  nzRange: 'NZD $55k – $85k'  },
      { title: 'Content Writer / Copywriter',auRange: '$55k – $85k',   nzRange: 'NZD $50k – $80k'  },
      { title: 'PR Manager',                 auRange: '$85k – $130k',  nzRange: 'NZD $75k – $115k' },
      { title: 'Brand Manager',              auRange: '$90k – $140k',  nzRange: 'NZD $80k – $125k' },
    ],
  },
  {
    name: 'Education',
    icon: '🎓',
    roles: [
      { title: 'Primary School Teacher',     auRange: '$70k – $100k',  nzRange: 'NZD $58k – $90k'  },
      { title: 'Secondary School Teacher',   auRange: '$72k – $102k',  nzRange: 'NZD $60k – $93k'  },
      { title: 'Principal',                  auRange: '$110k – $170k', nzRange: 'NZD $100k – $150k' },
      { title: 'University Lecturer',        auRange: '$100k – $160k', nzRange: 'NZD $90k – $145k' },
    ],
  },
  {
    name: 'Legal',
    icon: '⚖️',
    roles: [
      { title: 'Solicitor / Lawyer',         auRange: '$70k – $130k',  nzRange: 'NZD $65k – $120k' },
      { title: 'Senior Associate',           auRange: '$120k – $200k', nzRange: 'NZD $110k – $180k' },
      { title: 'Partner (Law Firm)',         auRange: '$200k – $500k+',nzRange: 'NZD $180k – $450k+'},
      { title: 'In-house Counsel',           auRange: '$120k – $200k', nzRange: 'NZD $110k – $180k' },
    ],
  },
  {
    name: 'Trades & Services',
    icon: '🔧',
    roles: [
      { title: 'Electrician',                auRange: '$70k – $110k',  nzRange: 'NZD $65k – $100k' },
      { title: 'Plumber',                    auRange: '$70k – $110k',  nzRange: 'NZD $65k – $100k' },
      { title: 'Carpenter',                  auRange: '$65k – $100k',  nzRange: 'NZD $60k – $90k'  },
      { title: 'HVAC Technician',            auRange: '$65k – $105k',  nzRange: 'NZD $60k – $95k'  },
    ],
  },
]

export default function ExplorePage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
            Industry salaries
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            Salary ranges by industry
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Typical salary ranges for common roles across Australia and New Zealand.
            Figures are broad market guides — actual pay varies by experience, location, and employer.
          </p>
        </div>

        {/* Industry sections */}
        <div className="space-y-10">
          {INDUSTRIES.map((industry, idx) => (
            <div key={industry.name}>
            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-lg">{industry.icon}</span>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {industry.name}
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                {/* Table header — desktop only */}
                <div className="hidden sm:grid grid-cols-3 gap-4 px-5 py-2.5 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">Role</span>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">Australia</span>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">New Zealand</span>
                </div>

                {/* Rows */}
                {industry.roles.map((role, i) => (
                  <div
                    key={role.title}
                    className={`px-5 py-3.5 text-sm
                      ${i !== industry.roles.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/60' : ''}`}
                  >
                    {/* Desktop: 3-col grid */}
                    <div className="hidden sm:grid grid-cols-3 gap-4">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{role.title}</span>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">{role.auRange}</span>
                      <span className="text-gray-500 dark:text-gray-500">{role.nzRange}</span>
                    </div>
                    {/* Mobile: stacked */}
                    <div className="sm:hidden">
                      <p className="font-medium text-gray-800 dark:text-gray-200 mb-1.5">{role.title}</p>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide block mb-0.5">AU</span>
                          <span className="text-brand-600 dark:text-brand-400 font-semibold">{role.auRange}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide block mb-0.5">NZ</span>
                          <span className="text-gray-500 dark:text-gray-400">{role.nzRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {idx === 1 && (
              <AdUnit slot={AD_SLOTS.EXPLORE_MID} format="auto" className="min-h-[100px] rounded-xl overflow-hidden" />
            )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-14 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> These salary ranges are aggregated estimates based on publicly available market data and are provided for general guidance only. They do not represent guaranteed or advertised salaries. Use Salary Scraper on specific Seek listings for verified, employer-entered salary data.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Want to verify what a specific job pays?
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"/>
            </svg>
            Reveal a salary on Seek
          </a>
        </div>

      </div>
    </main>
  )
}
