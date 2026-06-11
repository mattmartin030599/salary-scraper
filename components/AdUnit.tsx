'use client'

import { useEffect } from 'react'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

/**
 * Google AdSense unit.
 *
 * Setup:
 *   1. Sign up at https://adsense.google.com and add your site
 *   2. Once approved, replace PUBLISHER_ID below with your ca-pub-XXXXXX id
 *   3. Create ad units in AdSense and replace each slot prop with its unit ID
 */

const PUBLISHER_ID = 'ca-pub-7289866798736873'

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  // Don't render in dev so we're not making AdSense requests locally
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-400 dark:text-gray-600 ${className}`}>
        Ad placeholder (slot: {slot})
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
