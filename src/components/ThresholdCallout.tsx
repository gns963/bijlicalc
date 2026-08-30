/**
 * A 2-column visual callout for a "cliff" rule in a tariff — a duty threshold,
 * a subsidy boundary, a non-telescopic switch, etc. Generic and reusable; the
 * calling page supplies the real left/right values from its own tariff data.
 */
export default function ThresholdCallout({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  note,
}: {
  title: string
  leftLabel: string
  leftValue: string
  rightLabel: string
  rightValue: string
  note: string
}) {
  return (
    <div className="rounded-2xl border border-brass/30 bg-brass/5 p-5 dark:border-brass/20 dark:bg-brass/10">
      <h3 className="font-display text-lg font-bold text-ink-navy dark:text-gazette-cream">
        {title}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-spark-teal/10 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-spark-teal">
            {leftLabel}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-spark-teal">
            {leftValue}
          </p>
        </div>
        <div className="rounded-xl bg-brass/15 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-brass">
            {rightLabel}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-brass">
            {rightValue}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ash/70 dark:text-gazette-cream/60">{note}</p>
    </div>
  )
}
