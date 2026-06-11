'use client'

import { useState } from 'react'

const ITEMS = [
  {
    q: 'How does Salary Scraper find the salary?',
    a: "Seek's search API accepts a minimum salary filter. We probe it repeatedly — starting at $50k and stepping up — to find the highest filter value where the job still appears. That bracket is the floor the employer entered. It's the same data Seek uses for their own salary filter.",
  },
  {
    q: 'Is the salary exact?',
    a: "Not quite — we narrow it to a $10k–$30k bracket (Seek's own filter increments). For example, \"$100k – $120k\" means the employer typed something in that range. For most negotiation purposes, this is exactly what you need.",
  },
  {
    q: 'Why does the listing show no salary?',
    a: "Seek lets employers hide the salary from the public listing while still entering it internally for filtering purposes. That internal value is what we retrieve.",
  },
  {
    q: "What if it says it couldn't find a salary?",
    a: "A small percentage of listings have no salary stored at all — even internally. This is more common for executive, commission-based, or very senior roles. It may also mean the listing has expired.",
  },
  {
    q: 'Is this affiliated with Seek?',
    a: 'No. Salary Scraper is an independent tool. It queries Seek\'s publicly accessible API the same way your browser does when you use their salary filter.',
  },
  {
    q: 'How accurate is the take-home pay estimate?',
    a: "It's a rough guide based on ATO 2024–25 individual tax rates, the Low Income Tax Offset (LITO), and the Medicare Levy. It doesn't account for HECS/HELP debt, salary packaging, private health insurance rebates, or other offsets. Always check with a tax professional for personal advice.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="w-full max-w-xl mt-20">
      <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 text-center">
        Questions
      </h2>

      <div className="space-y-2">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {item.q}
              </span>
              <svg
                viewBox="0 0 20 20" fill="currentColor"
                className={`w-4 h-4 text-gray-400 dark:text-gray-600 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
              >
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
              </svg>
            </button>

            {open === i && (
              <div className="px-5 pb-4 animate-fadeIn">
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
