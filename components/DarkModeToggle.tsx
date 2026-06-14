'use client'

import { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [dark, setDark]       = useState(false)
  const [mounted, setMounted] = useState(false)

  // On mount: read stored preference or system default, then sync DOM
  useEffect(() => {
    const stored      = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark      = stored === 'dark' || (!stored && prefersDark)

    // Sync DOM immediately (the anti-flash script may have already done this,
    // but do it again to be certain)
    applyDark(isDark)
    setDark(isDark)
    setMounted(true)
  }, [])

  function applyDark(value: boolean) {
    const html = document.documentElement
    if (value) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
    }
    // Tells browser to use native dark/light controls (scrollbars, inputs, etc.)
    html.style.colorScheme = value ? 'dark' : 'light'
    localStorage.setItem('theme', value ? 'dark' : 'light')
  }

  function toggle() {
    // Use functional update to always flip the true current value
    setDark(prev => {
      const next = !prev
      applyDark(next)
      return next
    })
  }

  // Avoid flash of wrong icon before we know the real preference
  if (!mounted) return <div className="w-10 h-10" />

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300
                 bg-white/70 dark:bg-gray-900/60 backdrop-blur border border-gray-200/70 dark:border-gray-800 shadow-soft
                 hover:bg-white dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
    >
      {dark ? (
        /* Sun — visible while in dark mode */
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
          <path d="M10 2a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-.464 4.95.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414Zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1Zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707Zm1.414 8.486-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414ZM4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2h1Z" />
        </svg>
      ) : (
        /* Moon — visible while in light mode */
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8.001 8.001 0 1 0 10.586 10.586Z" />
        </svg>
      )}
    </button>
  )
}
