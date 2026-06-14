import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Primary identity — indigo→violet, matched to the logo wordmark.
        // Every existing `brand-*` usage retones automatically.
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#5b54e6',
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3',
          950: '#1e1b4b',
        },
        // Secondary accent — the cyan of the logo's dollar sign.
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
      },
      boxShadow: {
        // Soft, brand-tinted elevation for cards and CTAs.
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)',
        lift: '0 8px 30px -6px rgb(79 70 229 / 0.25)',
        glow: '0 0 0 1px rgb(99 102 241 / 0.12), 0 10px 40px -10px rgb(99 102 241 / 0.45)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6366f1 0%, #7c3aed 55%, #8b5cf6 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
