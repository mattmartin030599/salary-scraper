export default function DonationBanner() {
  return (
    <div className="w-full mt-6 flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Salary Scraper is 100% free.{' '}
        <span className="text-gray-600 dark:text-gray-300">
          If it saved you time, consider fuelling the next update ☕
        </span>
      </p>

      <a
        href="https://www.paypal.me/mm3066"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg
                   bg-[#003087] hover:bg-[#002069] active:bg-[#001a57]
                   text-white text-sm font-semibold transition-colors shadow-md
                   border border-[#00286a]"
      >
        {/* PayPal P logo mark */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106Zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471Z"
            fill="#009CDE"
          />
          <path
            d="M6.237 8.451c.05-.301.17-.566.354-.783.186-.219.436-.384.735-.478a4.09 4.09 0 0 1 1.155-.149h4.051a8.55 8.55 0 0 1 1.343.096 7.043 7.043 0 0 1 .524.106c.12.03.235.064.344.101.109.038.212.079.31.122.097.044.19.091.276.142.457-2.906-.003-4.883-1.58-6.677C11.94.465 9.84 0 7.172 0H2.463C1.94 0 1.491.382 1.41.901L.001 9.516c-.06.383.235.728.623.728H4.26l.976-6.19 1.001 4.397Z"
            fill="#012169"
          />
        </svg>

        {/* Gift icon */}
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-[#009CDE]">
          <path d="M4.5 4a2.5 2.5 0 0 1 4.584-1.318A2.5 2.5 0 0 1 15.5 4c0 .82-.4 1.55-1.01 2H16a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.51A2.49 2.49 0 0 1 4.5 4ZM8 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm5.5 1h-2.56A1 1 0 1 1 12.5 4a1 1 0 0 1 1 1ZM4 9v8a1 1 0 0 0 1 1h4V9H4Zm6 0v9h5a1 1 0 0 0 1-1V9h-6Z"/>
        </svg>

        Donate via PayPal
      </a>
    </div>
  )
}
