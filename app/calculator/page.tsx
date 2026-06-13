import type { Metadata } from 'next'
import PayCalculator from '@/components/PayCalculator'

export const metadata: Metadata = {
  title: 'Pay Calculator',
  description:
    'Free Australian pay calculator. Enter your salary and instantly see take-home pay, income tax, Medicare levy, HECS/HELP repayments and superannuation for FY2025–26.',
  alternates: { canonical: 'https://salaryscraper.com/calculator' },
}

export default function CalculatorPage() {
  return (
    <main className="flex-1 pt-16 pb-12 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Pay Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Australian take-home pay, tax &amp; HECS estimates · FY2021–22 to FY2025–26
        </p>
      </div>

      <PayCalculator />
    </main>
  )
}
