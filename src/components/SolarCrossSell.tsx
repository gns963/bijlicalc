import Link from 'next/link'

/** Cross-sell block placed on electricity calculator pages. */
export default function SolarCrossSell({ state }: { state?: string }) {
  return (
    <section
      aria-labelledby="solar-crosssell"
      className="mb-10 flex flex-col items-start gap-3 rounded-2xl border border-brass/20 bg-brass/5 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-brass/20 dark:bg-brass/15/30"
    >
      <div>
        <h2
          id="solar-crosssell"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          ☀️ See how much solar could save you
          {state ? ` in ${state}` : ''}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Rooftop solar can cut this bill sharply. Check your payback period and
          PM Surya Ghar subsidy in under a minute.
        </p>
      </div>
      <Link
        href="/solar/roi-calculator"
        className="shrink-0 rounded-lg bg-brass px-5 py-2.5 text-sm font-semibold text-white hover:bg-brass"
      >
        Solar ROI calculator →
      </Link>
    </section>
  )
}
