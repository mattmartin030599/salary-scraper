'use client'

// Swap href="#" with real links once app store pages are live

const BADGE_H = 44  // visual height both badges render at

export default function AppStoreBadges() {
  return (
    <div className="flex items-center justify-center gap-3 mt-4">

      {/* App Store — clean SVG, no built-in padding */}
      <a
        href="#"
        aria-label="Download on the App Store"
        className="transition-opacity hover:opacity-80 active:opacity-70"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          style={{ height: BADGE_H, width: 'auto', display: 'block' }}
        />
      </a>

      {/* Google Play — PNG has ~8px padding baked in; render taller and clip to BADGE_H */}
      <a
        href="#"
        aria-label="Get it on Google Play"
        className="transition-opacity hover:opacity-80 active:opacity-70"
        style={{ display: 'inline-block', height: BADGE_H, overflow: 'hidden' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Get it on Google Play"
          style={{ height: BADGE_H * 1.35, width: 'auto', display: 'block', marginTop: -(BADGE_H * 0.35 / 2) }}
        />
      </a>

    </div>
  )
}
