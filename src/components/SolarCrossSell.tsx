import Link from 'next/link'

/** Cross-sell block placed on electricity calculator pages. */
export default function SolarCrossSell({ state }: { state?: string }) {
  return (
    <section
      aria-labelledby="solar-crosssell"
      className="mb-10 flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-amber-950/30"
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
        className="shrink-0 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
      >
        Solar ROI calculator →
      </Link>
    </section>
  )
}
