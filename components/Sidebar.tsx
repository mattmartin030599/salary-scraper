'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'Industry salaries',
    href: '/explore',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM9.5 6A1.5 1.5 0 0 0 8 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 9.5 6ZM3.5 10A1.5 1.5 0 0 0 2 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 3.5 10Z"/>
      </svg>
    ),
  },
  {
    label: 'Helpful links',
    href: '/helpful-links',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path fillRule="evenodd" d="M12.207 2.232a.75.75 0 0 0 .025 1.06l4.5 4.25a.75.75 0 0 1 0 1.116l-4.5 4.25a.75.75 0 0 1-1.085-1.036L14.84 9H5.75a.75.75 0 0 1 0-1.5h9.09l-3.693-3.472a.75.75 0 0 1-.025-1.06.75.75 0 0 1 1.085.264Z" clipRule="evenodd"/>
        <path d="M4.5 13a.75.75 0 0 0-.75.75v1.5A2.75 2.75 0 0 0 6.5 18h7a2.75 2.75 0 0 0 2.75-2.75v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-7c-.69 0-1.25-.56-1.25-1.25v-1.5A.75.75 0 0 0 4.5 13Z"/>
      </svg>
    ),
  },
  {
    label: 'FAQ',
    href: '/faq',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'About',
    href: '/about',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: 'Contact us',
    href: '/contact',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z"/>
        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const [open, setOpen]     = useState(false)
  const pathname            = usePathname()

  // Close on navigation
  useEffect(() => { setOpen(false) }, [pathname])

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed top-4 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center
                   text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd"/>
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300
                    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 z-50 flex flex-col
                    bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
                    shadow-2xl transition-transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="Salary Scraper" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              Salary Scraper
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
              >
                <span className={active ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-600'}>
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Not affiliated with Seek Limited.
          </p>
        </div>
      </aside>
    </>
  )
}
