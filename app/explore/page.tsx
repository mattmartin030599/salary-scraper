import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import { AD_SLOTS } from '@/lib/adSlots'

// Maps Explore role titles to individual salary page slugs
const SLUG_MAP: Record<string, string> = {
  'Software Engineer':           'software-engineer',
  'Senior Software Engineer':    'senior-software-engineer',
  'Data Scientist':              'data-scientist',
  'Product Manager':             'product-manager',
  'UX Designer':                 'ux-designer',
  'DevOps / Cloud Engineer':     'devops-engineer',
  'Financial Analyst':           'financial-analyst',
  'Accountant':                  'accountant',
  'Investment Banker (Analyst)': 'investment-banker',
  'Risk Manager':                'risk-manager',
  'Registered Nurse (RN)':       'registered-nurse',
  'General Practitioner (GP)':   'general-practitioner',
  'Pharmacist':                  'pharmacist',
  'Physiotherapist':             'physiotherapist',
  'Civil Engineer':              'civil-engineer',
  'Mechanical Engineer':         'mechanical-engineer',
  'Electrical Engineer':         'electrical-engineer',
  'Structural Engineer':         'structural-engineer',
  'Marketing Manager':           'marketing-manager',
  'Digital Marketing Specialist':'digital-marketing-specialist',
  'Primary School Teacher':      'primary-school-teacher',
  'Secondary School Teacher':    'secondary-school-teacher',
  'University Lecturer':         'university-lecturer',
  'Solicitor / Lawyer':          'solicitor',
  'In-house Counsel':            'in-house-counsel',
  'Electrician':                 'electrician',
  'Plumber':                     'plumber',
  'Carpenter':                   'carpenter',
}

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

// Industry icons — Heroicons (solid, 24×24), one consistent family.
const ICONS: Record<string, ReactNode> = {
  tech: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-7.5a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" /></svg>
  ),
  finance: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" /><path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" /><path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" /></svg>
  ),
  health: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>
  ),
  engineering: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" /></svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16.881 4.346A23.112 23.112 0 0 1 8.25 6H7.5a5.25 5.25 0 0 0-.88 10.427 21.593 21.593 0 0 0 1.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.592.772-2.468a17.116 17.116 0 0 1-.628-1.607c1.918.258 3.76.75 5.5 1.446A21.727 21.727 0 0 0 18 11.25c0-2.413-.393-4.735-1.119-6.904ZM18.26 3.74a23.22 23.22 0 0 1 1.24 7.51 23.22 23.22 0 0 1-1.24 7.51c-.055.161-.111.322-.17.482a.75.75 0 1 0 1.409.516 24.555 24.555 0 0 0 1.415-6.43 2.992 2.992 0 0 0 .836-2.078c0-.806-.319-1.54-.836-2.078a24.65 24.65 0 0 0-1.415-6.43.75.75 0 1 0-1.409.516c.059.16.115.321.17.483Z" /></svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" /><path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.71 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.078 0Z" /><path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" /></svg>
  ),
  legal: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg>
  ),
  trades: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" /></svg>
  ),
}

const INDUSTRIES = [
  {
    name: 'Technology & IT',
    icon: ICONS.tech,
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
    icon: ICONS.finance,
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
    icon: ICONS.health,
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
    icon: ICONS.engineering,
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
    icon: ICONS.marketing,
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
    icon: ICONS.education,
    roles: [
      { title: 'Primary School Teacher',     auRange: '$70k – $100k',  nzRange: 'NZD $58k – $90k'  },
      { title: 'Secondary School Teacher',   auRange: '$72k – $102k',  nzRange: 'NZD $60k – $93k'  },
      { title: 'Principal',                  auRange: '$110k – $170k', nzRange: 'NZD $100k – $150k' },
      { title: 'University Lecturer',        auRange: '$100k – $160k', nzRange: 'NZD $90k – $145k' },
    ],
  },
  {
    name: 'Legal',
    icon: ICONS.legal,
    roles: [
      { title: 'Solicitor / Lawyer',         auRange: '$70k – $130k',  nzRange: 'NZD $65k – $120k' },
      { title: 'Senior Associate',           auRange: '$120k – $200k', nzRange: 'NZD $110k – $180k' },
      { title: 'Partner (Law Firm)',         auRange: '$200k – $500k+',nzRange: 'NZD $180k – $450k+'},
      { title: 'In-house Counsel',           auRange: '$120k – $200k', nzRange: 'NZD $110k – $180k' },
    ],
  },
  {
    name: 'Trades & Services',
    icon: ICONS.trades,
    roles: [
      { title: 'Electrician',                auRange: '$70k – $110k',  nzRange: 'NZD $65k – $100k' },
      { title: 'Plumber',                    auRange: '$70k – $110k',  nzRange: 'NZD $65k – $100k' },
      { title: 'Carpenter',                  auRange: '$65k – $100k',  nzRange: 'NZD $60k – $90k'  },
      { title: 'HVAC Technician',            auRange: '$65k – $105k',  nzRange: 'NZD $60k – $95k'  },
    ],
  },
]

export default function ExplorePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Australian & New Zealand Salary Ranges by Industry',
    description: 'Typical salary ranges for common professional roles across Australia and New Zealand, organised by industry sector.',
    url: 'https://salaryscraper.com/explore',
    creator: { '@type': 'Organization', name: 'Salary Scraper', url: 'https://salaryscraper.com' },
    spatialCoverage: ['Australia', 'New Zealand'],
    temporalCoverage: '2024/2025',
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 dark:border-brand-900 bg-brand-50/80 dark:bg-brand-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-4">
            Industry salaries
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            Salary ranges by <span className="text-gradient">industry</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Typical salary ranges for common roles across Australia and New Zealand.
            Figures are broad market guides — actual pay varies by experience, location, and employer.
          </p>
        </div>

        {/* Industry sections */}
        <div className="space-y-10">
          {INDUSTRIES.map((industry, idx) => (
            <div key={industry.name}>
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 ring-1 ring-brand-100 dark:ring-brand-900">
                  {industry.icon}
                </span>
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {industry.name}
                </h2>
              </div>

              <div className="card-surface overflow-hidden">
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
                      {SLUG_MAP[role.title] ? (
                        <Link
                          href={`/salary/${SLUG_MAP[role.title]}`}
                          className="text-gray-700 dark:text-gray-300 font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-colors underline-offset-2 hover:underline"
                        >
                          {role.title}
                        </Link>
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{role.title}</span>
                      )}
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">{role.auRange}</span>
                      <span className="text-gray-500 dark:text-gray-500">{role.nzRange}</span>
                    </div>
                    {/* Mobile: stacked */}
                    <div className="sm:hidden">
                      {SLUG_MAP[role.title] ? (
                        <Link
                          href={`/salary/${SLUG_MAP[role.title]}`}
                          className="font-medium text-gray-800 dark:text-gray-200 mb-1.5 block hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {role.title} →
                        </Link>
                      ) : (
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1.5">{role.title}</p>
                      )}
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
          <a href="/" className="btn-brand text-sm px-5 py-3">
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
