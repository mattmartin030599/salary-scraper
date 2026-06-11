import SalaryLookup      from '@/components/SalaryLookup'
import DonationBanner    from '@/components/DonationBanner'
import YourRecentLookups from '@/components/YourRecentLookups'
import RecentLookups     from '@/components/RecentLookups'
import AdUnit            from '@/components/AdUnit'
import FAQ               from '@/components/FAQ'

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-24">

      {/* Logo / wordmark */}
      <div className="mb-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Salary Scraper"
          className="h-20 w-auto mx-auto mb-3 dark:opacity-100 opacity-90"
        />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Salary Scraper
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mt-1">
          Paste a Seek job URL to reveal the salary the employer didn&rsquo;t show you.
        </p>
      </div>

      {/* Main lookup UI */}
      <div className="w-full max-w-xl">
        <SalaryLookup />
      </div>

      {/* Donation banner */}
      <div className="w-full max-w-xl">
        <DonationBanner />
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
        <AdUnit slot="0987654321" format="horizontal" className="min-h-[90px]" />
      </div>

      {/* How it works */}
      <div className="mt-20 w-full max-w-xl">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { step: '1', label: 'Paste the URL', desc: 'Copy any Seek job listing URL and paste it above.' },
            { step: '2', label: 'We scan Seek', desc: "We probe Seek's internal salary filter ~12 times using binary search." },
            { step: '3', label: 'Salary revealed', desc: 'The hidden salary range appears — even if the listing shows none.' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 text-left sm:text-center">
              <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 sm:mx-auto sm:mb-2">
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
