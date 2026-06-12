import type { Metadata } from 'next'
import type { Viewport } from 'next'
import Script from 'next/script'
import DarkModeToggle from '@/components/DarkModeToggle'
import Sidebar from '@/components/Sidebar'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,   // prevents iOS auto-zoom on input focus
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://salaryscraper.com'),
  title: {
    default: 'Salary Scraper — Reveal Hidden Seek Salaries',
    template: '%s — Salary Scraper',
  },
  description:
    'Paste any Seek job URL and instantly reveal the hidden salary range. Free salary checker for Australian and NZ job seekers. No account required.',
  keywords: [
    'seek salary',
    'seek salary reveal',
    'hidden salary seek',
    'seek job salary checker',
    'reveal salary seek australia',
    'seek salary estimator',
    'australian salary guide',
    'new zealand salary guide',
    'salary transparency',
    'salary scraper',
  ],
  openGraph: {
    title: 'Salary Scraper — Reveal Hidden Seek Salaries',
    description: 'Find out what a Seek job really pays — even when no salary is shown. Free salary checker for AU & NZ.',
    type: 'website',
    url: 'https://salaryscraper.com',
    siteName: 'Salary Scraper',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Salary Scraper' }],
  },
  twitter: {
    card: 'summary',
    title: 'Salary Scraper — Reveal Hidden Seek Salaries',
    description: 'Paste a Seek job URL and reveal the hidden salary. Free, no login needed.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://salaryscraper.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: 'b1ry3ph9_Jzu9KDwoTKHfmdEadS0eYxSWSY-DotZdLA',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Salary Scraper',
  },
  manifest: '/manifest.webmanifest',
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7289866798736873"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* PWA service worker registration */}
        <ServiceWorkerRegistration />
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
