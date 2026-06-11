import type { Metadata } from 'next'
import type { Viewport } from 'next'
import Script from 'next/script'
import DarkModeToggle from '@/components/DarkModeToggle'
import Sidebar from '@/components/Sidebar'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   // prevents iOS auto-zoom on input focus
}

export const metadata: Metadata = {
  title: 'Salary Scraper — Reveal Hidden Seek Salaries',
  description:
    'Paste any Seek job URL and instantly reveal the hidden salary range stored by the employer. Free, fast, no account required.',
  openGraph: {
    title: 'Salary Scraper — Reveal Hidden Seek Salaries',
    description: 'Find out what a Seek job really pays — even when no salary is shown.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Salary Scraper',
    description: 'Reveal hidden salary ranges on Seek job listings.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevents dark-mode flash before React hydrates */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme'),p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&p))document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        {/* Google AdSense — swap ca-pub-XXXXXXXXXXXXXXXX for your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7289866798736873"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Side navigation drawer */}
        <Sidebar />
        {/* Floating dark mode toggle */}
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle />
        </div>
        {children}
      </body>
    </html>
  )
}
