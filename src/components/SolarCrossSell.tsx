import Link from 'next/link'

/** Cross-sell block placed on electricity calculator pages. */
export default function SolarCrossSell({
  state,
  discomCode,
}: {
  state?: string
  /** Pre-fills the ROI calculator's DISCOM via a URL param, so the linked page opens already set to this state. */
  discomCode?: string
}) {
  const href = discomCode
    ? `/solar/roi-calculator?discom=${discomCode}`
    : '/solar/roi-calculator'

  return (
    <section
      aria-labelledby="solar-crosssell"
      className="mb-10 flex flex-col items-start gap-3 rounded-xl border border-spark-teal/25 bg-spark-teal/5 p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2
          id="solar-crosssell"
          className="font-display text-lg font-semibold text-ink-navy"
        >
          ☀️ See how much solar could save you
          {state ? ` in ${state}` : ''}
        </h2>
        <p className="mt-1 text-sm text-ash/70">
          Rooftop solar can cut this bill sharply. Check your payback period and
          PM Surya Ghar subsidy in under a minute.
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 rounded-lg bg-brass px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brass/90"
      >
        Solar ROI calculator →
      </Link>
    </section>
  )
}
