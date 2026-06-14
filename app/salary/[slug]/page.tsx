import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ROLES, getRoleBySlug, getAllSlugs, estimateTakeHome, fmt } from '@/lib/salaryData'

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

// ─── Per-page metadata ───────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const role = getRoleBySlug(slug)
  if (!role) return {}

  const range = `${fmt(role.auMin)} – ${fmt(role.auMax)}`
  const title = `${role.title} Salary Australia 2025 — ${range}`
  const description = `What does a ${role.title} earn in Australia? Typical Seek salary range is ${range} (median ${fmt(role.auMedian)}). Browse pay by experience level and instantly verify any live Seek listing.`

  return {
    title,
    description,
    keywords: role.keywords,
    alternates: { canonical: `https://salaryscraper.com/salary/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://salaryscraper.com/salary/${slug}`,
      type: 'article',
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SalaryRolePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const role = getRoleBySlug(slug)
  if (!role) notFound()

  const takeHome = estimateTakeHome(role.auMedian)

  // Related roles (up to 3)
  const related = role.relatedSlugs
    .map(s => ROLES.find(r => r.slug === s))
    .filter(Boolean)
    .slice(0, 3) as typeof ROLES

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://salaryscraper.com' },
          { '@type': 'ListItem', position: 2, name: 'Salary Guide', item: 'https://salaryscraper.com/explore' },
          { '@type': 'ListItem', position: 3, name: role.title,     item: `https://salaryscraper.com/salary/${slug}` },
        ],
      },
      {
        '@type': 'JobPosting',
        title: role.title,
        description: role.description,
        occupationalCategory: role.industry,
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: { '@type': 'Country', name: 'Australia' },
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'AUD',
          value: {
            '@type': 'QuantitativeValue',
            minValue: role.auMin,
            maxValue: role.auMax,
            value: role.auMedian,
            unitText: 'YEAR',
          },
        },
        datePosted: '2025-01-01',
        validThrough: '2026-12-31',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the average ${role.title} salary in Australia?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The average ${role.title} salary in Australia is around ${fmt(role.auMedian)} per year, with a typical range of ${fmt(role.auMin)} – ${fmt(role.auMax)} depending on experience, location and employer.`,
            },
          },
          {
            '@type': 'Question',
            name: `How do I find the exact salary for a ${role.title} job on Seek?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Paste the Seek job URL into Salary Scraper at salaryscraper.com. We use Seek's own salary filter API to reveal the exact salary bracket the employer entered — even when it's hidden from the listing page.`,
            },
          },
          {
            '@type': 'Question',
            name: `What does a ${role.title} take home after tax in Australia?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `At the median salary of ${fmt(role.auMedian)}, a ${role.title} takes home approximately $${takeHome.annual.toLocaleString()} per year ($${takeHome.monthly.toLocaleString()} per month) after income tax and the Medicare levy, based on 2024–25 ATO rates.`,
            },
          },
        ],
      },
    ],
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-2xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-brand-600 transition-colors">Salary Guide</Link>
          <span>/</span>
          <span className="text-gray-500 dark:text-gray-400">{role.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
            {role.industry}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
            {role.title} <span className="text-gradient">Salary</span> in Australia
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
            {role.description}
          </p>
        </div>

        {/* Hero salary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <div className="bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/40 rounded-xl p-4">
            <p className="text-xs text-brand-600 dark:text-brand-500 font-semibold uppercase tracking-wide mb-1">AU Typical Range</p>
            <p className="text-lg font-bold text-brand-700 dark:text-brand-300">{fmt(role.auMin)} – {fmt(role.auMax)}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 font-semibold uppercase tracking-wide mb-1">AU Median</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{fmt(role.auMedian)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 font-semibold uppercase tracking-wide mb-1">NZ Typical Range</p>
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">NZD {fmt(role.nzMin)} – {fmt(role.nzMax)}</p>
          </div>
        </div>

        {/* Salary by experience */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            Salary by experience level
          </h2>
          <div className="card-surface overflow-hidden">
            <div className="hidden sm:grid grid-cols-3 gap-4 px-5 py-2.5 bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">Experience level</span>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">Australia</span>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">New Zealand</span>
            </div>
            {role.levels.map((level, i) => (
              <div
                key={level.level}
                className={`px-5 py-3.5 text-sm ${i !== role.levels.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/60' : ''}`}
              >
                <div className="hidden sm:grid grid-cols-3 gap-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{level.level}</span>
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">{level.auRange}</span>
                  <span className="text-gray-500 dark:text-gray-500">{level.nzRange}</span>
                </div>
                <div className="sm:hidden">
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-1.5">{level.level}</p>
                  <div className="flex gap-6">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide block mb-0.5">AU</span>
                      <span className="text-sm text-brand-600 dark:text-brand-400 font-semibold">{level.auRange}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide block mb-0.5">NZ</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{level.nzRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Take-home pay */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            Estimated take-home pay (AU median)
          </h2>
          <div className="card-surface p-5">
            <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
              Based on {fmt(role.auMedian)} gross, ATO 2024–25 individual tax rates, 2% Medicare levy. No salary packaging, no HECS.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Annual', value: `$${takeHome.annual.toLocaleString()}` },
                { label: 'Monthly', value: `$${takeHome.monthly.toLocaleString()}` },
                { label: 'Fortnightly', value: `$${takeHome.fortnightly.toLocaleString()}` },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-600 mb-1">{item.label}</p>
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top employers */}
        {role.topEmployers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
              Common employers on Seek
            </h2>
            <div className="flex flex-wrap gap-2">
              {role.topEmployers.map(employer => (
                <span
                  key={employer}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {employer}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA — verify a real listing */}
        <div className="mb-10 bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-brand-900 dark:text-brand-200 mb-2">
            Verify a real {role.title} listing on Seek
          </h2>
          <p className="text-sm text-brand-700 dark:text-brand-400 mb-4 leading-relaxed">
            These are broad market ranges. The actual salary on a specific Seek listing may be higher or lower.
            Paste any Seek job URL below to reveal the exact salary the employer entered — even when it&rsquo;s hidden.
          </p>
          <Link href="/" className="btn-brand text-sm px-5 py-3">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"/>
            </svg>
            Reveal salary on Seek
          </Link>
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: `What is the average ${role.title} salary in Australia?`,
                a: `The average ${role.title} salary in Australia is around ${fmt(role.auMedian)} per year, with a typical Seek range of ${fmt(role.auMin)} – ${fmt(role.auMax)}. Pay varies by experience, location, and employer size.`,
              },
              {
                q: `How do I find the exact salary on a ${role.title} Seek listing?`,
                a: `Paste the Seek job URL into Salary Scraper. We query Seek's own salary filter to reveal the exact bracket the employer entered — even when the salary is not shown on the listing page. It takes about 5 seconds.`,
              },
              {
                q: `What does a ${role.title} take home after tax in Australia?`,
                a: `At the median salary of ${fmt(role.auMedian)}, take-home pay is approximately $${takeHome.annual.toLocaleString()} per year ($${takeHome.monthly.toLocaleString()} per month) after income tax and the 2% Medicare levy, based on ATO 2024–25 rates. This estimate excludes salary packaging and HECS repayments.`,
              },
            ].map((item) => (
              <div key={item.q} className="card-surface p-5">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.q}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related roles */}
        {related.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
              Related roles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/salary/${r.slug}`}
                  className="card-surface p-4 hover:-translate-y-0.5 hover:shadow-lift transition-all group"
                >
                  <p className="text-xs text-gray-400 dark:text-gray-600 mb-1 group-hover:text-brand-500 transition-colors">{r.industry}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{r.title}</p>
                  <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">{fmt(r.auMin)} – {fmt(r.auMax)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
