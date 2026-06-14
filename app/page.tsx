import type { Metadata } from 'next'
import Link              from 'next/link'
import SalaryLookup      from '@/components/SalaryLookup'
import YourRecentLookups from '@/components/YourRecentLookups'
import RecentLookups     from '@/components/RecentLookups'
import AdUnit            from '@/components/AdUnit'
import FAQ               from '@/components/FAQ'
import { AD_SLOTS }      from '@/lib/adSlots'

export const metadata: Metadata = {
  title: 'Salary Scraper — Reveal Hidden Seek Salaries',
  description:
    'Paste any Seek job URL and instantly reveal the hidden salary range. Free salary checker for Australian and NZ job seekers. No account required.',
  alternates: { canonical: 'https://salaryscraper.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://salaryscraper.com/#website',
      url: 'https://salaryscraper.com',
      name: 'Salary Scraper',
      description: 'Reveal hidden salary ranges on Seek job listings.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://salaryscraper.com/?url={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://salaryscraper.com/#webapp',
      name: 'Salary Scraper',
      url: 'https://salaryscraper.com',
      description:
        'Free tool that reveals hidden salary data from Seek job listings using binary search against Seek\'s internal salary filter API.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
      featureList: [
        'Reveal hidden Seek salary ranges',
        'Take-home pay calculator',
        'Salary history tracking',
        'Australian & New Zealand salary data',
      ],
    },
  ],
}

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Logo / wordmark */}
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Salary Scraper"
            className="h-24 w-auto mx-auto mb-4 animate-float-slow drop-shadow-[0_8px_24px_rgba(99,102,241,0.35)]"
          />
        </Link>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 dark:border-brand-900 bg-brand-50/80 dark:bg-brand-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            Free · No account · AU &amp; NZ
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Reveal the <span className="text-gradient">hidden salary</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm mx-auto mt-3 leading-relaxed">
          Paste any Seek job URL and instantly see the pay range the employer didn&rsquo;t show you.
        </p>
      </div>

      {/* Main lookup UI */}
      <div className="w-full max-w-xl">
        <SalaryLookup />
      </div>

      {/* Visitor's own lookup history — localStorage, hidden until first lookup */}
      <div className="w-full max-w-xl">
        <YourRecentLookups />
      </div>

      {/* Global recent lookups feed — all users, always visible */}
      <div className="w-full max-w-xl">
        <RecentLookups />
      </div>

      {/* Mid-page ad — browse zone between content sections */}
      <div className="w-full max-w-xl mt-12">
        <AdUnit slot={AD_SLOTS.HOME_MID} format="horizontal" className="min-h-[90px]" />
      </div>

      {/* How it works */}
      <div className="mt-20 w-full max-w-xl">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { step: '1', label: 'Paste the URL', desc: 'Copy any Seek job listing URL and paste it above.' },
            { step: '2', label: 'We scan Seek', desc: "We probe Seek's internal salary filter ~12 times using binary search." },
            { step: '3', label: 'Salary revealed', desc: 'The hidden salary range appears — even if the listing shows none.' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="card-surface p-5 flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 text-left sm:text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lift sm:mx-auto sm:mb-3">
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <footer className="mt-20 text-xs text-gray-300 dark:text-gray-700 text-center">
        Not affiliated with Seek. Salary ranges are estimates based on Seek&rsquo;s internal filter brackets.
      </footer>
    </main>
  )
}
