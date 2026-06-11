/**
 * AdSense slot IDs — replace all three once your account is approved.
 *
 * How to get real slot IDs:
 *   1. Go to https://adsense.google.com → Ads → By ad unit
 *   2. Click "New ad unit" → "Display ads"
 *   3. Name it (e.g. "Home Mid", "Result Card", "Explore Mid"), click Create
 *   4. Copy the data-ad-slot value (looks like "1234567890") and paste below
 */
export const AD_SLOTS = {
  /** Homepage — below the recent lookups feed */
  HOME_MID: '0987654321',

  /** ResultCard — shown after a salary is revealed */
  RESULT_CARD: '1234567890',

  /** Explore page — between industry sections */
  EXPLORE_MID: '1122334455',
} as const
